const Experiment = new Mongo.Collection('Experiment');

Experiment.attachSchema(
    new SimpleSchema({
    name: {
      type: String
    },
    // createdBy: {
    //   type: String,
    //   autoValue: function(){ return this.userId }
    // },
    createdAt: {
      type: Date,
      denyUpdate: true
    },
    teamSize: {
      type: Number,
      defaultValue: 15
    },
    taskURL: {
      type: String,
      defaultValue: 'https://docs.google.com/document/d/1nAVXdacAasKwrKXoT6tmQr0lsyOBJLVgo8eS1FgwUQU'
    },
    queueTask: {
       type: String,
       defaultValue: "Tetris"
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

//Experiment.rawCollection().drop();


export default Experiment;
