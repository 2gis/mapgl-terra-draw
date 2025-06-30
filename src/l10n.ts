/**
 * Localization
 */

export interface ControlConfig {
	label: string;
	icon: string;
}

export const CONTROL_CONFIGS: Record<string, ControlConfig> = {
	select: {
		label: "Select",
		icon: "select",
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
		label: "Delete All",
		icon: "delete", 
	},
	color: {
		label: "Color",
		icon: "palette", // цвет
	},
	"stroke-width": {
		label: "Stroke Width",
		icon: "line_weight", // толщина линии
	},
	"point-cap": {
		label: "Point Cap",
		icon: "adjust", // тип точки
	},
};
