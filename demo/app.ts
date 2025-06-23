/// <reference types="vite/client" />
import { load } from '@2gis/mapgl';
import { TerraDraw, TerraDrawAngledRectangleMode, TerraDrawCircleMode, TerraDrawFreehandMode, TerraDrawLineStringMode, TerraDrawPointMode, TerraDrawPolygonMode, TerraDrawRectangleMode, TerraDrawRenderMode, TerraDrawSectorMode, TerraDrawSelectMode, TerraDrawSensorMode, ValidateNotSelfIntersecting } from "terra-draw";
import { TerraDrawMapGlAdapter } from "../src";

const center = [55.31878, 25.23584];
const zoom = 13;

const key = import.meta.env.VITE_MAPGL_KEY;

load().then((mapgl) => {
    const map = new mapgl.Map('map', {
        center,
        zoom,
        key,
        enableTrackResize: true,
    });

    map.on("styleload", () => {
        const draw = new TerraDraw({
            adapter: new TerraDrawMapGlAdapter({
                map,
                mapgl,
                coordinatePrecision: 9,
            }),
            modes: getModes(),
        });

        draw.start();

        addModeChangeHandler(draw, currentSelected);
    });
});

const currentSelected: { button: undefined | HTMLButtonElement; mode: string } =
	{
		button: undefined,
		mode: "static",
	};

const addModeChangeHandler = (
	draw: TerraDraw,
	currentSelected: { button: undefined | HTMLButtonElement; mode: string },
) => {
	[
		"select",
		"point",
		"linestring",
		"polygon",
		"freehand",
		"circle",
		"rectangle",
		"angled-rectangle",
		"sector",
		"sensor",
	].forEach((mode) => {
		(document.getElementById(mode) as HTMLButtonElement).addEventListener(
			"click",
			() => {
				currentSelected.mode = mode;
				draw.setMode(currentSelected.mode);

				if (currentSelected.button) {
					currentSelected.button.classList.remove('active');
				}
				currentSelected.button = document.getElementById(
					mode,
				) as HTMLButtonElement;
				currentSelected.button.classList.add('active');
			},
		);
	});

	(document.getElementById("clear") as HTMLButtonElement).addEventListener(
		"click",
		() => {
			draw.clear();
		},
	);
};


const getModes = () => {
	return [
		new TerraDrawSelectMode({
			projection: "web-mercator",
			flags: {
				arbitrary: {
					feature: {},
				},
				polygon: {
					feature: {
						draggable: true,
						rotateable: true,
						scaleable: true,
						coordinates: {
							snappable: true,
							midpoints: true,
							draggable: true,
							deletable: true,
						},
					},
				},
				freehand: {
					feature: { draggable: true, coordinates: {} },
				},
				linestring: {
					feature: {
						draggable: true,
						rotateable: true,
						scaleable: true,
						coordinates: {
							midpoints: true,
							draggable: true,
							deletable: true,
						},
					},
				},
				rectangle: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: false,
							draggable: true,
							resizable: "center",
							deletable: true,
						},
					},
				},
				circle: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: false,
							draggable: true,
							resizable: "center-fixed",
							deletable: true,
						},
					},
				},
				point: {
					feature: {
						draggable: true,
					},
				},
			},
		}),
		new TerraDrawPointMode({ editable: true }),
		new TerraDrawLineStringMode({
			snapping: {
				toCoordinate: true,
			},
			editable: true,
			// insertCoordinates: {
			// 	strategy: "amount",
			// 	value: 10,
			// },
		}),
		new TerraDrawPolygonMode({
			pointerDistance: 20,
			snapping: {
				toLine: false,
				toCoordinate: false,
			},
			editable: true,
			validation: (feature, { updateType }) => {
				if (updateType === "finish" || updateType === "commit") {
					return ValidateNotSelfIntersecting(feature);
				}
				return { valid: true };
			},
			styles: {
				snappingPointColor: "#ffff00",
				// editedPointColor: "#008000",
				// coordinatePointColor: "#ff0000",
				// closingPointColor: "#0000ff",
			},
			// showCoordinatePoints: true,
		}),
		new TerraDrawRectangleMode(),
		new TerraDrawCircleMode(),
		new TerraDrawFreehandMode({
			autoClose: true,
			minDistance: 10,
			pointerDistance: 10,
		}),
		new TerraDrawRenderMode({
			modeName: "arbitrary",
			styles: {
				polygonFillColor: "#4357AD",
				polygonOutlineColor: "#48A9A6",
				polygonOutlineWidth: 2,
			},
		}),
		new TerraDrawAngledRectangleMode(),
		new TerraDrawSectorMode({}),
		new TerraDrawSensorMode(),
	];
};
