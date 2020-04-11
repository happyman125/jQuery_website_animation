/**
 * SnazzyMap Map 'Neutral Blue'
 * https://snazzymaps.com/style/13/neutral-blue
 *
 */


const groundColor = '#768e27';
const balooneColor = '#e29f35';
const darkOrange = '#ab7422';
const darkGreen = '#49591a';
const greenLayter = '#768e27';
const darkGreen2 = '#637919';
const water = '#b8c6d8';

export let snazzyMapsStyles: any = [{
    "featureType": "road.highway.controlled_access",
    "elementType": "all",
    "stylers": [{"color": darkGreen2}]
}, {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{"color": water}, {"weight": 0.1}]
}, {
    "featureType": "transit.line",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "transit.station.airport",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "transit.station.bus",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "transit.station.rail",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "road.highway.controlled_access",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{"visibility": "on"}, {"color": darkGreen2}]
}, {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [{"visibility": "on"}, {"color": darkGreen2}, {"weight": 1.75}, {"saturation": 0}, {"lightness": 0}]
}, {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "poi.attraction",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "poi.business",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "poi.government",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {"featureType": "poi.medical", "elementType": "all", "stylers": [{"visibility": "off"}]}, {
    "featureType": "poi.park",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "poi.place_of_worship",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "poi.school",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "poi.sports_complex",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "landscape.natural",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [{"visibility": "on"}, {"color": groundColor}]
}, {
    "featureType": "administrative.province",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "administrative.locality",
    "elementType": "labels.text.stroke",
    "stylers": [{"visibility": "off"}, {"color": darkGreen2}]
}, {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#355230"}]
}, {
    "featureType": "administrative.locality",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "on"}, {"color": "#15464b"}]
}, {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [{"color": "#15464b"}, {"weight": 1}, {"lightness": 0}]
}, {"featureType": "road.highway", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "landscape.man_made",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [{"visibility": "on"}, {"color": darkGreen2}]
}, {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{"color": darkGreen2}]
}, {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{"visibility": "on"}, {"color": darkGreen2}]
}, {
    "featureType": "administrative.country",
    "elementType": "labels.text",
    "stylers": [{"visibility": "on"}, {"color": "#355230"}]
}, {
    "featureType": "administrative.country",
    "elementType": "labels.text.stroke",
    "stylers": [{"visibility": "off"}]
}, {
    "featureType": "administrative.country",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "on"}, {"color": "#355230"}]
}, {
    "featureType": "administrative.country",
    "elementType": "geometry",
    "stylers": [{"color": "#355230"}]
}, {
    "featureType": "administrative.locality",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "on"}, {"color": "#355230"}]
}]
