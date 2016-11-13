import Worker from '../../universal/models/Worker.js';

export default function () {
  Meteor.methods({
    'launchAllWorkers'() {
      Worker.update({status: 'waiting'}, {$set: {status: 'confirm'}});
    }
  });
}
