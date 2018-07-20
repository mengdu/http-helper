'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fileType = require('file-type');

var _fileType2 = _interopRequireDefault(_fileType);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _readChunk = require('read-chunk');

var _readChunk2 = _interopRequireDefault(_readChunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var File = function File(options) {
  _classCallCheck(this, File);

  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
    throw new Error('The first arguments must be an object.');
  }
  if (!options.buffer && !options.filePath) {
    throw new Error('The options object must provide a `options.buffer` or `options.filePath`.');
  }
  this.buffer = options.buffer || [];
  this.filePath = options.filePath;
  this.name = options.name;

  if (!options.name && options.filePath) {
    this.name = _path2.default.basename(options.filePath);
  }

  if (options.buffer) {
    this.buffer = Buffer.from(options.buffer);
    var type = (0, _fileType2.default)(this.buffer);
    this.type = type ? type.mime : 'application/octet-stream';
    this.size = this.buffer.length;
  }

  if (!options.buffer && options.filePath) {
    var stat = _fs2.default.statSync(options.filePath);
    if (!stat.isFile()) {
      throw new Error('The `options.filePath` is not a file.');
    }
    var chunk = _readChunk2.default.sync(options.filePath, 0, 4100);
    var _type = (0, _fileType2.default)(chunk);
    this.buffer = null;
    this.size = stat.size;
    this.type = _type ? _type.mime : 'application/octet-stream';
  }
};

exports.default = File;