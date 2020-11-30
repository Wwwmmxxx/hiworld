// 不建议使用的原因:
// 1. 使用此函数时 , 需要将完整的insert语句放入到函数中 , 而实际上我们更多使用的是变量相连接
//  1.1 由此 , 我也转变思路 , 如果能把大家写成的携带变量的SQL语句作为入参 , 能快速定位到错误 , 那么也能解决问题 . 但是由于在js中通过编译一定需要为变量赋值所以此方法不行.
// 2. 
// 3. 

/**
 * @param {*} insertSql 检查的插入语句
 * 方法: 通过括号,逗号,单引号之间的比例.
 */
function checkInsertSql(inputInsertSql,inputDataObject) {
  let insertSql = inputInsertSql;
  // 将字符串去处前后空格 , 并去除多余空格 , 转为全部大写
  let insertSqlWithTrim = ((insertSql.trim()).replace(/\s+/g, ' ')).toUpperCase();
  const insertSqlStartWith = "INSERT INTO"
  if (insertSqlWithTrim.startsWith(insertSqlStartWith)) {
    // 获取单引号在字符串中出现的次数
    let singleQuotesNum = (insertSqlWithTrim.split("'")).length - 1;
    // 获取左括号出现的次数
    let leftBracketsNum = (insertSqlWithTrim.split("(")).length - 1;
    // 获取右括号出现的次数
    let rightBracketsNum = (insertSqlWithTrim.split(")")).length - 1;
    // 获取逗号出现的次数
    let commaNum = (insertSqlWithTrim.split(",")).length - 1;
    if (leftBracketsNum + rightBracketsNum === 4) {
      // 针对 insert table ('column1','column2')的情况
      if ((commaNum + 2) * 2 !== singleQuotesNum) {
        // (逗号+2)*2 !== 单引号时
        return false;
      }
    } else if (leftBracketsNum + rightBracketsNum === 2) {
      // 针对 insert table 的情况
      if ((commaNum + 1) * 2 !== singleQuotesNum) {
        // (逗号+1)*2 !== 单引号时
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

var insertSql = "insert into table1 ('column1','column2') values ('value1','value2')";

let checkFlag = checkInsertSql(insertSql,inputDataObject);