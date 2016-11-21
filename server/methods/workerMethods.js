import Worker from '../../universal/models/Worker.js';

export default function () {
  Meteor.methods({
    'launchAllWorkers'() {
      var date = new Date()
      var time = date.getHours() + ":" + date.getMinutes();
      Worker.update({status: 'waiting'}, {$set: {status: 'confirm'}}, {multi: true});

      // Survey code for every worker is the time the requester launches the worker's task.
      Worker.update({status: 'confirm'}, {$set: {surveycode: time}}, {multi: true});
      
      // TODO: Very bad, refactor (rewrite) when time permits
      let query = Worker.find({status: 'confirm'});

      let count = query.count();

      var handle = query.observeChanges({
        removed: function(id) {
          count--;
          if (count == 0) {
            Worker.update({status: 'confirmed'}, {$set: {status: 'launch'}}, {multi: true});
            handle.stop();
          }
        }
      });
    }
  });
}
