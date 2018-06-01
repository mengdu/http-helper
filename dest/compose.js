'use strict';
/**
* 洋葱模型
* https://github.com/koajs/compose
* @param {Array} middleware array
* @return {Promise}
**/

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compose;
function compose(middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = middleware[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var fn = _step.value;

      if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
    }
    /**
    * @param {Object} context
    * @param {Function} next
    * @return {Promise}
    **/
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

  return function (context, next) {
    // last called middleware #
    var index = -1;

    function dispatch(i) {
      // 多次调用next()
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      var fn = middleware[i];
      // 中间件遍历完
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, function next() {
          // 调用下一个中间件
          return dispatch(i + 1);
        }));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    // 从第一个中间件开始
    return dispatch(0);
  };
}