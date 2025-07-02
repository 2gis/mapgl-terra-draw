# MapGL TerraDraw Adapter

[TerraDraw](https://github.com/JamesLMilner/terra-draw) adapter for [MapGL JS API](http://docs.2gis.com/en/mapgl) or just a simple drawing tool.

![intro pic](/docs/intro.png)

[Demo](https://2gis.github.io/mapgl-terra-draw/)

## Getting started

Install library

```bash
npm install @2gis/mapgl-terra-draw
```

Use ui-helper `createTerraDrawWithUI` and not forget to plug css:

```ts
import { load } from '@2gis/mapgl';
import { createTerraDrawWithUI } from '@2gis/mapgl-terra-draw';
import '@2gis/mapgl-terra-draw/dist/mapgl-terra-draw.css';

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
            controls: ["color", "select", "point", "polygon", "circle", "download", "clear"],
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

## Material Icons

UI relies on Material Icons font to display icons. So you should include following `link` to your HTML head.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
```

## LICENSE

MIT