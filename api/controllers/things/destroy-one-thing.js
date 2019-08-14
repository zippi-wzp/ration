module.exports = {


  friendlyName: 'Destroy one thing',


  description: 'Delete one thing with the specified ID from the database',


  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {
    forbidden: {
      description: 'The user making this request does not have permissions to do this.',
      responseType: 'forbidden'
    },
    notFound: {
      description: 'The thing which you tried to delete is not exist.',
      responseType: 'notFound'
    }
  },


  fn: async function (inputs) {

    var thing  = await Thing.findOne({
      id: inputs.id
    });

    if (!thing) {
      throw 'notFound';
    }

    if (thing.owner !== this.req.me.id) {
      throw 'forbidden';
    }

    await Thing.destroy({ id: inputs.id });

    // All done.
    return;

  }


};
