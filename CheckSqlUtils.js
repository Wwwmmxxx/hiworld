// 做这个函数的目的:
// 对于我们开发者而言做这样的函数 , 应该满足以下两种条件中的任意一种:
// 1. 在程序执行中,检查Sql语句部分的代码,如果有问题直接终止程序 => 直接return.
// 针对一个问题的衍生
// 2. 在程序执行前,直接将Sql语句部分的代码,单独检查该部分是否有问题.


// 不建议使用的原因:
// 1.针对条件1无法实现的原因:
// 1.1 会破坏他人的代码结构,相当于所有涉及到插入语句的LogicDesigner都需要引入下方的函数
// 1.2 原生的LogicDesigner自带调试功能 , 足以支持调试的需要
// 1.2(补充) 使用原生LogicDesigner的另一个原因时:需要判定的要素过多,比如有的元素为数值型那么该元素本身是不需要单引号的,单独通过JS又无法判定它究竟是否需要单引号的问题.

// 2.针对条件2无法实现的原因:
// 2.1 包含Sql语句的代码部分中含有未定义的变量,会导致检查程序不通过,js不支持编译时赋值

var insertSql = "insert into table1 ('column1','column2') values ('value1','value2')";

let checkFlag = checkInsertSql(insertSql);

/**
 * @param {*} insertSql 检查的插入语句
 * 方法: 通过栈的形式,取得字段并确认两边是否有'
 */
function checkInsertSql(inputInsertSql) {
  let insertSql = inputInsertSql;
  // 将字符串去处前后空格 , 并去除多余空格 , 转为全部大写
  let insertSqlWithTrim = ((insertSql.trim()).replace(/\s+/g, ' ')).toUpperCase();
  const insertSqlStartWith = "INSERT INTO"
  if (insertSqlWithTrim.startsWith(insertSqlStartWith)) {
    // 如果是Insert语句
    let stack = [];
    for (let i = 0; i < insertSqlWithTrim.length; i++) {
      if (insertSqlWithTrim[i] === ',' || insertSqlWithTrim[i] === ')') {
        // 当遇到,或者)时,向前寻找逗号或者(时,出栈
        let str = "";
        while (stack.length !== 0) {
          if (stack[stack.length - 1] !== ',' && stack[stack.length - 1] !== '(') {
            str = stack.pop() + str;
          } else {
            break;
          }
        }
        if (stack.length === 0) {
          // 如果栈的长度为0,那么说明找到了最顶端,则表明缺省符号
          return false;
        }
        if (
          (str.startsWith("'") && !str.endsWith("'")) ||
          (!str.startsWith("'") && str.endsWith("'"))
          ){
          // 只有一个单引号开头或结尾时
          return false;
        }
      }
      // 压栈
      stack.push(insertSqlWithTrim[i]);
    }
  } else {
    // 如果不是Insert语句
    return false;
  }
}