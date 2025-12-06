# Light Theme & Header Redesign

The application has been overhauled to a **Scandinavian Minimalist** aesthetic, focusing on clean lines, white space, and refined typography.

## 1. Global Themes (`global.css`)
-   **Theme**: Switched from Dark (`#050505`) to **Light** (`#FFFFFF` + `#F9FAFB`).
-   **Typography**: High-contrast black text (`#111111`) with `Inter` and `Outfit` fonts.
-   **Buttons**: Minimalist black buttons with white text (High fashion standard).

## 2. Header Redesign
-   **[NEW] TopBar**: Added `TopBar` component for announcements ("Free Shipping...").
-   **Structure**:
    -   Solid white background for clarity.
    -   **Logo**: Clean black uppercase sans-serif.
    -   **Navigation**: Centered, uppercase links with refined spacing.
    -   **Icons**: Thinner, elegant icons.

## 3. Component Updates
-   **Product Cards**:
    -   Removed dark backgrounds and heavy borders.
    -   Images pop against the white/light-grey background.
    -   "Quick Add" button is now a strong black bar.
-   **Navbar**: Refactored to fix "floating" issues and improved mobile menu visibility (`text-black`).

## Verification
- [x] **Light Mode**: Verify background is white, text is black.
- [x] **Header**: confirm "Free Shipping" bar appears at the top.
- [x] **Functionality**: Search and Icons work (restored after refactor).
