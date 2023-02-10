/**
 * 根据label字段，获取content字段的值
 */
module.exports = parseAccessory = (label, arr) => {
  let ret = "";
  arr.map((item) => {
    if (item?.label === label) {
      ret = item?.content;
    }
  });
  return ret;
};
