import Experiment from '../../../universal/models/Experiment.js';

export default function (Template) {
  Template['requester'].helpers({
    experiments: function() {
      return Experiment.find({});
    }
  });

  Template['requester'].events({
    'click .create-experiment-button': (event) => {
      event.preventDefault();
      FlowRouter.go('/requester/experiment/create');
    },
    'click .manage-experiment': (event) => {
      event.preventDefault();

      const experimentId = $(event.currentTarget).data('id');

      FlowRouter.go('/experiment/' + experimentId + '/dashboard');
    }
  });
}
