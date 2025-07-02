export interface Style {
    fillColor: string;
    outlineColor: string;
    outlineWidth: number;
    pointCap: 'none' | 'round' | 'square';
}

export const defaultStyle: Style = {
    fillColor: '#3388ff33',
    outlineColor: '#3388ff',
    outlineWidth: 3,
    pointCap: 'round',
};

/**
 * Converts a hex color to transparent version by adding alpha
 */
export function makeTransparent(color: string, alpha: string = '33'): string {
    // Remove # if present
    const cleanColor = color.replace('#', '');

    // Ensure it's a valid hex color
    if (cleanColor.length === 3) {
        // Convert short hex to long hex
        const longHex = cleanColor
            .split('')
            .map((c) => c + c)
            .join('');
        return `#${longHex}${alpha}`;
    } else if (cleanColor.length === 6) {
        return `#${cleanColor}${alpha}`;
    }

    return color;
}
