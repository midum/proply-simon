Meteor.publish('userListings', function userListingsPublication() {
  return Listings.find({userId: this.userId});
});

Meteor.publish('singleListing', function singleListingPublication(id) {
  check(id, String);
  return Listings.find(id);
});
