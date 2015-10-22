'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ParserFactory = (function () {
  function ParserFactory() {
    _classCallCheck(this, ParserFactory);
  }

  _createClass(ParserFactory, null, [{
    key: 'create',
    value: function create(type) {
      switch (type) {
        case 'avito':
          break;
        case 'cian':
          break;
        default:
          throw new TypeError('Parser type is not recognized');
      }
    }
  }]);

  return ParserFactory;
})();

exports['default'] = ParserFactory;
module.exports = exports['default'];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Property = function Property(source, url) {
  _classCallCheck(this, Property);

  this.type = null;
  this.roomCount = null;
  this.propertySize = null;
  this.propertySizeUnits = null;
  this.floor = null;
  this.floorsInBuilding = null;
  this.rent = null;
  this.rentType = null;
  this.commission = null;
  this.deposit = null;
  this.currency = null;
  this.city = null;
  this.address = null;
  this.lat = null;
  this.lng = null;
  this.description = null;
  this.householdAppliances = [];
  this.comforts = [];
  this.permissions = [];

  this.source = source;
  this.url = url;
}

// property type: room/appartment/house, etc
;

exports["default"] = Property;
module.exports = exports["default"];
// sq.m/sq.ft

// pricing
// daily/monthly

// location

// property description

// wifi, washing machine, etc

// parking place, balcony, etc

// pets allowed, etc
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _parserJs = require('./parser.js');

var _parserJs2 = _interopRequireDefault(_parserJs);

var _property = require('../property');

