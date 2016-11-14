import Worker from '../../../universal/models/Worker.js';

export default function (Template) {
  Template['dashboard'].helpers({
    workers: () => {
      return Worker.find();
    },

    graphStyles: () => {
      let offset = Worker.find().count() * 20;
      return "bottom: " + parseInt(offset) + "px";
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
