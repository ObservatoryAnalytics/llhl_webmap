// Step 1
const { DeckGL } = deck;

const deckcontainer = new DeckGL({
    container: 'deckContainer',
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