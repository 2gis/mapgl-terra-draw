# MapGL TerraDraw Adapter

[TerraDraw](https://github.com/JamesLMilner/terra-draw) adapter for [MapGL JS API](http://docs.2gis.com/en/mapgl).

[Demo](https://2gis.github.io/mapgl-terra-draw/)

## Getting started

Install library

```bash
npm install @2gis/mapgl-terra-draw
```

and use ui-helper `createTerraDrawWithUI`:

```ts
import { load } from '@2gis/mapgl';
import { createTerraDrawWithUI } from '@2gis/mapgl-terra-draw';

load().then((mapgl) => {
    const map = new mapgl.Map('map', {
        center: [55.31878, 25.23584],
        zoom: 13,
        key: 'your-api-key',
        enableTrackResize: true,
    });

    map.on("styleload", () => {
        const { draw, cleanup } = createTerraDrawWithUI({
            map,
            mapgl,
            config: {
                controls: ["select", "point", "polygon", "circle", "download", "clear"],
            }
        });
    });
});
```

## Advanced usage

If you want to deep integrate with terra-draw or create your own UI.

```ts
import { load } from '@2gis/mapgl';
import { TerraDraw, TerraDrawPointMode, TerraDrawPolygonMode } from 'terra-draw';
import { TerraDrawMapGlAdapter } from '@2gis/mapgl-terra-draw';

load().then((mapgl) => {
    const map = new mapgl.Map('map', {
        center: [55.31878, 25.23584],
        zoom: 13,
        key: 'your-api-key',
        enableTrackResize: true,
    });

    map.on("styleload", () => {
        const draw = new TerraDraw({
            adapter: new TerraDrawMapGlAdapter({
                map,
                mapgl,
                coordinatePrecision: 9,
            }),
            modes: [
                new TerraDrawPointMode(),
                new TerraDrawPolygonMode(),
            ],
        });

        draw.start();
    });
});
```

### CSS and Material Icons

For proper UI display you should link material icons in your app

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

and plug this CSS

```css
.terra-draw-controls {
    z-index: 1;
    position: absolute;
    top: 0; 
    left: 0;
    margin: 16px;
}

.terra-draw-controls .group {
    display: flex;
    background: #ffffff;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 1px 3px 0 rgba(38, 38, 38, 0.5);
    flex-direction: column;
    margin: 16px 0;
}

.terra-draw-controls .group .item {
    padding: 8px;
    border: none;
    background: #ffffff;
    color: #262626;
    cursor: pointer;
    border-bottom: 1px solid #e6e6e6;
    font-size: 13px;
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;
}

.terra-draw-controls .group .item:hover {
    color: rgba(38, 38, 38, 0.7);
    background: #f8f8f8;
}

.terra-draw-controls .group .active {
    color: #028eff;
    background: #e3f2fd;
}
```

## API

### `TerraDrawMapGlAdapter`

Adapter class itself.
 
#### Contructor

```ts
new TerraDrawMapGlAdapter({
    map: mapgl.Map,
    mapgl: typeof mapgl,
    coordinatePrecision?: number // Точность координат (по умолчанию 9)
});
```

### `createTerraDrawWithUI`

Ui helper to quickly instantiate a terradraw with a simple UI.

#### Params

```ts
interface TerraModeUiOptions {
    map: mapgl.Map;
    mapgl: typeof mapgl;
    container?: HTMLElement;
    config?: UiConfig;
    adapterConfig?: TerraDrawExtend.BaseAdapterConfig;
}
```

#### Returns

```ts
{
    draw: TerraDraw;
    cleanup: () => void;
}
```

### `createDefaultModes`

Default modes set.

```ts
import { createDefaultModes } from '@2gis/mapgl-terra-draw';

const modes = createDefaultModes();
```
