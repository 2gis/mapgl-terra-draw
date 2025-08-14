import './ui.css';
import 'vanilla-colorful';
import { TerraDraw } from 'terra-draw';
import type * as mapgl from '@2gis/mapgl/types';
import { TerraDrawMapGlAdapter } from './adapter';
import { createDefaultModes } from './modes';
import { CONTROL_CONFIGS } from './l10n';
import { Style, defaultStyle, makeTransparent } from './styles';
import { FeatureId } from 'terra-draw/dist/extend';

export type UiControlType =
    | 'select'
    | 'point'
    | 'linestring'
    | 'polygon'
    | 'freehand'
    | 'circle'
    | 'rectangle'
    | 'angled-rectangle'
    | 'sector'
    | 'sensor'
    | 'download'
    | 'clear'
    | 'color'
    | 'stroke-width'
    | 'point-cap';

export interface MapDrawingOptions {
    map: mapgl.Map;
    mapgl: typeof mapgl;
    container?: HTMLElement;
    controls?: UiControlType[];
    style?: Style;
    stopByDoubleClick?: boolean;
}

const defaultControls: UiControlType[] = [
    'select',
    'point',
    'linestring',
    'polygon',
    'freehand',
    'circle',
    'angled-rectangle',
    'color',
    'stroke-width',
    'point-cap',
    'download',
    'clear',
];

/**
 * Creates UI controls for TerraDraw
 */
function createUiControls(
    container: HTMLElement,
    controls: UiControlType[],
    style: Style = defaultStyle,
): HTMLElement {
    const controlsElement = document.createElement('div');
    controlsElement.className = 'terra-draw-controls';

    // Разделяем контролы на группы
    const drawingControls = controls.filter(
        (control) =>
            ['download', 'clear', 'color', 'stroke-width', 'point-cap'].indexOf(control) === -1,
    );
    const styleControls = controls.filter(
        (control) => ['color', 'stroke-width', 'point-cap'].indexOf(control) !== -1,
    );
    const downloadControls = controls.filter((control) => control === 'download');
    const clearControls = controls.filter((control) => control === 'clear');

    // Style controls group
    if (styleControls.length > 0) {
        const styleGroup = createControlGroup('row');
        styleControls.forEach((control) => {
            if (control === 'color') {
                const colorControl = createColorControl(style ?? defaultStyle);
                styleGroup.appendChild(colorControl);
            } else if (control === 'stroke-width') {
                const strokeWidthControl = createStrokeWidthControl();
                styleGroup.appendChild(strokeWidthControl);
            } else if (control === 'point-cap') {
                const pointCapControl = createPointCapControl();
                styleGroup.appendChild(pointCapControl);
            }
        });
        controlsElement.appendChild(styleGroup);
    }

    // Drawing tools group
    if (drawingControls.length > 0) {
        const drawingGroup = createControlGroup();
        controlsElement.appendChild(drawingGroup);

        drawingControls.forEach((control) => {
            const config = CONTROL_CONFIGS[control];
            const button = createControlButton(config.label, config.icon, control);
            drawingGroup.appendChild(button);
        });
    }

    // Download group
    if (downloadControls.length > 0) {
        const downloadGroup = createControlGroup();
        downloadControls.forEach((control) => {
            const config = CONTROL_CONFIGS[control];
            const button = createControlButton(config.label, config.icon, control);
            downloadGroup.appendChild(button);
        });
        controlsElement.appendChild(downloadGroup);
    }

    // Clear group
    if (clearControls.length > 0) {
        const clearGroup = createControlGroup();
        clearControls.forEach((control) => {
            const config = CONTROL_CONFIGS[control];
            const button = createControlButton(config.label, config.icon, control);
            clearGroup.appendChild(button);
        });
        controlsElement.appendChild(clearGroup);
    }

    container.appendChild(controlsElement);
    return controlsElement;
}

function createControlGroup(direction: 'row' | 'column' = 'column'): HTMLElement {
    const group = document.createElement('div');
    group.classList.add('group');
    group.classList.add(direction);
    return group;
}

