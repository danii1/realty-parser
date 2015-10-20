import Parser from './parser.js';
import Property from '../property';
import request from 'request';
import cheerio from 'cheerio';

class AvitoParser extends Parser {
  static permissionsMapping = {
    'Можно с питомцами': 'pets_allowed',
    'Можно с детьми': 'family_with_children_allowed',
    'Можно курить': 'smoking_allowed',
    'Можно для мероприятий': 'use_as_event_space_allowed'
  }

  static comfortsMapping = {
    'Балкон / лоджия': 'balcony',
    'Кондиционер': 'conditioner',
    'Парковочное место': 'parking_space',
    'Камин': 'fireplace',
  }

  static householdAppliancesMapping = {
    'Wi-Fi': 'wifi',
    'Телевизор': 'tv',
    'Кабельное / цифровое ТВ': 'cable_tv',
    'Плита': 'stove',
    'Микроволновка': 'microwave',
    'Холодильник': 'fridge',
    'Стиральная машина': 'washing_machine',
    'Фен': 'hairdryer',
    'Утюг': 'iron'
  }

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
    let roomCountMatches = header.match(/\d+(?=\-к)/);
    if (roomCountMatches > -1) {
      return roomCountMatches[0];
    }
    return null;
  }

  _extractPropertySizeFromHeader(header) {
    let propertySizeMatches = header.match(/\d+(?=\s*м²)/);
    if (propertySizeMatches > -1) {
      return propertySizeMatches[0];
    }
    return null;
  }

  _extractRentType(rentString) {
    // get rent type (monthly, daily)
    const monthly = 'месяц';
    const daily = 'день';
    if (rentString.indexOf(monthly) > -1) {
      return 'monthly';
    } else if (rentString.indexOf(daily) > -1) {
      return 'daily';
    }
    return null;
  }

  _extractRent(rentString) {
    let rentMatches = rentString.match(/(\d+\s*)+/);
    if (rentMatches.length > 0) {
      let normalizedRentString = rentMatches[0].replace(/[\s]/g, '');
      return parseFloat(normalizedRentString);
    }
    return null;
  }

  _exractCommission(commissionString) {
    const commission = 'комиссия';
    if (commissionString.indexOf(commission) > -1) {
      let regex = /(?:комиссия\s+)((\d+\s*)+)/g;
      let commissionMatches = regex.exec(commissionString);
      if (commissionMatches.length > 1) {
        let normalizedCommissionString = commissionMatches[1].replace(/[\s]/g, '');
        return parseFloat(normalizedCommissionString);
      }
    }
    return null;
  }

  _extractDeposit(commissionString) {
    const deposit = 'залог';
    if (commissionString.indexOf(deposit) > -1) {
      let regex = /(?:залог\s+)((\d+\s*)+)/g;
      let depositMatches = regex.exec(commissionString);
      if (depositMatches.length > 1) {
        let normalizedDepositString = depositMatches[1].replace(/[\s]/g, '');
        return parseFloat(normalizedDepositString);
      }
    }
    return null;
  }


  // TODO: should parse selling properties too, not only rental
  // TODO: save information about floor if it's appartment
  _parsePage(body, url) {
    let result = new Property('avito', url);
    result.currency = 'rub';

    let $ = cheerio.load(body);

    const header = $('.h1').text().toLowerCase();

    result.type = this._extractPropertyTypeFromHeader(header);
    result.roomCount = this._extractRoomCountFromHeader(header)
    result.propertySize = this._extractPropertySizeFromHeader(header);
    result.propertySizeUnits = 'sq.m';

    // get city
    $('span', '.description_content').each((index, elem) => {
      if ($(elem).attr('itemprop') == 'name') {
        result.city = $(elem).text();
      }
    });

    // get address
    $('.description_content').each((index, elem) => {
      if ($(elem).attr('itemprop') == 'address') {
        result.address = $(elem).text();
      }
    });

    // get description
    result.description = $('#desc_text').text();

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

    $('.item-param-g-value').each((index, elem) => {
      let items = $(elem).text().split(',');
      for (var i = 0; i < items.length; i++) {
        items[i] = items[i].trim();
      }

      for (var i = 0; i < items.length; i++) {
        const prop = items[i];
        if (AvitoParser.permissionsMapping[prop]) {
          result.permissions.push(AvitoParser.permissionsMapping[prop]);
        }

        if (AvitoParser.comfortsMapping[prop]) {
          result.comforts.push(AvitoParser.comfortsMapping[prop]);
        }

        if (AvitoParser.householdAppliancesMapping[prop]) {
          result.householdAppliances.push(AvitoParser.householdAppliancesMapping[prop]);
        }
      }
    });

    return result;
  }

  parse(url) {
    if (typeof url === 'undefined' || url === '') {
      throw new Error('url param should be valid');
    }

    let _this = this;
    return new Promise((resolve, reject) => {
      request.get(url, function(err, response, body) {
        if (err) {
          reject(err);
        } else {
          resolve(_this._parsePage(body, url));
        }
      });
    });
  }
}

export default AvitoParser;
