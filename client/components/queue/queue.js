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

    this.autorun(() => {
      this.subscribe('Worker.select', this.getWorkerId());
    });

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
              new Notification("Are you ready for the task? Click on Confirm");
              timerId = setInterval(function () {
                new Notification("Reminder 1: Are you ready for the task? Click on Confirm. If not, you will be removed from the waiting list");
              }, 120000);
              timeoutId = setTimeout(function () {
                status = Worker.findOne({_id: Session.get('currentWorkerId')}).status;
                if(status != 'confirmed') {
                  clearInterval(timerId);
                  Worker.remove({_id: Session.get('currentWorkerId')});
                  FlowRouter.go('/');
                }                
              }, 180000);
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
