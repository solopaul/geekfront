export function compare(property, asc) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    if (asc == true) {
      // 升序排列
      return value1 - value2;
    } else {
      // 降序排列
      return value2 - value1;
    }
  }
}