'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormData = function () {
  function FormData() {
    _classCallCheck(this, FormData);

    if (this.constructor !== FormData) {
      throw new Error('Must be new a FormData Object.');
    }
    this.body = {};
  }

  _createClass(FormData, [{
    key: 'append',
    value: function append(key, value) {
      if (!this.body[key]) {
        this.body[key] = [];
      }
      this.body[key].push(value);
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      delete this.body[key];
    }
    // entries () {}
    // forEach () {}

  }, {
    key: 'get',
    value: function get(key) {
      if (this.body[key]) {
        return typeof this.body[key][0] === 'undefined' ? null : this.body[key][0];
      }
      return null;
    }
  }, {
    key: 'getAll',
    value: function getAll(key) {
      return this.body[key] ? this.body[key] : [];
    }
  }, {
    key: 'has',
    value: function has(key) {
      return !!this.body[key];
    }
    // keys () {
    // }

  }, {
    key: 'set',
    value: function set(key, value) {
      if (!this.body[key]) {
        this.body[key] = [];
      }
      this.body[key] = [value];
    }
    // values () {}

  }]);

  return FormData;
}();

exports.default = FormData;