function createControlButton(label: string, icon: string, id: string): HTMLElement {
    const button = document.createElement('div');
    button.id = id;
    button.title = label; // Tooltip
    button.className = 'item';

    // Создаем иконку Material Icons
    const iconElement = document.createElement('span');
    iconElement.className = 'material-symbols-outlined';
    iconElement.textContent = icon;
    iconElement.style.cssText = `
		font-size: 24px;
		line-height: 1;
        user-select: none;
	`;

    button.appendChild(iconElement);

    return button;
}

function createColorControl(style: Style): HTMLElement {
    const container = document.createElement('div');
    container.id = 'color';
    container.className = 'item color-control';
    container.id = 'color';
    container.title = 'Color';

    const indicator = document.createElement('span');
    indicator.className = 'color-indicator';
    indicator.style.backgroundColor = style.outlineColor;

    indicator.addEventListener('click', () => {
        const popup = document.createElement('div');
        popup.classList.add('color-picker');

        const picker = document.createElement('hex-color-picker');
        picker.setAttribute('color', style.outlineColor);
        popup.appendChild(picker);

        const buttons = document.createElement('div');
        buttons.classList.add('color-picker-buttons');
        popup.appendChild(buttons);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        buttons.appendChild(closeButton);

        const saveButton = document.createElement('button');
        saveButton.classList.add('primary');
        saveButton.textContent = 'Save';
        buttons.appendChild(saveButton);

        let changedColor: string | undefined;
        picker.addEventListener('color-changed', (event) => {
            changedColor = event.detail.value;
        });
        closeButton.addEventListener('click', () => {
            document.body.removeChild(popup);
        });
        saveButton.addEventListener('click', () => {
            if (changedColor) {
                container.dispatchEvent(
                    new CustomEvent('colorchange', {
                        detail: { color: changedColor },
                    }),
                );
                indicator.style.backgroundColor = changedColor;
                picker.setAttribute('color', style.outlineColor);
            }
            document.body.removeChild(popup);
        });

        document.body.appendChild(popup);
    });

    container.appendChild(indicator);

    return container;
}

function createStrokeWidthControl(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'item stroke-width-control';
    container.id = 'stroke-width';
    container.title = 'Stroke Width';

    // Create icon
    const iconElement = document.createElement('span');
    iconElement.className = 'material-symbols-outlined';
    iconElement.textContent = 'line_weight';
    iconElement.style.cssText = `
		font-size: 18px;
		line-height: 1;
	`;

    // Create input
    const input = document.createElement('input');
    input.type = 'range';
    input.min = '1';
    input.max = '10';
    input.value = defaultStyle.outlineWidth.toString();
    input.style.cssText = `
		width: 60px;
		margin-left: 5px;
	`;

    container.appendChild(iconElement);
    container.appendChild(input);

    // Handle input changes
    input.addEventListener('input', () => {
        container.dispatchEvent(
            new CustomEvent('strokewidthchange', {
                detail: { width: parseInt(input.value) },
            }),
        );
    });

    return container;
}

function createPointCapControl(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'item point-cap-control';
    container.id = 'point-cap';
    container.title = 'Point Cap';

    // Create icon
    const iconElement = document.createElement('span');
    iconElement.className = 'material-symbols-outlined';
    iconElement.textContent = 'adjust';
    iconElement.style.cssText = `
		font-size: 18px;
		line-height: 1;
	`;

    // Create select
    const select = document.createElement('select');
    select.style.cssText = `
		margin-left: 5px;
		border: 1px solid #ccc;
		border-radius: 2px;
		padding: 2px;
	`;

    const options = [
        { value: 'round', label: 'Round' },
        { value: 'square', label: 'Square' },
        { value: 'none', label: 'None' },
    ];

    options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.value === defaultStyle.pointCap) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });

    container.appendChild(iconElement);
    container.appendChild(select);

    // Handle select changes
    select.addEventListener('change', () => {
        container.dispatchEvent(
            new CustomEvent('pointcapchange', {
                detail: { cap: select.value },
            }),
        );
    });

    return container;
}

