import { renderBasic, renderSlim } from './helpers.js';

export default function (FlowRouter) {
  FlowRouter.route('/', {
    action: () => renderBasic('home')
  });

  FlowRouter.route('/queue', {
    action: () => renderBasic('queue')
  });

  FlowRouter.route('/dashboard', {
    action: () => renderBasic('dashboard')
  });

  FlowRouter.route('/createExperiment', {
    action: () => renderBasic('createExperiment')
  });

  FlowRouter.notFound = {
    action: () => renderSlim('notFound')
  };
}
