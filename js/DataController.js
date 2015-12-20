/*
 * Calculates the mean of a given list of times.
 */
function mean(times) {
  var sum = 0;

  for (var i = 0; i < times.length; i++) {
    if (Object.prototype.toString.call(times[i]) === '[object Array]') {
      sum += times[i][0];
    } else {
      sum += times[i];
    }
  }

  var average = sum / times.length;

  return average.toFixed(3);
}

/*
 * Removes the top and bottom 5 percentile before calculating the average of the remaining times.
 */
function calculateAverage(data, startPosition, numberOfTimes) {
  var times = [];

  for (var i = startPosition - numberOfTimes + 1; i <= startPosition; i++) {
    if (Object.prototype.toString.call(data[i]) === '[object Array]') {
      times.push(data[i][0]);
    } else {
      times.push(data[i]);
    }
  }

  // The highest and lowest 5 percent of solves are removed.
  var lowestPercentile = 5;
  var highestPercentile = 95;

  // Sort ascending.
  times.sort(function(a, b) {
    return a - b;
  });

  var removedElements = times.splice(0, Math.ceil(lowestPercentile / 100 * numberOfTimes)).length;

  var i = Math.ceil(highestPercentile / 100 * numberOfTimes) - 1 - removedElements;

  times.splice(i, times.length - i);

  return mean(times);
}

/*
 * Locate the best average in a list of times.
 */
function calculateBestAverage(times, numberOfTimes, returnIndex) {
  var bestAverage;
  var bestAverageIndex;

  for (var i = 0; i < times.length; i++) {
    var average = calculateAverage(times, i, numberOfTimes);
    if (!bestAverage || average < bestAverage) {
      bestAverage = average;
      bestAverageIndex = i;
    }
  }

  if (returnIndex) {
    return {
      index: bestAverageIndex,
      average: bestAverage
    };
  } else {
    return bestAverage;
  }
}

/*
 * Downloads a file.
 */
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }  else {
        pom.click();
    }
}

/*
 * Download an average as a file.
 */
function exportAverage(data, startPosition, numberOfTimes) {
  var output = '';

  output += 'Number of times: ' + numberOfTimes;
  output += '\nAo' + numberOfTimes + ': ' + calculateAverage(data, startPosition, numberOfTimes);

  output += '\n\nTimes:';

  for (var i = startPosition - numberOfTimes + 1; i <= startPosition; i++) {
    output += '\n' + data[i][0] + ' - ' + data[i][1];
  }

  download('AlgorithmDriller9000_SessionExport.txt', output);
}

/*
 * Export all the results as a text file.
 */
function exportAllTimes(data) {
  var output = '';

  output += 'Number of times: ' + data.length;
  output += '\n\nMean: ' + mean(data);
  output += '\nAverage: ' + calculateAverage(data, data.length - 1, data.length);
  output += '\n\nBest ao5: ' + calculateBestAverage(data, 5);
  output += '\nBest ao12: ' + calculateBestAverage(data, 12);
  output += '\n\nTimes:';

  for (var i = 0; i < data.length; i++) {
    output += '\n' + data[i][0] + ' - ' + data[i][1];
  }

  download('AlgorithmDriller9000_SessionExport.txt', output);
}

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

  this.statisticsView = new DataController.StatisticsView(statistics);

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
            message: data[i][0] + ' - <a target="_blank" href="https://alg.cubing.net/?setup=R' + data[i][1] + '">' + data[i][1] + '</a>',

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

DataController.StatisticsView = function(statisticsContainer) {
  this.statisticsContainer = statisticsContainer;
};

DataController.StatisticsView.prototype = {
  updateAllResults: function(data) {
    var currentAo5, currentAo12, bestAo5, bestAo12, globalMean, average;

    if (data.length >= 5) {
      currentAo5 = calculateAverage(data, data.length - 1, 5);
      bestAo5 = calculateBestAverage(data, 5, true);
    }

    if (data.length >= 12) {
      currentAo12 = calculateAverage(data, data.length - 1, 12);
      bestAo12 = calculateBestAverage(data, 12, true);
    }

    globalMean = mean(data);

    average = calculateAverage(data, data.length - 1, data.length);

    var data = '<p><a id="showStatistics">statistics: show</a><div id="statisticsInner">'

    data += '<p><a id="timesCount">times: ' + data.length + '</a></p>';

    data += '<p>mean: '+ globalMean + '</p>';

    data += '<p>avg: '+ average + '</p>';

    if (currentAo5) {
      data += '<p><a id="currentAo5">ao5: ' + currentAo5 + '</a></p>';
    }

    if (currentAo12) {
      data += '<p><a id="currentAo12">ao12: ' + currentAo12 + '</a></p>';
    }

    if (bestAo5) {
      data += '<p><a id="bestAo5">best ao5: ' + bestAo5.average + '</a></p>';
    }

    if (bestAo12) {
      data += '<p><a id="bestAo12">best ao12: ' + bestAo12.average + '</a></p>';
    }

    data += '</div>';

    var currentInnerStatisticsClass = document.getElementById('statisticsInner');

    if (currentInnerStatisticsClass) {
      currentInnerStatisticsClass = currentInnerStatisticsClass.className;
    }

    this.statisticsContainer.innerHTML = data;

    if (currentInnerStatisticsClass) {
      document.getElementById('statisticsInner').className = currentInnerStatisticsClass;
    }

    document.getElementById('timesCount').addEventListener('click', function() {
      exportAllTimes(data);
    });

    document.getElementById('currentAo5').addEventListener('click', function() {
      exportAverage(data, data.length - 1, 5);
    });

    document.getElementById('bestAo5').addEventListener('click', function() {
      exportAverage(data, bestAo5.index, 5);
    });

    document.getElementById('bestAo12').addEventListener('click', function() {
      exportAverage(data, bestAo12.index, 12);
    });


    document.getElementById('showStatistics').addEventListener('click', function() {
      document.getElementById('statisticsInner').classList.toggle('visible');
    });
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
