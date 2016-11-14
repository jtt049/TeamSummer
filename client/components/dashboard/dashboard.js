import Worker from '../../../universal/models/Worker.js';

Meteor.subscribe('Worker');

export default function (Template) {
  Template['dashboard'].helpers({
    workers: () => {
      return Worker.find();
    }
  });

  Template['dashboard'].events({
    'click .dashboard-launch-btn' (event) {
      Meteor.call('launchAllWorkers',
        (err, res) => {
        if (err) {
          alert(err);
        } else {
          alert('All workers launched!');
        }
      });
    }
  });
}
