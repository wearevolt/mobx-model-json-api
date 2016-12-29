import { expect } from 'chai';
import isFunction from 'mobx-model/node_modules/lodash/isFunction';

import API from '../../lib/api';


describe('config', () => {

  it("should contain config method", function() {
    expect(isFunction(API.config)).to.equal(true);
  });

  it("should contain properties from config set", function() {

    const options = {
      requestData: {
        q: 'an query string',
        page: 1
      },
      requestHeaders: {
        'X-Test-Header': 'test-header-value'
      },
      urlRoot: 'http://test.domain.com',
      superagent: () => {},
      onRequestError: () => {},
      onRequestCompleted: () => {},
    };

    API.config(options);

    expect(API.requestData).to.deep.equal(options.requestData);
    expect(API.requestHeaders).to.deep.equal(options.requestHeaders);
    expect(API.requestHeaders).to.deep.equal(options.requestHeaders);
    expect(API.urlRoot).to.equal(options.urlRoot);
    expect(API.superagent).to.equal(options.superagent);
    expect(API.onRequestError).to.equal(options.onRequestError);
    expect(API.onRequestCompleted).to.equal(options.onRequestCompleted);
  });

});
