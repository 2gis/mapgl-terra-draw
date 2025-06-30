# MapGL TerraDraw Adapter

Адаптер для интеграции [terra-draw](https://github.com/JamesLMilner/terra-draw) с картами 2GIS MapGL.

## Установка

```bash
npm install @2gis/mapgl-terra-draw
```

## Использование

### Базовое использование адаптера

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

### Быстрый старт с UI

Для быстрого создания интерфейса редактирования используйте функцию `createTerraDrawWithUI`:

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

        // Для очистки ресурсов при необходимости
        // cleanup();
    });
});
```

### Настройка UI

```ts
interface UiConfig {
    controls?: UiControl[];      // Какие инструменты и кнопки показывать
}

type UiControl = 
    | "select" 
    | "point" 
    | "linestring" 
    | "polygon" 
    | "freehand" 
    | "circle" 
    | "rectangle" 
    | "angled-rectangle" 
    | "sector" 
    | "sensor"
    | "download"    // Кнопка скачивания GeoJSON
    | "clear";      // Кнопка очистки
```

### CSS стили и Material Icons

UI использует Material Icons для отображения иконок. Добавьте подключение шрифта в ваш HTML:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

Для стилизации UI добавьте CSS:

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

Основной адаптер для интеграции terra-draw с MapGL.

#### Конструктор

```ts
new TerraDrawMapGlAdapter({
    map: mapgl.Map,              // Экземпляр MapGL карты
    mapgl: typeof mapgl,         // MapGL модуль
    coordinatePrecision?: number // Точность координат (по умолчанию 9)
});
```

### `createTerraDrawWithUI`

Создает TerraDraw с готовым UI.

#### Параметры

```ts
interface TerraModeUiOptions {
    map: mapgl.Map;                                    // Экземпляр MapGL карты
    mapgl: typeof mapgl;                              // MapGL модуль
    container?: HTMLElement;                          // Контейнер для UI (по умолчанию map.getContainer())
    config?: UiConfig;                               // Настройки UI
    adapterConfig?: TerraDrawExtend.BaseAdapterConfig; // Дополнительные настройки адаптера
}
```

#### Возвращает

```ts
{
    draw: TerraDraw;     // Экземпляр TerraDraw
    cleanup: () => void; // Функция для очистки ресурсов
}
```

### `createDefaultModes`

Создает набор режимов по умолчанию со всеми поддерживаемыми инструментами.

```ts
import { createDefaultModes } from '@2gis/mapgl-terra-draw';

const modes = createDefaultModes();
```

## Примеры

В папке `examples/` вы найдете:

- `usage.ts` - базовые примеры использования адаптера и UI
- `custom-ui.ts` - пример кастомизации иконок и лейблов

## Структура проекта

Код библиотеки разделен на несколько модулей:

- `adapter.ts` - основной адаптер `TerraDrawMapGlAdapter` для интеграции с MapGL
- `modes.ts` - конфигурация режимов рисования по умолчанию
- `ui.ts` - UI компоненты и функция `createTerraDrawWithUI`
- `index.ts` - главный файл с экспортами всех модулей

Все экспорты доступны через главный модуль:

```ts
import { 
	TerraDrawMapGlAdapter,    // Адаптер
	createDefaultModes,       // Режимы по умолчанию
	createTerraDrawWithUI,    // UI функция
	UiControl,               // Типы
	UiConfig,
	TerraModeUiOptions 
} from '@2gis/mapgl-terra-draw';
```