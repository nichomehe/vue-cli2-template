// Promise.finally 实现

(function(){
  if (typeof Promise.prototype.done !== 'function') {
    Promise.prototype.finally = function(onFinally) {
      return this.then(
        res => Promise.resolve(onFinally(res)).then(res => res),
        err => Promise.resolve(onFinally(err)).then(err => { throw err; })
      );
    };
  };

  if (typeof Object.assign != 'function') {
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { 
        'use strict';
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
          if (nextSource != null) { 
            for (var nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  if (!Array.prototype.every){
    Array.prototype.every = function(fun /*, thisArg */){
      'use strict';
      if (this === void 0 || this === null)
        throw new TypeError();
      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== 'function')
          throw new TypeError();
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++)
      {
        if (i in t && !fun.call(thisArg, t[i], i, t))
          return false;
      }
      return true;
    };
  }

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback/*, thisArg*/) {
      var T, k;
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      if (arguments.length > 1) {
        T = arguments[1];
      }
      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }
        k++;
      }
    };
  }

})()
