# UI Quality Overhaul: Modern Luxury

This document details the transformation of the YUVAX UI from a "Cyberpunk" aesthetic to a "Modern Luxury" brand identity.

## 1. Global Design System (`global.css`)
-   **Color Pivot**:
    -   Background: Deepest Black `#050505` (was `#0a0a0a`) for a richer feel.
    -   Accents: **Platinum** (`#E5E5E5`) and **Champagne Gold** (`#D4AF37`) replaced Neon Cyan/Purple.
    -   Text: Typography hierarchy sharpened with pure white headings and cool grey body text.
-   **Typography**:
    -   **Headings**: Switched to `Outfit` for a clean, fashion-editorial look.
    -   **Body**: `Inter` with tuned letter-spacing (`0.05em`) for readability.
-   **Layout**:
    -   Container width expanded to `1440px`.
    -   Strict spacing scale enforced.

## 2. Navbar Refinement (`Navbar.css`)
-   **Height**: Increased to `90px` for visual breathing room.
-   **Alignment**: Links centered (Desktop) for balance.
-   **Visuals**: Removed neon text glows. Added a "pill" shape badge style.
-   **Backdrop**: Deeper, more opaque blur (`blur(20px)`).

## 3. Product Catalog Polish (`ProductCard.css`)
-   **Aspect Ratio**: Enforced **4:5** (Industry Standard) instead of 3:4.
-   **Minimalism**: usage of borders removed. Relying on shadows and spacing.
-   **Interactions**:
    -   Hover effects are now subtle zooms and "light-ups" rather than heavy glows.
    -   "Quick Add" button uses a clean slide-up animation.

## Verification Checklist
- [x] **Visuals**: Check that new colors (Gold/Platinum) are visible.
- [x] **Desktop**: Verify Navbar link centering and 4-column product grid.
- [x] **Mobile**: Verify Product Cards handle touch inputs correctly (Quick Add visible).
