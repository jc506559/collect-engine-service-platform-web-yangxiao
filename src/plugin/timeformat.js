import moment from 'moment';

let format = (time) => {
		let ymd = '';
		let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1));
		let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate());
		ymd += time.getFullYear() + '-'; // 获取年份
		ymd += mouth + '-'; // 获取月份
		ymd += day; // 获取日
		return ymd; // 返回日期
	};
export const publicMethod = {

	getTimestamp(time){
		//把时间日期转成时间戳
		return (new Date(time)).getTime() / 1000
	}

}

export default {
	publicMethod,
	install: function(Vue) {
		//获取当前年月日
		Vue.prototype.$nowYearMonthDay = function () {
			let date = new Date();
			let Y = date.getFullYear(); // 年
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); // 月
			let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''; // 日
			date = Y+'-'+M+'-'+D;
			return date;
		};
		//获取当前年月日时分秒
		Vue.prototype.$nowTime = function () {
			let date = new Date();
			let Y = date.getFullYear(); // 年
			let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); // 月
			let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''; // 日
			let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 时
			let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 分
			let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 秒
			date = Y+'-'+M+'-'+D+' '+h+':'+m+":"+s;
			return date;
		};
		//获取开始、结束时间边界
		Vue.prototype.$getDateRangeStartEndFull = function(val) {
			let endMoment = moment();
			let startMoment = moment(endMoment);
			if (1 === val) {
				// 近三天
				startMoment.subtract(3, 'days').add(1, 'days');
			} else if (2 === val) {
				// 近一周
				startMoment.subtract(1, 'weeks').add(1, 'days');
			} else if (3 === val) {
				// 近一月
				startMoment.subtract(1, 'months').add(1, 'days');
			} else {
				// 近一月
				startMoment.subtract(1, 'months').add(1, 'days');
			}
			return [startMoment.format('YYYY-MM-DD HH:mm:ss'), endMoment.format('YYYY-MM-DD HH:mm:ss')];
		};
		//获取开始、结束时间的连续区间
		Vue.prototype.$getDateRangeList = function(range) {
			let result = [];
			let startMoment = moment(range[0]);
			let endMoment = moment(range[1]);
			while (!startMoment.isAfter(endMoment)) {
				result.push(startMoment.format('YYYY-MM-DD'));
				startMoment.add(1, 'days');
			}
			return result;
		};
		//获取格式化时间
		Vue.prototype.$format = function (fmt, date) {
			let ret;
			const opt = {
				"Y+": date.getFullYear().toString(),        // 年
				"M+": (date.getMonth() + 1).toString(),     // 月
				"D+": date.getDate().toString(),            // 日
				"H+": date.getHours().toString(),           // 时
				"m+": date.getMinutes().toString(),         // 分
				"s+": date.getSeconds().toString()          // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
					fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
				}
			}
			return fmt;
		}
		//获取时间

	},
}
