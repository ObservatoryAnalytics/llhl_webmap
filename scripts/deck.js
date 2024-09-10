
const { DeckGL, PathLayer, PolygonLayer, ColumnLayer } = deck;

const LINE_COLOR = [0, 255, 0]; // Green color for the lines

// URL to fetch bathymetry data
const bathymetryDataUrl = 'https://raw.githubusercontent.com/Dhareey/CSV/main/bathymety.json';
const routeDataUrl = "https://raw.githubusercontent.com/Dhareey/CSV/main/routes.js";
const jettyDataUrl = "https://raw.githubusercontent.com/Dhareey/CSV/main/jetty_complete.js";
const islandsDataUrl = "https://raw.githubusercontent.com/ObservatoryAnalytics/llhl_webmap/main/data/Mr_Dare_Island.geojson";

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
// Define the async function to fetch data and initialize the layers
async function initializeLayers() {
    // Fetch the data using await within an async function
    const poly = await fetchAndConvertBathyData(bathymetryDataUrl);
    const routepath = await fetchAndConvertRouteData(routeDataUrl);
    const jettypoint = await fetchAndConvertJettyData(jettyDataUrl);
    const islands = await fetchAndConvertJettyData(islandsDataUrl);

    // Now set up the deck.gl layers
    function toggle() {
        let bathyVisibility = document.getElementById('bathyLayerCheckbox').checked;
        let routeVisibility = document.getElementById('routeLayerCheckbox').checked;
        let islandsVisibility = document.getElementById('islandsLayerCheckbox').checked;

        let layers = [
            new PolygonLayer({
                id: 'polygon-layer',
                data: poly,
                extruded: true,
                stroked: true,
                filled: true,
                wireframe: false,
                lineWidthMinPixels: 0,
                getPolygon: d => d.contour,
                getElevation: d => d.depth,
                getFillColor: (d) => {
                    // Color based on depth
                    const depth = d.depth;
                    switch (true) {
                        case depth > -24 && depth <= -23:
                            return [8, 48, 107
                            ]
                        case depth > -23 && depth <= -22:
                            return [8, 59, 124
                            ]
                        case depth > -22 && depth <= -21:
                            return [8, 71, 141
                            ]
                        case depth > -21 && depth <= -20:
                            return [9, 82, 157
                            ];
                        case depth > -20 && depth <= -19:
                            return [18, 94, 166
                            ]
                        case depth > -19 && depth <= -18:
                            return [26, 105, 174
                            ];
                        case depth > -18 && depth <= -17:
                            return [36, 116, 182
                            ];
                        case depth > -17 && depth <= -16:
                            return [47, 127, 188
                            ];
                        case depth > -16 && depth <= -15:
                            return [59, 139, 194
                            ];
                        case depth > -15 && depth <= -14:
                            return [71, 150, 200
                            ];
                        case depth > -14 && depth <= -13:
                            return [
                                86, 159, 206
                            ];
                        case depth > -13 && depth <= -12:
                            return [
                                100, 169, 211
                            ];
                        case depth > -12 && depth <= -11:
                            return [
                                116, 179, 216
                            ];
                        case depth > -11 && depth <= -10:
                            return [
                                134, 189, 220
                            ];
                        case depth > -10 && depth <= -9:
                            return [151, 198, 224];
                        case depth > -9 && depth <= -8:
                            return [167, 206, 228]
                        case depth > -8 && depth <= -7:
                            return [181, 212, 233];
                        case depth > -7 && depth <= -6:
                            return [195, 218, 238];
                        case depth > -6 && depth <= -5:
                            return [204, 223, 241];
                        case depth > -5 && depth <= -4:
                            return [213, 224, 244];
                        case depth > -4 && depth <= -3:
                            return [213, 234, 246];
                        case depth > -3 && depth <= -2:
                            return [230, 240, 249];
                        case depth > -2 && depth <= -1:
                            return [238, 245, 252];
                        case depth > -1 && depth <= 0:
                            return [247, 251, 255];
                        default:
                            return [0, 0, 255]; // Black (default color)
                    }
                },
                getLineColor: (d) => {
                    // Color based on depth
                    const depth = d.depth;
                    switch (true) {
                        case depth > -21 && depth <= -20:
                            return [8, 48, 107
                            ]
                        case depth > -23 && depth <= -22:
                            return [8, 59, 124
                            ]
                        case depth > -22 && depth <= -21:
                            return [8, 71, 141
                            ]
                        case depth > -21 && depth <= -20:
                            return [9, 82, 157
                            ];
                        case depth > -20 && depth <= -19:
                            return [18, 94, 166
                            ]
                        case depth > -19 && depth <= -18:
                            return [26, 105, 174
                            ];
                        case depth > -18 && depth <= -17:
                            return [36, 116, 182
                            ];
                        case depth > -17 && depth <= -16:
                            return [47, 127, 188
                            ];
                        case depth > -16 && depth <= -15:
                            return [59, 139, 194
                            ];
                        case depth > -15 && depth <= -14:
                            return [71, 150, 200
                            ];
                        case depth > -14 && depth <= -13:
                            return [
                                86, 159, 206
                            ];
                        case depth > -13 && depth <= -12:
                            return [
                                100, 169, 211
                            ];
                        case depth > -12 && depth <= -11:
                            return [
                                116, 179, 216
                            ];
                        case depth > -11 && depth <= -10:
                            return [
                                134, 189, 220
                            ];
                        case depth > -10 && depth <= -9:
                            return [151, 198, 224];
                        case depth > -9 && depth <= -8:
                            return [167, 206, 228]
                        case depth > -8 && depth <= -7:
                            return [181, 212, 233];
                        case depth > -7 && depth <= -6:
                            return [195, 218, 238];
                        case depth > -6 && depth <= -5:
                            return [204, 223, 241];
                        case depth > -5 && depth <= -4:
                            return [213, 224, 244];
                        case depth > -4 && depth <= -3:
                            return [213, 234, 246];
                        case depth > -3 && depth <= -2:
                            return [230, 240, 249];
                        case depth > -2 && depth <= -1:
                            return [238, 245, 252];
                        case depth > -1 && depth <= 0:
                            return [247, 251, 255];
                        default:
                            return [0, 0, 255]; // Black (default color)
                    }
                },
                getLineWidth: d => 0,
                pickable: true,
                visible: bathyVisibility,
                // Add updateTrigger for getFillColor based on ref

            }),
            // Add other layers here (e.g., route paths, jetty points, etc.)
            new PathLayer({
                id: "GridLayer",
                data: routepath, // Provide your route dataset here
                getPath: (d) => d.path, // Assuming your route dataset has a 'path' property
                getColor: (d) => {
                    const routename = d.name;
                    switch (routename) {
                        case "Agboyi-Ajah":
                            return [103, 0, 13];
                            break;
                        case "Ajah-Takwa Bay":
                            return [147, 11, 19];
                            break;
                        case "Amuwo-Odofin to Falomo":
                            return [179, 18, 24];
                            break;
                        case "Baiyeku-Ajah":
                            return [201, 24, 29];
                            break;
                        case "Baiyeku-Falomo":
                            return [221, 42, 37];
                            break;
                        case "Falomo- Ikorodu":
                            return [240, 62, 46];
                            break;
                        case "Falomo-Ajah":
                            return [246, 87, 62];
                            break;
                        case "Falomo-Ilado":
                            return [251, 112, 80];
                            break;
                        case "Falomo-Oworonsoki":
                            return [252, 134, 102];
                            break;
                        case "Falomo-Takwa Bay":
                            return [252, 156, 126];
                            break
                        case "Ikorodu-Ebutu Ero":
                            return [252, 179, 152];
                            break;
                        case "Ikorodu-Takwa Bay":
                            return [253, 200, 178];
                            break;
                        case "Osborne-Ikorodu":
                            return [254, 220, 205];
                            break;
                        case "Oworonsoki-Oshodi":
                            return [254, 233, 224];
                            break;
                        default:
                            return [0, 255, 0];
                            break;
                    }
                }, // Red color for routes
                getWidth: 40, // Width of the route lines
                getDashArray: [8, 4], // Dashed line effect
                pickable: true,
                visible: routeVisibility
            }),
            new PolygonLayer({
                id: 'island-layer',
                data: islands,
                extruded: true,
                stroked: true,
                filled: true,
                wireframe: false,
                lineWidthMinPixels: 0,
                getPolygon: d => d.position,
                getElevation: d => 2,
                getFillColor: (d) => [203, 189, 147],
                getLineColor: (d) => [203, 189, 147],
                getLineWidth: d => 0,
                pickable: true,
                visible: islandsVisibility,
                // Add updateTrigger for getFillColor based on ref

            }),
        ];

        deckcontainer.setProps({ layers });
    }

    // Initialize deck.gl with the fetched data
    const deckcontainer = new DeckGL({
        mapStyle: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        //mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        initialViewState: {
            longitude: 3.463221,
            latitude: 6.502195,
            zoom: 11,
            maxZoom: 20,
            pitch: 0,
            bearing: 0
        },
        controller: true,
    });

    toggle();
}

// Call the initialize function to set everything up
initializeLayers();
