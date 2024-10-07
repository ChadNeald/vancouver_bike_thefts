import React from 'react';
import { createRoot } from 'react-dom/client';
import { Map } from 'react-map-gl/maplibre';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { CSVLoader } from '@loaders.gl/csv';
import { load } from '@loaders.gl/core';
import { useState, useEffect } from 'react';

import type { Color, PickingInfo, MapViewState } from '@deck.gl/core';
import './styles.css';

const DATA_URL =
  'data/cleaned/vancouver_bicycle_thefts_cleaned.csv';

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 1,
  position: [-123.12103, 49.27869, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 1,
  position: [-116.89301, 49.1192680000]
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight1, pointLight2 });

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -123.12103,
  latitude: 49.27869,
  zoom: 11.7,
  minZoom: 5,
  maxZoom: 30,
  pitch: 40.5,
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const colorRange: Color[] = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
  [196, 45, 69],
  [183, 35, 61],
  [170, 25, 52],
  [157, 15, 43],
  [144, 5, 35],
  [131, 0, 30],
  [118, 0, 25]
];

function getTooltip({ object }: PickingInfo) {
  if (!object) {
    return null;
  }
  const lat = object.position[1];
  const lng = object.position[0];
  const count = object.elevationValue;
  let text: string;
  if (count == 1) {
    text = "Bicycle Theft"
  } else {
    text = "Bicycle Thefts";
  }

  return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
    ${count} ${text}`;
}

type DataPoint = [longitude: number, latitude: number, date_year: number];

export default function App({
  data = null,
  mapStyle = MAP_STYLE,
}: {
  data?: DataPoint[] | null;
  mapStyle?: string;
}) {
  // Default values for the variables.
  const [radius, setRadius] = useState(50);
  const [year, setYear] = useState(2003);
  const [filteredData, setFilteredData] = useState(data);
  const [minValue, setMinValue] = useState(2);

  // Filter data based on the selected year.
  useEffect(() => {
    if (data) {
      setFilteredData(data.filter(d => d[2] === year));
    }
  }, [data, year]);

  const layers = [
    new HexagonLayer<DataPoint>({
      id: 'heatmap',
      colorDomain: [minValue, 65],
      colorRange: colorRange,
      coverage: 1,
      data: filteredData,
      elevationDomain: [minValue, 65],
      elevationRange: [0, 7000],
      extruded: true,
      getPosition: d => d,
      pickable: true,
      radius: radius,
      material: {
        ambient: 0.64,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51]
      },
      transitions: {
        elevationScale: 3000
      }
    })
  ];

  return (
    <div>
      <div>
        <DeckGL
          layers={layers}
          effects={[lightingEffect]}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          getTooltip={getTooltip}
        >
          <Map reuseMaps mapStyle={mapStyle} />
        </DeckGL>
      </div>
      <div className="box">
        <h3>Vancouver Bike Thefts</h3>
        <label className="slider_label">
          Radius: {radius}
        </label>
        <div className="slider">
          <input
            type="range"
            min={10}
            max={120}
            step={10}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </div>
        <label className="slider_label">
          Year: {year}
        </label>
        <div className="slider">
          <input
            type="range"
            min={2003}
            max={2024}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
        <label className="slider_label">
          Minimum Value: {minValue}
        </label>
        <div className="slider">
          <input
            type="range"
            min={1}
            max={5}
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
          />
        </div >
        <p>(Hold shift and click to rotate the view)</p>
      </div >
    </div >
  );
}

export async function renderToDOM(container: HTMLDivElement) {
  const root = createRoot(container);
  root.render(<App />);

  const data = (await load(DATA_URL, CSVLoader)).data;
  const points: DataPoint[] = data
    .map(d => (Number.isFinite(d.longitude) ? [d.longitude, d.latitude, d.date_year] : null))
    .filter(Boolean);
  root.render(<App data={points} />);
}
