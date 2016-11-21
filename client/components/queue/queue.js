import Worker from '../../../universal/models/Worker.js';
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
      Worker.remove({_id: Session.get('currentWorkerId')});
      FlowRouter.go('/');
    },
    'click .queue-confirm-btn' (event) {
      Worker.update({_id: Session.get('currentWorkerId')}, {$set: {status: 'confirmed'}});
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
      Worker.remove({_id: Session.get('currentWorkerId')});
    }


    let query = Worker.find({_id: this.getWorkerId()});

    var handle = query.observeChanges({
      changed: function(id, fields) {
        if (fields.status == 'launch') {
          window.location = constants.taskUrl;
          handle.stop();
        }

        if (fields.status == 'confirmed'){
          clearInterval(timerId);
        }

        if(fields.status == 'confirm'){
           if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
            }

            // Let's check whether notification permissions have already been granted
           else if (Notification.permission === "granted") {
                var date = new Date()
                var displaytime = 'Enter this time as the survey code for additional payment: ' + Worker.findOne({_id: Session.get('currentWorkerId')}).surveycode;
                var notification = new Notification("Notification on! ", {
                                  dir: "auto",
                                  lang: "hi",
                                  tag: "testTag"+date.getTime(),
                                  icon: "../../../assets/notification.png",
                                  body: displaytime
                                  });
                timerId = setInterval(function () {
                new Notification("Reminder 1 : Notification on! ", {
                                  dir: "auto",
                                  lang: "hi",
                                  tag: "testTag"+date.getTime(),
                                  icon: "../../../assets/notification.png",
                                  body: displaytime
                                  });
                   }, constants.notification2);
                notification.onclick = function () {
                          window.focus();
                          notification.close();
                        };
                
                timeoutId = setTimeout(function () {
                  status = Worker.findOne({_id: Session.get('currentWorkerId')}).status;
                  if(status != 'confirmed') {
                    console.log("in")
                    clearInterval(timerId);
                    Worker.remove({_id: Session.get('currentWorkerId')});
                    FlowRouter.go('/');
                  }
                }, constants.canceltime);
              }

            // Otherwise, we need to ask the user for permission
            else if (Notification.permission !== 'denied') {
              Notification.requestPermission(function (permission) {
              if (permission === "granted") {
                //Code for initial payment here!
                var notification = new Notification("Granted");
              }
          });
          }
        }
      }
    });
  });
}
