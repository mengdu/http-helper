'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = request;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _formData = require('./form-data');

var _formData2 = _interopRequireDefault(_formData);

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function request(options, target) {
  var _this = this;

  var net = options.protocol === 'http:' ? _http2.default : _https2.default;

  return new Promise(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(resolve, reject) {
      var boundary, body, req, loop;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              loop = function loop(item) {
                return new Promise(function (done) {
                  if (item.value instanceof _file2.default) {
                    req.write('\r\nContent-Disposition: form-data; name="' + item.key + '"; filename="' + item.value.name + '"\r\nContent-Type: ' + item.value.type + '\r\n\r\n');
                    if (item.value.buffer) {
                      req.write(item.value.buffer, 'binary');
                      req.write('\r\n');
                      done();
                    } else {
                      // read buffer stream
                      var buf = _fs2.default.createReadStream(item.value.filePath);
                      buf.on('data', function (chunk) {
                        req.write(chunk, 'binary');
                      });
                      buf.on('end', function () {
                        req.write('\r\n');
                        done();
                      });
                      buf.on('error', function (err) {
                        target.emit('error', err);
                      });
                    }
                  } else {
                    req.write('\r\nContent-Disposition: form-data; name="' + item.key + '"\r\n\r\n' + item.value + '\r\n');
                    done();
                  }
                });
              };

              boundary = options.boundary;
              body = options.body;


              delete options.boundary;
              delete options.body;

              req = net.request(options, function (res) {
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
                target.emit('error', err);
                reject(err);
              });

              req.on('timeout', function () {
                target.emit('timeout');
                reject(new Error('Http request has timeout'));
              });

              if (!((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object' && body instanceof _formData2.default)) {
                _context2.next = 12;
                break;
              }

              return _context2.delegateYield( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var keys, items, _loop, i, total, index;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // send multipart/form-data
                        keys = Object.keys(body.body);
                        items = [];

                        _loop = function _loop(i) {
                          body.body[keys[i]].forEach(function (e) {
                            items.push({
                              key: keys[i],
                              value: e
                            });
                          });
                        };

                        for (i in keys) {
                          _loop(i);
                        }
                        // send form-data https://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.2
                        req.write('--' + boundary);

                        total = items.length;
                        _context.t0 = _regenerator2.default.keys(items);

                      case 7:
                        if ((_context.t1 = _context.t0()).done) {
                          _context.next = 15;
                          break;
                        }

                        index = _context.t1.value;
                        _context.next = 11;
                        return loop(items[index]);

                      case 11:

                        target.emit('upload', items[index], total);

                        if (index < total - 1) {
                          req.write('--' + boundary);
                        }
                        _context.next = 7;
                        break;

                      case 15:

                        req.write('--' + boundary + '--');
                        req.end();

                      case 17:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              })(), 't0', 10);

            case 10:
              _context2.next = 14;
              break;

            case 12:
              // send application/x-www-form-urlencoded
              req.write(body || '', 'utf8');
              req.end();

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
}