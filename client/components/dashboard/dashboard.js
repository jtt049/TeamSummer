import Worker from '../../../universal/models/Worker.js';

export default function (Template) {
  Template['dashboard'].helpers({
    workers: () => {
      return Worker.find({status: 'waiting'});
    }
  });

  Template['dashboard'].events({
  });
}
