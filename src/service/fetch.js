
import axios from 'axios'
import {Evn} from './env'
import {filterData,setStore,getStore} from './utils';

import Qs from 'qs'
import MD5 from './md5'


let host = () => {
  let oHost = ""
  if (window.location.port) {
    oHost = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/'
  } else {
    oHost = window.location.protocol + "//" + window.location.hostname + '/'
  }
  return oHost;
}

export let ajaxHost = host ;

// 根据平台类型设置请求头
export let getHeader = () => {
  var headers = {}
  let token = getStore('token');
  if(token){
    headers.token = token;
  }
  return headers
}

/*
 * 通用ajax封装 返回Promise
 * params 参数 {url ,data, method = 'get',timeout = '1000000', header}
 */
export const fetch = (params) => {
  // 清除空参数
  filterData(params.data || {});
  return new Promise(function (resolve, reject) {
    let method = params.method ? params.method.toLowerCase() : 'get';
    let o = {
      url: host() + params.url,
      baseURL: '',
      method: method,
      timeout: params.timeout || 1000000,
      headers: params.headers || getHeader()
    }
    if (method === 'post') {
      o.data = params.data || '';
      if(!params.noUseQs){ // 默认使用QS
        o.data  = Qs.stringify(o.data);
      }
    } else {
      o.params = params.data || '';
    }
    axios(o).then((res) => {
      // cfrs安全当请求头中有token 时候请求接口的时候带过去
      if(res.headers && res.headers.token){
        setStore('token',res.headers.token);
      }
      let data = res.data;
      if(typeof data  != 'object'){
        reject('非法请求');
        return;
      }
      if(data.error == 0){
        resolve(data);
      }else{
        eject(data);
      }
    }).catch((res) => {
      reject(res);
    });
  });
}

