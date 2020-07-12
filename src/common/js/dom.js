export function addClass(el, className) {
  el.classList.add(className)
}

export function removeClass(el, className) {
  el.classList.remove(className)
}

export function hasClass(el, className) {
  // 任意单词组、空格、空开头，再这样结尾
  let reg = new RegExp("(^|s)" + className + "(s|$)");
  return reg.test(el.className);
}

/**
 * 提供两个功能：
 *  1. 获取el 指定的attr属性
 *  2. 向el 添加指定属性和值
 * @param el
 * @param attrName
 * @param val
 */
export function getData(el, attrName, val) {
  const prefix = "data-";
  if (val) {
    return el.setAttribute(prefix + attrName, val);
  }
  return el.getAttribute(prefix + attrName);
}

/**
 * 能力检测：
 *
 */

let elementStyle = document.createElement("div").style;

let vendor = (() => {
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform"
  };
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === "standard") {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
