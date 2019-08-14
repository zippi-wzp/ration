module.exports = {


  friendlyName: 'Deliver overdue item notifications',


  description: '',


  fn: async function () {

    var moment = require('moment');


    var overdueThings = await Thing.find({
      borrowedBy: { '!=': null },
      expectedReturnAt: { '<=': Date.now() - 1000*60*60*12 }
    })
    .populate('owner')
    .populate('borrowedBy');


    for (let overdueThing of overdueThings) {
      var itemLabel = overdueThing.label || 'your borrowed item';
      var formattedExpectedReturnAt = moment(new Date()).format('dddd, MMMM Do');

      await sails.helpers.sendTemplateEmail.with({
        to: overdueThing.borrowedBy.emailAddress,
        // to: 'truebatmandc@gmail.com',
        subject: `It's time to return ${overdueThing.owner.fullName}'s ${overdueThing.label || 'item'}!`,
        template: 'email-overdue-notice',
        templateData: {
          ownerName: overdueThing.owner.fullName,
          ownerEmail: overdueThing.owner.emailAddress,
          itemLabel: itemLabel,
          fullName: overdueThing.borrowedBy.fullName,
          // fullName: 'Artem Yeryshev',
          expectedReturnAt: formattedExpectedReturnAt,
          baseUrl: sails.config.custom.baseUrl
        }
      });

    }
  }


};

