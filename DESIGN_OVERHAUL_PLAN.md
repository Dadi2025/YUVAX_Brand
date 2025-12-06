# Design Overhaul Plan: Light Theme & Header

## Goal
Address user feedback that the current header is "really bad" and the color theme needs improvement. Pivot to a **Scandinavian Minimalist (Light)** aesthetic, which is the industry standard for premium fashion (e.g., Zara, COS, Arket).

## 1. Global Theme Switch (Light Mode)
-   **Old Theme**: Dark/Cyberpunk (`#050505` bg).
-   **New Theme**:
    -   **Background**: `#ffffff` (Pure White) and `#f9fafb` (Off-white/Gray-50) for sections.
    -   **Text**: `#171717` (Neutral-900) for headings, `#4b5563` (Gray-600) for body.
    -   **Accents**: `#000000` (Black) for primary buttons/actions. No neons.
    -   **Borders**: Delicate `#e5e7eb` (Gray-200).

## 2. Header Redesign
The current header feels "floating" and disconnected.
-   **[NEW] Top Bar**: A thin black bar at the very top for announcements ("Free Shipping on orders over ₹999").
-   **Main Header**:
    -   **Background**: Solid White (no transparency confusion).
    -   **Layout**: Logo (Left) - Navigation (Center) - Icons (Right).
    -   **Typography**: Uppercase, tracked-out 12px font for navigation links.
    -   **Icons**: Thinner, more refined SVG icons (using Lucide style).

## 3. Implementation Steps
1.  **Update `global.css`**: Overwrite all CSS variables with the new Light Theme values.
2.  **Create `TopBar.jsx`**: Implement the announcement bar.
3.  **Refactor `Navbar.jsx`**: Update layout to include TopBar.
4.  **Update `Navbar.css`**: Style for white background and clean typography.
5.  **Update `ProductCard.css`**: Ensure cards look good on white background (remove borders, add subtle hover).

## Verification
-   **Visual**: Check contrast ratios (Black text on White bg is high accessibility).
-   **Mobile**: Verify that the white header works well on mobile and the menu hamburger is visible.
