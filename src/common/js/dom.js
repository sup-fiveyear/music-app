export function addClass(el, className) {
	if (hasClass(el, className)) {
		return;
	}
	let newClass = el.className.split("");
	newClass.push(className);
	el.className = newClass.join(" ");
}

export function hasClass(el, className) {
	// 任意单词组、空格、空开头，再这样结尾	
	let reg = new RegExp("(^|\s)" + className + "(\s|$)");
	return reg.test(el.className);
}
