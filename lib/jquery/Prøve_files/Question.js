"use strict";

define([
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/_base/xhr",
    "dojo/json",
    "teststudio/play/model/QuestionStore",
    "teststudio/play/model/QuestionReply",
    "dojo/_base/array"
], function (declare, Deferred, xhr, JSON, QuestionStore, QuestionReply, array) {
    return declare("teststudio.play.model.Question", null, {

        store: null,

        constructor: function (args) {
            if (typeof args === "undefined") {
                args = {};
            }
            this.store = new QuestionStore({});
            declare.safeMixin(this, args);
            if (typeof this.id !== "undefined") {
                this.id = parseInt(this.id, 10);
            }
        },

        /**
         * Loads this question from the web service using the store.
         *
         * @return Question Promise that will contain this object once it's loaded
         */
        load: function () {
            var d = new Deferred(),
                thisObject = this;
            if (this.isLoaded) {
                return this;
            }
            if (!this.id || isNaN(this.id)) {
                d.errback(new Error("Cannot load, invalid ID"));
                return d;
            }
            return this.store.get(this.id).then(function (data) {
                declare.safeMixin(thisObject, data);
                thisObject.isLoaded = true;
                thisObject._populateHasReply();
                return thisObject;
            });
        },

        /**
         * Returns the Question reply for this question
         *
         * @param integer questionId
         * @return Question
         */
        getReply: function () {
            var d = new Deferred(),
                thisObject = this,
                questionId = thisObject.id,
                replyObj;
            if (!questionId || isNaN(questionId) || questionId < 1) {
                d.errback(new Error("Cannot load the reply, invalid id"));
                return d;
            }
            questionId = parseInt(questionId, 10);
            if (typeof thisObject.replyCache !== "undefined" && thisObject.replyCache.isLoaded){
                d.resolve(thisObject.replyCache);
            } else {
                replyObj = new QuestionReply({'questionId': questionId});
                replyObj.load().then(
                    function (loadedReply) {
                        thisObject.replyCache = loadedReply;
                        d.resolve(thisObject.replyCache);
                    }
                );
            }
            return d;
        },

        /**
         * Since the REST service does not yet support handling replies,
         * we populate properties we would expect from it by looking up
         * the global variable that may be printed which contains the 
         * reply data.
         *
         * matchReplyList is a global variable that is printed on the 
         * page in the legacy showQuestion php function.
         */
         _populateHasReply: function () {
            if (typeof(matchReplyList) !== 'undefined') {
                if (typeof(matchReplyList[this.id]) === 'object' && matchReplyList[this.id].submittedAnswerList) {
                    this.hasReply = true;
                }
            }
         }
    });
});
