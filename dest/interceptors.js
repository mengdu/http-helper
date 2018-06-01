'use strict';
/**
* 中间件执行器
* e.g. interceptors(obj.middlewares)(ctx, fn)
* @param {Array} middlewares 中间件数组
* @return {Function}
**/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = interceptors;
function interceptors(middlewares) {
  if (!Array.isArray(middlewares)) throw new TypeError('Middleware stack must be an array!');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = middlewares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var fn = _step.value;

      if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return function (content, next) {
    var index = -1;
    function dispatch(i) {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      if (i >= middlewares.length) {
        return next(content);
      }
      var fn = middlewares[i];

      fn(content, function () {
        dispatch(i + 1);
      });
    }
    dispatch(0);
  };
}