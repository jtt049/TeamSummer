import Worker from '../../../universal/models/Worker.js';
import constants from '../../../universal/config.js';

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

    let query = Worker.find({_id: this.getWorkerId()});

    var handle = query.observeChanges({
      changed: function(id, fields) {
        if (fields.status == 'launch') {
          window.location = constants.taskUrl;
          handle.stop();
        }
      }
    });
  });
}
