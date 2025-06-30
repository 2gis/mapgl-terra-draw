# MapGL terradraw adapter

Usage

```ts
import { load } from '@2gis/mapgl';

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
            modes: [
                new TerraDrawPointMode(),
                new TerraDrawLineStringMode(),
                new TerraDrawPolygonMode(),
                new TerraDrawRectangleMode(),
                new TerraDrawCircleMode(),
                new TerraDrawFreehandMode(),
            ],
        });

        draw.start();

        addModeChangeHandler(draw, currentSelected);
    });
});
```