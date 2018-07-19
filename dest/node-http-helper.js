'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _interceptors = require('./interceptors');

var _interceptors2 = _interopRequireDefault(_interceptors);

var _urlparams = require('./urlparams');

var _urlparams2 = _interopRequireDefault(_urlparams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function request(options) {
  var net = options.protocol === 'http:' ? _http2.default : _https2.default;

  return new Promise(function (resolve, reject) {
    var req = net.request(options, function (res) {
      // res.setEncoding('utf8')
      var chunks = [];
      var totalLen = 0;
      res.on('data', function (chunk) {
        chunks = [].concat(chunk);
        totalLen += chunk.length;
      });

      res.on('end', function () {
        res.body = Buffer.concat(chunks, totalLen);
        resolve(res);
      });
    });

    req.on('error', function (err) {
      reject(err);
    });

    req.on('timeout', function () {
      reject(new Error('Http request has timeout'));
    });

    req.write(['POST', 'PUT', 'PATCH'].indexOf(options.method) > -1 ? options.body : '');
    req.end();
  });
}

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

var HttpHepler = function () {
  function HttpHepler() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HttpHepler);

    this.urlEncode = options.urlEncode === 'undefined' ? options.urlEncode : true;
    this.bodyEncode = this.bodyEncode === 'undefined' ? this.bodyEncode : false;
    this.request = {
      middlewares: [],
      use: function use(fn) {
        if (typeof fn !== 'function') throw new Error('The middleware must be a functon.');
        this.middlewares.push(fn);
        return this;
      }
    };

    this.response = {
      middlewares: [],
      use: function use(fn) {
        if (typeof fn !== 'function') throw new Error('The middleware must be a functon.');
        this.middlewares.push(fn);
        return this;
      }
    };
  }

  _createClass(HttpHepler, [{
    key: 'fetch',
    value: function fetch(options) {
      var that = this;
      return new Promise(function (resolve, reject) {
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
          reject(new Error('The options params must be an object.'));
        }
        if (typeof options.url !== 'string' && !options.url) {
          reject(new Error('The options.url params required.'));
        }

        var reqOpts = new RequestHeader(options);

        (0, _interceptors2.default)(that.request.middlewares)(reqOpts, function (options) {

          var url = _urlparams2.default.url(options.path, options.params, that.urlEncode);
          options.path = url;
          options.method = (options.method || 'GET').toUpperCase();
          // options.headers['Content-Length'] = 0

          if (['POST', 'PUT', 'PATCH'].indexOf(options.method) > -1) {
            options.body = _typeof(options.body) === 'object' ? _urlparams2.default.stringify(options.body) : options.body;
            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded';
            // options.headers['Content-Length'] = Buffer.byteLength(options.body, that.bodyEncode)
          }
          console.log(options);
          request(options).then(function (res) {
            (0, _interceptors2.default)(that.response.middlewares)(res, function (newRes) {
              resolve(newRes);
            });
          }).catch(function (err) {
            reject(err);
          });
        });
      });
    }
  }, {
    key: 'get',
    value: function get(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.fetch(_extends({ url: url }, options, { method: 'GET' }));
    }
  }, {
    key: 'delete',
    value: function _delete(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.fetch(_extends({ url: url }, options, { method: 'DELETE' }));
    }
  }, {
    key: 'head',
    value: function head(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.fetch(_extends({ url: url }, options, { method: 'HEAD' }));
    }
  }, {
    key: 'post',
    value: function post(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.fetch(_extends({ url: url }, options, { method: 'POST' }));
    }
  }, {
    key: 'put',
    value: function put(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.fetch(_extends({ url: url }, options, { method: 'PUT' }));
    }
  }, {
    key: 'patch',
    value: function patch(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.fetch(_extends({ url: url }, options, { method: 'PATCH' }));
    }
  }]);

  return HttpHepler;
}();

exports.default = HttpHepler;