import Worker from '../../../universal/models/Worker.js';

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
  });
}
