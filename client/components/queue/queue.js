import Worker from '../../../universal/models/Worker.js';
import Experiment from '../../../universal/models/Experiment.js';
import Event from './Event';
import constants from '../../../universal/config.js';

Meteor.subscribe('Worker');

export default function (Template) {
  Template['queue'].helpers({
    workerId: () => {
      return Session.get('currentWorkerId');
    },
    worker: () => {
      return Worker.findOne(Session.get('currentWorkerId'));
    },
    isConfirmation: () => {

    }
  });

  Template['queue'].events({
    'click .queue-cancel-btn' (event) {
      Worker.remove({_id: Session.get('currentWorkerId')}, function(err) {
        if (err) {
          console.error(err);
        }
        else {
          // Record event
          Event.insert({
            action: 'canceled',
            worker: Session.get('currentWorkerId'),
            experiment: FlowRouter.getParam('experimentId'),
            timestamp: new Date()
          });
        }
      });

      FlowRouter.go('/');
    },
    'click .queue-confirm-btn' (event) {
      Worker.update({_id: Session.get('currentWorkerId')}, {$set: {status: 'confirmed'}}, function(err, numUpdated) {
        if (err) {
          console.err(err);
        }
        else {
          // Record event
          Event.insert({
            action: 'confirmed',
            worker: Session.get('currentWorkerId'),
            experiment: FlowRouter.getParam('experimentId'),
            timestamp: new Date()
          });
        }
      });
    }
  });

  Template['queue'].onCreated(function() {
    this.getWorkerId = () => Session.get('currentWorkerId');

    // User doesn't have worker ID yet, return to home
    if (!this.getWorkerId()) {
      FlowRouter.go('/');
    }

    this.autorun(() => {
      this.subscribe('Worker.select', this.getWorkerId());
    });

    //closing window - remove user
    Meteor.startup(function(){
      $(window).bind('beforeunload', function() {
        closingWindow();
      });
    });
    closingWindow = function(){
      //Only remove the worker if he has not been redirected by the app itself
      status = Worker.findOne({_id: Session.get('currentWorkerId')}).status;
      if(status != "launch")
      Worker.remove({_id: Session.get('currentWorkerId')}, function(err) {
        if (err) {
          console.error(err);
        }
        else {
          // Record event
          Event.insert({
            action: 'closedWindow',
            worker: Session.get('currentWorkerId'),
            experiment: FlowRouter.getParam('experimentId'),
            timestamp: new Date()
          });
        }
      });

    }


    let query = Worker.find({_id: this.getWorkerId()});

    var handle = query.observeChanges({
      changed: function(id, fields) {
        var audio = new Audio();
        audio.src = "bells.mp3";
        audio.load();
        if(fields.status == 'waiting')
        {
          if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
           else if (Notification.permission === "granted") {
                audio.play();
                var date = new Date()
                var notification = new Notification("Allow Notifications!", {
                                  dir: "auto",
                                  lang: "hi",
                                  tag: "testTag"+date.getTime(),
                                  icon: "notification.png",
                                  });
              }

            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== 'denied') {
              Notification.requestPermission(function (permission) {
              if (permission === "granted") {
                //Code for initial payment here!
                var notification = new Notification("Granted Permission for Notifications");
              }
          });
          }
        }
        if (fields.status == 'launch') {
          window.location =  Experiment.find().fetch()[0].taskURL;
          handle.stop();
        }

        if (fields.status == 'confirmed'){
          clearInterval(timerId);
        }

        if(fields.status == 'confirm'){
            if (Notification.permission === "granted") {                
                audio.play();
                var date = new Date()
                var notification = new Notification("Notification on!", {
                                  dir: "auto",
                                  lang: "hi",
                                  tag: "testTag"+date.getTime(),
                                  icon: "notification.png",
                                  body: "Click on I'm Ready to start the task! Proceed to the task!"
                                  });
                timerId = setInterval(function () {
                audio.play();
                new Notification("Reminder 1 : Notification on! ", {
                                  dir: "auto",
                                  lang: "hi",
                                  tag: "testTag"+date.getTime(),
                                  icon:"notification.png",
                                  body: "Click on I'm Ready to start the task! Proceed to the task!"
                                  });
                   }, constants.notification2);
                notification.onclick = function () {
                          window.focus();
                          notification.close();
                        };

                timeoutId = setTimeout(function () {
                  status = Worker.findOne({_id: Session.get('currentWorkerId')}).status;
                  if(status != 'confirmed') {
                    clearInterval(timerId);
                    Worker.remove({_id: Session.get('currentWorkerId')}, function(err) {
                      if (err) {
                        console.error(err);
                      }
                      else {
                        // Record event
                        Event.insert({
                          action: 'timedOut',
                          worker: Session.get('currentWorkerId'),
                          experiment: FlowRouter.getParam('experimentId'),
                          timestamp: new Date()
                        });
                      }
                    });
                    FlowRouter.go('/');
                  }
                }, constants.canceltime);
              }
        }
      }
    });
  });
}
