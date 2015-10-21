class Property {
  constructor(source, url) {
    this.source = source;
    this.url = url;
  }

  // ad author
  author = {
    type: null,
    name: null,
  };

  // property type: room/appartment/house, etc
  type = null;

  roomCount = null;
  propertySize = null;
  propertySizeUnits = null; // sq.m/sq.ft

  floor = null;
  floorsInBuilding = null;

  // pricing
  rent = null;
  rentType = null; // daily/monthly
  commission = null;
  deposit = null;
  currency = null;

  // location
  city = null;
  address = null;
  lat = null;
  lng = null;

  // property description
  description = null;

  // property photos
  photos = [];

  // wifi, washing machine, etc
  householdAppliances = [];

  // parking place, balcony, etc
  comforts = [];

  // pets allowed, etc
  permissions = [];
}

export default Property;
