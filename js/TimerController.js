var TimerController = function(display, attemptFinshed) {
  this._attemptFinished = attemptFinshed;

  this._timerView = new TimerController.TimerView(display);

  this._timerView.updateDisplay('0.000');
};

TimerController.States = {
  IDLE: 0,
  WAITING: 1,
  RUNNING: 2
};

TimerController.prototype = {
  updateState: function(state) {
    switch(state) {
      case TimerController.States.IDLE:
        this.endTiming();
        break;
      case TimerController.States.WAITING:
        this.initializeTimer();
        break;
      case TimerController.States.RUNNING:
        this.startTimer();
        break;
    }
  },

  initializeTimer: function() {
    this._timerView.setWaiting(true);
  },

  startTimer: function() {
    this._timerView.setWaiting(false);
    this._startTime = (new Date()).getTime();
    this._isTiming = true;

    var self = this;

    function frame() {
      if (self._isTiming) {
        self._timerView.updateDisplay(self._getCurrentTime());
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  },

  _getCurrentTime: function() {
    return ((new Date()).getTime() - this._startTime) / 1000;
  },

  endTiming: function() {
    // Force a last update so that the time display and history display are in sync.
    this._timerView.updateDisplay(this._getCurrentTime());
    this._attemptFinished(this._getCurrentTime());
    this._isTiming = false;
  }
};

TimerController.TimerView = function(display) {
  this._display = display;
};

TimerController.TimerView.prototype = {
  setWaiting: function(waiting) {
    if (waiting) {
      this._display.classList.add('active');
    } else {
      this._display.classList.remove('active');
    }
  },

  updateDisplay: function(time) {
    this._display.innerHTML = time;
  }
};
