import { BaseModel } from 'mobx-model';


BaseModel.addClassAction('fetch', function ({ link, id, params } = {}) {
  return API.request({
    link,
    endpoint: this.urlRoot,
    id,
    params,

    onSuccess: (body) => {
      this.setByBody(body);
    },
    onError: function (err) {
      console.log('onError', err);
    }
  });
});


BaseModel.addClassAction('create', function (attributes = {}) {
  return API.request({
    method: 'post',
    params: attributes,
    endpoint: this.urlRoot,
    onSuccess: (body) => {
      this.setByBody(body);
    }
  });
});


BaseModel.addAction('update', function (attributes = {}) {
  return API.request({
    method: 'put',
    params: { id: this.id, type: attributes.type, ...attributes },
    endpoint: `${this.urlRoot}/${this.id}`,
    onSuccess: (body) => {
      this.setByBody(body);
    },
  });
});


BaseModel.addAction('destroy', function() {
  return API.request({
    method: 'del',
    endpoint: this.urlRoot,
    id: this.id,
    onSuccess: () => {
      this.onDestroy();
    }
  });
});
