
const { DeckGL, PathLayer, PolygonLayer, ColumnLayer } = deck;

const LINE_COLOR = [0, 255, 0]; // Green color for the lines

// URL to fetch bathymetry data
const bathymetryDataUrl = 'https://raw.githubusercontent.com/Dhareey/CSV/main/bathymety.json';
const routeDataUrl = "https://raw.githubusercontent.com/Dhareey/CSV/main/routes.js";
const jettyDataUrl = "https://raw.githubusercontent.com/Dhareey/CSV/main/jetty_complete.js";
const landingDataUrl = "https://raw.githubusercontent.com/Dhareey/CSV/main/jetty_landings.js";

//Fectch the geojson file
//fetch('data/depth.geojson').then(response => response.json()).then(data => {console.log(data)})

// Step 2
function convertGeoJSONToPaths(geojsonData) {
    const polygons = [];

    geojsonData.features.forEach((feature) => {
        const contour = feature.geometry.coordinates[0][0];
        const depth = feature.properties.DN || 0.0; // Adjust as needed
        const id = feature.properties.fid_1;
        const band = feature.properties.band_0;
        const color = [255, 0, 128]; // You can customize the color here

        polygons.push({ contour, depth, id, band, color });
    });

    return polygons;
}

// Fetch and convert bathymetry data
async function fetchAndConvertBathyData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return convertGeoJSONToPaths(data);
    } catch (error) {
        console.error('Error fetching bathymetry data:', error);
        return [];
    }
}

// Fetch and convert jetties data
async function fetchAndConvertJettyData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return convertJettyGeojsonToPolygon(data);
    } catch (error) {
        console.error('Error fetching bathymetry data:', error);
        return [];
    }
}



function convertRouteToPaths(routegeojson) {
    const routePaths = [];
    routegeojson.features.forEach((feature) => {
        const path = feature.geometry.coordinates[0];
        const name = feature.properties.Name;
        const route_code = feature.properties.Route_ID;
        const avg_depth = feature.properties["Avg Depth"];

        routePaths.push({ path, name, route_code, avg_depth });
    });
    return routePaths;
}

function convertJettyGeojsonToPolygon(jettygeojson) {
    const jettyPoints = [];
    jettygeojson.features.forEach((features) => {
        const position = features.geometry.coordinates[0];
        const jettyname = features.properties.Name;

        jettyPoints.push({ position, jettyname });
    });
    return jettyPoints;
}

// Fetch and convert bathymetry data
async function fetchAndConvertRouteData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return convertRouteToPaths(data);
    } catch (error) {
        console.error('Error fetching bathymetry data:', error);
        return [];
    }
}

// Call the function and assign the result to poly
const poly = await fetchAndConvertBathyData(bathymetryDataUrl);
const routepath = await fetchAndConvertRouteData(routeDataUrl);

const jettypoint = fetchAndConvertJettyData(jettyDataUrl);
const landings = fetchAndConvertRouteData(landingDataUrl);

function toggle() {
    let bathyVisibility = document.getElementById('bathyLayerCheckbox').checked;
    let routeVisibility = document.getElementById('routeLayerCheckbox').checked;
    let ref = parseFloat(document.getElementById('de').value);

    let layers = [new PolygonLayer({
        id: 'polygon-layer',
        data: poly,
        extruded: true,
        stroked: true,
        filled: true,
        wireframe: false,
        lineWidthMinPixels: 0,
        getPolygon: d => d.contour,
        getElevation: d => d.depth,
        getFillColor: d => d.depth >= ref ? [255, 0, 0] : [0, 0, 255], // Use depth compared to reference
        getLineColor: d => {
            const depth = d.depth;
            switch (true) {
                // Color cases...
            }
        },
        getLineWidth: d => 0,
        pickable: true,
        visible: bathyVisibility,
        // Add updateTrigger for getFillColor based on ref
        updateTriggers: {
            getFillColor: [ref] // Update when reference value changes
        }
    }),
        // Other layers...
    ];

    deckcontainer.setProps({ layers });
}


console.log(jettypoint);

const deckcontainer = new DeckGL({
    mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    //mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    initialViewState: {
        longitude: 3.463221,
        latitude: 6.502195,
        zoom: 12,
        maxZoom: 20,
        pitch: 85,
        bearing: 0
    },
    controller: true,
});

toggle();
