parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    things: [],
    confirmDeleteThingModalOpen: false,

    selectedThing: undefined,
    syncing: false,
    cloudError: '',
    formErrors: {

    },
    uploadThingModalOpen: false,
    uploadFormData: {
      label: '',
      photo: undefined
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    // Delete thing
    clickDeleteThing: function(thingId) {
      this.confirmDeleteThingModalOpen = true;
      this.selectedThing = _.find(this.things, {id: thingId})

    },
    closeDeleteThingModal: function() {
      this.selectedThing = undefined;
      this.confirmDeleteThingModalOpen = false;
      this.cloudError = '';
    },
    handleParsingDeleteThingForm: function() {
      return {
        id: this.selectedThing.id
      };
    },
    submittedDeleteThingForm: function() {
      console.log('ok it works');

      _.remove(this.things, {id: this.selectedThing.id });
      this.$forceUpdate();
      this.confirmDeleteThingModalOpen = false;
      this.selectedThing = undefined;
      this.cloudError = '';
    },

    // Add thing
    _clearUploadThingModal: function() {
      this.uploadThingModalOpen = false;

      this.uploadFormData = {
        label: ''
      };
      this.formErrors = {};
      this.cloudError = '';
    },

    clickAddThing: function() {
      this.uploadThingModalOpen = true;
    },
    handleParsingUploadThingForm: function() {
      this.formErrors = {};

      var argins = this.uploadFormData;

      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;

    },
    submittedUploadThingForm: function(result) {
      this.things.push({
        label: this.uploadFormData.label,
        owner: {
          id: this.me.id,
          fullName: this.me.fullName
        }
      });

      this._clearUploadThingModal();
    },
    closeAddThingModal: function() {
      this.uploadThingModalOpen = false;
    },

    changeFileInput: function(files) {
      var selectedFile = files[0];

      if (!selectedFile) {
        this.uploadFormData.photo = undefined;
        return;
      }
      this.uploadFormData.photo = selectedFile;

    },
    changeLabelInput: function(value) {
      this.uploadFormData.label = value;

    },
    changeBorrowedByInput: function(value) {
      this.uploadFormData.borrowedBy = value;
    }
  }
});
