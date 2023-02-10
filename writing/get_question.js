var rf = require("fs");
var fs = require("fs");
var parseAccessory = require("../utils");
var body = rf.readFileSync("./input/question.txt", "utf-8"); //以后直接抓包页面，点击右键，open，newTab，复制过来就是body

//原body是字符串，需要转化为数组
body = JSON.parse(body);
console.log("body是什么", body[0].accessories);

//写作的body是个数组，但只有1个元素
let question = body[0];
/**
 * 题干英文
 */
let quetsionTextRaw = question.content.replace(/\[/g, "<").replace(/\]/g, ">"); //题干英文
/**
 * 审题分析
 */
let stfx = parseAccessory("stfx", question.accessories)
  .replace(/\[/g, "<")
  .replace(/\]/g, ">");
/**
 * 写作提纲
 */
let xztg = parseAccessory("xztg", question.accessories)
  .replace(/\[/g, "<")
  .replace(/\]/g, ">");

fs.writeFile(
  "./output/题干英文.txt",
  JSON.stringify(quetsionTextRaw),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);

fs.writeFile("./output/审题分析.txt", JSON.stringify(stfx), function (err) {
  if (err) {
    return console.error(err);
  }
});

fs.writeFile("./output/写作提纲.txt", JSON.stringify(xztg), function (err) {
  if (err) {
    return console.error(err);
  }
});
