# UI Quality Overhaul Plan: "Modern Luxury"

## Goal
Elevate the visual quality from "Cyberpunk/Gamer" to "Premium Fashion Brand". The focus is on clean alignment, sophisticated typography, and a refined color palette.

## 1. Visual Identity Refresh (Global Styles)
-   **Color Palette**: Shift from "Neon Black" to "Luxury Monochrome".
    -   Background: `#050505` (Deepest Black) instead of `#0a0a0a`.
    -   Accents: Replace Neon Cyan/Purple with **Platinum** (`#e5e5e5`) and **Champagne Gold** (`#d4af37`) for subtle highlights.
    -   Text: Pure White (`#ffffff`) for headings, Cool Grey (`#a0a0a0`) for body.
-   **Typography**:
    -   **Headings**: Switch from `Orbitron` (Sci-fi) to `Inter` (Bold/Heavy) or `Outfit` for a clean, editorial look. Limit `Orbitron` strictly to the Logo.
    -   **Body**: Continue with `Inter` but increase line-height and tracking (letter-spacing) for readability.

## 2. Layout & Alignment (The Grid)
-   **Container Width**: Standardize to `1440px` max-width with responsive padding.
-   **Navbar**:
    -   Increase height to `90px` for visual breathing room.
    -   Center-align navigation links (Desktop).
    -   Use a stronger backdrop blur (`blur(20px)`).
-   **Spacing System**: Implement a strict spacing scale (4px, 8px, 16px, 32px, 64px, 128px) to fix "misalignment" feelings.

## 3. Component Polish
### Navbar
-   Remove "Glow" effects from links. Use subtle underlinings.
-   Align icons (Search, Cart, Profile) perfectly on the grid.

### Product Card
-   **Alignment**: Ensure all text (price, title) is left-aligned or center-aligned consistently.
-   **Image**: Enforce 4:5 aspect ratio (Industry standard for fashion) instead of 3:4.
-   **Typography**: reduce font weight differences.

### Hero Section
-   align text to the absolute center or left with massive whitespace.

## Implementation Steps
1.  **Refactor `global.css`**: Update CSS variables for colors, fonts, and spacing.
2.  **Update `Navbar.css`**: Re-align flex containers and remove neon effects.
3.  **Update `ProductCard.css`**: Adjust aspect ratio and typography.
4.  **Verify**: Check alignment on 1920x1080 and 375x812 screens.

## Verification
-   **Visual Check**: Does the site look like a premium brand (Guidelines: Zara, SSENSE)?
-   **Alignment Check**: Are margins consistent? (Use browser inspector grid).