function triggerDownload(filename: string, data: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Creates and initializes TerraDraw with UI controls
 */
export function createTerraDrawWithUI({
    map,
    mapgl,
    container = map.getContainer(),
    controls = defaultControls,
    style,
    stopByDoubleClick = true,
}: MapDrawingOptions): { draw: TerraDraw; cleanup: () => void } {
    const currentStyle = { ...defaultStyle, ...style };

    // Create adapter
    const adapter = new TerraDrawMapGlAdapter({
        map,
        mapgl,
        coordinatePrecision: 9,
        style: currentStyle,
    });

    // Create TerraDraw instance
    const draw = new TerraDraw({
        adapter,
        modes: createDefaultModes(),
    });

    // Create UI controls
    const controlsElement = createUiControls(container, controls, currentStyle);

    // State for tracking current selection
    const currentSelected: { button: HTMLElement | undefined; mode: string } = {
        button: undefined,
        mode: 'static',
    };

    // Разделяем контролы на рисующие и служебные
    const drawingControls = controls.filter(
        (control) =>
            ['download', 'clear', 'color', 'stroke-width', 'point-cap'].indexOf(control) === -1,
    );

    drawingControls.forEach((mode) => {
        const button = document.getElementById(mode);
        if (button) {
            button.addEventListener('click', () => {
                currentSelected.mode = mode;
                draw.setMode(currentSelected.mode);

                if (currentSelected.button) {
                    currentSelected.button.classList.remove('active');
                }
                currentSelected.button = button;
                currentSelected.button.classList.add('active');
            });
        }
    });

    // Add style control handlers
    if (controls.indexOf('color') !== -1) {
        const colorControl = document.getElementById('color');
        if (colorControl) {
            colorControl.addEventListener('colorchange', (event: any) => {
                const color = event.detail.color;
                const transparentColor = makeTransparent(color);

                adapter.updateStyle({
                    outlineColor: color,
                    fillColor: transparentColor,
                });
                adapter.updateDrawingStyle({
                    outlineColor: color,
                    fillColor: transparentColor,
                });
            });
        }
    }

    if (controls.indexOf('stroke-width') !== -1) {
        const strokeWidthControl = document.getElementById('stroke-width');
        if (strokeWidthControl) {
            strokeWidthControl.addEventListener('strokewidthchange', (event: any) => {
                const width = event.detail.width;
                adapter.updateStyle({ outlineWidth: width });
                adapter.updateDrawingStyle({ outlineWidth: width });
            });
        }
    }

    if (controls.indexOf('point-cap') !== -1) {
        const pointCapControl = document.getElementById('point-cap');
        if (pointCapControl) {
            pointCapControl.addEventListener('pointcapchange', (event: any) => {
                const cap = event.detail.cap;
                adapter.updateStyle({ pointCap: cap });
                adapter.updateDrawingStyle({ pointCap: cap });
            });
        }
    }

    // Add download handler
    if (controls.indexOf('download') !== -1) {
        const downloadButton = document.getElementById('download');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                const fc = {
                    type: 'FeatureCollection',
                    features: draw.getSnapshot(),
                };
                triggerDownload('features.json', JSON.stringify(fc, null, 2));
            });
        }
    }

    let selectedId: FeatureId | null = null;

    // Add clear handler
    if (controls.indexOf('clear') !== -1) {
        const clearButton = document.getElementById('clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (selectedId) {
                    draw.removeFeatures([selectedId]);
                } else {
                    if (!confirm('Are you sure want to clear all features?')) {
                        return;
                    }
                    draw.clear();
                }
            });
        }
    }

    if (stopByDoubleClick) {
        // HACK. To get doubleclick work like in other drawing libraries
        // we need to temporarily switch to a render mode and restore
        // after little timeout. So we avoid start drawing again in a second 
        // click of doubleclick.
        draw.on('finish', (_id, context) => {
            const currentMode = context.mode;
            draw.setMode('arbitrary');
            setTimeout(() => {
                draw.setMode(currentMode);
            }, 500);
        });
    }

    draw.on('select', (id) => {
        selectedId = id;
    });
    draw.on('deselect', () => {
        selectedId = null;
    });

    // Start drawing
    draw.start();

    // Cleanup function
    const cleanup = () => {
        draw.stop();
        if (controlsElement.parentNode) {
            controlsElement.parentNode.removeChild(controlsElement);
        }
    };

    return { draw, cleanup };
}
