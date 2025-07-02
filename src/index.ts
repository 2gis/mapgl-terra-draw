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
	type UiControlType,
	type MapDrawingOptions 
} from "./ui";

// Экспорты локализации
export { CONTROL_CONFIGS, type ControlConfig } from "./l10n";

// Экспорты стилей
export { 
	type Style, 
	defaultStyle, 
	makeTransparent 
} from "./styles";