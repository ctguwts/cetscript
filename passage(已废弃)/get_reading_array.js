var fs = require("fs");
const text =
  "[p] In the coming era of budget cuts to education, distance learning could become the norm.[trans][u]（51）在即将到来的教育预算削减时代，远程教育可能会成为常态。[/u][/trans][/p][p] The temptation for those [phrase=197444]in charge of[/phrase] education budgets to trade teachers for technology could be so strong that they ignore the disadvantages of distance learning. School facilities are expensive to build and maintain, and teachers are expensive to employ. Online classes do not require buildings and each class can host hundreds of people simultaneously, [phrase=194885]resulting in[/phrase] greater savings, thus increasing the temptation of distance education for those concerned more about budgets than learning. But [phrase=201498]moving away from[/phrase] a traditional classroom in which a living, breathing human being teaches and [phrase=201257]interacts with[/phrase] students daily would be a disaster. Physically attending school has hidden benefits: [phrase=43304]getting up[/phrase] every morning, [phrase=201257]interacting with[/phrase] peers, and building relationships with teachers are essential skills to cultivate in young people. Moreover, schools should be more than simple institutions of traditional learning. They are now places that provide meals. They are places where students receive counseling and other support.[trans]对那些负责教育预算的人来说，把教师换成技术的诱惑是如此强烈，以至于他们忽视了远程学习的缺点。学校设施的建造和维护成本高昂，教师的雇佣成本也很高。在线课程不需要教学楼，而且每一节课可同时容纳数百人，从而节省了更多的资金。因此，对那些更关心预算而不是学习的人来说，远程教育的诱惑增加了。但是，从一个有活生生的、会呼吸的人每天教学并与学生互动的传统课堂中脱离出来，将是一场灾难。（52）[u]去学校上课有潜在的好处：每天早上起床、与同龄人互动、和老师建立关系是年轻人需要培养的基本技能。[/u]此外，学校应该不仅仅是简单的传统学习机构。它们现在是提供饭食的地方。它们是学生接受辅导和其他方面帮助的地方。[/trans][/p][p] Those policy-makers are often fascinated by the latest technology in education and its potential to “transform” education overnight. But online education does not allow a teacher to keep a struggling student after class and offer help. Educational videos may deliver academic content, but they are unable to make eye contact or assess a student’s level of engagement. Distance education will never match the personal teaching in a traditional classroom. In their first 18 years of life, American children spend only 9% of their time in school. Yet teachers are [phrase=198375]expected to[/phrase] prepare them to be responsible citizens, cultivate their social skills, encourage successful time management, and enhance their capacity to flourish in an increasingly harsh labor market. Given these expectations, schools should not become permanently “remote”.[trans]（53）[u]这些政策制定者经常被最新的教育技术及其在一夜之间“彻底改变”教育的潜力所吸引。但在线教育无法让老师在课后留下一个学习困难的学生，并提供帮助。教育视频可以传递学术内容，但它们无法与学生进行眼神交流，也无法评估学生的投入程度。远程教育永远无法与传统课堂上的个人教学相匹敌。[/u]在美国儿童生命的前18年里，他们只有9%的时间在学校度过。（54）[u]然而，教师被期望将他们培养成负责任的公民，培养他们的社交技能，鼓励他们成功地管理时间，并增强他们在日益严峻的劳动力市场中蓬勃发展的能力。[/u]考虑到这些期望，学校不应该变得一直“远程”。[/trans][/p][p] The power of the classroom is rooted in the humanity of the people gathered in the same place, [phrase=159508]at the same time[/phrase]. Personal teaching is about teachers showing students a higher path, and about young people [phrase=170661]going through[/phrase] the process together. Technology, no matter how advanced, should simply be a tool of a good teacher.[trans]（55）[u]课堂的力量根源于在同一地点、同一时间聚集在一起的人们的人性。个人教学是老师向学生展示一条更高远的路径，是年轻人一起经历的过程。技术，无论多么先进，都应该只是一个好老师的工具。[/u][/trans][/p]";

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
  console.log("translationText是什么", translationTextChangeline);

  // let result = [];
  // let maxlength =
  //   wholeChineseWithoutnull.length > wholeEnglishWithoutnull.length
  //     ? wholeChineseWithoutnull.length
  //     : wholeEnglishWithoutnull.length;
  // for (let i = 0; i < maxlength; i++) {
  //   result.push({
  //     chinese: wholeChineseWithoutnull[i],
  //     english: wholeEnglishWithoutnull[i],
  //   });
  // }

  // console.log(
  //   "wholeChinse是",
  //   wholeChineseWithoutnull,
  //   wholeEnglishWithoutnull
  // );

  fs.writeFile(
    "./passage/chinese_english.txt",
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
    "./passage/chinese_english.txt",
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
    "./passage/translationText.txt",
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

getEnglishText(text);
