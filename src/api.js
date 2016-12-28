import { API } from 'mobx-model';

const request = API.request;
const jsonApiHeaders = {
  'Accept': 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json',
};


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

  let endpointUrl = link || `${endpoint.replace(/_+/g, '-')}${id ? '/'+id : ''}`;

  return request.call(this, {
    method,
    endpoint: endpointUrl,
    requestHeaders: { ...this.requestHeaders, ...jsonApiHeaders },
    data: params,
    superagent,

    onSuccess: (res = {}) => {
      onSuccess(res.body);
    },

    onError,

  });
};


export default API;