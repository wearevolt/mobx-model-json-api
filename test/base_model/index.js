import { expect } from 'chai';
import BaseModel from '../../src/base_model';
import isFunction from 'mobx-model/node_modules/lodash/isFunction';


describe('BaseModel', () => {

  beforeEach(function () {
  });

  afterEach(function() {
  });

  it("should have class action `set`", function() {
    expect(isFunction(BaseModel.__setToBaseModel)).to.equal(true);
    expect(isFunction(BaseModel.set)).to.equal(true);
  });

  it("should have action `set`", function() {
    expect(isFunction(BaseModel.prototype.__setToBaseModel)).to.equal(true);
    expect(isFunction(BaseModel.prototype.set)).to.equal(true);
  });

});
