import { renderBasic, renderSlim } from './helpers.js';

export default function (FlowRouter) {
  FlowRouter.route('/', {
    action: () => renderBasic('home')
  });

  FlowRouter.route('/createExperiment', {
    action: () => renderBasic('createExperiment')
  });

  FlowRouter.notFound = {
    action: () => renderSlim('notFound')
  };
}
