import { expect } from 'chai';
import BaseModel from '../../src/base_model';
import isFunction from 'mobx-model/node_modules/lodash/isFunction';


describe('RESTful actions in BaseModel', () => {

  it("should have class static method `fetch`", function() {
    expect(isFunction(BaseModel.fetch)).to.equal(true);
  });

  it("should have class static method `create`", function() {
    expect(isFunction(BaseModel.create)).to.equal(true);
  });

  it("should have method `update` in prototype", function() {
    expect(isFunction(BaseModel.prototype.update)).to.equal(true);
  });

  it("should have method `destroy` in prototype", function() {
    expect(isFunction(BaseModel.prototype.destroy)).to.equal(true);
  });

});

