class Property {
  constructor(source, url) {
    this.source = source;
    this.url = url;
  }

  // property type: room/appartment/house, etc
  type = null;

  roomCount = null;
  propertySize = null;
  propertySizeUnits = null; // sq.m/sq.ft

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

  // wifi, washing machine, etc
  householdAppliances = [];

  // parking place, balcony, etc
  comforts = [];

  // pets allowed, etc
  permissions = [];
}

export default Property;
