import { TerraDraw, TerraDrawExtend } from "terra-draw";
import type * as mapgl from "@2gis/mapgl/types";
import { TerraDrawMapGlAdapter } from "./adapter";
import { createDefaultModes } from "./modes";
import { CONTROL_CONFIGS } from "./l10n";

export type UiControl = 
	| "select" 
	| "point" 
	| "linestring" 
	| "polygon" 
	| "freehand" 
	| "circle" 
	| "rectangle" 
	| "angled-rectangle" 
	| "sector" 
	| "sensor"
	| "download"
	| "clear";

export interface UiConfig {
	controls?: UiControl[];
}

export interface TerraModeUiOptions {
	map: mapgl.Map;
	mapgl: typeof mapgl;
	container?: HTMLElement;
	config?: UiConfig;
	adapterConfig?: TerraDrawExtend.BaseAdapterConfig;
}

/**
 * Creates UI controls for TerraDraw
 */
function createUiControls(container: HTMLElement, config: UiConfig = {}): HTMLElement {
	const {
		controls = ["select", "point", "linestring", "polygon", "freehand", "circle", "rectangle", "angled-rectangle", "sector", "sensor", "download", "clear"],
	} = config;

	const controlsElement = document.createElement('div');
	controlsElement.className = 'terra-draw-controls';

	// Разделяем контролы на группы
	const drawingControls = controls.filter(control => 
		["download", "clear"].indexOf(control) === -1
	);
	const downloadControls = controls.filter(control => control === "download");
	const clearControls = controls.filter(control => control === "clear");

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

function createControlGroup(): HTMLElement {
	const group = document.createElement('div');
	group.className = 'group';
	return group;
}

function createControlButton(label: string, icon: string, id: string): HTMLElement {
	const button = document.createElement('div');
	button.id = id;
	button.title = label; // Tooltip
	button.className = 'item';

	// Создаем иконку Material Icons
	const iconElement = document.createElement('span');
	iconElement.className = 'material-icons';
	iconElement.textContent = icon;
	iconElement.style.cssText = `
		font-size: 18px;
		line-height: 1;
	`;

	button.appendChild(iconElement);

	return button;
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
export function createTerraDrawWithUI(options: TerraModeUiOptions): { draw: TerraDraw; cleanup: () => void } {
	const {
		map,
		mapgl,
		container = map.getContainer(),
		config = {},
		adapterConfig = {}
	} = options;

	// Create TerraDraw instance
	const draw = new TerraDraw({
		adapter: new TerraDrawMapGlAdapter({
			map,
			mapgl,
			coordinatePrecision: 9,
			...adapterConfig,
		}),
		modes: createDefaultModes(),
	});

	// Create UI controls
	const controlsElement = createUiControls(container, config);

	// State for tracking current selection
	const currentSelected: { button: HTMLElement | undefined; mode: string } = {
		button: undefined,
		mode: "static",
	};

	// Add event handlers for mode changes
	const {
		controls = ["select", "point", "linestring", "polygon", "freehand", "circle", "rectangle", "angled-rectangle", "sector", "sensor", "download", "clear"],
	} = config;

	// Разделяем контролы на рисующие и служебные
	const drawingControls = controls.filter(control => 
		["download", "clear"].indexOf(control) === -1
	);

	drawingControls.forEach((mode) => {
		const button = document.getElementById(mode);
		if (button) {
			button.addEventListener("click", () => {
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

	// Add download handler
	if (controls.indexOf("download") !== -1) {
		const downloadButton = document.getElementById('download');
		if (downloadButton) {
			downloadButton.addEventListener('click', () => {
				const fc = {
					type: 'FeatureCollection',
					features: draw.getSnapshot()
				};
				triggerDownload('features.json', JSON.stringify(fc, null, 2));
			});
		}
	}

	// Add clear handler
	if (controls.indexOf("clear") !== -1) {
		const clearButton = document.getElementById('clear');
		if (clearButton) {
			clearButton.addEventListener('click', () => {
				draw.clear();
			});
		}
	}

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
