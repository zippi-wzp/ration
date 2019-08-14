module.exports = {


  friendlyName: 'Download photo',


  description: 'Download photo file (returning a stream).',


  inputs: {
    id: {
      description: 'The id of the thing whose photo we are downloading.',
      type: 'number',
      required: true
    }
  },


  exits: {
    success: {
      outputDescription: 'The streaming bytes of the specified things\'s photo.',
      outputType: 'ref'
    },
    notFound: {
      responseType: 'notFound'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },


  fn: async function (inputs) {
    var thing = await Thing.findOne({ id: inputs.id });

    if (!thing) {
      throw 'notFound';
    }

    var friends = User.findOne({ id: this.req.me.id }).populate('friends');

    if (thing.owner !== this.req.me.id  && !_.any(friends, { id: thing.owner })) {
      throw 'forbidden';
    }

    // set the mime type for the response

    this.res.type(thing.imageUploadMime);
    console.log(thing.imageUploadFd)
    var downloading = await sails.startDownload(thing.imageUploadFd);

    // All done.
    return downloading;

  }


};
