export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }
  console.log(`获取到的元素样式表为：`, el.className);
  let newClass = el.className.split("");
  newClass.push(className);
  el.className = newClass.join(" ");
}

export function hasClass(el, className) {
  // FIXME: 正则表达式匹配class属性
  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
  return reg.test(el.className);
}
