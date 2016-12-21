import { expect } from 'chai';
import BaseModel from '../../src/base_model';


const testBody = {
  data: {
    id: 68,
    type: "product_brands",
    attributes: {
      name: "nike",
      aliases: ["nike", 1917, "FooBar"],
    },
  }
};


class TestModel extends BaseModel {

  static attributes = {
    name: '',
    aliases: null,
  };

  static relations = [];

}

const models = { TestModel };


BaseModel.getModel = function(modelName) {
  return models[modelName];
};


describe('Issue #1 Incorrect set value into array typed attribute', () => {

  it("attribute should have same value which set", function() {
    TestModel.setByBody(testBody);
    const testModel = TestModel.get(68);

    expect(!!testModel).to.equal(true);
    expect(testModel.aliases.slice()).to.equal(testBody.data.attributes.aliases);

    console.log('--->', brandModel.aliases.slice());
  });

});
