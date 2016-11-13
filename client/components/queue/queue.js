import Worker from '../../../universal/models/Worker.js';

export default function (Template) {
  Template['queue'].helpers({
    workerId: () => {
      return Session.get('currentWorkerId');
    },
    worker: () => {
      return Worker.findOne(Session.get('currentWorkerId'));
    }
  });

  Template['queue'].events({
  });

  Template['queue'].onCreated(function() {
    this.getWorkerId = () => Session.get('currentWorkerId');

    this.autorun(() => {
      this.subscribe('Worker.select', this.getWorkerId());
    });
  });
}
