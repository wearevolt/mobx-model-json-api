import { expect } from 'chai';
import BaseModel from '../../lib/base_model';

/* DATA */

const testBody = {
  data: {
    id: '11111111-64b0-11e8-adc0-fa7ae01bbebc',
    type: "alpha-models",
    attributes: {
      "model-name": "Test model A 1",
      "alias-names": ["Rainbow", 1917, "FooBar"],
      "created-at": "2017-02-07T18:25:00",
    },
    relationships: {
      "betta-models": {
        data: [
          { type: "betta-models", id: '22222222-64b0-11e8-adc0-fa7ae01bbebc' },
          { type: "betta-models", id: '33333333-64b0-11e8-adc0-fa7ae01bbebc' },
        ]
      },
      "omega-model": {
        data: { type: "omega-models", id: '44444444-64b0-11e8-adc0-fa7ae01bbebc' }
      }
    }
  },
  included: [
    {
      type: "betta-models",
      id: '22222222-64b0-11e8-adc0-fa7ae01bbebc',
      attributes: {
        "model-name": "Test model BETTA 11",
        "useless-count": 42,
        "created-at": "2017-02-07T18:26:00",
      }
    },
    {
      type: "betta-models",
      id: '33333333-64b0-11e8-adc0-fa7ae01bbebc',
      attributes: {
        "model-name": "Test model BETTA 12",
        "useless-count": 43,
        "created-at": "2017-02-07T18:28:00",
      }
    },
    {
      type: "omega-models",
      id: '44444444-64b0-11e8-adc0-fa7ae01bbebc',
      attributes: {
        "model-name": "Test model OMEGA 21",
        "another-number_attr": 136,
        "created-at": "2017-02-07T18:30:00",
      }
    }
  ]
};


/* MODELS */

class AlphaModel extends BaseModel {

  static attributes = {
    modelName: '',
    aliasNames: null,
    createdAt: null
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
    createdAt: null
  };

  static relations = [
    {
      type: 'hasOne',
      relatedModel: 'AlphaModel',
      reverseRelation: true,
      createdAt: null
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

describe('Issue #13 Broke string identificators (UUID support)', () => {
  AlphaModel.setByBody(testBody);

  const testModel = AlphaModel.get('11111111-64b0-11e8-adc0-fa7ae01bbebc');

  it("attribute should have same value which set", function() {
    expect(!!testModel).to.equal(true);
    expect(testModel.modelName).to.equal(testBody.data.attributes['model-name']);
    expect(testModel.aliasNames.slice()).to.deep.equal(testBody.data.attributes['alias-names']);
    expect(testModel.createdAt).to.equal(testBody.data.attributes['created-at']);
  });

  it("HasMany relative models should have same value which set", function() {
    const bettaModels = testModel.bettaModels;

    expect(!!bettaModels).to.equal(true);

    expect(bettaModels.slice().length).to.equal(2);

    expect(bettaModels[0].id).to.equal(testBody.included[0].id);
    expect(bettaModels[0].modelName).to.equal(testBody.included[0].attributes['model-name']);
    expect(bettaModels[0].uselessCount).to.equal(testBody.included[0].attributes['useless-count']);

    expect(bettaModels[1].id).to.equal(testBody.included[1].id);
    expect(bettaModels[1].modelName).to.equal(testBody.included[1].attributes['model-name']);
    expect(bettaModels[1].uselessCount).to.equal(testBody.included[1].attributes['useless-count']);
  });

  it("HasOne relative model should have same value which set", function() {
    const omegaModel = testModel.omegaModel;
    expect(omegaModel.id).to.equal(testBody.included[2].id);
    expect(omegaModel.modelName).to.equal(testBody.included[2].attributes['model-name']);
    expect(omegaModel.anotherNumberAttr).to.equal(testBody.included[2].attributes['another-number_attr']);
  });

});
