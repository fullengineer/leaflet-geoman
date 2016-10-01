L.PM.Draw.Line = L.PM.Draw.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'Line';
        this.toolbarButtonName = 'drawPolyline';
    },
    enable() {
        // enable draw mode

        this._enabled = true;

        // create a new layergroup
        this._layerGroup = new L.LayerGroup();
        this._layerGroup.addTo(this._map);

        // this is the polyLine that'll make up the polygon
        this._polyline = L.polyline([], { color: 'red' });
        this._layerGroup.addLayer(this._polyline);

        // this is the hintline from the mouse cursor to the last marker
        this._hintline = L.polyline([], {
            color: 'red',
            dashArray: [5, 5],
        });
        this._layerGroup.addLayer(this._hintline);


        // change map cursor
        this._map._container.style.cursor = 'crosshair';

        // create a polygon-point on click
        this._map.on('click', this._createPolygonPoint, this);

        // sync the hintline on mousemove
        this._map.on('mousemove', this._syncHintLine, this);

        // fire drawstart event
        this._map.fire('pm:drawstart', { shape: this._shape });

        // toggle the draw button of the Toolbar in case drawing mode got enabled without the button
        this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, true);
    },
    disable() {
        // disable draw mode

        // cancel, if drawing mode isn't even enabled
        if(!this._enabled) {
            return;
        }

        this._enabled = false;

        // reset cursor
        this._map._container.style.cursor = 'default';

        // unbind listeners
        this._map.off('click', this._createPolygonPoint);
        this._map.off('mousemove', this._syncHintLine);

        // remove layer
        this._map.removeLayer(this._layerGroup);

        // fire drawend event
        this._map.fire('pm:drawend', { shape: this._shape });

        // toggle the draw button of the Toolbar in case drawing mode got disabled without the button
        this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, false);
    },
    enabled() {
        return this._enabled;
    },
    toggle(options) {
        if(this.enabled()) {
            this.disable();
        } else {
            this.enable(options);
        }
    },
    _syncHintLine(e) {
        const polyPoints = this._polyline.getLatLngs();

        if(polyPoints.length > 0) {
            const lastPolygonPoint = polyPoints[polyPoints.length - 1];
            this._hintline.setLatLngs([lastPolygonPoint, e.latlng]);
        }
    },
    _createPolygonPoint(e) {
        // is this the first point?
        const first = this._polyline.getLatLngs().length === 0;

        this._polyline.addLatLng(e.latlng);
        this._createMarker(e.latlng, first);


        this._hintline.setLatLngs([e.latlng, e.latlng]);
    },
    _finishPolygon() {
        const coords = this._polyline.getLatLngs();
        const polygonLayer = L.polygon(coords).addTo(this._map);

        this.disable();

        this._map.fire('pm:create', {
            shape: this._shape,
            layer: polygonLayer,
        });
    },
    _createMarker(latlng) {
        const marker = new L.Marker(latlng, {
            draggable: false,
            icon: L.divIcon({ className: 'marker-icon' }),
        });

        this._layerGroup.addLayer(marker);

        return marker;
    },
});
