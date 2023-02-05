var rf = require("fs");
var fs = require("fs");
var data = rf.readFileSync("./input/solution.txt", "utf-8");
// var person = data.toString(); //将二进制的数据转换为字符串
// var dataJson = JSON.parse(person); //将字符串转换为json对象
var body = data;

//原body是字符串，需要转化为数组
body = JSON.parse(body);

let solutionArr = []; //题目解析
let interferenceOption = []; //干扰项分析
let tydzArr = []; //听音重点

let regQuetsionText = /\[\/*p\]/g;

body.map((quetsion) => {
  let solution = quetsion.solution.replace(regQuetsionText, "");
  let tyzd = quetsion.solutionAccessories[0]?.content.replace(
    regQuetsionText,
    ""
  );
  let interference = quetsion.solutionAccessories[1]?.content.replace(
    regQuetsionText,
    ""
  );

  solutionArr.push(solution);
  interferenceOption.push(interference);
  tydzArr.push(tyzd);
});

//把[u]换成<u>,把[/u]换成</u>
let regUOpen = /\[/g;
let regUClose = /\]/g;
solutionArr = solutionArr.map((item) => {
  if (item) return item.replace(regUOpen, "<");
});
solutionArr = solutionArr.map((item) => {
  //删除不间断空格
  let normalItem = item?.replace(/\u00a0/g, " ");
  if (normalItem) return normalItem.replace(regUClose, ">");
});

// console.log("solution数组", solutionArr);
// console.log("干扰项数组", interferenceOption);
fs.writeFile(
  "./output/题目解析.txt",
  JSON.stringify(solutionArr),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);

fs.writeFile(
  "./output/干扰项解析.txt",
  JSON.stringify(interferenceOption),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);

fs.writeFile("./output/听音重点.txt", JSON.stringify(tydzArr), function (err) {
  if (err) {
    return console.error(err);
  }
});
