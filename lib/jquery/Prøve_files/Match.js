/**
 * Widget to show/play the Matching question type.
 */

define([
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojox/gfx",
    "dojo/query",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-attr",
    'dojo/dom-geometry',
    "dojo/json",
    "shared/underscore",
    "dojo/keys",
    "teststudio/play/widget/MatchTextFeedback",
    'teststudio/play/util/i18n/translation',
    "dojo/text!./Match.mustache.html",
    "dojo/text!./MatchCorrectAnswers.mustache.html",
    "teststudio/play/widget/MatchKeystrokeHandler",
    "dojo/NodeList-traverse",
    "dojo/NodeList-dom"
], function (
    array,
    declare,
    lang,
    WidgetBase,
    TemplatedMixin,
    gfx,
    query,
    dom,
    domConstruct,
    domClass,
    on,
    domStyle,
    domAttr,
    domGeometry,
    json,
    _,
    keys,
    MatchTextFeedback,
    translation,
    template,
    correctAnswersTemplate,
    MatchKeystrokeHandler
) {
    return declare("teststudio.play.widget.Match", [WidgetBase, TemplatedMixin], {
        templateString: null,
        questionObj: null,
        baseClass: "match-question",
        selectedLeft: null,  // Index of selected item on the left column
        selectedRight: null, // Index of selected item on the right column
        leftNodeList: null,
        rightNodeList: null,
        maxItemCount: null,
        matches: null,
        surface: null,
        clearButton: null,
        correctMatchesLink: null,
        replyMatchesLink: null,
        displayStudentResult: false,
        replyMatchesNode: null,
        correctMatchesNode: null,
        matchingStatusNode: null,
        questionStateInput: null,
        screenReaderHelpContainer: null,
        replyObj: null,
        keystrokeHandler: null,
        helpLink: null,

        constructor: function () {
            this.keystrokeHandler = new MatchKeystrokeHandler(this);
        },

        postMixInProperties: function () {
            "use strict";
            if (this.questionObj.hasReply && !_.isNull(this.replyObj)) {
                if (lang.isObject(this.replyObj.questionState.state) && this.replyObj.questionState.status === 'OK') {
                    this.questionObj.matchItemList1 = this.sortMatchItemList(this.questionObj.matchItemList1, this.replyObj.questionState.state.matchItemList1);
                    this.questionObj.matchItemList2 = this.sortMatchItemList(this.questionObj.matchItemList2, this.replyObj.questionState.state.matchItemList2);
                } else if (this.questionObj.random) {
                    this.randomizeMatchItemLists();
                }
                this.prepareTemplate();
            } else {
                if (this.questionObj.random) {
                    this.randomizeMatchItemLists();
                }
                this.prepareTemplate();
            }
        },

        randomizeMatchItemLists: function () {
            // Randomize the left and right answer lists if random is enabled on question
            this.questionObj.matchItemList1.sort(function () { return 0.5 - Math.random(); });
            this.questionObj.matchItemList2.sort(function () { return 0.5 - Math.random(); });
        },

        prepareTemplate: function () {
            var thisWidget = this,
                i,
                viewData = {};
            // Add the index of each item as a property of the object since it's needed by the template
            for (i = 0; i < this.questionObj.matchItemList1.length; i++) {
                this.questionObj.matchItemList1[i].index = i;
            }
            for (i = 0; i < this.questionObj.matchItemList2.length; i++) {
                this.questionObj.matchItemList2[i].index = i;
            }
            require(['teststudio/play/view/CurrentTest'], function (currentTest) {
                thisWidget.displayStudentResult = currentTest.displayStudentResult;
            });

            viewData['question'] = this.questionObj;
            viewData['strings'] = {
                helpText: translation.get('QT_MATCH_HELP_TEXT'),
                helpLink: translation.get('QT_MATCH_HELP_LINK_TEXT'),
                close: translation.get('CLOSE'),
                questionMarkUrl: Fronter.Util.Config.get('customerUrl') + '/design_images/default/other_images/question_mark.png'
            };
            // Render markup using Mustache directly rather than Fronter.Mustache
            // since the Dijit widget framework needs the template to be gotten synchronously
            this.templateString = Mustache.to_html(template, viewData);
        },

        sortMatchItemList: function (matchItemList, masterOrder) {
            var newList = new Array(masterOrder.length),
                masterOrderIndex,
                itemListIndex,
                newItem;

            for (masterOrderIndex = 0; masterOrderIndex < masterOrder.length; masterOrderIndex++) {
                newItem = {};
                for (itemListIndex = 0; itemListIndex < matchItemList.length; itemListIndex++) {
                    if (matchItemList[itemListIndex].id == masterOrder[masterOrderIndex]) {
                        newItem.id = matchItemList[itemListIndex].id;
                        newItem.text = matchItemList[itemListIndex].text;
                        newList[masterOrderIndex] = newItem;
                        break;
                    }
                }
            }
            return newList;
        },

        startup: function () {
            var i,
                questionState;

            this.inherited(arguments);
            this.leftNodeList = query(".left-match-items .match-item", this.replyMatchesNode);
            this.rightNodeList = query(".right-match-items .match-item:first-child", this.replyMatchesNode);

            questionState = {};
            questionState.state = {
                matchItemList1: [],
                matchItemList2: []
            };
            for (i = 0; i < this.questionObj.matchItemList1.length; i++) {
                questionState.state.matchItemList1[i] = this.questionObj.matchItemList1[i].id;
            }
            for (i = 0; i < this.questionObj.matchItemList2.length; i++) {
                questionState.state.matchItemList2[i] = this.questionObj.matchItemList2[i].id;
            }
            this.questionStateInput.value = json.stringify(questionState);

            //Extract a list of the hidden inputs for left side of matchPairs.
            this.hiddenInputs = [];
            for (i = 0; i < this.leftNodeList.length; i++) {
                this.hiddenInputs[i] = query("input", this.leftNodeList[i])[0];
            }

            this.maxItemCount = Math.max(this.leftNodeList.length, this.rightNodeList.length);
            this.matches = new Array(this.maxItemCount);
            this.surface = gfx.createSurface(this.canvasNode, 100, domStyle.get(this.domNode, 'height'));
            if (this.questionObj.hasReply && !_.isNull(this.replyObj)) {
                if (this.replyObj.isEditable) {
                    this.showPreviousReply();
                    this.enablePlayMode();
                } else {
                    if (this.displayStudentResult || this.replyObj.correctAnswerList) {
                        this.createScoreSummarySection();
                        this.showPreviousReply();
                        this.createIndividualMatchFeedbackIndicators();
                    } else {
                        this.showPreviousReply();
                    }
                    new MatchTextFeedback(
                        {
                            replyObj: this.replyObj,
                            matchItemList1: this.questionObj.matchItemList1,
                            matchItemList2: this.questionObj.matchItemList2,
                            displayStudentResult: this.displayStudentResult
                        }, this.textFeedbackPlaceholderNode);
                }
            } else {
                this.enablePlayMode();
            }
        },

        /**
         * Sets the widget up for playing so user can create, remove and change matches
         */
        enablePlayMode: function () {
            "use strict";
            this.bindClickEvents();
            this.bindKeyPressEvents();
            this.createClearButton();
            this.bindHelpLink();
            this.bindTabInEvents();
            domClass.add(this.replyMatchesNode, 'playing');
            domClass.remove(this.screenReaderHelpContainer, 'hidden');
        },

        /**
         * Create the "Clear all matches" button and bind it
         */
        createClearButton: function () {
            //This button is added here rather than in the template since we are not using Fronter.Mustache,
            //but instead Mustache directly, which doesn't have the translate functionality that is needed.
            "use strict";
            var thisWidget = this;
            this.clearButton = domConstruct.create('button', {
                    className: 'reset cancel',
                    type: 'button',
                    innerHTML: translation.get('QT_CLEAR_ALL_MATCHES')
                },
                query('.questions .wrapper', this.domNode)[0], 'after');
            query(this.clearButton).on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                thisWidget.clearAllMatches();
                thisWidget.checkRemainingMatches();
            });
        },

        /**
         * Bind clicks on the help link to the toggling of the screen reader help container.
         */
        bindHelpLink: function () {
            var thisWidget = this;
            on(this.helpLink, 'click', function (e) {
                e.preventDefault();
                thisWidget.toggleHelpLink(false);
                thisWidget.toggleHelpDiv(true);
            });
            on(this.closeHelpNode, 'click', function (e) {
                e.preventDefault();
                thisWidget.toggleHelpLink(true);
                thisWidget.toggleHelpDiv(false);
            });
        },

        /**
         * Create the correctness and score feedback items to the right of each match, and the
         * max possible match score for each match in the correct matches view
         */
        createIndividualMatchFeedbackIndicators: function () {
            "use strict";
            var correctMatchScores = [],
                submittedMatchItems = [],
                correctnessElement,
                correctnessClass,
                rightItemId,
                submittedItem,
                i = 0;

            if (this.replyObj.submittedAnswerList && this.replyObj.correctAnswerList) {
                // Prepare the match item lists to be keyed by the matchItem2 value for easier lookup
                array.forEach(this.replyObj.submittedAnswerList, function (item) {
                    submittedMatchItems[item.matchItem2] = item;
                });
                if (this.replyObj.correctAnswerList) {
                    array.forEach(this.replyObj.correctAnswerList, function (item) {
                        correctMatchScores[item.matchItem2] = item.score;
                    });
                }
                // Go through each node on the right. Find the associated data in the
                // submittedMatchItems and add the icons and score if the isCorrect
                // and score are set
                for (i = 0; i < this.rightNodeList.length; i++) {
                    rightItemId = this.rightNodeList[i].getAttribute("data-item-id");
                    submittedItem = submittedMatchItems[rightItemId];
                    if (!_.isUndefined(submittedItem)) {
                        if (!_.isUndefined(submittedItem.isCorrect)) {
                            correctnessClass = 'wrong-answer';

                            if (submittedItem.isCorrect) {
                                correctnessClass = 'correct-answer';
                            }
                            correctnessElement = domConstruct.create(
                                'li',
                                {
                                    className: 'correctness-indicator ' + correctnessClass
                                },
                                this.rightNodeList[i],
                                'after'
                            );
                        }
                        if (!_.isUndefined(submittedItem.score)) {
                            domConstruct.create(
                                'li',
                                {
                                    className: 'score-obtained',
                                    innerHTML: '[' + parseFloat(submittedItem.score).toFixed(2) + ']'
                                },
                                correctnessElement,
                                'after'
                            );
                        }
                    }
                    domConstruct.create(
                        'li',
                        {
                            className: 'match-max-score',
                            innerHTML: '[' + (parseFloat(correctMatchScores[rightItemId]).toFixed(2)) + ']'
                        },
                        query(".right-match-items .match-item:first-child", this.correctMatchesNode)[i],
                        'after'
                    );
                }
            }
        },

        /**
         * Create the Score summary section of the widget as part of displaying the students result
         */
        createScoreSummarySection: function () {
            "use strict";
            var thisWidget = this,
                summaryDivNode = null,
                scoreSummary = "";

            if (this.displayStudentResult || this.replyObj.correctAnswerList) {
                summaryDivNode = domConstruct.create('div',
                    {
                        className: 'question-feedback',
                        'aria-hidden': 'true'
                    },
                    query(".wrapper", this.domNode)[0],
                    'last');
            } else {
                return;
            }

            if (this.displayStudentResult) {
                scoreSummary = translation.get('SCORE')
                                + ': <span class="total-score">'
                                + this.replyObj.score
                                + '</span> (' + translation.get('QT_SCORE_OUT_OF')
                                + ' <span class="max-score">'
                                + this.replyObj.maxScore
                                + '</span>)';
                domConstruct.create('p',
                    {
                        className: "score-summary",
                        innerHTML: scoreSummary
                    },
                    summaryDivNode,
                    'last');
            }
        },

        /**
         * Clears all the user's matches, both in the gui, the matches array, and the hidden inputs
         *
         */
        clearAllMatches: function () {
            "use strict";
            var i;
            this.unselect();
            this.surface.clear();
            for (i = 0; i < this.leftNodeList.length; i++) {
                this.removeColorClasses(this.leftNodeList[i]);
            }
            for (i = 0; i < this.rightNodeList.length; i++) {
                this.removeColorClasses(this.rightNodeList[i]);
            }
            for (i = 0; i < this.hiddenInputs.length; i++) {
                this.hiddenInputs[i].value = "";
            }
            this.matches = new Array(this.maxItemCount);
            this.setLiveRegionMessage(translation.get('QT_ALL_MATCHES_WERE_CLEARED'));
        },

        /**
         * Draws a line between two elements
         *
         * @param {DomElement} leftNode Selected node in the left column
         * @param {DomElement} rightNode Selected node in the right column
         * @param {DomElement} surface The surface where matches are drawn
         * @param {integer} surfacePosition
         */
        drawMatch: function (leftNode, rightNode, surface, surfacePosition) {
            "use strict";
            var posLeft = domGeometry.position(leftNode, true),
                posRight = domGeometry.position(rightNode, true),
                path,
                y1,
                y2;
            y1 = Math.floor(posLeft.y - surfacePosition.y + (posLeft.h) / 2);
            y2 = Math.floor(posRight.y - surfacePosition.y + (posRight.h) / 2);
            path = surface.createPath();
            path.moveTo(0, y1)
                .hLineTo(5)
                .curveTo(2 * surfacePosition.w / 3, y1,
                         surfacePosition.w / 3, y2,
                         surfacePosition.w - 5, y2)
                .hLineTo(surfacePosition.w)
                .setStroke({
                    width: 3,
                    color: this.getLineColor(leftNode)
                });
        },

        /**
         * Clears the surface and draws all the lines
         */
        redraw: function () {
            "use strict";
            var i,
                indexRight,
                surfacePosition = null;
            this.surface.clear();
            if (this.matches.length) {
                surfacePosition = domGeometry.position(this.surface._parent, true);
            }
            for (i = 0; i < this.matches.length; i++) {
                if (this.matches[i] != null) {
                    indexRight = this.matches[i];
                    this.drawMatch(
                        this.leftNodeList[i],
                        this.rightNodeList[indexRight],
                        this.surface,
                        surfacePosition
                    );
                }
            }
        },

        /**
         * Clears the correctMatches surface and draws all the lines for the correct matches
         */
        drawCorrectMatches: function () {
            "use strict";
            var i,
                leftNodeList = query(".left-match-items .match-item", this.correctMatchesNode),
                rightNodeList = query(".right-match-items .match-item", this.correctMatchesNode),
                indexRight,
                correctMatches = null,
                correctSurfacePosition = null;
            correctMatches = this.getCorrectMatches();
            if (correctMatches.length) {
                correctSurfacePosition = domGeometry.position(this.correctSurface._parent, true);
            }
            this.correctSurface.clear();
            for (i = 0; i < correctMatches.length; i++) {
                if (correctMatches[i] != null) {
                    indexRight = correctMatches[i];
                    this.drawMatch(
                        leftNodeList[i],
                        rightNodeList[indexRight],
                        this.correctSurface,
                        correctSurfacePosition
                    );
                }
            }
        },


        /**
         * Stores the user's selection and handles changes
         *
         * @param {integer} indexLeft Index of selected item in left column
         * @param {integer} indexRight Index of selected item in right column
         */
        storeMatch: function (indexLeft, indexRight) {
            "use strict";
            var indexFound = null,
                i;
            for (i = 0; i < this.matches.length; i++) {
                if (this.matches[i] === indexRight) {
                    indexFound = i;
                    break;
                }
            }
            //the item was previously matched. Clear it.
            if (!_.isNull(indexFound)) {
                this.matches[indexFound] = null;
                this.removeColorClasses(this.leftNodeList[indexFound]);
                this.hiddenInputs[indexFound].value = "";
            }
            if (this.matches[indexLeft] != null) {
                this.removeColorClasses(this.rightNodeList[this.matches[indexLeft]]);
            }

            //Set the new match
            this.matches[indexLeft] = indexRight;
            this.hiddenInputs[indexLeft].value = this.rightNodeList[indexRight].getAttribute("data-item-id");

            //give the match a color
            this.removeColorClasses(this.leftNodeList[indexLeft]);
            this.removeColorClasses(this.rightNodeList[indexRight]);
            domClass.add(this.leftNodeList[indexLeft], this.getColorClass(indexLeft));
            domClass.add(this.rightNodeList[indexRight], this.getColorClass(indexLeft));
        },

         /**
         * Show the match results with green/red colors according to whether it was right/wrong
         */
        showRightAndWrong: function () {
            "use strict";
            var matchedWith = null,
                matchedWithId = null,
                correctIdMapped = [],
                correctnessClass = null,
                i = 0;

            if (this.replyObj.correctAnswerList) {
                this.setupCorrectMatches();
                array.forEach(this.replyObj.correctAnswerList, function (item) {
                    correctIdMapped[item.matchItem1] = item;
                });

                for (i = 0; i < this.rightNodeList.length; i++) {
                    this.removeColorClasses(this.leftNodeList[i]);
                    this.removeColorClasses(this.rightNodeList[i]);

                    matchedWith = array.indexOf(this.matches, i);
                    correctnessClass = 'wrong-answer';
                    if (matchedWith != -1) {
                        matchedWithId = this.leftNodeList[matchedWith].getAttribute("data-item-id");
                        if (correctIdMapped[matchedWithId].matchItem2 === this.rightNodeList[i].getAttribute("data-item-id")) {
                            correctnessClass = 'correct-answer';
                        }
                        query(this.leftNodeList[matchedWith]).addClass(correctnessClass);
                        query(this.rightNodeList[i]).addClass(correctnessClass);
                    }
                }
            }
        },

        /**
         * Look up the reply object for the question and setup any matches it contains
         */
        showPreviousReply: function () {
            "use strict";
            var answer = null,
                leftNode = null,
                rightNode = null,
                leftIndex = null,
                rightIndex = null,
                i = 0;
            for (i = 0; i < this.replyObj.submittedAnswerList.length; i++) {
                answer = this.replyObj.submittedAnswerList[i];
                leftNode = dom.byId(answer.matchItem1);
                rightNode = dom.byId(answer.matchItem2);
                if (!_.isNull(leftNode) && !_.isNull(rightNode)) {
                    leftIndex = this.leftNodeList.indexOf(leftNode);
                    rightIndex = this.rightNodeList.indexOf(rightNode);
                }
                if (!_.isNull(leftIndex) && !_.isNull(rightIndex)) {
                    this.storeMatch(leftIndex, rightIndex);
                }
            }
            this.showRightAndWrong();
            this.redraw();
        },

        /**
         * Add the correct matches node, and create links to toggle back and forth between
         * user matches and correct matches
         */
        setupCorrectMatches: function () {
            "use strict";
            var leftNodeList = null,
                rightNodeList = null,
                i = 0;

            this.correctMatchesNode = domConstruct.create('div',
                {
                    className: 'correct-matches',
                    innerHTML: Mustache.to_html(correctAnswersTemplate, this.questionObj)
                },
                this.replyMatchesNode,
                'after');
            leftNodeList = query(".left-match-items .match-item", this.correctMatchesNode);
            rightNodeList = query(".right-match-items .match-item", this.correctMatchesNode);

            //set the green color on each match node
            for (i = 0; i < leftNodeList.length; i++) {
                domClass.add(leftNodeList[i], "correct-answer");
            }
            for (i = 0; i < rightNodeList.length; i++) {
                domClass.add(rightNodeList[i], "correct-answer");
            }

            this.correctSurface = gfx.createSurface(
                                            query(".canvasSurface", this.correctMatchesNode)[0],
                                            100,
                                            domStyle.get(this.replyMatchesNode, 'height'));
            this.drawCorrectMatches();
            domStyle.set(this.correctMatchesNode, "display", "none");
            this.setupTogglingBetweenRepliesAndCorrectMatches();
        },

        /**
         * Iterate through the correctAnswerList from the reply object
         * and populate an array that is used for drawing the matches
         *
         * @return {Array} Array containing the correct matches
         */
        getCorrectMatches: function () {
            "use strict";
            var answer = null,
                leftIndex = null,
                rightIndex = null,
                leftNode = null,
                rightNode = null,
                correctMatches = null,
                i = 0;
            correctMatches = new Array(this.maxItemCount);
            for (i = 0; i < this.replyObj.correctAnswerList.length; i++) {
                answer = this.replyObj.correctAnswerList[i];
                leftNode = dom.byId(answer.matchItem1);
                rightNode = dom.byId(answer.matchItem2);
                if (!_.isNull(leftNode) && !_.isNull(rightNode)) {
                    leftIndex = this.leftNodeList.indexOf(leftNode);
                    rightIndex = this.rightNodeList.indexOf(rightNode);
                }
                if (!_.isNull(leftIndex) && !_.isNull(rightIndex)) {
                    correctMatches[leftIndex] = rightIndex;
                }
            }
            return correctMatches;
        },

        /**
         * Add and bind the links that allow toggling between the Replies and the Correct matches
         */
        setupTogglingBetweenRepliesAndCorrectMatches: function () {
            "use strict";
            var thisWidget = this;
            this.correctMatchesLink = domConstruct.create(
                'a',
                {
                    href: '#',
                    className: 'correct-matches-link',
                    innerHTML: translation.get('QT_SHOW_CORRECT_MATCHES')
                },
                query(".question-feedback", this.domNode)[0],
                'last');
            on(this.correctMatchesLink, 'click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                thisWidget.toggleView(true);
            });

            this.replyMatchesLink = domConstruct.create(
                'a',
                {
                    href: '#',
                    className: 'reply-matches-link',
                    innerHTML: translation.get('QT_SHOW_MY_MATCHES')
                },
                query(".question-feedback", this.domNode)[0],
                'last');
            on(this.replyMatchesLink, 'click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                thisWidget.toggleView(false);
            });
        },

        /**
         * Show/hide the student reply or correct matches
         */
        toggleView: function (showCorrect) {
            "use strict";
            if (showCorrect) {
                domStyle.set(this.replyMatchesNode, "display", "none");
                domStyle.set(this.correctMatchesNode, "display", "block");
                domStyle.set(this.replyMatchesLink, 'display', 'inline');
                domStyle.set(this.correctMatchesLink, 'display', 'none');
            } else {
                domStyle.set(this.replyMatchesNode, "display", "block");
                domStyle.set(this.correctMatchesNode, "display", "none");
                domStyle.set(this.replyMatchesLink, 'display', 'none');
                domStyle.set(this.correctMatchesLink, 'display', 'inline');
            }
        },

        /**
         * Performs the necessary actions when a match item is selected.
         *
         * @param {DOMElement} selectedElement
         */
        handleSelection: function (selectedElement) {
            "use strict";
            var currentNodeList;
            // Check if the user is trying to cancel the operation
            if (domClass.contains(selectedElement, "selected")) {
                this.unselect();
            } else {
                // Delete previous selection and focus.
                query('li', this.replyMatchesNode).removeClass("selected").removeClass("focused");

                domClass.add(selectedElement, "selected");
                domClass.add(selectedElement, "focused");

                // Record the selected items
                if (selectedElement.parentNode.getAttribute("data-list-position") === "left") {
                    this.selectedLeft = selectedElement.getAttribute("data-item-index");
                } else {
                    this.selectedRight = selectedElement.getAttribute("data-item-index");
                }
                // If the action is completed, draw & store
                if (!_.isNull(this.selectedLeft) && !_.isNull(this.selectedRight)) {
                    this.storeMatch(this.selectedLeft, this.selectedRight);
                    this.unselect();
                    this.redraw();
                    this.checkRemainingMatches();
                }
            }
        },

        /**
         * Bind the clicking of each item to create matches
         */
        bindClickEvents: function () {
            "use strict";
            var thisWidget = this;
            query("li", thisWidget.replyMatchesNode).on("click", function (e) {
                thisWidget.keystrokeHandler.handleAction(e.target);
            });
        },

        /**
         * Bind the keypress events we want to handle inside the matching area.
         */
        bindKeyPressEvents: function () {
            "use strict";
            var thisWidget = this;
            query(this.replyMatchesNode).on("keydown", function (e) {
                thisWidget.keystrokeHandler.captureKeystroke(e);
            });
        },

        /**
         * Bind the keypress events we need to handle tabs directly before and after replyMatchesNode.
         * When tabing into the replyMatchesNode, we should simulate what happens when the down arrow key is pressed
         * inside replyMatchesNode.
         */
        bindTabInEvents: function () {
            "use strict";
            var thisWidget = this;
            on(this.helpLink, "keydown", function (e) {
                // If the help node is visible, we should do nothing special.
                if (domStyle.get(thisWidget.helpNode, 'display') !== 'none') {
                    return;
                }
                if (e.keyCode === keys.TAB && !e.shiftKey) {
                    thisWidget.keystrokeHandler.moveFocusUpOrDown(thisWidget.helpLink, 'down', true);
                }
            });
            on(this.closeHelpNode, "keydown", function (e) {
                if (e.keyCode === keys.TAB && !e.shiftKey) {
                    thisWidget.keystrokeHandler.moveFocusUpOrDown(thisWidget.helpLink, 'down', true);
                }
            });
            on(this.clearButton, "keydown", function (e) {
                if (e.keyCode === keys.TAB && e.shiftKey) {
                    thisWidget.keystrokeHandler.moveFocusUpOrDown(thisWidget.helpLink, 'down', true);
                }
            });
            on(this.replyMatchesNode, "blur", function (e) {
                thisWidget.clearFocus();
            });
        },

        /**
         * Removes the classes that have been applied to an element in order to color it for a match
         *
         * @param {DOMElement} element The DOM node
         */
        removeColorClasses: function (element) {
            "use strict";
            var classAttr = domAttr.get(element, 'class'),
                classArr = classAttr.split(' '),
                i;
            for (i = 0; i < classArr.length; i++) {
                if (classArr[i].indexOf("color") === 0) {
                    domClass.remove(element, classArr[i]);
                }
            }
        },

        /**
         * Unselects all the elements
         */
        unselect: function () {
            "use strict";
            this.selectedLeft = null;
            this.selectedRight = null;
            query(".questions li", this.domNode).removeClass("selected");
        },

        /**
         * Returns the color that the match must have when starting in the given node
         *
         * @param {DomElement} node to get the color from
         * @return {string} Color in HEX or RGB format (depends on the browser)
         */
        getLineColor: function (node) {
            "use strict";
            return domStyle.get(node, 'borderBottomColor');
        },

        /**
         * Returns the color class that must be applied to the matching elements
         *
         * @param {integer} index Index of selected item in left column
         * @return {string} Class name
         */
        getColorClass: function (index) {
            "use strict";
            var availableClassesCount = 8;
            return 'color' + (index % availableClassesCount);
        },

        /**
         * Gets the currently selected match item in either left or right column, if any.
         *
         * @return {DOMElement}
         */
        getSelectedItemNode: function () {
            var selectedItemList = query('.match-item.selected', this.domNode);
            return (selectedItemList.length === 0) ? null : selectedItemList[0];
        },

        /**
         * @return {string} The relative position of the nodeList passed in ('left' or 'right').
         */
        getNodeListPosition: function (nodeList) {
            if (nodeList == this.getRightNodeList()) {
                return 'right';
            } else if (nodeList == this.getLeftNodeList()) {
                return 'left';
            }
            return null;
        },

        /**
         * Toggles the visibility of the screen reader help container.
         * 
         * @param {boolean} doShow
         */
        toggleHelpDiv: function (doShow) {
            if (doShow) {
                domStyle.set(this.helpNode, "display", "block");
            } else {
                domStyle.set(this.helpNode, "display", "none");
            }
        },

        /**
         * Toggles the visibility of the screen reader help link.
         * 
         * @param {boolean} doShow
         */
        toggleHelpLink: function (doShow) {
            if (doShow) {
                domStyle.set(this.helpLink, "display", "block");
            } else {
                domStyle.set(this.helpLink, "display", "none");
            }
        },

        /**
         * Prints a message in the status container that is used to provide feedback
         * about the question matching's status regarding number of unmatched elements.
         *
         * @param {string} tabindex whether it should be focusable or not
         * @param {string} message
         */
        setQuestionStatusMessage: function (tabindex, message) {
            domAttr.set(this.matchingStatusNode, 'tabindex', tabindex);
            this.matchingStatusNode.innerHTML = message;
        },

        /**
         * Prints a message in the log container that is used to provide feedback
         * about state changes in the widget.
         *
         * @param {string} message
         */
        setLiveRegionMessage: function (message) {
            this.logNode.innerHTML = message;
        },

        /**
         * Returns the DOMElement that element is matched with, if any.
         *
         * @param {DOMElement} element
         * @return {DOMElement}
         */
        getMatchedItemNode: function (element) {
            var nodeList = this.getNodeListForItemNode(element),
                indexInList = nodeList.indexOf(element),
                nodeListPosition = this.getNodeListPosition(nodeList);

            if (nodeListPosition === 'left')  {
                return (_.isString(this.matches[indexInList]) ? this.rightNodeList[this.matches[indexInList]] : null);
            }
            if (nodeListPosition === 'right')  {
               return (array.indexOf(this.matches, indexInList.toString()) >= 0  ? 
                        this.leftNodeList[array.indexOf(this.matches, indexInList.toString())] : null);
            }
            return null;
        },

        /**
         * Checks the matching question's current match status, and notifies the user
         * of the remaining items left unmatched. This is very useful for
         * users with accessibility issues
         */
        checkRemainingMatches: function() {
            var matchItems = query('.left-match-items .match-item', this.domNode),
                matchCount = 0,
                i;

            for (i = 0; i < matchItems.length; i++) {
                if ( _.isNull( this.getMatchedItemNode( matchItems[i] ) ) ) {
                    matchCount++;
                }
            }

            if (matchCount > 0) {
                this.setQuestionStatusMessage(
                    0,
                    _.sprintf(
                        translation.get('QT_LEAVING_YOU_STILL_HAVE_X_ITEMS_TO_MATCH'),
                        {X: matchCount}
                    )
                );
            } else {
                this.setQuestionStatusMessage(
                    0,
                    translation.get('QT_ALL_ITEMS_MATCHED')
                );
            }
        },

        /**
         * @return {NodeList}
         */
        getLeftNodeList: function () {
            return this.leftNodeList;
        },

        /**
         * @return {NodeList}
         */
        getRightNodeList: function () {
            return this.rightNodeList;
        },

        /**
         * Gets the opposite node list to the one passed in.
         *
         * @return {NodeList}
         */
        getOtherNodeList: function (nodeList) {
            if (nodeList == this.getRightNodeList()) {
                return this.getLeftNodeList();
            } else if (nodeList == this.getLeftNodeList()) {
                return this.getRightNodeList();
            }
            return null;
        },

        /**
         * Gets the node list (left or right) that a given node belongs to.
         *
         * @return {NodeList}
         */
        getNodeListForItemNode: function (itemNode) {
            if (this.leftNodeList.indexOf(itemNode) !== -1) {
                return this.leftNodeList;
            } else if (this.rightNodeList.indexOf(itemNode) !== -1) {
                return this.rightNodeList;
            }
            return null;
        },

        /**
         * Gets the currently "focused" match item in either left or right column, if any.
         * (The item is not properly focused, but has the css class "focused".)
         *
         * @return {DOMNode}
         */
        getFocusedItemNode: function () {
            var selNodes = query('.match-item.focused', this.replyMatchesNode);
            return selNodes.length === 0 ? null : selNodes[0];
        },

        /**
         * Move focus from one match item to another.
         *
         * @param {DOMNode} toNode
         */
        moveFocus: function (toNode) {
            this.clearFocus();
            this.setFocus(toNode);
        },

        /**
         * Clear focus from all match items.
         *
         * @param {DOMNode} toNode
         */
        clearFocus: function (toNode) {
            this.getLeftNodeList().removeClass('focused');
            this.getRightNodeList().removeClass('focused');
        },

        /**
         * Set focus on a match item.
         *
         * @param {DOMNode} toNode
         */
        setFocus: function (toNode) {
            domClass.add(toNode, 'focused');
        }

    });
});
