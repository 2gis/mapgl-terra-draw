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
    const cleanColor = color.replace('#', '');

    if (cleanColor.length === 3) {
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
