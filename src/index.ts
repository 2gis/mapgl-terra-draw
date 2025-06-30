/**
 * @module terra-draw-mapgl-adapter
 */

// Экспорты адаптера
export { TerraDrawMapGlAdapter } from "./adapter";

// Экспорты режимов
export { createDefaultModes } from "./modes";

// Экспорты UI
export { 
	createTerraDrawWithUI,
	type UiControl,
	type UiConfig,
	type TerraModeUiOptions 
} from "./ui";

// Экспорты локализации
export { CONTROL_CONFIGS, type ControlConfig } from "./l10n";