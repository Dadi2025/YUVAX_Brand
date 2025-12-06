# YUVAX Code Review & Enhancement Report

## 1. Architecture & Project Structure

### Findings
*   **"Fat" Routes Pattern:** The server logic is heavily concentrated in the route files (e.g., `server/routes/orderRoutes.js`). This violates the "Separation of Concerns" principle. Route files should primarily handle HTTP request/response mapping, while business logic should reside in Controllers or Services.
*   **Mixed ID Strategies:** The `Product` model uses a custom numeric `id` field alongside the default MongoDB `_id`. Some queries use `findOne({ id: ... })` while valid references in `Order` use `mongoose.Schema.Types.ObjectId`. This duality can lead to confusing bugs where a numeric ID is passed where an ObjectId is expected, or vice versa.
*   **Frontend Organization:** The client structure is standard and well-organized (`components`, `pages`, `context`). However, `App.jsx` handles a significant amount of routing and lazy loading setup which could be extracted into a separate `AppRoutes.jsx` component for better readability.

### Recommendations
1.  **Adopt MVC Pattern:** Refactor server code to move logic from `routes/*` to `controllers/*`.
    *   *Create:* `server/controllers/orderController.js`, `productController.js`
    *   *Action:* Move async logic (like `Order.find(...)`, calculations) into controller functions.
2.  **Standardize IDs:** If the numeric `id` is required for legacy URLs or user readability, ensure it's handled consistently via a wrapper service. Ideally, migrate fully to MongoDB `_id` (ObjectIds) for internal consistency if external requirements permit.
3.  **Modularize Routes:** Extract routing configuration from `App.jsx` to keep the root component clean.

## 2. Performance & Scalability

### Findings
*   **Inefficient Courier Simulation:** The `simulate-courier` endpoint in `orderRoutes.js` fetches *all* processing/shipped orders and iterates through them synchronously.
    *   *Risk:* As order volume grows to thousands, this loop will time out or block the event loop, causing server unresponsiveness.
*   **React Rendering:** The `Navbar` component has scroll event listeners attached directly. If not throttled/debounced, this triggers frequent re-renders on every scroll pixel, potentially causing UI jank.

### Recommendations
1.  **Background Jobs:** Move the courier simulation and price drop checkers to a dedicated background job queue (e.g., using `agenda` or `bull`). Do not run heavy batch processing in the main HTTP request thread.
2.  **Database Indexing:** Ensure `deliveredAt`, `processedAt`, and other date fields used in range queries are indexed. (Current indexes on `status` and `createdAt` are good starts).
3.  **Optimize Scroll Handlers:** Use a debounced function for the scroll event listener in `Navbar.jsx` to limit state updates to once every 50-100ms.

## 3. Code Quality & Maintainability

### Findings
*   **Hardcoded Configuration:** `client/src/services/api.js` has a hardcoded URL `http://localhost:5000/api`. This requires manual changes for deployment.
*   **Inline Styles in React:** `Navbar.jsx` contains a significant amount of inline styles (e.g., `style={{ ... }}`). This makes the valid JSX harder to read and CSS harder to maintain/reuse.
*   **Error Handling:** `console.error` is used extensively. in production, these logs might be lost or clutter standard output without structured context.

### Recommendations
1.  **Environment Variables:** Use `import.meta.env.VITE_API_URL` (for Vite) to set the base URL dynamically based on the environment (dev/prod).
2.  **CSS Classes / Modules:** Move inline styles to `Navbar.css` or use a utility class system (if Tailwind is available) or CSS Modules. This improves render performance and code readability.
3.  **Structured Logging:** Replace `console.log/error` with a logging library like `winston` or `pino` for the server. This allows for log levels (info, warn, error) and better formatting for log aggregation systems.

## 4. Security

### Findings
*   **Good Defaults:** The use of `helmet`, `mongo-sanitize`, and `rate-limit` in `server/index.js` establishes a solid security baseline.
*   **Auth Logic:** Two middleware functions (`protect` and `admin`) handle auth well. The logic checking both `User` and `Agent` collections is a bit unconventional but functional for this use case.

### Recommendations
1.  **Input Validation:** Ensure `express-validator` is used consistently across *all* POST/PUT endpoints, not just orders.
2.  **Secrets Management:** Ensure `.env` is never committed to the repo (checked `.gitignore`, it is included, which is good).

## 5. Summary of Immediate Actions
| Priority | Task | Reason |
| :--- | :--- | :--- |
| **High** | Refactor `api.js` Base URL | Enables easy deployment to production without code changes. |
| **High** | Optimize `simulate-courier` | Prevents server freeze as order volume grows. |
| **Medium** | Extract Business Logic to Controllers | Improves code testability and organization. |
| **Medium** | Move Inline Styles to CSS | Improves frontend performance and maintainability. |
