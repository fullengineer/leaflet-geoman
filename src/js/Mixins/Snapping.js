var SnapMixin = {
    _initSnappableMarkers: function() {

        this.options.snapDistance = this.options.snapDistance || 30;

        this._markers.forEach((marker) => {

            marker.off('drag', this._handleSnapping, this);
            marker.on('drag', this._handleSnapping, this);

            marker.off('dragend', this._cleanupSnapping, this);
            marker.on('dragend', this._cleanupSnapping, this);
        });

    },
    _cleanupSnapping: function(e) {

        // delete it, we need to refresh this with each start of a drag because
        // meanwhile, new layers could've been added to the map
        delete this._snapList;

        this.debugIndicatorLines.forEach((line) => {
            line.remove();
        });
    },
    _handleSnapping: function(e) {

        // create a list of polygons that the marker could snap to
        // this isn't inside a movestart/dragstart callback because middlemarkers are initialized
        // after dragstart/movestart so it wouldn't fire for them
        if(this._snapList === undefined) {
            this._createSnapList(e);
        }

        let marker = e.target;

        // get the closest layer, it's closest latlng and the distance
        let closestLayer = this._calcClosestLayer(marker.getLatLng(), this._snapList);

        // minimal distance before marker snaps (in pixels)
        let minDistance = this.options.snapDistance;

        if(closestLayer.distance < minDistance) {

            // snap the marker
            marker.setLatLng(closestLayer.latlng);
            this._onMarkerDrag(e);
        }

    },
    _createSnapList: function() {

        let layers = [];
        let debugIndicatorLines = [];

        // find all layers that are or inherit from Polylines...
        this._poly._map.eachLayer((layer) => {
            if(layer instanceof L.Polyline) {
                layers.push(layer);
                debugIndicatorLines.push(L.polyline([], {color: 'red'}).addTo(this._poly._map));
            }
        });

        // ...except myself
        layers = layers.filter((layer) => this._poly !== layer);

        this._snapList = layers;
        this.debugIndicatorLines = debugIndicatorLines;
    },
    _calcClosestLayer: function(latlng, layers) {
        let map = this._poly._map;

        // the closest polygon to our dragged marker latlng
        let closestLayer = {};

        // loop through the layers
        layers.forEach((layer, index) => {

            // find the closest latlng, segment and the distance of this layer to the dragged marker latlng
            let results = this._calcLayerDistances(latlng, layer);

            // show indicator lines, it's for debugging
            this.debugIndicatorLines[index].setLatLngs([latlng, results.latlng]);

            // save the info if it doesn't exist or if the distance is smaller than the previous one
            if(closestLayer.distance === undefined || results.distance < closestLayer.distance) {
                closestLayer = results;
                closestLayer.layer = layer;
            }

        });

        // return the closest layer and it's data
        return closestLayer;


    },
    _calcLayerDistances: function(latlng, layer) {
        let map = this._poly._map;

        // the point which we want to snap (probpably the marker that is dragged) in pixels
        let P = map.latLngToLayerPoint(latlng);

        // the coords of the layer
        let coords = layer.getLatLngs()[0];

        // the shortest segment (line between two points) of the layer
        let closestSegment;

        // the shortest distance from P to closestSegment
        let shortestDistance;

        // loop through the coords of the layer
        coords.forEach((point, index) => {
            // take this coord (A)...
            let A = map.latLngToLayerPoint(point);

            // and the next coord (B) as points
            let nextIndex = index + 1 === coords.length ? 0 : index + 1;
            let B = map.latLngToLayerPoint(coords[nextIndex]);

            // calc the distance between P and AB-segment
            let distance = L.LineUtil.pointToSegmentDistance(P, A, B);

            // is the distance shorter than the previous one? Save it and the segment
            if(shortestDistance === undefined || distance < shortestDistance) {
                shortestDistance = distance;
                closestSegment = [A, B];
            }

        });

        // now, take the closest segment (closestSegment) and calc the closest point to P on it.
        let closestPointOnSegment = L.LineUtil.closestPointOnSegment(P, closestSegment[0], closestSegment[1]);

        // return the latlng of that sucker
        return {
            latlng: map.layerPointToLatLng(closestPointOnSegment),
            segment: closestSegment,
            distance: shortestDistance
        };

    }
}
