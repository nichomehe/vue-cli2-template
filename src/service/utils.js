/**
 * 获取IOS版本号
 */
export const get_ios_version = ()=>{
  let ua = navigator.userAgent.toLowerCase();
  let version = 0;
  if (ua.indexOf("like mac os x") > 0) {
      let reg = /os [\d._]+/gi;
      let v_info = ua.match(reg);
      version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号9.3.2或者9.0
      version = parseInt(version.split('.')[0]); // 得到版本号第一位
  }
  return version;
}
/**
 * 获取安卓版本号
 */
export const get_android_version = ()=>{
  let ua = navigator.userAgent.toLowerCase();
  let version = 0;
  if (ua.indexOf("android") > 0) {
      let reg = /android [\d._]+/gi;
      let v_info = ua.match(reg);
      version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号4.2.2
      version = parseInt(version.split('.')[0]);// 得到版本号第一位
  }
  return version;
}

/**
 * 获取手机型号
 */
export const get_phone_model = ()=>{
  let agent =navigator.userAgent;
  let phone_model = '';
  if(agent.indexOf('Mac OS X') > -1){
    phone_model = (screen.width == 375 && screen.height == 812)?'iphoneX':'iphone' ;
  } else if(agent.indexOf('Android') > -1){
    let thrStr = agent.split(';')[2];
    let spaceIndex = thrStr.indexOf('Build');
    phone_model = thrStr.substring(0,spaceIndex).trim();
  }
  return phone_model;
}


/**
 * 获取cookie
 */
export const getCookie = (name)=>{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)){
    return unescape(arr[2]); 
  }else{
    return null;
  }
}
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content == 'object') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(`${prefix}+${name}`, content);
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(`${prefix}+${name}`);
}
/**
 * 存储sessionStorage
 */
export const setSessionStore = (name, content) => {
  if (!name) return;
  if (typeof content == 'object') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(`${prefix}+${name}`, content);
}

/**
 * 获取sessionStorage
 */
export const getSessionStore = name => {
  if (!name) return;
  return window.sessionStorage.getItem(`${prefix}+${name}`);
}

/**
 * 删除空参数
 */
export const filterData = (data) => {
  if (data) {
    for (const key in data) {
      const val = data[key];
      if ((typeof val === 'undefined') || val === '' || val === null) {
        delete data[key];
      }
    }
    return data;
  }
}
/**
 * 获取url后全部参数
 */
export const getUrlParams = (url) => (url.match(/([^?=&]+)(=([^&]*))/g) || [])
  .reduce((a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {});
/**
 * 时间定时器
 */
export const TimerUtils = (() => {
  let _timer, _func, _interval;
  return {
    init: function (func, interval) {
      _func = func;
      _interval = interval;
      return this;
    },
    start: function () {
      _timer = setInterval(_func, _interval);
      return this;
    },
    stop: function () {
      if (_timer) {
        clearInterval(_timer);
        _timer = null;
      }
      return this;
    }
  };
})
// 对象深拷贝
export function deepClone(source){
  if(!source || typeof source !== 'object'){
    throw new Error('error arguments', 'shallowClone');
  }
  var targetObj = source.constructor === Array ? [] : {};
  for(var keys in source){
     if(source.hasOwnProperty(keys)){
        if(source[keys] && typeof source[keys] === 'object'){
          targetObj[keys] = source[keys].constructor === Array ? [] : {};
          targetObj[keys] = deepClone(source[keys]);
        }else{
          targetObj[keys] = source[keys];
        }
     } 
  }
  return targetObj;
}

// 判断手机号格式
export function checkMobile (mobile) {
  let reg = /^1[3|4|5|7|8|6|9]\d{9}$/
  if (reg.test(mobile)) {
    return true
  } else {
    return false
  }
}

// 判断密码格式
export let checkPassword  = (password) => {
  let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
  if (reg.test(password)) {
    return true
  } else {
    return false
  }
}

// 判断身份证号格式
export let checkIdCard = (idCard) => {
  let patten1 = '^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$'
  let patten2 = '^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|x|X)$'

  if (new RegExp(patten1).test(idCard) || new RegExp(patten2).test(idCard)) {
    return true
  } else {
    return false
  }
}

/** 
 *  判断某个元素是否含有某个class
 */
 export const hasClass = (()=>{
  let div = document.createElement("div") ;
  if( "classList" in div && typeof div.classList.contains === "function" ) {
      return function(elem, className){
          return elem.classList.contains(className) ;
      } ;
  } else {
      return function(elem, className){
          let classes = elem.className.split(/\s+/);
          return !classes.every(item=>{
            return !(classes[i] === className)
          })
      } ;
  }
 })()

 // removeClass
 export const removeClass = (elements,cName )=>{
  if( hasClass( elements,cName ) ){  
    elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " );
  };  
 }

 // addClass
 export const addClass = (elements,cName )=>{
  if( !hasClass( elements,cName ) ){  
    elements.className += " " + cName;  
  }; 
 }

 /**
  * 获取指定class的最近父节点
  */
export const getParentsByClass = (element, className)=>{
  let returnParentElement = null;
  function getParentNode(element, className) {
    if(element && hasClass(element,className) && element.tagName.toLowerCase() != "body") {
      returnParentElement = element;
    } else if(element && element.parentElement) {
      getParentNode(element.parentElement, className);
    }
  }
  getParentNode(element, className);
  return returnParentElement;
}
/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop;
  } else if (element.currentStyle) {
    target = element.currentStyle[attr];
  } else {
    target = document.defaultView.getComputedStyle(element, null)[attr];
  }
  //  在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode === 'float' ? parseFloat(target) : parseFloat(target);
}

