
const Experiment = new Mongo.Collection('Experiment');

Experiment.attachSchema(
    new SimpleSchema({
    name: {
      type: String
    },
    createdBy: {
      type: String,
      autoValue: function(){ return this.userId }
    },
    createdAt: {
      type: Date,
      denyUpdate: true
    }
  })
);

// Collection2 already does schema checking
if (Meteor.isServer) {
  Experiment.allow({
    insert : () => true,
    update : () => true,
    remove : () => true
  });
}

export default Experiment;
