var rf = require("fs");
var fs = require("fs");
var data = rf.readFileSync("./input/question.txt", "utf-8");
// var person = data.toString(); //将二进制的数据转换为字符串
// var dataJson = JSON.parse(person); //将字符串转换为json对象
var body = data;

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

let regQuetsionText = /\[\/*p\]/g;

body.map((quetsion) => {
  let quetsionTextRaw = quetsion.content; //题干英文
  let questionChineseRaw = quetsion?.accessories[2]?.translation; //题干中文
  let questionOptions = quetsion?.accessories[0]?.options; //题目选项英文
  let questionOptionsChineseRaw = quetsion?.accessories[3]?.choiceTranslations;
  let questionOptionsChineseUnit = []; //题目选项中文
  let correctAnswer = quetsion?.correctAnswer?.choice; //正确选项
  let quetsionIndex = quetsion.paperQuestionIndex; //题目的编号

  for (let item in questionOptionsChineseRaw) {
    questionOptionsChineseUnit.push(
      questionOptionsChineseRaw[item][0]?.translation
    );
  }

  let quetsionText = quetsionTextRaw
    .replace(regQuetsionText, "")
    .replace(/\[i\]/g, "<i>")
    .replace(/\[\/i\]/g, "</i>");
  let questionChinese = questionChineseRaw.replace(regQuetsionText, "");

  quetsionEnglishArr.push(quetsionText);
  quetsionChineseArr.push(questionChinese);
  optionsArr.push(questionOptions);
  optionsArrChinese.push(questionOptionsChineseUnit);
  correctAnswerArr.push(correctAnswer);
  questionIndexArr.push(quetsionIndex);
});

//文章的简介
passageAbstract = body[0].material?.accessories[0].content?.replace(
  regQuetsionText,
  ""
);

//重点单词
importantWord = body[0].material?.accessories[1].content;
importantWord = importantWord.replace(regQuetsionText, "\n");
importantWord = importantWord.split("\n").filter((item) => {
  return item;
});

fs.writeFile(
  "./output/题干英文.txt",
  JSON.stringify(quetsionEnglishArr),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
fs.writeFile(
  "./output/题干中文.txt",
  JSON.stringify(quetsionChineseArr),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
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
fs.writeFile(
  "./output/文章简介（材料分析）.txt",
  JSON.stringify(passageAbstract),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
fs.writeFile(
  "./output/重点单词.txt",
  JSON.stringify(importantWord),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);

//文章的中文和英文
passageText = body[0].material?.content;
const getEnglishText = (rawText) => {
  //删除文本中所有的[p]
  let text = rawText.split("[/p]");
  //数组中每一个元素都是该段落的中文+英文
  let textDeleteP = text.map((item) => {
    return item.replace("[p]", "");
  });

  //数组中每一个元素是该段落的英文
  let paragraphEnglish = textDeleteP.map((item) => {
    return item.split("[trans]")?.[0];
  });

  let wholeEnglish = [];
  //以英文句号为分隔符，但不删除英文句号
  paragraphEnglish.map((item) => {
    wholeEnglish = [...wholeEnglish, ...item.split(/(?<=\.)/g), "<br></br>"];
  });

  //去除数组中的空元素 ''
  let wholeEnglishWithoutnull = wholeEnglish.filter((item, index) => {
    return item;
  });

  //把每个英文句子的首位空格去掉
  wholeEnglishWithoutnull = wholeEnglish.map((item, index) => {
    return item.trim();
  });

  //把英文句子里的[phrase]换成<em>
  let regPhraseClose = /\[\/phrase\]/g;
  wholeEnglishWithoutnull = wholeEnglishWithoutnull.map((item, index) => {
    return item.replace(regPhraseClose, "</em>");
  });
  let regPhrase = /\[phrase=\d*\]/g;
  wholeEnglishWithoutnull = wholeEnglishWithoutnull.map((item, index) => {
    return item.replace(regPhrase, "<em>");
  });

  //数组中每一个元素是该段落的中文
  let paragraphChineseRaw = textDeleteP.map((item) => {
    return item.split("[trans]")?.[1];
  });

  //把中文里的[u] [/u] [/trans] (51) (51-2)全部去掉
  let regUTransBrackets = /(\[(\/)*u\])|(\[\/trans\])|(（\d*\-*\d*）)/g;
  let paragraphChineseWithoutBrackets = paragraphChineseRaw.map((item) => {
    if (item) return item.replace(regUTransBrackets, "");
  });

  let wholeChinese = [];
  paragraphChineseWithoutBrackets.map((item) => {
    if (item)
      wholeChinese = [...wholeChinese, ...item.split("。"), "<br></br>"];
  });
  let wholeChineseWithoutnull = wholeChinese.filter((item) => {
    return item;
  });

  //提取中文文本，方法同上，但是得保留题目序号（该翻译文本在交卷后出现）
  //第一步，把[/trans]去掉
  let regTranlsation = /\[\/trans\]/g;
  let translationText = paragraphChineseRaw.map((item) => {
    if (item) return item.replace(regTranlsation, "");
  });
  //第二步，把[u]换成<u>,把[/u]换成</u>
  let regUOpen = /\[/g;
  let regUClose = /\]/g;
  translationText = translationText.map((item) => {
    if (item) return item.replace(regUOpen, "<");
  });
  translationText = translationText.map((item) => {
    if (item) return item.replace(regUClose, ">");
  });
  translationText = translationText.filter((item) => {
    return item;
  });
  //translationText数组中每个元素是一个自然段，自然段之间加上br换行
  let translationTextChangeline = [];
  translationText.map((item) => {
    translationTextChangeline.push(item);
    translationTextChangeline.push("<br />");
  });

  fs.writeFile(
    "./output/chinese_english.txt",
    JSON.stringify(wholeChineseWithoutnull),
    function (err) {
      if (err) {
        return console.error(err);
      }
      console.log("数据写入成功！");
      console.log("--------我是分割线-------------");
      console.log("读取写入的数据！");
    }
  );
  fs.appendFile(
    "./output/chinese_english.txt",
    JSON.stringify(wholeEnglishWithoutnull),
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
    "./output/translationText.txt",
    JSON.stringify(translationTextChangeline),
    function (err) {
      if (err) {
        return console.error(err);
      }
      console.log("数据写入成功！");
      console.log("--------我是分割线-------------");
      console.log("读取写入的数据！");
    }
  );
};
getEnglishText(passageText);
