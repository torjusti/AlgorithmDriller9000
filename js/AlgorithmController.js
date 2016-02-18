/**
 * Manages the algorithm adding and removing functionality.
 * @param {Array} storedAlgorithms Array of algs stored in the DataController.
 * @param {Node} algorithmsContainer Contains the algorithm blocks.
 * @param {Node} algorithmSetsContainer Contains the algorithm set blocks.
 * @param {Function} algorithmsUpdated Called when an algorithm set is updated.
 * @constructor
 */
var AlgorithmController = function(storedAlgorithms, algorithmsContainer, algorithmSetsContainer, algorithmsUpdated) {
  this._algorithmsUpdated = algorithmsUpdated;

  // Elements
  this._algorithmSetsContainer = algorithmSetsContainer;

  this._algorithmsContainer = algorithmsContainer;

  this._algorithms = storedAlgorithms || [];

  this._currentAlgorithmSet = this._algorithms[this._algorithms.length - 1];

  this._initializeStructure();

  this._render();

  this._propagateUpdates();
};

AlgorithmController.prototype = {
  _initializeStructure: function() {
    var self = this;

    var createAlgorithmSetButton = document.createElement('button');
    createAlgorithmSetButton.innerHTML = 'Create set';
    createAlgorithmSetButton.addEventListener('click', function() {
      var setName = prompt('Set name');
      if (setName) {
        self._createAlgorithmSet(setName);
      }
    });

    var addAlgorithmButton = document.createElement('button');
    addAlgorithmButton.innerHTML = 'Add algorithm';
    addAlgorithmButton.addEventListener('click', function() {
      if (!self._currentAlgorithmSet) {
        alert('No algorithm set currently selected!');
        return;
      }
      var algorithm = prompt('Algorithm');
      if (algorithm) {
        algorithm = algorithm.replace('(', '').replace(')', '').replace("U2'", "U2");
        if (new RegExp("^[ RULFDB'xyzM2]+$", "i").test(algorithm)) {
          self._addAlgorithm(algorithm);
        } else {
          alert('Algorithm contains invalid moves');
        }
      }
    });

    this._algorithmSetsContainer.appendChild(createAlgorithmSetButton);
    this._algorithmsContainer.appendChild(addAlgorithmButton);

    var setContainer = document.createElement('div');
    var algContainer = document.createElement('div');

    this._algorithmSetsContainer.appendChild(setContainer);
    this._algorithmsContainer.appendChild(algContainer);

    this._innerSetContainer = setContainer;
    this._innerAlgContainer = algContainer;
  },

  /**
   * @param {boolean=} doNotRender Whether the algorithm view should be rerendered after propagating or not.
   */
  _propagateUpdates: function(doNotRender) {
    this._algorithmsUpdated(this._getAlgorithms(), this._getEnabledAlgorithms());
    this._updateSelectedAlgorithmSetIndicators(this._currentAlgorithmSet.name);

    if (!doNotRender) {
      this._render();
    }
  },

  _getAlgorithms: function() {
    return this._algorithms;
  },

  /**
   * Returns a list of all enabled algorithms in a set.
   * @param{String=} setName The (optional) name of the set to get enabled algorithms from.
   */
  _getEnabledAlgorithms: function(setName) {
    var sets = this._algorithms;
    var enabledAlgs = [];

    for (var i = 0; i < sets.length; i++) {
      var algsInSet = sets[i].algorithms;

      // If we have a set name, only check this set if it is the set we are looking for.
      // If we find the set we are looking for, cancel the loop.
      if (!setName || (sets[i].name === setName)) {
        for (var j = 0; j < algsInSet.length; j++) {
          var alg = algsInSet[j];
          if (alg && alg.enabled) {
            enabledAlgs.push(alg);
          }
        }

        // We found the alg set we were looking for, stop searching.
        break;
      }
    }

    return enabledAlgs;
  },

  /**
   * Returns the object of an algorithm set given its name.
   * Behaviour for duplicate set names is currently undocumented. The first set will be returned.
   * @param {string} setName The set name to find.
   */
  _getAlgorithmSetFromName: function(setName) {
    var sets = this._algorithms;

    for (var i = 0; i < sets.length; i++) {
      if (sets[i].name === setName) {
        return sets[i];
      }
    }

    return false;
  },

  /**
   * Checks whether a given set has enabled algorithms in it or not and returns a boolean.
   * @param {String} setName The name of the set to check for enabled algorithms in.
   * @returns {boolean}
   */
  _algorithmSetHasEnabledAlgorithms: function(setName) {
    return this._getEnabledAlgorithms(setName).length > 0;
  },

  /**
   * Checks whether a given set has ALL of its algorithms enabled or not and returns a boolean.
   * @param {String} setName The name of the set to check for enabled algorithms in.
   * @param {boolean=} allowEmpty If true, empty sets will count.
   * @returns {boolean}
   */
  _algorithmSetHasOnlyEnabledAlgorithms: function(setName, allowEmpty) {
    // If the algorithm set is empty...
    if (!allowEmpty && this._getAlgorithmSetFromName(setName).algorithms.length === 0) {
      return false;
    }

    return this._getEnabledAlgorithms(setName).length === this._getAlgorithmSetFromName(setName).algorithms.length;
  },

  _selectLatestAlgorithmSet: function() {
    this._currentAlgorithmSet = this._algorithms[this._algorithms.length - 1];
  },

  _selectAlgorithmSet: function(i) {
    this._currentAlgorithmSet = this._algorithms[i];
  },

  _toggleAlgorithmSetEnabled: function(i) {
    this._selectAlgorithmSet(i);

    if (this._algorithms[i].algorithms[0].enabled) {
      for (var j = 0; j < this._algorithms[i].algorithms.length; j++) {
        this._algorithms[i].algorithms[j].enabled = false;
      }
    } else {
      for (var j = 0; j < this._algorithms[i].algorithms.length; j++) {
        this._algorithms[i].algorithms[j].enabled = true;
      }
    }

    this._propagateUpdates();
  },

  _createAlgorithmSet: function(name) {
    this._algorithms.push({
      name: name,
      algorithms: []
    });

    this._selectLatestAlgorithmSet();

    this._propagateUpdates();
  },

  _addAlgorithm: function(alg) {
    this._currentAlgorithmSet.algorithms.push({
      alg: alg,
      enabled: true
    });

    this._propagateUpdates();
  },

  _setAlgorithmEnabled: function(index, value) {
    this._currentAlgorithmSet.algorithms[index].enabled = value;
    this._propagateUpdates(true);
  },

  _deleteAlgorithm: function(i) {
    this._currentAlgorithmSet.algorithms.splice(i, 1);
    this._propagateUpdates();
  },

  _deleteAlgorithmSet: function(i) {
    this._algorithms.splice(i, 1);
    this._propagateUpdates();
  },

  /**
   * Locates the DOM node for the button that selects an algorithm set.
   * @param {string} setName The name of the algoritm set.
   */
  _locateAlgorithmSetBoxWithSetName: function(setName) {
    var boxes = this._innerSetContainer.getElementsByClassName('set-box');

    // The name of the box is set as the innerHTML, so we loop through and compare.
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].getAttribute('data-set-name') === setName) {
        return boxes[i];
      }
    }

    return false;
  },

  /**
   * When an algorithm set has selected algorithms, this should be indicated in the UI.
   * This function updates the state of this UI indicator to dynamically enable or disable it.
   * @param {string} setName The set to check the highlight status of.
   */
  _updateSelectedAlgorithmSetIndicators: function(setName) {
    var setBox = this._locateAlgorithmSetBoxWithSetName(setName);

    // algorithmSetHasOnlyEnabledAlgorithms does not count empty sets, so we do not need to do any extra work.
    // See function definition for algorithmSetHasOnlyEnabledAlgorithms.
    if (this._algorithmSetHasOnlyEnabledAlgorithms(setName)) {
      setBox.classList.add('setBoxFullyEnabled');
      setBox.classList.remove('setBoxEnabled');
      setBox.classList.remove('setBoxDisabled');
    } else if (this._algorithmSetHasEnabledAlgorithms(setName)) {
      setBox.classList.add('setBoxEnabled');
      setBox.classList.remove('setBoxDisabled');
      setBox.classList.remove('setBoxFullyEnabled');
    } else {
      setBox.classList.add('setBoxDisabled');
      setBox.classList.remove('setBoxEnabled');
      setBox.classList.remove('setBoxFullyEnabled');
    }
  },

  _render: function() {
    var self = this;

    this._innerSetContainer.innerHTML = '';

    var algs = this._algorithms;

    for (var i = 0; i < algs.length; i++) {
      (function(i) {
        var setBox = document.createElement('div');
        setBox.className = 'set-box';
        var setName = algs[i].name;
        setBox.setAttribute('data-set-name', setName);
        var algSetButton = document.createElement('button');
        algSetButton.innerHTML = algs[i].name;
        algSetButton.addEventListener('click', function() {
          self._selectAlgorithmSet(i);
          self._render();
        });
        var deleteAlgSetButton = document.createElement('button');
        deleteAlgSetButton.innerHTML = 'delete';
        deleteAlgSetButton.addEventListener('click', function() {
          if (confirm('Are you sure you want to delete this algorithm set?')) {
            self._deleteAlgorithmSet(i);
          }
        });
        var selectAlgSetButton = document.createElement('button');
        selectAlgSetButton.innerHTML = 'select';
        selectAlgSetButton.addEventListener('click', function() {
          self._toggleAlgorithmSetEnabled(i);
        });
        setBox.appendChild(algSetButton);
        setBox.appendChild(deleteAlgSetButton);
        setBox.appendChild(selectAlgSetButton);
        self._innerSetContainer.appendChild(setBox);

        self._updateSelectedAlgorithmSetIndicators(setName);
      })(i);
    }

    if (!this._currentAlgorithmSet) {
      return;
    }

    var algsInSet = this._currentAlgorithmSet.algorithms;

    this._innerAlgContainer.innerHTML = '<h2>' + this._currentAlgorithmSet.name + '</h2>';

    for (var j = 0; j < algsInSet.length; j++) {
      (function(j) {
        var alg = algsInSet[j];
        var algorithmBox = document.createElement('div');
        algorithmBox.className = 'alg-box';
        var algorithmName = document.createElement('p');
        algorithmName.className = 'alg-name';
        algorithmName.innerHTML = alg.alg;
        algorithmBox.appendChild(algorithmName);
        var algorithmCheckBox = document.createElement('input');
        algorithmCheckBox.type = 'checkbox';
        algorithmCheckBox.checked = alg.enabled;
        algorithmCheckBox.addEventListener('change', function() {
          self._setAlgorithmEnabled(j, algorithmCheckBox.checked);
        });
        algorithmBox.appendChild(algorithmCheckBox);
        var deleteAlgorithmButton = document.createElement('button');
        deleteAlgorithmButton.innerHTML = 'delete';
        deleteAlgorithmButton.addEventListener('click', function() {
          if (confirm('Are you sure you want to delete this algorithm?')) {
            self._deleteAlgorithm(j);
          }
        });
        algorithmBox.appendChild(deleteAlgorithmButton);
        self._innerAlgContainer.appendChild(algorithmBox);
      })(j);
    }
  }
};
