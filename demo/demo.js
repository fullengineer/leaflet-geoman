/* eslint-disable */

const map2 = L.map('example2').setView([51.505, -0.09], 13);
// map2.dragging.disable();

map2.on('pm:create', function(e) {
    // alert('pm:create event fired. See console for details');
    console.log(e);
});
map2.on('pm:remove', function(e) {
    console.log('pm:remove event fired. See console for details');
    // alert('pm:remove event fired. See console for details');
    console.log(e);
});
map2.on('pm:drawstart', function(e) {
    console.log(e);
});

const m1 = L.circleMarker([51.50313, -0.091223], { radius: 10 });
const m2 = L.marker([51.50614, -0.0989]);
const m3 = L.marker([51.50915, -0.096112], {pmIgnore: true});

const mGroup = L.layerGroup([m1, m2, m3]).addTo(map2);
mGroup.pm.enable();

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map2);

const map3 = L.map('example3').setView([51.505, -0.09], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map3);

const map4 = L.map('example4').setView([51.505, -0.09], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map4);

map2.pm.addControls({
    drawMarker: false,
    drawPolygon: true,
    editPolygon: false,
    drawPolyline: false,
    deleteLayer: true,
});
// map2.pm.addControls({
//     drawMarker: false,
//     drawPolygon: true,
//     editPolygon: false,
//     drawPolyline: false,
//     deleteLayer: false,
// });
// map2.pm.addControls({
//     drawMarker: true,
//     drawPolygon: false,
//     editPolygon: false,
//     drawPolyline: false,
//     deleteLayer: true,
// });
map2.pm.addControls({
    drawMarker: true,
    drawPolygon: true,
    editPolygon: true,
    drawPolyline: true,
    deleteLayer: true,
});

map2.pm.enableDraw('Poly', {
    snappable: true,
    templineStyle: {
        color: 'blue',
    },
    hintlineStyle: {
        color: 'blue',
        dashArray: [5, 5],
    },
    pathOptions: {
        color: 'red',
        fillColor: 'orange',
        fillOpacity: 0.7,
    },
    cursorMarker: false,
    finishOnDoubleClick: true,
});
map2.pm.disableDraw('Poly');
map2.pm.enableDraw('Circle', {
    snappable: true,
    cursorMarker: true,
});

// GEOSJON EXAMPLE

const geoJsonData = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Polygon',
                'coordinates': [
                    [
                        [
                            -0.15483856201171872,
                            51.527329038465936,
                        ],
                        [
                            -0.16977310180664062,
                            51.51643437722083,
                        ],
                        [
                            -0.15964508056640625,
                            51.50094238217541,
                        ],
                        [
                            -0.13149261474609375,
                            51.5042549065934,
                        ],
                        [
                            -0.11758804321289061,
                            51.518463972439385,
                        ],
                        [
                            -0.13303756713867188,
                            51.53106680201548,
                        ],
                        [
                            -0.15483856201171872,
                            51.527329038465936,
                        ],
                    ],
                ],
            },
        },
    ],
};
// const geoJsonButton = document.getElementById('test-geojson');
const geoJsonLayer = L.geoJson(null, {pmIgnore: true});
geoJsonLayer.addData(geoJsonData);
geoJsonLayer.addTo(map2);
// geoJsonLayer.pm.toggleEdit({
//     draggable: true,
//     snappable: true,
// });

map3.pm.addControls({
    drawMarker: true,
    drawPolygon: true,
    editPolygon: true,
    drawPolyline: true,
    deleteLayer: true,
});

var scotland = L.polygon([[[60,-13],[60,0],[50,4],[50,-13]],
                  [[55.7,-4.5],[56,-4.5],[56,-4],[55.7,-4]]]);
scotland.addTo(map3);

const bounds = scotland.getBounds();


map3.fitBounds(bounds);

const markerStyle = {
    opacity: 0.5,
    draggable: false,
};

const options = {
    markerStyle: markerStyle,
};

map3.pm.enableDraw('Marker', options);


geoJsonLayer.addEventListener('click', function(e) {
    geoJsonLayer.pm.toggleEdit();
});

geoJsonLayer.on('pm:edit', function(e) {
    console.log(e);
});

geoJsonLayer.on('pm:dragstart', function(e) {
    console.log(e);
});
// geoJsonLayer.on('pm:drag', function(e) {
//     console.log(e);
// });
geoJsonLayer.on('pm:dragend', function(e) {
    console.log(e);
});


// Polygon Example

const polygonLayer = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
]).addTo(map3).addTo(map2);
polygonLayer.pm.toggleEdit();

polygonLayer.on('pm:snap', function(e) {
    console.log(e);
});

polygonLayer.on('pm:edit', function(e) {
    console.log(e);
});



// Layer Group Example

const layerGroupItem1 = L.polyline([
    [51.51, -0.09],
    [51.513, -0.08],
    [51.514, -0.11],
]);
const layerGroupItem2 = L.polygon([
    [51.52, -0.06],
    [51.51, -0.07],
    [51.52, -0.05],
]);

const layerGroupItem3 = L.polygon([
    [
        51.51549835365031,
        -0.06450164634969281,
    ],
    [
        51.51944818307178,
        -0.08425079345703125,
    ],
    [
        51.51868369995795,
        -0.06131630004205801,
    ],
    [
        51.51549835365031,
        -0.06450164634969281,
    ],
]);
const layerGroupItem4 = L.polygon([
    [
        51.51549835365031,
        -0.06450164634969281,
    ],
    [
        51.51944818307178,
        -0.08425079345703125,
    ],
    [
        51.51868369995795,
        -0.06131630004205801,
    ],
    [
        51.51549835365031,
        -0.06450164634969281,
    ],
]);
const layerGroupItem5 = L.polygon([
    [
        51.51549835365031,
        -0.06450164634969281,
    ],
    [
        51.51944818307178,
        -0.08425079345703125,
    ],
    [
        51.51868369995795,
        -0.06131630004205801,
    ],
    [
        51.51549835365031,
        -0.06450164634969281,
    ],
]);

const layerGroup = L.featureGroup([layerGroupItem1]).addTo(map4);
layerGroup.pm.toggleEdit({
    draggable: true,
    snappable: true,
    snapDistance: 30,
});

layerGroup.on('pm:snap', function(e) {
    console.log('snap');
    console.log(e);
});
layerGroup.on('pm:unsnap', function(e) {
    console.log('unsnap');
    console.log(e);
});

map4.pm.addControls({
    position: 'topright',
});

// map4.pm.setPathOptions({
//     color: 'orange',
//     fillColor: 'green',
//     fillOpacity: 0.4,
// });

layerGroup.addLayer(layerGroupItem2);
layerGroup.addLayer(layerGroupItem3);
// layerGroup.addLayer(layerGroupItem4);
// layerGroup.addLayer(layerGroupItem5);

layerGroup.on('pm:dragstart', function(e) {
    console.log(e);
});
layerGroup.on('pm:drag', function(e) {
    console.log(e);
});
layerGroup.on('pm:dragend', function(e) {
    console.log(e);
});
layerGroup.on('pm:markerdragstart', function(e) {
    console.log(e);
});
layerGroup.on('pm:markerdragend', function(e) {
    console.log(e);
});

// test with markercluster
// var markers = L.markerClusterGroup();
// markers.addLayer(L.marker([51.505, -0.07]));
// markers.addLayer(L.marker([51.505, -0.08]));
// markers.addLayer(L.marker([51.505, -0.09]));
// map4.addLayer(markers);
