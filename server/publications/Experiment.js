// TODO: call this in entry file
export default function () {
  Meteor.publish('Experiment', function () {
    return Experiment.find();
  });
}
