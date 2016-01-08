/**
 * This widget instantiates the play view for question types that can be fetched via Ajax.
 */

define([
    "dojo/_base/declare",
    "teststudio/play/model/Question",
    "dojo/query",
    "dojo/_base/Deferred",
    "teststudio/play/widget/Match"
], function (declare, Question, query, Deferred, Match) {
    "use strict";

    return declare("teststudio.play.widget.QuestionWidgetInstantiator", null, {
        questionId: null,
        questionWidget: null,
        questionObj: null,
        questionTypeId: null,
        widgetModel: null,
        ajaxedTypes: {9: Match},

        /**
         * @param Object args Object whose properties will be safely mixed into this. 
         */
        constructor: function (args) {
            declare.safeMixin(this, args);
            this.widgetModel = this._getWidgetModel();
        },

        /**
         * Instantiate a question widget with the question data
         *
         * @return Promise of a widget
         */
        instantiate: function () {
            var wrapperObj = this,
                def = new Deferred(),
                replyDef = new Deferred(),
                questionObj = new Question({'id': this.questionId});

            questionObj.load().then(function (questionObj) {
                wrapperObj.questionObj = questionObj;
                if (questionObj.hasReply) {
                    questionObj.getReply().then(function (replyObj) {
                        wrapperObj._makeWidget(replyObj);
                        def.resolve(wrapperObj.questionWidget);
                    });
                } else {
                    wrapperObj._makeWidget(null);
                    def.resolve(wrapperObj.questionWidget);
                }
            });
            return def;
        },

        /**
         * Creates the actual question widget, places it in the dom and runs startup() on it.
         *
         * @param QuestionReply replyObj
         */
        _makeWidget: function (replyObj) {
            // Use query on the DOM to get the parentNode rather than setting a parentNode property
            // this avoids JS errors, particularly in IE10
            var parentNode = query("#play-question" + this.questionId)[0];
            this.questionWidget = new this.widgetModel({
                questionObj: this.questionObj,
                replyObj: replyObj
            });
            this.questionWidget.placeAt(parentNode);
            this.questionWidget.startup();
        },

        /**
         * Gets the proper widget model to use for the question type we are instantiating.  
         * 
         * @return WidgetBase Question widget class
         * @throws exception
         */
        _getWidgetModel: function() {
            if (this.questionTypeId in this.ajaxedTypes) {
                return this.ajaxedTypes[this.questionTypeId];
            } else {
                throw "Invalid question type.";
            }
        }
    });
});
