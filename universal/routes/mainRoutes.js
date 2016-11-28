import { renderBasic, renderSlim } from './helpers.js';
import Experiment from '../models/Experiment';

export default function (FlowRouter) {
  FlowRouter.route('/', {
    action: () => renderBasic('home')
  });

  FlowRouter.route('/dashboard', {
    action: () => renderBasic('dashboard')
  });

  FlowRouter.route('/overview', {
    action: () => renderBasic('overview')
  });

  FlowRouter.route('/createExperiment', {
    action: () => renderBasic('createExperiment')
  });

  // TODO: Refactor into group
  FlowRouter.route('/experiment/:experimentId', {
    action: (params, queryParams) => {
      renderBasic('experimentLogin')
    }
  });

  FlowRouter.route('/experiment/:experimentId/queue', {
    action: (params) => {
      // Check if experiment exists
      if (Experiment.findOne({_id: params.experimentId})) {
        renderBasic('queue')
      }
      else {
        FlowRouter.go('/404');
      }
    }
  });

  FlowRouter.notFound = {
    action: () => renderSlim('notFound')
  };
}