/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画duration
 */
export const animate = (element, target,  duration = 400, mode = 'ease-out', callback) => {
  clearInterval(element.timer);

  //判断不同参数的情况
  if (duration instanceof Function) {
    callback = duration;
    duration = 400;
  } else if (duration instanceof String) {
    mode = duration;
    duration = 400;
  }

  //判断不同参数的情况
  if (mode instanceof Function) {
    callback = mode;
    mode = 'ease-out';
  }

  //获取dom样式
  const attrStyle = attr => {
    if (attr === "opacity") {
      return Math.round(getStyle(element, attr, 'float') * 100);
    } else {
      return getStyle(element, attr);
    }
  }
  //根字体大小，需要从此将 rem 改成 px 进行运算
  const rootSize = parseFloat(document.documentElement.style.fontSize);

  const unit = {};
  const initState = {};

  //获取目标属性单位和初始样式值
  Object.keys(target).forEach(attr => {
    if (/[^\d^\.]+/gi.test(target[attr])) {
      unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
    } else {
      unit[attr] = 'px';
    }
    initState[attr] = attrStyle(attr);
  });

  //去掉传入的后缀单位
  Object.keys(target).forEach(attr => {
    if (unit[attr] == 'rem') {
      target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
    } else {
      target[attr] = parseInt(target[attr]);
    }
  });

  let flag = true; //假设所有运动到达终点
  const remberSpeed = {};//记录上一个速度值,在ease-in模式下需要用到
  element.timer = setInterval(() => {
    Object.keys(target).forEach(attr => {
      let iSpeed = 0;  //步长
      let status = false; //是否仍需运动
      let iCurrent = attrStyle(attr) || 0; //当前元素属性址
      let speedBase = 0; //目标点需要减去的基础值，三种运动状态的值都不同
      let intervalTime; //将目标值分为多少步执行，数值越大，步长越小，运动时间越长
      switch (mode) {
        case 'ease-out':
          speedBase = iCurrent;
          intervalTime = duration * 5 / 400;
          break;
        case 'linear':
          speedBase = initState[attr];
          intervalTime = duration * 20 / 400;
          break;
        case 'ease-in':
          let oldspeed = remberSpeed[attr] || 0;
          iSpeed = oldspeed + (target[attr] - initState[attr]) / duration;
          remberSpeed[attr] = iSpeed
          break;
        default:
          speedBase = iCurrent;
          intervalTime = duration * 5 / 400;
      }
      if (mode !== 'ease-in') {
        iSpeed = (target[attr] - speedBase) / intervalTime;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
      }
      //判断是否达步长之内的误差距离，如果到达说明到达目标点
      switch (mode) {
        case 'ease-out':
          status = iCurrent != target[attr];
          break;
        case 'linear':
          status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
          break;
        case 'ease-in':
          status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
          break;
        default:
          status = iCurrent != target[attr];
      }

      if (status) {
        flag = false;
        //opacity 和 scrollTop 需要特殊处理
        if (attr === "opacity") {
          element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
          element.style.opacity = (iCurrent + iSpeed) / 100;
        } else if (attr === 'scrollTop') {
          element.scrollTop = iCurrent + iSpeed;
        } else {
          element.style[attr] = iCurrent + iSpeed + 'px';
        }
      } else {
        flag = true;
      }
      if (flag) {
        clearInterval(element.timer);
        if (callback) {
          callback();
        }
      }
    })
  }, 20);
}


/**
* 倒计时
*/
export const intervalTimer = (endTime) => {
  let timeObj = {
    days:null,
    hours:null,
    minutes:null,
    seconds:null
  }
  let nowTime = new Date
  let leftTime = new Date(endTime) - nowTime  //距离结束 剩余时间
  if(leftTime < 0){
    return timeObj
  }
  //时间戳换算为具体的 天、时、分、秒
  let days = checkTime(parseInt(leftTime / 1000 / 60 / 60 / 24, 10)); //计算剩余的天数
  let hours = checkTime(parseInt(leftTime / 1000 / 60 / 60 % 24, 10)); //计算剩余的小时
  let minutes = checkTime(parseInt(leftTime / 1000 / 60 % 60, 10)); //计算剩余的分钟
  let seconds = checkTime(parseInt(leftTime / 1000 % 60, 10)); //计算剩余的秒数
  timeObj = {
    days,
    hours,
    minutes,
    seconds
  }
  return timeObj
}
export const checkTime = (i) => {
  i < 10 && (i = "0" + i)
  return i
}



