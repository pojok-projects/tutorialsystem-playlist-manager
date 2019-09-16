// List Group Data Based Key
// https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
const groupData = key => array =>
array.reduce((objectsByKeyValue, obj) => {
  const value = obj[key];
  objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
  return objectsByKeyValue;
}, {});

module.exports = {
    groupData
}