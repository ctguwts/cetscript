var rf = require("fs");
var fs = require("fs");
var data = rf.readFileSync("./input/question.txt", "utf-8");
var person = data.toString(); //将二进制的数据转换为字符串
var dataJson = JSON.parse(person); //将字符串转换为json对象
var body = dataJson[0]?.res?.body;

//原body是字符串，需要转化为数组
body = JSON.parse(body);

// let quetsionEnglishArr = []; //题干英文
// let quetsionChineseArr = []; //题干中文
// let optionsArr = []; //题目选项英文
// let optionsArrChinese = []; //题目选项中文
// // let correctAnswerArr = []; //正确选项
// let questionIndexArr = []; //题目的编号
// let passageAbstract; //文章简介（材料分析）
// let importantWord; //重点单词
let passageText; //文章的中文和英文

let wordsArr = []; //备选单词列表
let wordsArrTranslation = []; //备选单词翻译
let correctAnswerArr = []; //正确选项
let passageAbstract = ""; //文章简介 材料分析
let questionIndexArr = []; //每道题的题号

let regQuetsionText = /\[\/*p\]/g;

body.map((quetsion) => {
  let correctAnswerNumber = quetsion.correctAnswer.choice; //题目正确选项
  let quetsionIndex = quetsion.paperQuestionIndex; //题目的编号

  correctAnswerArr.push(correctAnswerNumber);
  questionIndexArr.push(quetsionIndex);
});

//文章的中文和英文
passageText = body[0].material?.content;

//备选单词
wordsArr = body[0].accessories[0].options;
//备选单词翻译
// wordsArrTranslation = body[0].accessories[2].choiceTranslations;
for (let index in body[0].accessories[2].choiceTranslations) {
  let tmpArr = body[0].accessories[2].choiceTranslations[index];
  let oneWordArr = tmpArr.map((item, index) => {
    return `${item.label}. ${item.translation}`;
  });
  wordsArrTranslation.push(oneWordArr);
}
//文章简介 材料分析
passageAbstract = body[0].material?.accessories[0].content?.replace(
  regQuetsionText,
  ""
);
fs.writeFile("./output/备选单词.txt", JSON.stringify(wordsArr), function (err) {
  if (err) {
    return console.error(err);
  }
});
fs.writeFile(
  "./output/备选单词翻译.txt",
  JSON.stringify(wordsArrTranslation),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
fs.writeFile(
  "./output/材料分析.txt",
  JSON.stringify(passageAbstract),
  function (err) {
    if (err) {
      return console.error(err);
    }
  }
);
fs.writeFile(
  "./output/正确选项.txt",
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
    if (item && item.length > 0) {
      return item;
    }
  });

  //把每个英文句子的首位空格去掉
  wholeEnglishWithoutnull = wholeEnglishWithoutnull.map((item, index) => {
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

  //把[u]32[/u][input=type:choice,size:10,index:32][/input] 改成 <u id=32>32</u>
  //第一步 把[u]换成<u>,把[/u]换成</u>
  let regUUOpen = /\[u\]/g;
  let regUUClose = /\[\/u\]/g;
  wholeEnglishWithoutnull = wholeEnglishWithoutnull.map((item) => {
    if (item) return item.replace(regUUOpen, "<u>");
  });
  wholeEnglishWithoutnull = wholeEnglishWithoutnull.map((item) => {
    if (item) return item.replace(regUUClose, "</u>");
  });
  //第二步 给<u>加上id <u id=34>34</u>
  wholeEnglishWithoutnull = wholeEnglishWithoutnull.map((item) => {
    let newStr = item.replace(/<u>([0-9]+)<\/u>/g, "<u id=$1>$1</u>");
    return newStr;
  });
  console.log("id有没有加上去", wholeEnglishWithoutnull);

  //第三步 把input去掉 [input=type:choice,size:10,index:32][/input]
  let regInput = /\[input=type:choice,size:10,index:\d*\]\[\/input\]/g;
  wholeEnglishWithoutnull = wholeEnglishWithoutnull.map((item) => {
    if (item) return item.replace(regInput, "");
  });

  //数组中每一个元素是该段落的中文
  let paragraphChineseRaw = textDeleteP.map((item) => {
    return item.split("[trans]")?.[1];
  });

  //把中文里的[u] [/u] [/trans] (51)全部去掉
  let regUTransBrackets = /(\[(\/)*u\])|(\[\/trans\])|(（\d*）)/g;
  let paragraphChineseWithoutBrackets = paragraphChineseRaw.map((item) => {
    if (item) return item.replace(regUTransBrackets, "");
  });

  let wholeChinese = [];
  paragraphChineseWithoutBrackets.map((item) => {
    if (item)
      wholeChinese = [...wholeChinese, ...item.split("。"), "<br></br>"];
  });
  let wholeChineseWithoutnull = wholeChinese.filter((item) => {
    if (item && item.length > 0) return item;
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
