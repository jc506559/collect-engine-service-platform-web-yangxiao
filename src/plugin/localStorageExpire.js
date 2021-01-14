
export default {
	install: function(Vue) {
		Vue.prototype.$setExpire = function (key, value, expire) {
			let obj = {
				data: value,
				time: Date.now(),
				expire: expire
			};
			//localStorage 设置的值不能为对象,转为json字符串
			localStorage.setItem(key, JSON.stringify(obj));
		};
		Vue.prototype.$getExpire = function (key) {
			let val = localStorage.getItem(key);
			if (!val) {
				return val;
			}
			val = JSON.parse(val);
			if (Date.now() - val.time > val.expire) {
				localStorage.removeItem(key);
				return null;
			}
			return val.data;
		}
	}
}
