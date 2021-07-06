Meteor.methods({
  queryTradeMeAPI(listingId) {
    check(listingId, String);
    this.unblock();
    const api = Meteor.settings.public.services.trademe.api_url;
    const key = Meteor.settings.private.trademe.consumer_key;
    const signature = Meteor.settings.private.trademe.consumer_secret;

    return HTTP.call('GET', `${api}/Listings/${listingId}.json`, {
      headers: {
        'Authorization': `OAuth oauth_consumer_key=\"${key}\", oauth_signature=\"${signature}&\", oauth_signature_method=\"PLAINTEXT\"`
      }
    });
  },

  insertTradeMeListing(data) {
    const getAttributeValue = name => {
      const object = _.find(data.Attributes, attr => attr.Name === name);
      return !_.isUndefined(object) && object.Value || null;
    }

    const isHouse = getAttributeValue('property_type') === 'House';
    const isSection = getAttributeValue('property_type') === 'Section';

    const address = getAttributeValue('location');
    const title = data.Title;
    const description = data.Body;
    const images = _.map(data.Photos, photo => {
      return photo.Value.FullSize;
    });

    const url = `${Meteor.settings.public.services.trademe.site_url}auction-${data.ListingId}.htm`;

    const askingPrice = accounting.parse(getAttributeValue('price'));
    const watchersCount = data.BidderAndWatchers || 1;

    let bedroom, bathroom, livingArea, landArea;

    if (getAttributeValue('bedrooms')) {
      bedroom = getAttributeValue('bedrooms').split(' ')[0];
    }

    if (getAttributeValue('bathrooms')) {
      bathroom = getAttributeValue('bathrooms').split(' ')[0];
    }

    if (getAttributeValue('floor_area')) {
      livingArea = getAttributeValue('floor_area').replace('m²', '');
    }

    if (getAttributeValue('land_area')) {
      landArea = getAttributeValue('land_area').replace('m²', '');
    }

    const details = {
      bedroom,
      bathroom,
      livingArea,
      landArea
    };

    let agency = {};

    if (data.Agency) {
      const agents = _.map(data.Agency.Agents, agent => {
        return {
          name: agent.FullName,
          phone: agent.OfficePhoneNumber
        }
      });

      agency = {
        name: data.Agency.Name,
        logo: data.Agency.Logo,
        agents
      }
    }

    let geo = {};

    if (data.GeographicLocation) {
      geo.lat = data.GeographicLocation.Latitude;
      geo.lng = data.GeographicLocation.Longitude;
    };

    Listings.insert({
      userId: Meteor.userId(),
      notes: [],
      address,
      title,
      description,
      images,
      url,
      watchersCount,
      //
      askingPrice,
      holdPeriod: 10,
      //
      rent: 530,
      yield: 4.3,
      mortgageRate: 4.5,
      manualMarketValue: 0,
      useValueOverride: false,
      //
      lim: 500,
      legalFees: 1500,
      inspection: 750,
      renovCostsRent: 2500,
      otherCosts: 250,
      //
      councilRates: 2500,
      strataTitled: 0,
      leasehold: 0,
      rentalAdvertisementCosts: 250,
      gardening: 500,
      maintenanceCosts: 500,
      electricity: 1000,
      water: 1000,
      insurance: 1500,
      managementFeesRate: 3,
      realEstateFeesRate: 3,
      vacancyRate: 0,
      //
      forRent: true,
      //
      mType: 1,
      mIntType: 1,
      //
      grRent: 3,
      grExp: 3,
      grVal: 3.5,
      mFuture: 6,
      mKickIn: 3,
      //
      saleRenovCosts: 5000,
      saleLegalFees: 1500,
      saleOtherCosts: 0,
      //
      details,
      agency,
      geo
    });
  }
});
