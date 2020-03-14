const MarkerLimits = {
  filterMarkerGroup() {
    // don't do it if the option is disabled
    if (this.options.limitMarkers === -1) {
      return;
    }

    this.markerCache = [];
    this.refreshMarkerCache();

    this._layer.on('pm:edit', () => {
      this.refreshMarkerCache();
    })

    this._layer.on('pm:disable', () => {
      // remove markerFilter mousemove event
      this._map.off('mousemove', this._filterClosestMarkers, this);
    });

    this.markerCache.forEach((l) => {
      this._markerGroup.removeLayer(l)
    })

  },
  refreshMarkerCache() {
    const allMarkers = [...this._markerGroup.getLayers(), ...this.markerCache];
    this.markerCache = allMarkers.filter((v, i, s) => s.indexOf(v) === i);

    this._map.off('mousemove', this._filterClosestMarkers, this);
    this._map.on('mousemove', this._filterClosestMarkers, this);
  },
  _filterClosestMarkers({ latlng }) {

    this.markerCache.sort((l, t) => {
      const distanceA = l._latlng.distanceTo(latlng);
      const distanceB = t._latlng.distanceTo(latlng);
      // console.log(distanceA);
      return distanceA - distanceB;
    })

    this.markerCache.forEach((l, i) => {
      if (i >= this.options.limitMarkers) {
        this._markerGroup.removeLayer(l)
      } else {
        this._markerGroup.addLayer(l)
      }
    })


  }
}

export default MarkerLimits