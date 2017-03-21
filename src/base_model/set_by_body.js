import { transaction } from 'mobx-model/node_modules/mobx';
import isArray from 'mobx-model/node_modules/lodash/isArray';
import { singularize } from 'mobx-model/node_modules/inflection';
import { BaseModel } from 'mobx-model';


function minesToLodash (str) {
  return str.replace(/-/g, '_');
}


function getModelAttributes (attributes={}) {
  return Object.keys(attributes).reduce((memo, key) => {
    memo[minesToLodash(key)] = attributes[key];
    return memo;
  }, {});
}


function getRelationAttributes (relationships={}) {
  return Object
    .keys(relationships)
    .reduce((attrs, key) => {

      const dataByKey = relationships[key].data;
      if (!dataByKey) return attrs;

      const jsonKey = minesToLodash(key);

      const isMany = isArray(dataByKey);
      if (isMany) {
        attrs[`${singularize(jsonKey)}_ids`] = dataByKey.map(data => data.id|0);
      } else {
        attrs[`${jsonKey}_id`] = dataByKey.id|0;
      }

      return attrs;
    }, {})
}


function getAttributesByData ({ id, type, attributes, relationships }) {
  const modelAttributes = getModelAttributes(attributes);
  const relationAttributes = getRelationAttributes(relationships);

  return {
    id: id|0,
    type,
    ...modelAttributes,
    ...relationAttributes,
  }
}


function normalizeDataObj(dataObj) {
  return {
    ...dataObj,
    type: minesToLodash(dataObj.type),
  }
}


function getModelsJson(dataObj) {
  return []
    .concat(dataObj)
    .map(data => getAttributesByData(normalizeDataObj(data)));
}


function getTopLevelJson(included=[]) {
  return included.reduce((json, data) => {
    const normalizedData = normalizeDataObj(data);

    const { type } = normalizedData;
    if (!json[type]) {
      json[type] = [];
    }

    json[type].push(getAttributesByData(normalizedData));

    return json;
  }, {});
}


function setModelData ({ data, included=[] }) {
  const modelsJson = getModelsJson(data);
  const topLevelJson = getTopLevelJson(included);

  transaction(() => {
    modelsJson.forEach(modelJson => {
      this.set({ modelJson, topLevelJson });
    });
  });

}


BaseModel.addClassAction('setByBody', setModelData);
BaseModel.addAction('setByBody', setModelData);
