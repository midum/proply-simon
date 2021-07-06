Template.header.helpers({
  avatarUser() {
    return Meteor.user();
  },

  avatarName() {
    return Meteor.user().profile.firstName;
  }
});

Template.header.events({
  'click .js-sing-out'() {
    AccountsTemplates.logout();
  }
});
