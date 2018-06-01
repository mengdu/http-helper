/**
* 判断一些原生对象
**/
function isOriginObject (obj) {
  return obj.constructor === Date ||
    typeof obj === 'function'
}

function isArr (val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

/**
* 把参数对象序列化成树对象
*
**/
function ObjTree (obj) {
  var arr = []
  for (var key in obj) {
    // 过滤一些原生对象类型
    if (isOriginObject(obj[key])) {
      continue
    }
    if (typeof obj[key] === 'object') {
      arr.push({label: key, child: ObjTree(obj[key])})
    } else {
      arr.push({label: key, val: obj[key]})
    }
  }
  return arr
}
/**
* 从对象树种遍历所有路径，及叶子
*
**/
function ObjTreePaths (tree) {
  var arr = []
  // 路径遍历
  function path (tree, label) {
    label = label || ''
    for (var i in tree) {
      if (tree[i].child) {
        if (label) {
          path(tree[i].child, label + '[' + tree[i].label + ']')
        } else {
          path(tree[i].child, tree[i].label)
        }
      } else {
        // 把叶子值连接到路径后面
        if (label) {
          arr.push(label + '[' + tree[i].label + ']=' + tree[i].val)
        } else {
          arr.push(tree[i].label + '=' + tree[i].val)
        }
      }
    }
  }
  path(tree)
  return arr
}

function URLParams (obj, encode) {
  if (typeof obj === 'object' && !isOriginObject(obj) && !isArr(obj)) {
    var paths = ObjTreePaths(ObjTree(obj))
    var qs = paths.join('&')
    return encode ? encodeURI(qs) : qs
  }
  return ''
}

export default {
  url: (url, obj, isEncode) => {
    var params = URLParams(obj, isEncode)
    if (url.indexOf('?') > -1) {
      var uri = url.split('?')
      return params ? (url.replace(/&$/, '') + (uri[1] ? '&' : '') + params) : url
    } else {
      return params ? url + '?' + params : url
    }
  },
  stringify: (obj, isEncode) => {
    return URLParams(obj, isEncode)
  }
}
