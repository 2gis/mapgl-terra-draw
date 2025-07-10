# MapGL TerraDraw Adapter

[TerraDraw](https://github.com/JamesLMilner/terra-draw) adapter for [MapGL JS API](http://docs.2gis.com/en/mapgl) or just a simple drawing tool.

![intro pic](/docs/intro.png)

[Demo](https://2gis.github.io/mapgl-terra-draw/)

[Drawing Modes User Manual](MODES.md)

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
        key: 'Your MapGL JS API key',
        enableTrackResize: true,
    });

    map.on('styleload', () => {
        createTerraDrawWithUI({
            map,
            mapgl: mapgl as any,
            controls: ['color', 'select', 'point', 'polygon', 'circle', 'download', 'clear'],
        });
    });
});
```

## Advanced usage

If advanced cases (use your custom drawing mode, customize a very flexible TerraDraw [selection behaviour](https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md#selection-mode), design a fancy UI, e.g.) you can use `TerraDrawMapGlAdapter` class directly.

This gives you much more flexibility, but puts a some bunch of work on your side. Here is a simple example:

```ts
import { load } from '@2gis/mapgl';
import {
    TerraDraw,
    TerraDrawPointMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode,
} from 'terra-draw';
import { TerraDrawMapGlAdapter } from '@2gis/mapgl-terra-draw';

load().then((mapgl) => {
    const map = new mapgl.Map('map', {
        center: [55.31878, 25.23584],
        zoom: 13,
        key: 'Your MapGL JS API key',
        enableTrackResize: true,
    });

    map.on('styleload', () => {
        const draw = new TerraDraw({
            adapter: new TerraDrawMapGlAdapter({
                map,
                mapgl,
                coordinatePrecision: 9,
            }),
            modes: [
                new TerraDrawSelectMode(),
                new TerraDrawPointMode(),
                new TerraDrawPolygonMode(),
            ],
        });

        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.flexDirection = 'column';
        buttons.style.gap = '8px';
        new mapgl.Control(map, buttons, { position: 'centerLeft' });

        const selectButton = document.createElement('button');
        selectButton.innerText = 'select';
        selectButton.addEventListener('click', () => {
            draw.setMode('select');
        });
        buttons.appendChild(selectButton);

        const pointButton = document.createElement('button');
        pointButton.innerText = 'point';
        pointButton.addEventListener('click', () => {
            draw.setMode('point');
        });
        buttons.appendChild(pointButton);

        const polygonButton = document.createElement('button');
        polygonButton.innerText = 'polygon';
        polygonButton.addEventListener('click', () => {
            draw.setMode('polygon');
        });
        buttons.appendChild(polygonButton);

        const clearButton = document.createElement('button');
        clearButton.innerText = 'clear';
        clearButton.addEventListener('click', () => {
            draw.clear();
        });
        buttons.appendChild(clearButton);

        draw.start();
    });
});
```

## How to get a drawed data

Use a [.getSnapshot()](https://jameslmilner.github.io/terra-draw/classes/terra_draw.TerraDraw.html#getSnapshot) method of a TerraDraw.

```ts
const { draw } = createTerraDrawWithUI({
    ...
});

...

draw.getSnapshot();
```


## Material Icons

UI relies on Material Icons font to display icons. So you should include following `link` to your HTML head.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
```

## Deploy

```
npm run build
npm publish --access=public
```

## LICENSE

MIT
