/**
 * Color extraction utility for visual search
 * Simple implementation using color quantization
 */

/**
 * Extract dominant color from image buffer
 * Returns RGB values as an object
 */
export const extractDominantColor = (imageBuffer) => {
    // This is a simplified version - in production, you'd use a library like 'get-pixels' or 'sharp'
    // For now, we'll return a placeholder that can be enhanced later

    // Placeholder: Return a default color
    // In a real implementation, you would:
    // 1. Load the image buffer
    // 2. Sample pixels across the image
    // 3. Use k-means clustering or color quantization
    // 4. Return the most dominant color

    return {
        r: 128,
        g: 128,
        b: 128
    };
};

/**
 * Calculate color distance between two RGB colors
 * Uses Euclidean distance in RGB space
 */
export const calculateColorDistance = (color1, color2) => {
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;

    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Get color category from RGB values
 * Simplified color categorization
 */
export const getColorCategory = (rgb) => {
    const { r, g, b } = rgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Grayscale check
    if (max - min < 30) {
        if (max < 50) return 'black';
        if (max > 200) return 'white';
        return 'gray';
    }

    // Color categorization
    if (r > g && r > b) return 'red';
    if (g > r && g > b) return 'green';
    if (b > r && b > g) return 'blue';
    if (r > 150 && g > 150 && b < 100) return 'yellow';
    if (r > 150 && b > 150 && g < 100) return 'purple';
    if (g > 150 && b > 150 && r < 100) return 'cyan';

    return 'mixed';
};

export default {
    extractDominantColor,
    calculateColorDistance,
    hexToRgb,
    getColorCategory
};
