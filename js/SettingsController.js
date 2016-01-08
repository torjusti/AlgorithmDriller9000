/**
 * Manages settings.
 * @constructor
 */
var SettingsController = function() {
  var self = this;

  // Attempt to restore settings from localStorage.
  if (localStorage['settingsData']) {
    this._settings = JSON.parse(localStorage['settingsData']);
  }

  // Called by the renderer when a value is updated.
  function valueUpdated(id, value) {
    self.updateSetting(id, value);
  }

  /**
   * @private
   */
  this._settingsView = new SettingsController.SettingsView(valueUpdated);
};

SettingsController.prototype = {
  /**
   * @private
   */
  _listeners: {},

  /**
   * @private
   */
  _settings: {},

  /**
   * Stores all the settings in localStorage.
   */
  _saveSettingsData: function() {
    localStorage['settingsData'] = JSON.stringify(this._settings);
  },

  /**
   * Creates a new setting.
   * @param {String} id The ID of the new setting.
   * @param {String} type The type of the setting.
   * @param {String|Number|boolean} defaultValue The default setting value.
   * @param {String} label A label to describe the setting.
   */
  registerSetting: function(id, type, defaultValue, label) {
    this._settings[id] = {
      label: label,
      type: type,
      val: defaultValue
    };

    this._saveSettingsData();

    this._settingsView.render(this._settings);
  },

  /**
   * Updates the value of a setting.
   * @param {String} id The setting ID.
   * @param {String|Number|boolean} value The value of the setting.
   */
  updateSetting: function(id, value) {
    this._settings[id].val = value;
    this._saveSettingsData();
    this._triggerListeners(id);
  },

  /**
   * Returns the value of a setting.
   * @param {String} id The ID of the setting.
   * @returns {String|Number|boolean}
   */
  getSetting: function(id) {
    return this._settings[id].val;
  },

  /**
   * Adds a listener that waits for updates to a specified setting.
   * @param {String} id The setting ID.
   * @param {Function} fn The callback function.
   */
  addListener: function(id, fn) {
    if (!this._listeners[id]) {
      this._listeners[id] = [];
    }

    this._listeners[id].push(fn);
  },

  /**
   * Trigger all listeners on a certain ID.
   * @param {String} id The ID to trigger listeners on.
   * @private
   */
  _triggerListeners: function(id) {
    if (this._listeners[id]) {
      for (var i = 0; i < this._listeners[id].length; i++) {
        this._listeners[id][i](this._settings[id].val);
      }
    }
  },

  /**
   * Show the settings view.
   */
  show: function() {
    this._settingsView.show();
  },

  /**
   * Hide the settings view.
   */
  hide: function() {
    this._settingsView.hide();
  },

  /**
   * Toggle the display of the settings view.
   */
  toggleDisplay: function() {
    this._settingsView.toggleDisplay();
  }
};

/**
 * Renders the setting view.
 */
SettingsController.SettingsView = function(valueUpdated) {
  this._valueUpdated = valueUpdated;
};

SettingsController.prototype = {
  /**
   * Updates the setting list.
   * @param {Object} settings The internal settings object.
   */
  render: function(settings) {
    var tempContainer = document.createElement('div');

    for (var key in settings) {
      (function(key, settingsObject) {
        var elem, label;

        if (settingsObject.type === 'checkbox') {
          label = document.createElement('label');
          label.innerHTML = settingsObject.label;
          label.for = key;

          elem = document.createElement('input');
          elem.type = 'checkbox';
          elem.name = key;
        }

        tempContainer.appendChild(label);
        tempContainer.appendChild(elem);
      })(key, settings[key]);
    }
  },

  /**
   * Show the settings view.
   */
  show: function() {

  },

  /**
   * Hide the settings view.
   */
  hide: function() {

  },

  /**
   * Toggle the display of the settings view.
   */
  toggleDisplay: function() {

  }
};
