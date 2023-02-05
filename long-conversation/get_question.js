var rf = require("fs");
var fs = require("fs");
var body = rf.readFileSync("./input/question.txt", "utf-8"); //以后直接抓包页面，点击右键，open，newTab，复制过来就是body

//原body是字符串，需要转化为数组
body = JSON.parse(body);

let quetsionEnglishArr = []; //题干英文
let quetsionChineseArr = []; //题干中文
let optionsArr = []; //题目选项英文
let optionsArrChinese = []; //题目选项中文
let correctAnswerArr = []; //正确选项
let questionIndexArr = []; //题目的编号
let passageAbstract; //文章简介（材料分析）
let importantWord; //重点单词
let passageText; //文章的中文和英文
let lrc = [];

let regQuetsionText = /\[\/*p\]/g;

body.map((quetsion) => {
  //   let quetsionTextRaw = quetsion.content; //题干就是题号，听力只有题号，题干没有英文，题干没有中文(废弃，等同于quetsionIndex)
  let questionOptions = quetsion?.accessories[0]?.options; //题目选项英文
  let questionOptionsChineseRaw = quetsion?.accessories[2]?.choiceTranslations;
  let questionOptionsChineseUnit = []; //题目选项中文
  let correctAnswer = quetsion?.correctAnswer?.choice; //正确选项
  let quetsionIndex = quetsion.paperQuestionIndex; //题目的编号

  for (let item in questionOptionsChineseRaw) {
    questionOptionsChineseUnit.push(
      questionOptionsChineseRaw[item][0]?.translation
    );
  }

  optionsArr.push(questionOptions);
  optionsArrChinese.push(questionOptionsChineseUnit);
  correctAnswerArr.push(correctAnswer);
  questionIndexArr.push(quetsionIndex);
});

console.log("选项英文", optionsArr);
console.log("选项中文", optionsArrChinese);
console.log("正确答案", correctAnswerArr);
console.log("题目编号", questionIndexArr);
//文章的简介
passageAbstract = body[0].material?.accessories[1].content?.replace(
  regQuetsionText,
  ""
);

//重点单词
importantWord = body[0].material?.accessories[3].content;
importantWord = importantWord.replace(regQuetsionText, "\n");
importantWord = importantWord.split("\n").filter((item) => {
  return item;
});

//题干就是题号，听力只有题号，题干没有英文，题干没有中文(废弃，等同于quetsionIndex)
// fs.writeFile(
//   "./output/题干英文.txt",
//   JSON.stringify(quetsionEnglishArr),
//   function (err) {
//     if (err) {
//       return console.error(err);
//     }
//   }
// );
// fs.writeFile(
//   "./output/题干中文.txt",
//   JSON.stringify(quetsionChineseArr),
//   function (err) {
//     if (err) {
//       return console.error(err);
//     }
//   }
// );
fs.writeFile(
  "./output/题目选项英文.txt",
  JSON.stringify(optionsArr),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
fs.writeFile(
  "./output/题目选项中文.txt",
  JSON.stringify(optionsArrChinese),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
fs.writeFile(
  "./output/正确答案.txt",
  JSON.stringify(correctAnswerArr),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
fs.writeFile(
  "./output/题目编号.txt",
  JSON.stringify(questionIndexArr),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
// fs.writeFile(
//   "./output/文章简介（材料分析）.txt",
//   JSON.stringify(passageAbstract),
//   function (err) {
//     if (err) {
//       return console.error(err);
//     }
//   }
// );
// fs.writeFile(
//   "./output/重点单词.txt",
//   JSON.stringify(importantWord),
//   function (err) {
//     if (err) {
//       return console.error(err);
//     }
//   }
// );

let l = body[0].material?.accessories[5]?.lrcMetas
  ?.map((item, index) => {
    //第一句话是conversation2 ，并不是正文，需要去掉
    if (index !== 0) return item?.timeMs;
  })
  .filter((item) => item);
fs.writeFile("./output/time.txt", JSON.stringify(l), function (err) {
  if (err) {
    return console.error(err);
  }
});

//文章的中文和英文
let passageTextChinese = body[0].material?.accessories[0]?.translation;
let passageTextEnglish = body[0].material?.accessories[2]?.content;

const getText = (rawText, mode) => {
  let wholePure = [];
  let wholeAnswerMoreU = [];
  let wholeAnswer = [];
  //删除文本中所有的[p]
  let text = rawText.split("[/p]");

  //第一种  携带(16)(16-5)以及[u][/u]的中文数组
  let textDeleteP = text.map((item) => {
    return item.replace("[p]", "");
  });

  //把[u]换成<u>,把[/u]换成</u>
  let regUOpen = /\[/g;
  let regUClose = /\]/g;
  let textWithU = textDeleteP.map((item) => {
    if (item) return item.replace(regUOpen, "<");
  });
  textWithU = textWithU.map((item) => {
    if (item) return item.replace(regUClose, ">");
  });
  textWithU = textWithU.filter((item) => {
    return item;
  });
  console.log("textWithU", textWithU);
  //   //以句号、问号、感叹号为分隔符，但不删除
  //   textDeleteP.map((item) => {
  //     wholeAnswerMoreU = [
  //       ...wholeAnswerMoreU,
  //       ...item.split(/(?<=[\.。\!！\?？])/g),
  //       "<br></br>",
  //     ];
  //   });

  //   for (let i = 0; i < wholeAnswerMoreU.length; i++) {
  //     if (wholeAnswerMoreU[i].indexOf("[/u]") === 0) {
  //       wholeAnswer[wholeAnswer.length - 1] += "[/u]";
  //       if (
  //         wholeAnswerMoreU[i].substring(4) &&
  //         wholeAnswerMoreU[i].substring(4).length > 0
  //       ) {
  //         wholeAnswer.push(wholeAnswerMoreU[i].substring(4).trim());
  //       }
  //     } else {
  //       wholeAnswer.push(wholeAnswerMoreU[i].trim());
  //     }
  //   }
  //   for (let i = 0; i < wholeAnswer.length; i++) {
  //     //如果有正括号，但没有反括号，就在结尾补齐反括号
  //     if (
  //       wholeAnswer[i].indexOf("[u]") !== -1 &&
  //       wholeAnswer[i].indexOf("[/u]") === -1
  //     ) {
  //       wholeAnswer[i] = wholeAnswer[i] + "[/u]";
  //     }
  //     //如果有反括号，但没有正括号，就在开头补齐反括号
  //     if (
  //       wholeAnswer[i].indexOf("[/u]") !== -1 &&
  //       wholeAnswer[i].indexOf("[u]") === -1
  //     ) {
  //       wholeAnswer[i] = "[u]" + wholeAnswer[i];
  //     }
  //   }

  //第二种，不带答案提示，需要删除所有的(16)(16-5)以及[u][/u]
  let regUTransBrackets = /(\[(\/)*u\])|(\[\/trans\])|([（(]\d*\-*\d*[）)])/g;
  let paragraphChineseWithoutBrackets = textDeleteP.map((item) => {
    if (item) return item.replace(regUTransBrackets, "");
  });
  paragraphChineseWithoutBrackets.map((item) => {
    if (item) {
      wholePure = [...wholePure, ...item.split(/(?<=[\.。\!！\?？])/g)];
    }
  });
  wholePure = wholePure
    .filter((item) => item)
    .map((item) => {
      return item.trim();
    });

  if (mode === "ch") {
    fs.writeFile(
      "./output/chinese_pure.txt",
      JSON.stringify(wholePure),
      function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("数据写入成功！");
        console.log("--------我是分割线-------------");
        console.log("读取写入的数据！");
      }
    );

    fs.writeFile(
      "./output/chinese_clue.txt",
      JSON.stringify(textWithU),
      function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("数据写入成功！");
        console.log("--------我是分割线-------------");
        console.log("读取写入的数据！");
      }
    );
  }

  if (mode === "en") {
    fs.writeFile(
      "./output/english_pure.txt",
      JSON.stringify(wholePure),
      function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("数据写入成功！");
        console.log("--------我是分割线-------------");
        console.log("读取写入的数据！");
      }
    );

    fs.writeFile(
      "./output/english_clue.txt",
      JSON.stringify(textWithU),
      function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("数据写入成功！");
        console.log("--------我是分割线-------------");
        console.log("读取写入的数据！");
      }
    );
  }
};

getText(passageTextChinese, "ch");
getText(passageTextEnglish, "en");
