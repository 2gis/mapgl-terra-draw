/**
 * Локализация и иконки для UI элементов
 */

export interface ControlConfig {
	label: string;
	icon: string;
}

/**
 * Конфигурация контролов с иконками и лейблами
 */
export const CONTROL_CONFIGS: Record<string, ControlConfig> = {
	select: {
		label: "Select",
		icon: "near_me", // курсор/выбор
	},
	point: {
		label: "Point",
		icon: "place", // маркер точки
	},
	linestring: {
		label: "LineString", 
		icon: "timeline", // линия
	},
	polygon: {
		label: "Polygon",
		icon: "pentagon", // многоугольник
	},
	freehand: {
		label: "Freehand",
		icon: "gesture", // свободное рисование
	},
	circle: {
		label: "Circle",
		icon: "radio_button_unchecked", // круг
	},
	rectangle: {
		label: "Rectangle",
		icon: "crop_din", // прямоугольник
	},
	"angled-rectangle": {
		label: "Angled Rectangle",
		icon: "crop_rotate", // повернутый прямоугольник
	},
	sector: {
		label: "Sector",
		icon: "pie_chart", // сектор
	},
	sensor: {
		label: "Sensor",
		icon: "sensors", // сенсор
	},
	download: {
		label: "Download GeoJSON",
		icon: "download", // скачивание
	},
	clear: {
		label: "Clear",
		icon: "clear_all", // очистка
	},
};
