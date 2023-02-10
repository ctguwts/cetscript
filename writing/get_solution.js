var rf = require("fs");
var fs = require("fs");
var parseAccessory = require("../utils");
var data = rf.readFileSync("./input/solution.txt", "utf-8");
// var person = data.toString(); //将二进制的数据转换为字符串
// var dataJson = JSON.parse(person); //将字符串转换为json对象
var body = data;

//原body是字符串，需要转化为数组
body = JSON.parse(body);
let question = body[0];
let regQuetsionText = /\[\/*p\]/g;

/**
 * 精彩句式
 */
let jcjs = parseAccessory("jcjs", question.solutionAccessories)
  .replace(/\[p\]/g, "<p>")
  .replace(/\[\/p\]/g, "</p>")
  .replace(/\[color=(#[0-9a-f]{6})\]/g, "<br>")
  .replace(/\[\/color\]/g, "</br>");

/**
 * 范围翻译
 */
let fwfy = parseAccessory("fwfy", question.solutionAccessories)
  .replace(/\[p\]/g, "<p>")
  .replace(/\[\/p\]/g, "</p>")
  .replace(/\[p=align:[a-z]*\]/g, "<p>");

/**
 * 亮点词汇
 */
let importantWord = parseAccessory("ldch", question.solutionAccessories);
importantWord = importantWord.replace(regQuetsionText, "\n");
importantWord = importantWord.split("\n").filter((item) => {
  return item;
});

/**
 * 参考答案
 */
let ckda = parseAccessory("reference", question.solutionAccessories)
  .replace(/\[p\]/g, "<p>")
  .replace(/\[\/p\]/g, "</p>")
  .replace(/\[p=align:[a-z]*\]/g, "<p>");

fs.writeFile("./output/精彩句式.txt", JSON.stringify(jcjs), function (err) {
  if (err) {
    return console.error(err);
  }
});

fs.writeFile("./output/范文翻译.txt", JSON.stringify(fwfy), function (err) {
  if (err) {
    return console.error(err);
  }
});

fs.writeFile(
  "./output/亮点词汇.txt",
  JSON.stringify(importantWord),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);

fs.writeFile("./output/参考答案.txt", JSON.stringify(ckda), function (err) {
  if (err) {
    return console.error(err);
  }
});
