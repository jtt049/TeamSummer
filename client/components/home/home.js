import Worker from '../../../universal/models/Worker.js';

export default function (Template) {
  Template.home.events({
    'submit .login-worker'(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;
      const source = target.source.value;
      const id = target.sourceId.value;

      // Insert a task into the collection
      Worker.insert({
        source: source,
        id: id,
        createdAt: new Date(), // current time
      }, (err, _id) => {
        if (err) {
          console.error(err);
        }

        Session.set('currentWorkerId', _id);
        FlowRouter.go('/queue');
      });

      // Clear form
      target.source.value = '';
      target.sourceId.value = '';
    },
  });

  Template.home.helpers({
  });

  Template.home.rendered = function () {
  };
}
