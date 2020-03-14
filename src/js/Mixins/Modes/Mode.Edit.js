// this mixin adds a global edit mode to the map
import Utils from '../../L.PM.Utils'

const { findLayers } = Utils

const GlobalEditMode = {
  _globalEditMode: false,
  globalEditEnabled() {
    return this._globalEditMode;
  },
  setGlobalEditStatus(status) {
    // set status
    this._globalEditMode = status;

    // fire event
    this._fireEditModeEvent(this._globalEditMode);
  },
  enableGlobalEditMode(o) {
    const options = {
      snappable: this._globalSnappingEnabled,
      ...o
    }

    const status = true;

    // Set toolbar button to currect status
    this.Toolbar.toggleButton('editMode', status);

    // find all layers handled by leaflet-geoman
    const layers = findLayers(this.map);

    // enable all layers
    layers.forEach(layer => {
      layer.pm.enable(options);
    });

    if (!this.throttledReInitEdit) {
      this.throttledReInitEdit = L.Util.throttle(this.reinitGlobalEditMode, 100, this)
    }

    // handle layers that are added while in removal mode
    this.map.on('layeradd', this.throttledReInitEdit, this);

    this.setGlobalEditStatus(status);
  },
  disableGlobalEditMode() {
    const status = false;

    // find all layers handles by leaflet-geoman
    const layers = findLayers(this.map);

    // disable all layers
    layers.forEach(layer => {
      layer.pm.disable();
    });

    // cleanup layer off event
    this.map.off('layeroff', this.throttledReInitEdit, this);

    // Set toolbar button to currect status
    this.Toolbar.toggleButton('editMode', status);

    this.setGlobalEditStatus(status);
  },
  toggleGlobalEditMode(options = this.globalOptions) {
    // console.log('toggle global edit mode', options);

    if (this.globalEditEnabled()) {
      // disable
      this.disableGlobalEditMode();
    } else {
      // enable
      this.enableGlobalEditMode(options);
    }
  },
  reinitGlobalEditMode({ layer }) {
    // do nothing if layer is not handled by leaflet so it doesn't fire unnecessarily	
    const isRelevant = !!layer.pm && !layer._pmTempLayer;
    if (!isRelevant) {
      return;
    }

    // re-enable global edit mode if it's enabled already
    if (this.globalEditEnabled()) {
      this.disableGlobalEditMode();
      this.enableGlobalEditMode();
    }
  },
  _fireEditModeEvent(enabled) {
    this.map.fire('pm:globaleditmodetoggled', {
      enabled,
      map: this.map,
    });
  },

}

export default GlobalEditMode