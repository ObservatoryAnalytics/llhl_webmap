
const { DeckGL, PathLayer, PolygonLayer, ColumnLayer } = deck;

const LINE_COLOR = [0, 255, 0]; // Green color for the lines


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