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
    doNotRender || this._render();
  },

  _getAlgorithms: function() {
    return this._algorithms;
  },

  _getEnabledAlgorithms: function() {
    var sets = this._algorithms;
    var enabledAlgs = [];

    for (var i = 0; i < sets.length; i++) {
      var algsInSet = sets[i].algorithms;
      for (var j = 0; j < algsInSet.length; j++) {
        var alg = algsInSet[j];
        if (alg && alg.enabled) {
          enabledAlgs.push(alg);
        }
      }
    }

    return enabledAlgs;
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
    console.log('toggling', index, value)
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

  _render: function() {
    var self = this;

    this._innerSetContainer.innerHTML = '';

    var algs = this._algorithms;

    for (var i = 0; i < algs.length; i++) {
      (function(i) {
        var setBox = document.createElement('div');
        setBox.className = 'set-box';
        var setName = algs[i].name;
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
