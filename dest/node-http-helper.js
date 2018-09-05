'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _requestHeader = require('./request-header');

var _requestHeader2 = _interopRequireDefault(_requestHeader);

var _interceptors = require('./interceptors');

var _interceptors2 = _interopRequireDefault(_interceptors);

var _urlparams = require('./urlparams');

var _urlparams2 = _interopRequireDefault(_urlparams);

var _formData = require('./form-data');

var _formData2 = _interopRequireDefault(_formData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpHepler = function (_EventEmitter) {
  _inherits(HttpHepler, _EventEmitter);

  function HttpHepler() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HttpHepler);

    var _this = _possibleConstructorReturn(this, (HttpHepler.__proto__ || Object.getPrototypeOf(HttpHepler)).call(this));

    _this.urlEncode = options.urlEncode === 'undefined' ? options.urlEncode : true;

    // 请求中间件
    _this.request = {
      middlewares: [],
      use: function use(fn) {
        if (typeof fn !== 'function') throw new Error('The middleware must be a functon.');
        this.middlewares.push(fn);
        return this;
      }
    };

    // 响应中间件
    _this.response = {
      middlewares: [],
      use: function use(fn) {
        if (typeof fn !== 'function') throw new Error('The middleware must be a functon.');
        this.middlewares.push(fn);
        return this;
      }
    };
    return _this;
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
        // 创建请求对象
        var reqOpts = new _requestHeader2.default(options);
        // 合并公共 headers
        reqOpts.headers = Object.assign({}, that.headers || {}, reqOpts.headers);

        // 请求中间件
        (0, _interceptors2.default)(that.request.middlewares)(reqOpts, function (options) {

          var url = _urlparams2.default.url(options.path, options.params, that.urlEncode);
          options.path = url;
          options.method = (options.method || 'GET').toUpperCase();

          if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(options.method) > -1) {

            options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded';

            if (_typeof(options.body) === 'object') {

              if (!(options.body instanceof _formData2.default)) {
                options.body = _urlparams2.default.stringify(options.body);
              } else {
                var randString = _crypto2.default.randomBytes(32).toString('hex');
                options.boundary = _crypto2.default.createHash('md5').update(randString + Date.now()).digest('hex');
                options.headers['Content-Type'] = 'multipart/form-data; boundary=' + options.boundary + '';
                options.headers['Transfer-Encoding'] = 'chunked';
              }
            }
          } else {
            options.body = '';
          }

          // 触发 start 事件
          that.emit('start', options);

          // 发起请求
          (0, _request2.default)(options, that).then(function (res) {
            // 触发 end 事件
            that.emit('end', options, res);

            // 响应中间件
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
}(_events2.default);

exports.default = HttpHepler;