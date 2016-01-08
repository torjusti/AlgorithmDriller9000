/**
 * The main timer constructor. Initializes all submodules and connects the dots.
 * @param {Object} config An object containing configuration such as DOM elements to use.
 * @constructor
 */
var TimerApp = function(config) {
  // Store a reference to the current object.
  var self = this;

  // We cannot allow timing if there is no scramble, as this would mess with the results.
  var HAS_VALID_SCRAMBLE = false;

  // Called when a new scramble is fetched from the scramble controller.
  function scrambleUpdated(scramble) {
    HAS_VALID_SCRAMBLE = !!scramble;
    self._currentScramble = scramble;
  }

  // Initialize a scramble controller.
  this._scrambleController = new ScrambleController(config.DEFAULT_SCRAMBLER, config.scrambleDisplay, config.scrambleSelector, config.nextScramble, scrambleUpdated);

  // Initialize a data controller.
  this._dataController = new DataController(config.history, config.statistics, config.sessionSelector);

  // Called when the algorithm manager changes the algorithm data.
  function algorithmsUpdated(data, enabledAlgorithms) {
    // Update scramble controller alg references.
    self._scrambleController.setAlgorithms(enabledAlgorithms);
    // Store updated algorithms in the data controller.
    self._dataController.setAlgorithms(data);
  }

  // Initialize an algorithm controller.
  this._algorithmController = new AlgorithmController(this._dataController.getAlgorithms(), config.algorithms, config.algorithmSets, algorithmsUpdated);

  // Called when the timer controller returns a new result.
  function attemptFinished(time) {
    self._dataController.addTime(time, self._currentScramble.scramble_string, self._currentScramble.algorithm);
    self._scrambleController.generateScramble();
  }

  // Initialize a new timer controller.
  this._timerController = new TimerController(config.display, attemptFinished);

  // Initialize a default scramble.
  this._scrambleController.generateScramble();

  // When the user is waiting to release the space bar.
  var isWaiting = false;

  // When the timer is running-
  var isRunning = false;

  document.addEventListener('keydown', function(e) {
    // Do not allow starting a time if we have no valid scramble available
    if (HAS_VALID_SCRAMBLE) {
      if (e.keyCode === 32 && !isWaiting && !isRunning) {
        self._timerController.updateState(TimerController.States.WAITING);
        isWaiting = true;
      } else if (isRunning) {
        self._timerController.updateState(TimerController.States.IDLE);
        isRunning = false;
      }
    }

    // Prevent spacebar from making the page jump
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
      return false;
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 32 && isWaiting) {
      self._timerController.updateState(TimerController.States.RUNNING);
      isRunning = true;
      isWaiting = false;
    }
  });
};

var timerApp = new TimerApp({
  DEFAULT_SCRAMBLER: '333',
  scrambleDisplay: document.getElementById('scramble'),
  scrambleSelector: document.getElementById('scramble-selector'),
  algorithms: document.getElementById('algorithms'),
  algorithmSets: document.getElementById('algorithm-sets'),
  display: document.getElementById('display'),
  statistics: document.getElementById('statistics'),
  history: document.getElementById('history'),
  sessionSelector: document.getElementById('session'),
  nextScramble: document.getElementById('next-scramble'),
});
