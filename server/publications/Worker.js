// TODO: call this in entry file
export default function () {
  Meteor.publish('Worker', function () {
    return Worker.find();
  });
}
