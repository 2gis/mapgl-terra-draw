import {
    TerraDrawChanges,
    SetCursor,
    TerraDrawStylingFunction,
    TerraDrawExtend,
    GeoJSONStoreFeatures,
} from 'terra-draw';

import type * as mapgl from '@2gis/mapgl/types';
import { Style, defaultStyle } from './styles';

const dotIcon = (color: string, fillColor: string, cap: 'none' | 'round' | 'square' = 'round') => {
    let shape = '';
    if (cap === 'round') {
        shape = `<circle cx="3.5" cy="3.5" r="2.5" fill="${fillColor}" stroke="${color}" stroke-width="1.2"/>`;
    } else if (cap === 'square') {
        shape = `<rect x="1" y="1" width="5" height="5" fill="${fillColor}" stroke="${color}" stroke-width="1.2"/>`;
    } else {
        shape = `<circle cx="3.5" cy="3.5" r="1" fill="${color}"/>`;
    }

    return (
        'data:image/svg+xml;base64,' +
        btoa(`<svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
${shape}
</svg>`)
    );
};

export class TerraDrawMapGlAdapter extends TerraDrawExtend.TerraDrawBaseAdapter {
    private _map: mapgl.Map;
    private _mapgl: typeof mapgl;
    private _container: HTMLElement;
    private _dynamicObjects: Record<string, mapgl.Polygon | mapgl.Polyline | mapgl.Marker>;
    private _style: Style;

    private featureStyles: Record<string, Style>;

    constructor(
        config: {
            map: mapgl.Map;
            mapgl: typeof mapgl;
            style?: Style;
        } & TerraDrawExtend.BaseAdapterConfig,
    ) {
        super(config);

        this._mapgl = config.mapgl;
        this._map = config.map;
        this._container = this._map.getContainer();
        this._dynamicObjects = {};
        this._style = { ...defaultStyle, ...config.style };
        this.featureStyles = {};
    }

    /**
     * Returns the longitude and latitude coordinates from a given PointerEvent on the map.
     * @param event The PointerEvent or MouseEvent  containing the screen coordinates of the pointer.
     * @returns An object with 'lng' and 'lat' properties representing the longitude and latitude, or null if the conversion is not possible.
     */
    public getLngLatFromEvent(event: PointerEvent | MouseEvent) {
        const { left, top } = this._container.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        return this.unproject(x, y);
    }

    /**
     *Retrieves the HTML element of the Mapbox element that handles interaction events
     * @returns The HTMLElement representing the map container.
     */
    public getMapEventElement() {
        return this._map.getCanvas();
    }

    /**
     * Enables or disables the draggable functionality of the map.
     * @param enabled Set to true to enable map dragging, or false to disable it.
     */
    public setDraggability(enabled: boolean) {
        const mapImpl = (this._map as any)._impl;
        if (enabled) {
            mapImpl.modules.handler.unblock();
        } else {
            mapImpl.modules.handler.block();
        }
    }

    /**
     * Converts longitude and latitude coordinates to pixel coordinates in the map container.
     * @param lng The longitude coordinate to project.
     * @param lat The latitude coordinate to project.
     * @returns An object with 'x' and 'y' properties representing the pixel coordinates within the map container.
     */
    public project(lng: number, lat: number) {
        const [x, y] = this._map.project([lng, lat]);
        return { x, y };
    }

    /**
     * Converts pixel coordinates in the map container to longitude and latitude coordinates.
     * @param x The x-coordinate in the map container to unproject.
     * @param y The y-coordinate in the map container to unproject.
     * @returns An object with 'lng' and 'lat' properties representing the longitude and latitude coordinates.
     */
    public unproject(x: number, y: number) {
        const [lng, lat] = this._map.unproject([x, y]);
        return { lng, lat };
    }

    /**
     * Sets the cursor style for the map container.
     * @param cursor The CSS cursor style to apply, or 'unset' to remove any previously applied cursor style.
     */
    public setCursor(cursor: Parameters<SetCursor>[0]) {
        const canvas = this._map.getCanvas();
        if (cursor === 'unset') {
            canvas.style.removeProperty('cursor');
        } else {
            canvas.style.cursor = cursor;
        }
    }

