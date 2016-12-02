import Worker from '../../universal/models/Worker.js';

export default function () {
  Meteor.methods({
    'launchAllWorkers'() {
      Worker.update({status: 'waiting'}, {$set: {status: 'confirm'}}, {multi: true});      
      // TODO: Very bad, refactor (rewrite) when time permits
      let query = Worker.find({status: 'confirm'});

      let count = query.count();

      var handle = query.observeChanges({
        removed: function(id) {
          count--;

          if (count == 0) {
            Worker.update({status:'confirmed'}, {$set:{launchTime: new Date()}}, {multi:true})
            Worker.update({status: 'confirmed'}, {$set: {status: 'launch'}}, {multi: true});
            handle.stop();
          }
        }
      });
    }
  });
}
