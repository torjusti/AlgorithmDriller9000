/*
 * @constructor
 * @param {string} defaultScrambler The default scrambler to be selected.
 * @param {Node} DOM node to store the scramble in.
 * @param {Node} Selection dropdown to pick scramble type from.
 */
var ScrambleController = function(defaultScrambler, scrambleDisplay, scrambleSelector, nextScrambleButton, scrambleUpdated) {
  var self = this;

  this._scrambler = defaultScrambler;
  this._scrambleUpdated = scrambleUpdated;

  this._solverInitialized = false;

  // Called when the scramble selector dropdown is updated.
  function scramblerUpdated(scrambler) {
    self._scrambler = scrambler;
    self.generateScramble();
  }

  // The view may call this function to force a new scramble. Used by the next scramble button.
  function forceScrambleUpdate() {
    self.generateScramble();
  }

  this.scrambleView = new ScrambleController.ScrambleView(scrambleDisplay, scrambleSelector, scramblerUpdated, nextScrambleButton, forceScrambleUpdate);

  this.selectScrambler(defaultScrambler);
};

ScrambleController.prototype = {
  generateScramble: function() {
    if (this._scrambler === 'alg') {
      if (this._algorithms && this._algorithms.length) {
        if (!this._solverInitialized) {
          Cube.initSolver();
        }

        var algs = this._algorithms;

        var randomAlgorithm = algs[Math.floor(Math.random() * algs.length)].alg;

        var AUF_MOVES = ['U', 'U2', "U'"];

        var randomAlgWithAuf = [AUF_MOVES[Math.floor(Math.random() * AUF_MOVES.length)], randomAlgorithm, AUF_MOVES[Math.floor(Math.random() * AUF_MOVES.length)]].join(' ');

        var scrambleObject = {
          scramble_string: randomAlgorithm,
          algorithm: true
        };

        var normalizedAlgorithm = randomAlgWithAuf.replace("2'", "2").split(/ +/);

        var translateWideMoves = {
          r: "R M'",
          l: "L M",
          u: "D y'",
          d: "U y",
          f: "B z'",
          b: "F z'"
        };

        var translateSliceMoves = {
          M: "R L' x'"
        };

        var translateRotations = {
          y: {
            R: 'F',
            L: 'B',
            B: 'R',
            F: 'L'
          },

          "y2": {
            R: 'L',
            L: 'R',
            B: 'F',
            F: 'B'
          },

          "y'": {
            R: 'B',
            L: 'F',
            B: 'L',
            F: 'R'
          },

          x: {
            U: 'F',
            D: 'B',
            B: 'U',
            F: 'D'
          },

          "x'": {
            U: 'B',
            D: 'F',
            B: 'D',
            F: 'U'
          },

          "x2": {
            U: 'D',
            D: 'U',
            F: 'B',
            B: 'F'
          },

          z: {
            R: 'D',
            U: 'R',
            L: 'U',
            D: 'L'
          },

          "z2": {
            R: 'L',
            U: 'D',
            L: 'R',
            D: 'U'
          },

          "z'": {
            R: 'U',
            U: 'L',
            L: 'D',
            D: 'R'
          }
        };

        for (var key in translateWideMoves) {
          translateWideMoves[key + "'"] = [translateWideMoves[key], translateWideMoves[key], translateWideMoves[key]].join(' ');
          translateWideMoves[key + "2"] = [translateWideMoves[key], translateWideMoves[key]].join(' ');
        }

        for (var key in translateSliceMoves) {
          translateSliceMoves[key + "'"] = [translateSliceMoves[key], translateSliceMoves[key], translateSliceMoves[key]].join(' ');
          translateSliceMoves[key + "2"] = [translateSliceMoves[key], translateSliceMoves[key]].join(' ');
        }

        var rotations = ['y', 'x', 'z', "y'", "y2", "x'", "x2", "z'", "z2"];
        for (var i = 0; i < rotations.length; i++) {
          if (!translateRotations[rotations[i]]) {
            translateRotations[rotations[i]] = {};
          }

          for (var key in translateRotations[rotations[i]]) {
            translateRotations[rotations[i]][key + "'"] = [translateRotations[rotations[i]][key], translateRotations[rotations[i]][key], translateRotations[rotations[i]][key]].join(' ');
            translateRotations[rotations[i]][key + "2"] = [translateRotations[rotations[i]][key], translateRotations[rotations[i]][key]].join(' ');
          }
        }

        for (var i = normalizedAlgorithm.length - 1; i >= 0; i--) {
          if (translateWideMoves[normalizedAlgorithm[i]]) {
            normalizedAlgorithm[i] = translateWideMoves[normalizedAlgorithm[i]];
          }
        }

        normalizedAlgorithm = normalizedAlgorithm.join(' ').split(' ');

        for (var i = normalizedAlgorithm.length - 1; i >= 0; i--) {
          if (translateSliceMoves[normalizedAlgorithm[i]]) {
            normalizedAlgorithm[i] = translateSliceMoves[normalizedAlgorithm[i]];
          }
        }

        normalizedAlgorithm = normalizedAlgorithm.join(' ').split(' ');

        for (var i = normalizedAlgorithm.length - 1; i >= 0; i--) {
          if (translateRotations[normalizedAlgorithm[i]]) {
            for (var j = normalizedAlgorithm.length - 1; j > i; j--) {
              if (translateRotations[normalizedAlgorithm[i]][normalizedAlgorithm[j]]) {
                normalizedAlgorithm[j] = translateRotations[normalizedAlgorithm[i]][normalizedAlgorithm[j]];
                normalizedAlgorithm = normalizedAlgorithm.join(' ').split(' ');
              }
            }
            normalizedAlgorithm.splice(i, 1);
          }
        }

        normalizedAlgorithm = normalizedAlgorithm.join(' ').split(' ').join(' ');

        var randomized = new Cube().move(normalizedAlgorithm).solve();

        this.scrambleView.updateScrambleDisplay(randomized);
        this._scrambleUpdated(scrambleObject);
      } else {
        this.scrambleView.updateScrambleDisplay('No algorithms');
        this._scrambleUpdated(false);
      }
    } else {
      var scramble = scramblers[this._scrambler].getRandomScramble();
      this.scrambleView.updateScrambleDisplay(scramble.scramble_string);
      this._scrambleUpdated(scramble);
    }
  },

  setAlgorithms: function(algorithms) {
    this._algorithms = algorithms;
  },

  selectScrambler: function(scrambler) {
    this._scrambler = scrambler;
  },
};

