
const Worker = new Mongo.Collection('Worker');

Worker.attachSchema(
    new SimpleSchema({
    source: {
      type: String
    },
    id: {
      type: String
    },
    status: {
      type: String,
      defaultValue: 'waiting'
    },
    createdAt: {
      type: Date,
      denyUpdate: true
    }
  })
);

// Collection2 already does schema checking
if (Meteor.isServer) {
  Worker.allow({
    insert : () => true,
    update : () => true,
    remove : () => true
  });
}

export default Worker;
