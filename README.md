# vancouver_bike_thefts
A repo to visualize bike theft incidents in the city of Vancouver, BC from 2003 - 2024.

### Raw Data
Download the raw data from here: https://geodash.vpd.ca/opendata/#
and place it into the data/raw directory with the name: 
crimedata_csv_AllNeighbourhoods_AllYears.csv

### Reference
The following sources were referenced while building this visualization:
- https://github.com/visgl/deck.gl/tree/9.0-release/examples/website/3d-heatmap
- https://deck.gl/docs/api-reference/aggregation-layers/hexagon-layer

### Usage
Install dependencies

`npm install`

View the visualization

`npm start`

Build the production files

`npm run build`

### GitHub Pages
A github page has been created based on the gh-pages branch of this repo.

To recreate this branch run

`npm run build && gh-pages -d dist`

and then add the "data/cleaned/vancouver_bicycle_thefts_cleaned.csv" file to the branch.

### Tools
This visualization uses Deck.gl which is a powerful framework for visualizing large datasets.
Specifically, the HexagonLayer is being used to create the extruded columns on the map.

### Files
The "clean.ipynb" notebook takes the raw data and cleans it into the necessary format.

