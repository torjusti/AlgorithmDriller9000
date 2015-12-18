var DataController = function(history, statistics, sessionSelector) {
  var self = this;

  if (localStorage['sessionData']) {
    this._sessionData = JSON.parse(localStorage['sessionData']);
  } else {
    this._sessionData = [[]];
  }

  this._selectLatestSession();

  function timeDeleted(i) {
    self._deleteTime(i);
  }

  this.historyView = new DataController.HistoryView(history, timeDeleted);

  this.statisticsView = new DataController.StatisticsView();

  function selectedSessionUpdated(i) {
    self._selectSession(i);
  }

  function sessionCreated() {
    self._createSession();
  }

  function sessionDeleted(i) {
    self._deleteSession(i);
  }

  this.sessionView = new DataController.SessionView(sessionSelector, this._sessionData, selectedSessionUpdated, sessionCreated, sessionDeleted);

  this._updateHistoryView();
  this._updateStatisticsView();
};

DataController.prototype = {
  _updateHistoryView: function() {
    this.historyView.updateAllResults(this._currentSession);
  },

  _updateStatisticsView: function() {
    this.statisticsView.updateAllResults(this._currentSession);
  },

  _updateSessionView: function() {
    this.sessionView.updateSessionData(this._sessionData);
    this.sessionView.render();
  },

  _selectLatestSession: function() {
    this._currentSession = this._sessionData[this._sessionData.length - 1];
  },

  _saveSessionData: function() {
    localStorage['sessionData'] = JSON.stringify(this._sessionData);
    this._updateHistoryView();
    this._updateStatisticsView();
  },

  _selectSession: function(i) {
    this._currentSession = this._sessionData[i];
    this._updateHistoryView();
    this._updateStatisticsView();
    this._updateSessionView();
  },

  _createSession: function() {
    this._sessionData.push([]);
    this._selectLatestSession();
    this._saveSessionData();
    this._updateSessionView();
  },

  _deleteSession: function(i) {
    if (this._sessionData.length === 1) {
      alert('Cannot delete last session');
      return;
    }

    this._sessionData.splice(i, 1);
    this._selectLatestSession();
    this._saveSessionData();
    this._updateSessionView();
  },

  addTime: function(time, scramble, isAlgorithm) {
    this._currentSession.push([time, scramble, !!isAlgorithm]);
    this._saveSessionData();
  },

  _deleteTime: function(i) {
    this._currentSession.splice(i, 1);
    this._saveSessionData();
  },

  setAlgorithms: function(data) {
    localStorage['algorithms'] = JSON.stringify(data);
  },

  getAlgorithms: function() {
    if (localStorage['algorithms']) {
      return JSON.parse(localStorage['algorithms']);
    }
  }
};

DataController.HistoryView = function(container, deleteTime) {
  this._container = container;

  this._deleteTime = deleteTime;
};

DataController.HistoryView.prototype = {
  updateAllResults: function(data) {
    var self = this;

    self._container.innerHTML = '';

    for (var i = 0; i < data.length; i++) {
      (function(i) {
        var result = document.createElement('a');
        result.className = 'history-elem';
        result.innerHTML = data[i][0];

        if (i < data.length && i > 0) {
          self._container.innerHTML += ', ';
        }

        self._container.appendChild(result);
      })(i);
    }

    // We need to add the event listeners in a separate loop for some reason.
    var elems = self._container.getElementsByTagName('a');
    for (var i = 0; i < elems.length; i++) {
      (function(i) {
        elems[i].addEventListener('click', function() {
          vex.dialog.open({
            message: data[i][0] + ' - ' + data[i][1],
            buttons: [
              $.extend({}, vex.dialog.buttons.NO, {
                text: 'Close',
                click: function() {
                  vex.close();
                }
              }),

              $.extend({}, vex.dialog.buttons.NO, {
                text: 'Delete',
                click: function() {
                  self._deleteTime(i);
                  vex.close();
                }
              })
            ]
          });
        });
      })(i);
    }
  }
};

DataController.StatisticsView = function() {

};

DataController.StatisticsView.prototype = {
  updateAllResults: function(data) {

  }
};

DataController.SessionView = function(sessionSelector, defaultSessions, selectedSessionUpdated, sessionCreated, sessionDeleted) {
  this._sessionSelector = sessionSelector;

  this._sessions = defaultSessions;

  this._selectedSessionUpdated = selectedSessionUpdated;
  this._sessionCreated = sessionCreated;
  this._sessionDeleted = sessionDeleted;

  this.render();
};

DataController.SessionView.prototype = {
  render: function() {
    var self = this;

    var performingEdits = true;

    this._sessionSelector.removeEventListener('change', this._onChange);

    var previousSelectedIndex = this._sessionSelector.selectedIndex;

    this._sessionSelector.innerHTML = '';

    for (var i = 0; i < this._sessions.length; i++) {
      var option = document.createElement('option');
      option.innerHTML = i;
      this._sessionSelector.appendChild(option);
    }

    var newSessionOption = document.createElement('option');
    newSessionOption.innerHTML = 'create';
    var deleteSessionOption = document.createElement('option');
    deleteSessionOption.innerHTML = 'delete';

    this._sessionSelector.appendChild(newSessionOption);
    this._sessionSelector.appendChild(deleteSessionOption);

    if (previousSelectedIndex === -1 || (previousSelectedIndex > (this._sessionSelector.length - 1))) {
      this._sessionSelector.selectedIndex = this._sessionSelector.options.length - 3;
    } else {
      this._sessionSelector.selectedIndex = previousSelectedIndex;
    }

    this._sessionSelector.addEventListener('change', function() {
      if (!performingEdits) {
        var selectedText = self._sessionSelector.options[self._sessionSelector.selectedIndex].text;

        if (selectedText === 'create') {
          self._sessionCreated();
        } else if (selectedText === 'delete') {
          self._sessionDeleted(selectedText);
        } else {
          self._selectedSessionUpdated(selectedText);
        }
      }
    });

    performingEdits = false;
  },

  updateSessionData: function(data) {
    this._sessions = data;
  }
};
