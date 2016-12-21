import { transaction } from 'mobx-model/node_modules/mobx';
import isArray from 'mobx-model/node_modules/lodash/isArray';
import { camelize } from 'inflection';
import { singularize } from 'mobx-model/node_modules/inflection';
import { BaseModel } from 'mobx-model';


function getAttributesByData ({ id, type, attributes, relationships={} }) {
  const relationAttrs = Object.keys(relationships).reduce((attrs, key) => {
    const keyData = relationships[key].data;
    if (!keyData) return attrs;

    const isMany = isArray(keyData);
    if (isMany) {
      attrs[`${singularize(key)}_ids`] = keyData.map(data => data.id|0);
    } else {
      attrs[`${key}_id`] = keyData.id|0;
    }

    return attrs;
  }, {});

  const camelCaseAttributes  = Object.keys(attributes).reduce((memo, attr) => {
    memo[camelize(attr, true)] = attributes[attr];
    return memo;
  }, {});

  return { id: id|0, type,  ...camelCaseAttributes, ...relationAttrs }
}


function setModelData ({ data, included=[] }) {
  const resourceObjects = [].concat(data);
  const modelsJson = resourceObjects.map(data => getAttributesByData(data));
  const topLevelJson = included.reduce((json, data) => {
    const { type } = data;

    if (!json[type]) {
      json[type] = [];
    }

    json[type].push(getAttributesByData(data));

    return json;
  }, {});

  transaction(() => {
    modelsJson.forEach(modelJson => {
      this.set({ modelJson, topLevelJson });
    });
  });

}


BaseModel.addClassAction('setByBody', setModelData);
BaseModel.addAction('setByBody', setModelData);


export default BaseModel;