import {
    TerraDrawAngledRectangleMode,
    TerraDrawCircleMode,
    TerraDrawFreehandMode,
    TerraDrawLineStringMode,
    TerraDrawPointMode,
    TerraDrawPolygonMode,
    TerraDrawRectangleMode,
    TerraDrawRenderMode,
    TerraDrawSectorMode,
    TerraDrawSelectMode,
    TerraDrawSensorMode,
    ValidateNotSelfIntersecting,
} from 'terra-draw';

/**
 * Creates default modes configuration for TerraDraw
 */
export function createDefaultModes() {
    return [
        new TerraDrawSelectMode({
            projection: 'web-mercator',
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
                            resizable: 'center',
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
                            resizable: 'center-fixed',
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
        }),
        new TerraDrawPolygonMode({
            pointerDistance: 20,
            snapping: {
                toLine: false,
                toCoordinate: false,
            },
            editable: true,
            validation: (feature, { updateType }) => {
                if (updateType === 'finish' || updateType === 'commit') {
                    return ValidateNotSelfIntersecting(feature);
                }
                return { valid: true };
            },
            styles: {
                snappingPointColor: '#ffff00',
            },
        }),
        new TerraDrawRectangleMode(),
        new TerraDrawCircleMode(),
        new TerraDrawFreehandMode({
            autoClose: true,
            minDistance: 10,
            pointerDistance: 10,
        }),
        new TerraDrawRenderMode({
            modeName: 'arbitrary',
            styles: {
                polygonFillColor: '#4357AD',
                polygonOutlineColor: '#48A9A6',
                polygonOutlineWidth: 2,
            },
        }),
        new TerraDrawAngledRectangleMode(),
        new TerraDrawSectorMode({}),
        new TerraDrawSensorMode(),
    ];
}
