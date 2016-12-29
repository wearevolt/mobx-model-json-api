import { expect } from 'chai';
import BaseModel from '../../lib/base_model';
import isFunction from 'mobx-model/node_modules/lodash/isFunction';


class TestModel extends BaseModel {

  static attributes = {
    name: '',
    aliases: null,
  };

}

const models = { TestModel };


BaseModel.getModel = function(modelName) {
  return models[modelName];
};


describe('BaseModel', () => {

  it("should have class action `set`", function() {
    expect(isFunction(BaseModel.set)).to.equal(true);
    expect(isFunction(BaseModel.setByBody)).to.equal(true);
  });

  it("should have method `set`", function() {
    expect(isFunction(BaseModel.prototype.set)).to.equal(true);
    expect(isFunction(BaseModel.prototype.setByBody)).to.equal(true);
  });

  describe('Class extended by BaseModel', () => {

    it("should have method `setByBody`", function() {
      expect(isFunction(TestModel.setByBody)).to.equal(true);
    });

  });

});

