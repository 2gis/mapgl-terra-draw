/// <reference types="vite/client" />
import { load } from '@2gis/mapgl';
import { createTerraDrawWithUI } from '../src';

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

    map.on('styleload', () => {
        const { draw, cleanup } = createTerraDrawWithUI({
            map,
            mapgl,
            config: {
                controls: [
                    'select',
                    'point',
                    'linestring',
                    'polygon',
                    'freehand',
                    'circle',
                    'angled-rectangle',
                    'color',
                    'stroke-width',
                    'point-cap',
                    'download',
                    'clear',
                ],
                style: {
                    fillColor: '#3388ff33',
                    outlineColor: '#3388ff',
                    outlineWidth: 3,
                    pointCap: 'round',
                },
            },
        });
    });
});
