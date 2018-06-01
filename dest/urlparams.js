'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
* 判断一些原生对象
**/
function isOriginObject(obj) {
  return obj.constructor === Date || typeof obj === 'function';
}

function isArr(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}

/**
* 把参数对象序列化成树对象
*
**/
function ObjTree(obj) {
  var arr = [];
  for (var key in obj) {
    // 过滤一些原生对象类型
    if (isOriginObject(obj[key])) {
      continue;
    }
    if (_typeof(obj[key]) === 'object') {
      arr.push({ label: key, child: ObjTree(obj[key]) });
    } else {
      arr.push({ label: key, val: obj[key] });
    }
  }
  return arr;
}
/**
* 从对象树种遍历所有路径，及叶子
*
**/
function ObjTreePaths(tree) {
  var arr = [];
  // 路径遍历
  function path(tree, label) {
    label = label || '';
    for (var i in tree) {
      if (tree[i].child) {
        if (label) {
          path(tree[i].child, label + '[' + tree[i].label + ']');
        } else {
          path(tree[i].child, tree[i].label);
        }
      } else {
        // 把叶子值连接到路径后面
        if (label) {
          arr.push(label + '[' + tree[i].label + ']=' + tree[i].val);
        } else {
          arr.push(tree[i].label + '=' + tree[i].val);
        }
      }
    }
  }
  path(tree);
  return arr;
}

function URLParams(obj, encode) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !isOriginObject(obj) && !isArr(obj)) {
    var paths = ObjTreePaths(ObjTree(obj));
    var qs = paths.join('&');
    return encode ? encodeURI(qs) : qs;
  }
  return '';
}

exports.default = {
  url: function url(_url, obj, isEncode) {
    var params = URLParams(obj, isEncode);
    if (_url.indexOf('?') > -1) {
      var uri = _url.split('?');
      return params ? _url.replace(/&$/, '') + (uri[1] ? '&' : '') + params : _url;
    } else {
      return params ? _url + '?' + params : _url;
    }
  },
  stringify: function stringify(obj, isEncode) {
    return URLParams(obj, isEncode);
  }
};