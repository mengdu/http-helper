'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RequestHeader = function RequestHeader() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, RequestHeader);

  var _url$parse = _url2.default.parse(options.url),
      protocol = _url$parse.protocol,
      hostname = _url$parse.hostname,
      port = _url$parse.port,
      path = _url$parse.path;

  this.method = (options.method || 'GET').toUpperCase();
  this.timeout = options.timeout;
  this.headers = options.headers || {};
  this.auth = options.auth;
  this.agent = options.agent;
  this.body = options.body || {};
  this.params = options.params || {};

  this.hostname = hostname;
  this.port = port;
  this.protocol = protocol;
  this.path = path;
};

exports.default = RequestHeader;