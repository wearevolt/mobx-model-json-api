import { expect } from 'chai';
import BaseModel from '../../lib/base_model';

/* DATA */

const testBody = {
  data: {
    id: 1,
    type: "alpha_models",
    attributes: {
      model_name: "Test model A 1",
      alias_names: ["Rainbow", 1917, "FooBar"],
    },
    relationships: {
      "betta_models": {
        data: [
          { type: "betta_models", id: 11 },
          { type: "betta_models", id: 12 },
        ]
      },
      "omega_model": {
        data: { type: "omega_models", id: 21 }
      }
    }
  },
  included: [
    {
      type: "betta_models",
      id: 11,
      attributes: {
        "model_name": "Test model BETTA 11",
        "useless_count": 42,
      }
    },
    {
      type: "betta_models",
      id: 12,
      attributes: {
        "model_name": "Test model BETTA 12",
        "useless_count": 43,
      }
    },
    {
      type: "omega_models",
      id: 21,
      attributes: {
        "model_name": "Test model OMEGA 21",
        "another_number_attr": 136,
      }
    }
  ]
};


/* MODELS */

class AlphaModel extends BaseModel {

  static attributes = {
    modelName: '',
    aliasNames: null,
  };

  static relations = [
    {
      type: 'hasMany',
      relatedModel: 'BettaModel',
      reverseRelation: true,
    },
    {
      type: 'hasOne',
      relatedModel: 'OmegaModel',
      reverseRelation: true,
    },
  ];

}

class BettaModel extends BaseModel {

  static attributes = {
    modelName: '',
    uselessCount: 0,
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'AlphaModel',
      reverseRelation: true,
    },
  ];

}

class OmegaModel extends BaseModel {

  static attributes = {
    modelName: '',
    anotherNumberAttr: 0,
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'AlphaModel',
      reverseRelation: true,
    },
  ];

}


/* INITIALIZE MODELS */

const models = { AlphaModel, BettaModel, OmegaModel };
BaseModel.getModel = function(modelName) {
  return models[modelName];
};


/* TESTS */

describe('Model relations', () => {
  AlphaModel.setByBody(testBody);
  const testModel = AlphaModel.get(1);

  it("attribute should have same value which set", function() {
    expect(!!testModel).to.equal(true);
    expect(testModel.aliasNames.slice()).to.deep.equal(testBody.data.attributes.alias_names);
  });

  it("HasMany relative models should have same value which set", function() {
    const bettaModels = testModel.bettaModels;

    expect(!!bettaModels).to.equal(true);

    expect(bettaModels.slice().length).to.equal(2);

    expect(bettaModels[0].id).to.equal(testBody.included[0].id);
    expect(bettaModels[0].modelName).to.equal(testBody.included[0].attributes['model_name']);
    expect(bettaModels[0].uselessCount).to.equal(testBody.included[0].attributes['useless_count']);

    expect(bettaModels[1].id).to.equal(testBody.included[1].id);
    expect(bettaModels[1].modelName).to.equal(testBody.included[1].attributes['model_name']);
    expect(bettaModels[1].uselessCount).to.equal(testBody.included[1].attributes['useless_count']);
  });

  it("HasOne relative model should have same value which set", function() {
    const omegaModel = testModel.omegaModel;

    expect(omegaModel.id).to.equal(testBody.included[2].id);
    expect(omegaModel.modelName).to.equal(testBody.included[2].attributes['model_name']);
    expect(omegaModel.anotherNumberAttr).to.equal(testBody.included[2].attributes['another_number_attr']);
  });

});