    /**
     * Enables or disables the double-click to zoom functionality on the map.
     * @param enabled Set to true to enable double-click to zoom, or false to disable it.
     */
    public setDoubleClickToZoom(enabled: boolean) {
        const mapImpl = (this._map as any)._impl;
        if (enabled) {
            mapImpl.modules.handler.unblock();
        } else {
            mapImpl.modules.handler.block();
        }
    }

    /**
     * Updates the current style settings
     */
    public updateStyle(style: Partial<Style>) {
        this._style = { ...this._style, ...style };
    }

    public getFeatures() {
        return this.featureStyles;
    }

    private updateFeature(feature: GeoJSONStoreFeatures) {
        const id = feature.id;
        if (!id) {
            console.warn(`Refusing attempt to process a feature without id.`);
            return;
        }

        let stylingFeatureId = id;
        if (feature.properties.selectionPoint) {
            stylingFeatureId = String(feature.properties.selectionPointFeatureId);
        }
        if (feature.properties.midPoint) {
            stylingFeatureId = String(feature.properties.midPointFeatureId);
        }

        if (!this.featureStyles[stylingFeatureId]) {
            this.featureStyles[stylingFeatureId] = { ...this._style };
        }

        const currentStyle =
            this.featureStyles[stylingFeatureId] ?? this._style;

        switch (feature.geometry.type) {
            case 'Polygon': {
                const current = this._dynamicObjects[id];
                if (current) {
                    current.destroy();
                }
                if (!feature.properties.color) {
                    feature.properties.color = currentStyle.fillColor;
                    feature.properties.outlineColor = currentStyle.outlineColor;
                    feature.properties.outlineWidth = currentStyle.outlineWidth;
                }
                this._dynamicObjects[id] = new this._mapgl.Polygon(this._map, {
                    coordinates: feature.geometry.coordinates,
                    color: String(feature.properties.color),
                    strokeColor: String(feature.properties.outlineColor),
                    strokeWidth: Number(feature.properties.outlineWidth),
                });
                break;
            }

            case 'LineString': {
                const current = this._dynamicObjects[id];
                if (current) {
                    current.destroy();
                }
                if (!feature.properties.color) {
                    feature.properties.color = currentStyle.outlineColor;
                    feature.properties.width = currentStyle.outlineWidth;
                }
                this._dynamicObjects[id] = new this._mapgl.Polyline(this._map, {
                    coordinates: feature.geometry.coordinates,
                    color: String(feature.properties.color),
                    width: Number(feature.properties.width),
                });
                break;
            }

            case 'Point': {
                const current = this._dynamicObjects[id];
                if (current) {
                    current.destroy();
                }
                this._dynamicObjects[id] = new this._mapgl.Marker(this._map, {
                    coordinates: feature.geometry.coordinates,
                    icon: dotIcon(
                        currentStyle.outlineColor,
                        feature.properties.midPoint ? '#ffffff' : currentStyle.fillColor,
                        currentStyle.pointCap,
                    ),
                    size: [16, 16],
                    anchor: [8, 8],
                });
                break;
            }
        }
    }

    /**
     * Renders GeoJSON features on the map using the provided styling configuration.
     * @param changes An object containing arrays of created, updated, and unchanged features to render.
     * @param styling An object mapping draw modes to feature styling functions
     */
    public render(changes: TerraDrawChanges, _styling: TerraDrawStylingFunction) {
        for (const f of changes.created) {
            this.updateFeature(f);
        }
        for (const f of changes.updated) {
            this.updateFeature(f);
        }
        for (const id of changes.deletedIds) {
            if (this._dynamicObjects[id]) {
                this._dynamicObjects[id].destroy();
                delete this._dynamicObjects[id];
            }
        }
    }

    /**
     * Clears the map and store of all rendered data layers
     * @returns void
     * */
    public clear() {
        if (this._currentModeCallbacks) {
            // Clear up state first
            this._currentModeCallbacks.onClear();
        }

        for (const id in this._dynamicObjects) {
            const obj = this._dynamicObjects[id];
            if (obj) {
                obj.destroy();
            }
            delete this._dynamicObjects[id];
        }
    }

    public getCoordinatePrecision(): number {
        return super.getCoordinatePrecision();
    }

    public unregister(): void {
        super.unregister();
    }

    public register(callbacks: TerraDrawExtend.TerraDrawCallbacks) {
        super.register(callbacks);

        if (this._currentModeCallbacks?.onReady) {
            this._currentModeCallbacks.onReady();
        }
    }
}
