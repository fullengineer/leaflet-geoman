L.PM.Draw.Marker = L.PM.Draw.extend({
    initialize(map) {
        this._map = map;
        this._shape = 'Marker';
        this.toolbarButtonName = 'drawMarker';

        this._markers = [];
    },
    enable(options) {
        // TODO: Think about if these options could be passed globally for all
        // instances of L.PM.Draw. So a dev could set drawing style one time as some kind of config
        L.Util.setOptions(this, options);

        // change enabled state
        this._enabled = true;

        // enable dragging and removal for all current markers
        this._markers.forEach((marker) => {
            marker.dragging.enable();

            marker.on('contextmenu', this._removeMarker, this);
        });

        // create a marker on click on the map
        this._map.on('click', this._createMarker, this);

        // toggle the draw button of the Toolbar in case drawing mode got enabled without the button
        this._map.pm.Toolbar.toggleButton(this.toolbarButtonName, true);
    },
    disable() {
        // cancel, if drawing mode isn't even enabled
        if(!this._enabled) {
            return;
        }

        // undbind click event, don't create a marker on click anymore
        this._map.off('click', this._createMarker, this);

        // disable dragging and removing for all markers
        this._markers.forEach((marker) => {
            marker.dragging.disable();

            marker.off('contextmenu', this._removeMarker, this);
        });

        // change enabled state
        this._enabled = false;
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
    _createMarker(e) {
        // save coords of click
        const latlng = e.latlng;

        // create marker
        const marker = new L.Marker(latlng, {
            draggable: true,
        });

        // handle dragging and removing of the marker
        marker.on('contextmenu', this._removeMarker, this);
        marker.on('dragend', this._onDragEnd, this);

        // add marker to the map
        marker.addTo(this._map);

        // fire the pm:create event and pass shape and marker
        this._map.fire('pm:create', {
            shape: this._shape,
            marker,
        });

        // save marker into markers array for later reference
        this._markers.push(marker);
    },
    _removeMarker(e) {
        const marker = e.target;

        const index = this._markers.indexOf(marker);
        this._markers.splice(index, 1);

        marker.remove();
    },
    _onDragEnd(e) {
        const marker = e.target;

        // fire the pm:edit event and pass shape and marker
        marker.fire('pm:edit');
    },
});
