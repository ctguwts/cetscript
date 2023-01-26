var rf = require("fs");
var fs = require("fs");
var data = rf.readFileSync("./input/solution.txt", "utf-8");
var person = data.toString(); //将二进制的数据转换为字符串
var dataJson = JSON.parse(person); //将字符串转换为json对象
var body = dataJson[0]?.res?.body;

//原body是字符串，需要转化为数组
body = JSON.parse(body);

let solutionArr = []; //题目解析

let regQuetsionText = /\[\/*p\]/g;

body.map((quetsion) => {
  let solution = quetsion.solution.replace(regQuetsionText, "");

  solutionArr.push(solution);
});

//把[u]换成<u>,把[/u]换成</u>
let regUOpen = /\[/g;
let regUClose = /\]/g;
solutionArr = solutionArr.map((item) => {
  if (item) return item.replace(regUOpen, "<");
});
solutionArr = solutionArr.map((item) => {
  if (item) return item.replace(regUClose, ">");
});

console.log("solution数组", solutionArr);

fs.writeFile(
  "./output/题目解析.txt",
  JSON.stringify(solutionArr),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
