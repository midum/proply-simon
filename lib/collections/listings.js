Listings = new Mongo.Collection('listings');

const sum = ([...args]) => _.reduce(args, (memo, num) => memo + num, 0);

Listings.helpers({
  featuredImage() {
    return this.images[0];
  },

  // Costs
  purchaseCosts() {
    return sum([
      this.lim,
      this.legalFees,
      this.inspection,
      this.renovCostsRent,
      this.otherCosts
    ]);
  },

  holdingCosts() {
    return sum([
      this.councilRates,
      this.strataTitled,
      this.leasehold,
      this.rentalAdvertisementCosts,
      this.gardening,
      this.maintenanceCosts,
      this.electricity,
      this.water,
      this.insurance
    ]);
  },

  saleCosts() {
    return sum([
      this.saleRenovCosts,
      this.saleLegalFees,
      this.saleOtherCosts,
      this.agencyFees()
    ]);
  },

  rentPerAnnum() {
    return (this.rent - this.rent * (this.vacancyRate / 100)) * 52;
  },

  vacancyCost() {
    return this.rentPerAnnum() * this.vacancyRate;
  },

  estimatedValue() {
    return this.rentPerAnnum() / this.yield * 100;
  },

  estimatedMarketValue() {
    return this.useValueOverride ? this.manualMarketValue : this.estimatedValue();
  },

  highestOffer() {
    return this.estimatedMarketValue();
  },

  managementFees() {
    return this.rentPerAnnum() * this.managementFeesRate / 100;
  },

  isAuckland() {
    return this.address.toLowerCase().indexOf('auckland') > - 1;
  },

  location() {
    return this.isAuckland() && 'Auckland' || 'Not Auckland';
  },

  expectedUse() {
    return this.forRent && 'For Rent' || 'Your Home';
  },

  lvrRate() {
    return (this.isAuckland() && this.forRent) && 70 || 80;
  },

  deposit() {
    return this.estimatedMarketValue() * (100 - this.lvrRate()) / 100;
  },

  mortgageAmount() {
    return this.estimatedMarketValue() - this.deposit();
  },

  mortgageInterestCosts() {
    return this.mortgageAmount() * this.mortgageRate / 100;
  },

  mortgagePaymentYearOne() {
    if (this.mType == 1) {
      return this.mortgageInterestCosts();
    } else if (this.mType == 2) {
      const monthlyRate = this.mortgageRate / 100 / 12;
      return monthlyRate * Math.pow((1 + monthlyRate), this.holdPeriod * 12) / (Math.pow((1 + monthlyRate), this.holdPeriod * 12) - 1) * this.mortgageAmount() * 12;
    }
  },

  estimatedSellPriceTenYears() {
    return this.estimatedMarketValue() + ((this.grVal / 100) * this.estimatedMarketValue() * this.holdPeriod);
  },

  initialCashOutlay() {
    return sum([this.deposit(), this.purchaseCosts()]);
  },

  agencyFees() {
    return this.estimatedSellPriceTenYears() * this.realEstateFeesRate / 100;
  },

  expectedRetalProfitOrLossYearOne() {
    return this.rentPerAnnum() - this.holdingCosts() - this.mortgageInterestCosts();
  },

  expectedRetalProfitOrLossTotal() {
    return this.expectedRetalProfitOrLossYearOne() * this.holdPeriod;
  },

  estimatedCapitalGainsOrLoss() {
    return this.estimatedSellPriceTenYears() - this.saleCosts() - this.purchaseCosts() - this.estimatedMarketValue();
  },

  totalProfitOrLoss() {
    return this.estimatedCapitalGainsOrLoss() + this.expectedRetalProfitOrLossTotal();
  },

  roi() {
    return this.totalProfitOrLoss() / this.initialCashOutlay() * 100;
  },

  irr() {
    return ((Math.pow((this.initialCashOutlay() + this.totalProfitOrLoss()) / this.initialCashOutlay(), 1 / this.holdPeriod)) - 1) * 100;
  }
})
