import Parser from './parser';
import Property from '../property';
import request from 'request';
import cheerio from 'cheerio';

class AvitoParser extends Parser {
  _extractPropertyTypeFromHeader(header) {
    const room = 'комната';
    const appartment = 'квартира';
    const studio = 'студия';
    const house = 'дом';
    if (header.indexOf(room) > -1) {
      return 'room';
    } else if (header.indexOf(appartment)) {
      return 'appartment';
    } else if (header.indexof(studio)) {
      return 'studio';
    } else if (header.indexOf(house)) {
      return 'house';
    }
    return null;
  }

  _extractRoomCountFromHeader(header) {
    const roomCountMatches = header.match(/\d+(?=\-к)/);
    if (roomCountMatches && roomCountMatches.length > -1) {
      return roomCountMatches[0];
    }
    return null;
  }

  _extractPropertySizeFromHeader(header) {
    const propertySizeMatches = header.match(/\d+(?=\s*м²)/);
    if (propertySizeMatches && propertySizeMatches.length > -1) {
      return propertySizeMatches[0];
    }
    return null;
  }

  _extractFloorFromHeader(header) {
    const floorMatches = header.match(/\d\/\d(?=\s*эт)/);
    if (floorMatches && floorMatches.length > -1) {
      const floors = floorMatches[0].split('/');
      return parseInt(floors[0], 10);
    }
    return null;
  }

  _extractFloorsInBuildingFromHeader(header) {
    const floorMatches = header.match(/\d\/\d(?=\s*эт)/);
    if (floorMatches && floorMatches.length > -1) {
      const floors = floorMatches[0].split('/');
      return parseInt(floors[1], 10);
    }
    return null;
  }


  _extractRentType(rentString) {
    // get rent type (monthly, daily)
    const monthly = 'месяц';
    const daily = 'сутки';
    if (rentString.indexOf(monthly) > -1) {
      return 'monthly';
    } else if (rentString.indexOf(daily) > -1) {
      return 'daily';
    }
    return null;
  }

  _extractRent(rentString) {
    const rentMatches = rentString.match(/(\d+\s*)+/);
    if (rentMatches && rentMatches.length > 0) {
      const normalizedRentString = rentMatches[0].replace(/[\s]/g, '');
      return parseFloat(normalizedRentString);
    }
    return null;
  }

  _exractCommission(commissionString) {
    const commission = 'комиссия';
    if (commissionString.indexOf(commission) > -1) {
      const regex = /(?:комиссия\s+)((\d+\s*)+)/g;
      const commissionMatches = regex.exec(commissionString);
      if (commissionMatches && commissionMatches.length > 1) {
        const normalizedCommissionString = commissionMatches[1].replace(/[\s]/g, '');
        return parseFloat(normalizedCommissionString);
      }
    }
    return null;
  }

  _extractDeposit(commissionString) {
    const deposit = 'залог';
    if (commissionString.indexOf(deposit) > -1) {
      const regex = /(?:залог\s+)((\d+\s*)+)/g;
      const depositMatches = regex.exec(commissionString);
      if (depositMatches && depositMatches.length > 1) {
        const normalizedDepositString = depositMatches[1].replace(/[\s]/g, '');
        return parseFloat(normalizedDepositString);
      }
    }
    return null;
  }

  // TODO: should parse selling properties too, not only rental
  _parsePage(body, url) {
    const result = new Property('avito', url);
    result.currency = 'rub';

    const $ = cheerio.load(body);

    const header = $('.h1').text().toLowerCase();

    result.type = this._extractPropertyTypeFromHeader(header);
    result.roomCount = this._extractRoomCountFromHeader(header);
    result.propertySize = this._extractPropertySizeFromHeader(header);
    result.floor = this._extractFloorFromHeader(header);
    result.floorsInBuilding = this._extractFloorsInBuildingFromHeader(header);
    result.propertySizeUnits = 'sq.m';

    // extract photos
    $('.js-item-gallery .gallery-link').each((index, elem) => {
      let link = $(elem).attr('href');
      link = link.replace(/^\/\//, 'http://');
      result.photos.push(link);
    });

    // extract author type
    const authorType = $('.description_seller').text();
    if (authorType.indexOf('Агентство') > -1) {
      result.author.type = 'agency';
    } else if (authorType.indexOf('Арендодатель') > -1) {
      result.author.type = 'owner';
    }

    // extract author name
    const authorName = $('#seller').children().first().text();
    result.author.name = authorName;

    // get city
    $('span', '.description_content').each((index, elem) => {
      if ($(elem).attr('itemprop') === 'name') {
        result.city = $(elem).text().trim();
      }
    });

    // get address
    $('.description_content').each((index, elem) => {
      if ($(elem).attr('itemprop') === 'address') {
        result.address = $(elem).text().trim();
      }
    });

    // get description
    result.description = $('#desc_text').text().trim();

    // get rent and rent type
    const rentString = $('.p_i_price').text().toLowerCase();
    result.rentType = this._extractRentType(rentString);
    result.rent = this._extractRent(rentString);

    // get commission and deposit
    const commissionString = $('.description_commission').text().toLowerCase();
    result.commission = this._exractCommission(commissionString);
    result.deposit = this._extractDeposit(commissionString);

    // get coordinates
    result.lat = $('.js-item-map').attr('data-map-lat');
    result.lng = $('.js-item-map').attr('data-map-lon');

    const amenities = $('.item-param-g-value').map((index, elem) => {
      return $(elem).text().split(',').map((item) => {
        return item.trim();
      });
    }).get();

    amenities.forEach((prop) => {
      if (AvitoParser.permissionsMapping[prop]) {
        result.permissions.push(AvitoParser.permissionsMapping[prop]);
      }

      if (AvitoParser.comfortsMapping[prop]) {
        result.comforts.push(AvitoParser.comfortsMapping[prop]);
      }

      if (AvitoParser.householdAppliancesMapping[prop]) {
        result.householdAppliances.push(AvitoParser.householdAppliancesMapping[prop]);
      }
    });

    return result;
  }

  parse(url) {
    if (typeof url === 'undefined' || url === '') {
      throw new Error('url param should be valid');
    }

    return new Promise((resolve, reject) => {
      request.get(url, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(this._parsePage(body, url));
        }
      });
    });
  }
}

AvitoParser.permissionsMapping = {
  'Можно с питомцами': 'pets_allowed',
  'Можно с детьми': 'family_with_children_allowed',
  'Можно курить': 'smoking_allowed',
  'Можно для мероприятий': 'use_as_event_space_allowed',
};

AvitoParser.comfortsMapping = {
  'Балкон / лоджия': 'balcony',
  'Кондиционер': 'conditioner',
  'Парковочное место': 'parking_space',
  'Камин': 'fireplace',
};

AvitoParser.householdAppliancesMapping = {
  'Wi-Fi': 'wifi',
  'Телевизор': 'tv',
  'Кабельное / цифровое ТВ': 'cable_tv',
  'Плита': 'stove',
  'Микроволновка': 'microwave',
  'Холодильник': 'fridge',
  'Стиральная машина': 'washing_machine',
  'Фен': 'hairdryer',
  'Утюг': 'iron',
};

export default AvitoParser;
