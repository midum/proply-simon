AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  layoutTemplate: 'auth',
  contentRegion: 'main'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'signup',
  layoutTemplate: 'auth',
  contentRegion: 'main'
});

FlowRouter.route('/', {
  name: 'home',
  action: function() {
    BlazeLayout.render('layout', {top: 'header', main: 'home'});
  }
});

FlowRouter.route('/watchlist', {
  name: 'watchlist',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action: function() {
    BlazeLayout.render('layout', {top: 'header', main: 'watchlist'});
  }
});

FlowRouter.route('/listing/:id', {
  name: 'listing',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  subscriptions: function(params) {
    this.register('listing', Meteor.subscribe('singleListing', params.id))
  },
  action: function() {
    BlazeLayout.render('layout', {top: 'header', main: 'listing'});
  }
});
