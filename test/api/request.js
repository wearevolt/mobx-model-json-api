import { expect } from 'chai';
import isFunction from 'mobx-model/node_modules/lodash/isFunction';
import superagent from 'superagent';
import mock from 'superagent-mocker';
import API from '../../lib/api';


const API_ROOT = 'http://test.domain.com';
const RESPONSE_DATA = {
  teddy: true,
  names: ['Alex', 'Nuke'],
};

// init superagent mock
mock.timeout = 100;
mock(superagent);


mock.get(API_ROOT + '/model/:id', function(req) {
  const id = req.params.id|0;

  return {
    ok: true,
    body: {
      id,
      data: RESPONSE_DATA
    },
  }

});



describe('request', () => {

  it("should contain request method", function() {
    expect(isFunction(API.request)).to.equal(true);
  });

  describe('send', () => {

    it("should receive data", function() {
      const PARAM_ID = 21;

      API.config({
        superagent,
        requestHeaders: {
          'X-Test-Header': 'test-header-value'
        },
        urlRoot: API_ROOT,
      });

      let isSuccessCalled = false;
      API.request({
        endpoint: '/model',
        id: PARAM_ID,

        onSuccess: () => {
          isSuccessCalled = true;
        }

      }).then(res => {
        const { ok, status, body } = res;

        expect(ok).to.equal(true);
        expect(status).to.equal(200);
        expect(isSuccessCalled).to.equal(true);
        expect(body.id).to.equal(PARAM_ID);
        expect(body.data).to.equal(RESPONSE_DATA);
      });

    });

  });

});