ScrambleController.ScrambleView = function(scrambleDisplay, scrambleSelector, scramblerUpdated, nextScrambleButton, forceScrambleUpdate) {
  this._scrambleDisplay = scrambleDisplay;
  this._scrambleSelector = scrambleSelector;

  var scrambleTypes = ['333', '222', '333bf', '333fm', '333ft', '333mbf', '333oh', '444', '444bf', '555', '555bf', '666', '777', 'clock', 'minx', 'skewb', 'sq1', 'edges', 'corners', 'cmll', 'lsll', 'zbll', '2gll', 'pll', 'lse', 'zzls', 'alg'];

  // Propagate the scrambler dropdown.
  for (var i = 0; i < scrambleTypes.length; i++) {
    var option = document.createElement('option');
    option.innerHTML = scrambleTypes[i];
    this._scrambleSelector.appendChild(option);
  }

  var self = this;

  this._scrambleSelector.addEventListener('change', function() {
    scramblerUpdated(self._scrambleSelector.options[self._scrambleSelector.selectedIndex].text);
  });

  nextScrambleButton.addEventListener('click', function() {
    forceScrambleUpdate();
  });
};

ScrambleController.ScrambleView.prototype = {
  updateScrambleDisplay: function(value) {
    this._scrambleDisplay.innerHTML = '<a target="_blank" href="https://alg.cubing.net/?setup=R' + value + '">' + value + '</a>';
  }
};
