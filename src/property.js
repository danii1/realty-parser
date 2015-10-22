class Property {
  constructor(source, url) {
    this.source = source;
    this.url = url;

    // ad author
    this.author = {
      type: null,
      name: null,
    };

    // property type: room/appartment/house, etc
    this.type = null;

    this.roomCount = null;
    this.propertySize = null;
    this.propertySizeUnits = null; // sq.m/sq.ft

    this.floor = null;
    this.floorsInBuilding = null;

    // pricing
    this.rent = null;
    this.rentType = null; // daily/monthly
    this.commission = null;
    this.deposit = null;
    this.currency = null;

    // location
    this.city = null;
    this.address = null;
    this.lat = null;
    this.lng = null;

    // property description
    this.description = null;

    // property photos
    this.photos = [];

    // wifi, washing machine, etc
    this.householdAppliances = [];

    // parking place, balcony, etc
    this.comforts = [];

    // pets allowed, etc
    this.permissions = [];    
  }
}

export default Property;