var _property2 = _interopRequireDefault(_property);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var AvitoParser = (function (_Parser) {
  _inherits(AvitoParser, _Parser);

  function AvitoParser() {
    _classCallCheck(this, AvitoParser);

    _get(Object.getPrototypeOf(AvitoParser.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AvitoParser, [{
    key: '_extractPropertyTypeFromHeader',
    value: function _extractPropertyTypeFromHeader(header) {
      var room = 'комната';
      var appartment = 'квартира';
      var studio = 'студия';
      var house = 'дом';
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
  }, {
    key: '_extractRoomCountFromHeader',
    value: function _extractRoomCountFromHeader(header) {
      var roomCountMatches = header.match(/\d+(?=\-к)/);
      if (roomCountMatches.length > -1) return roomCountMatches[0];
      return null;
    }
  }, {
    key: '_extractPropertySizeFromHeader',
    value: function _extractPropertySizeFromHeader(header) {
      var propertySizeMatches = header.match(/\d+(?=\s*м²)/);
      if (propertySizeMatches.length > -1) return propertySizeMatches[0];
      return null;
    }
  }, {
    key: '_extractFloorFromHeader',
    value: function _extractFloorFromHeader(header) {
      var floorMatches = header.match(/\d\/\d(?=\s*эт)/);
      if (floorMatches.length > -1) {
        var floors = floorMatches[0].split('/');
        return parseInt(floors[0], 10);
      }
      return null;
    }
  }, {
    key: '_extractFloorsInBuildingFromHeader',
    value: function _extractFloorsInBuildingFromHeader(header) {
      var floorMatches = header.match(/\d\/\d(?=\s*эт)/);
      if (floorMatches.length > -1) {
        var floors = floorMatches[0].split('/');
        return parseInt(floors[1], 10);
      }
      return null;
    }
  }, {
    key: '_extractRentType',
    value: function _extractRentType(rentString) {
      // get rent type (monthly, daily)
      var monthly = 'месяц';
      var daily = 'день';
      if (rentString.indexOf(monthly) > -1) {
        return 'monthly';
      } else if (rentString.indexOf(daily) > -1) {
        return 'daily';
      }
      return null;
    }
  }, {
    key: '_extractRent',
    value: function _extractRent(rentString) {
      var rentMatches = rentString.match(/(\d+\s*)+/);
      if (rentMatches.length > 0) {
        var normalizedRentString = rentMatches[0].replace(/[\s]/g, '');
        return parseFloat(normalizedRentString);
      }
      return null;
    }
  }, {
    key: '_exractCommission',
    value: function _exractCommission(commissionString) {
      var commission = 'комиссия';
      if (commissionString.indexOf(commission) > -1) {
        var regex = /(?:комиссия\s+)((\d+\s*)+)/g;
        var commissionMatches = regex.exec(commissionString);
        if (commissionMatches.length > 1) {
          var normalizedCommissionString = commissionMatches[1].replace(/[\s]/g, '');
          return parseFloat(normalizedCommissionString);
        }
      }
      return null;
    }
  }, {
    key: '_extractDeposit',
    value: function _extractDeposit(commissionString) {
      var deposit = 'залог';
      if (commissionString.indexOf(deposit) > -1) {
        var regex = /(?:залог\s+)((\d+\s*)+)/g;
        var depositMatches = regex.exec(commissionString);
        if (depositMatches.length > 1) {
          var normalizedDepositString = depositMatches[1].replace(/[\s]/g, '');
          return parseFloat(normalizedDepositString);
        }
      }
      return null;
    }

    // TODO: should parse selling properties too, not only rental
    // TODO: detect if owner or agency posted ad
    // TODO: extract photos
  }, {
    key: '_parsePage',
    value: function _parsePage(body, url) {
      var result = new _property2['default']('avito', url);
      result.currency = 'rub';

      var $ = _cheerio2['default'].load(body);

      var header = $('.h1').text().toLowerCase();

      result.type = this._extractPropertyTypeFromHeader(header);
      result.roomCount = this._extractRoomCountFromHeader(header);
      result.propertySize = this._extractPropertySizeFromHeader(header);
      result.floor = this._extractFloorFromHeader(header);
      result.floorsInBuilding = this._extractFloorsInBuildingFromHeader(header);
      result.propertySizeUnits = 'sq.m';

      // get city
      $('span', '.description_content').each(function (index, elem) {
        if ($(elem).attr('itemprop') === 'name') {
          result.city = $(elem).text();
        }
      });

      // get address
      $('.description_content').each(function (index, elem) {
        if ($(elem).attr('itemprop') === 'address') {
          result.address = $(elem).text();
        }
      });

      // get description
      result.description = $('#desc_text').text();

      // get rent and rent type
      var rentString = $('.p_i_price').text().toLowerCase();
      result.rentType = this._extractRentType(rentString);
      result.rent = this._extractRent(rentString);

      // get commission and deposit
      var commissionString = $('.description_commission').text().toLowerCase();
      result.commission = this._exractCommission(commissionString);
      result.deposit = this._extractDeposit(commissionString);

      // get coordinates
      result.lat = $('.js-item-map').attr('data-map-lat');
      result.lng = $('.js-item-map').attr('data-map-lon');

      $('.item-param-g-value').each(function (index, elem) {
        var items = $(elem).text().split(',');
        for (var i = 0; i < items.length; i++) {
          items[i] = items[i].trim();
        }

        for (var i = 0; i < items.length; i++) {
          var prop = items[i];
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
  }, {
    key: 'parse',
    value: function parse(url) {
      if (typeof url === 'undefined' || url === '') {
        throw new Error('url param should be valid');
      }

      var _this = this;
      return new Promise(function (resolve, reject) {
        _request2['default'].get(url, function (err, response, body) {
          if (err) {
            reject(err);
          } else {
            resolve(_this._parsePage(body, url));
          }
        });
      });
    }
  }], [{
    key: 'permissionsMapping',
    value: {
      'Можно с питомцами': 'pets_allowed',
      'Можно с детьми': 'family_with_children_allowed',
      'Можно курить': 'smoking_allowed',
      'Можно для мероприятий': 'use_as_event_space_allowed'
    },
    enumerable: true
  }, {
    key: 'comfortsMapping',
    value: {
      'Балкон / лоджия': 'balcony',
      'Кондиционер': 'conditioner',
      'Парковочное место': 'parking_space',
      'Камин': 'fireplace'
    },
    enumerable: true
  }, {
    key: 'householdAppliancesMapping',
    value: {
      'Wi-Fi': 'wifi',
      'Телевизор': 'tv',
      'Кабельное / цифровое ТВ': 'cable_tv',
      'Плита': 'stove',
      'Микроволновка': 'microwave',
      'Холодильник': 'fridge',
      'Стиральная машина': 'washing_machine',
      'Фен': 'hairdryer',
      'Утюг': 'iron'
    },
    enumerable: true
  }]);

  return AvitoParser;
})(_parserJs2['default']);

exports['default'] = AvitoParser;
module.exports = exports['default'];
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Parser = (function () {
  function Parser() {
    _classCallCheck(this, Parser);
  }

  _createClass(Parser, [{
    key: 'parse',
    value: function parse() {
      throw new Error('Not implemented');
    }
  }]);

  return Parser;
})();

exports['default'] = Parser;
module.exports = exports['default'];
//# sourceMappingURL=realty-parser.js.map
