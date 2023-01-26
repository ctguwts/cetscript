let item = "qqq.“bbbb.”cccc.";
let res = item.split(/(?<=\.(?!”))/g);
// |(?<=\.)

console.log(res);
