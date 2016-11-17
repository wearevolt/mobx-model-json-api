import isString from 'mobx-model/node_modules/lodash/isString';
import isArray from 'mobx-model/node_modules/lodash/isArray';
import isPlainObject from 'mobx-model/node_modules/lodash/isPlainObject';
import { API } from 'mobx-model/src/index';

const request = API.request;
const jsonApiHeaders = {
  'Accept': 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json',
};


function encodeParam (param) {
  return isArray(param)
    ? param.map(p => encodeURIComponent(p)).join()
    : encodeURIComponent(param);
}


function toQueryStr (params) {

  if (isString(params)) {
    return `?${params}`;
  }

  if (!isPlainObject(params)) {
    return '';
  }

  let paramsArr = Object.keys(params).map(key => {
    const param = params[key];

    if (!isPlainObject(param)) {
      return `${key}=${encodeParam(param)}`;
    }

    return Object.keys(param).map(subKey => {
      const subParam = param[subKey];

      return `${key}[${subKey}]=${encodeParam(subParam)}`;
    }).join('&');

  });

  return paramsArr.length ?  '?' + paramsArr.join('&') : '';
}


API.request = function (options = {}) {
  const {
    method = 'get',
    link,
    endpoint,
    id,
    params = {},

    onSuccess = () => {},
    onError = () => {},

    superagent
  } = options;

  const isGetMethod = /^get$/i.test(method);

  let endpointUrl = link || `${endpoint.replace(/_+/g, '-')}${id ? '/'+id : ''}`;
  let requestParams = params;

  if (isGetMethod) {
    if (!link) {
      endpointUrl += toQueryStr(params);
    }
    requestParams = undefined;
  }

  return request.call(this, {
    method,
    endpoint: endpointUrl,
    requestHeaders: { ...this.requestHeaders, ...jsonApiHeaders },
    data: requestParams,
    superagent,

    onSuccess: (res = {}) => {
      onSuccess(res.body);
    },

    onError,

  });
};


export default API;