const GlobalRotateMode = {

  _globalRotateModeEnabled: false,
  enableGlobalRotateMode() {
    this._globalRotateModeEnabled = true;
    const layers = L.PM.Utils.findLayers(this.map).filter(l => l instanceof L.Polyline);
    layers.forEach(layer => {
      layer.pm.enableRotate();
    });

    // toogle the button in the toolbar if this is called programatically
    this.Toolbar.toggleButton('rotateMode', this.globalRotateModeEnabled());
    this._fireRotateModeEvent();
  },
  disableGlobalRotateMode() {
    this._globalRotateModeEnabled = false;
    const layers = L.PM.Utils.findLayers(this.map).filter(l => l instanceof L.Polyline);
    layers.forEach(layer => {
      layer.pm.disableRotate();
    });

    // toogle the button in the toolbar if this is called programatically
    this.Toolbar.toggleButton('rotateMode', this.globalRotateModeEnabled());
    this._fireRotateModeEvent();
  },
  globalRotateModeEnabled() {
    return !!this._globalRotateModeEnabled;
  },
  toggleGlobalRotateMode() {
    if (this.globalRotateModeEnabled()) {
      this.disableGlobalRotateMode();
    } else {
      this.enableGlobalRotateMode();
    }
  },
  _fireRotateModeEvent() {
    L.PM.Utils._fireEvent(this.map, 'pm:globalrotatemodetoggled', {
      enabled: this.globalRotateModeEnabled(),
      map: this.map,
    });
  }

};
export default GlobalRotateMode;
