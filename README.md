# Mobx-model JSON API [![npm version](https://badge.fury.io/js/mobx-model-json-api.svg)](https://badge.fury.io/js/mobx-model-json-api)

This library is wrapper on [mobx-model](https://github.com/wearevolt/mobx-model) 
which implements [JSON API](http://jsonapi.org/format/) specification.

### Install
```
npm install mobx-model-json-api
```

### API.request
Method `API.request(options)` accept following options: 

* `endpoint` - backend endpoint URL (string),
* `id` - model ID (number)
* `params` - additional parameters for fetching data: pagination, filtration, includes and field names (object)
* `link` - direct url with query params. Use instead `endpoint`, `id` and `params` options (string).
* `onSuccess(body)` - callback for success server response. Argument `body` contain response body object (function). 
* `onError(err)` - callback for error server response. Argument `err` contain response body object with error data (function).

Method `API.request` return [Bluebird promise](http://bluebirdjs.com/docs/api-reference.html) with server response.

### Use option `params` in API.request
For fetching inclusion of related resources.
```
AnMobxModel.fetch({
      id,
      params:{
        include: ['user', 'reported_by'],
      }
    })
```
For fetching inclusion of sparse fieldsets.
```
AnMobxModel.fetch({
      id,
      params:{
        include: 'author',
        fields: {
          articles: ['title', 'body'],
          people: 'name'
        }
      }
    })
```
For fetching sorted data.
```
AnMobxModel.fetch({
      id,
      params:{
        sort: 'age',
      }
    })
```
For fetching paginated data.
```
AnMobxModel.fetch({
      id,
      params:{
        page: {
          number: 1
          size: 20
        }
      }
    })
```

### Example action to fetch JSON API data to model
For setting data from backend using JSON API use method `.setByBody()`;
```
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
```

### Common RESTful methods
Module already have common RESTful actions:
* BaseModel.fetch({ id, params })
* BaseModel.create(attributes)
* model.update(attributes)
* model.destroy()


### Issues

Have a bug? Please create an issue here on GitHub!

[https://github.com/wearevolt/mobx-model-json-api/issues](https://github.com/wearevolt/mobx-model-json-api/issues)

### License

MIT 