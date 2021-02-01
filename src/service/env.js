// import { getCookie } from './utils'
let agent = navigator.userAgent;
let host = location.host;

const getCookie = (name)=>{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)){
    return unescape(arr[2]); 
  }else{
    return null;
  }
}

/*
 * 环境判断
 */
export let Evn = {
  isWeChat: /MicroMessenger/i.test(agent),
  isLocal: host.indexOf('localhost') === 0 || ['192', '172', '127', '10'].indexOf(host.split('.').shift()) > -1,
  isTest: host.indexOf('test') >= 0 || host.indexOf('dev') >= 0,
  isIOS: !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  isIOS_11: /iP(ad|hone|od)/.test(agent) && /OS 11/.test(agent),
  isAndroid: agent.indexOf('Android') > -1 || agent.indexOf('Adr') > -1,
  isIphoneX: /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375),
  isMX: /MEIZU/gi.test(navigator.userAgent), // 魅族
  isFullpage:false,
  isApp: !!(getCookie('client_type') == 'ios')  //ios新版本
}