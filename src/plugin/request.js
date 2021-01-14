import axios from 'axios'
import { is } from '../lib/util'

/**
 * 统一拦截错误码
 * @param vm vue实例
 * @param status 状态码
 */
let parseStatusCode = (vm, data, status) => {
	// 判断请求状态码
	if (status === 200) {
		return data.data
	}
	// 没有权限
	else if (status === 401) {
		throw new Error(status);
	}

	// Session失效
	else if (status === 403) {
		// @特殊处理 阻止到登录页面之前, 需要记录最后的访问页面
		// if (vm.$route.fullPath !== '/login') {
		// 	vm.$localStore.set("before_403_path", vm.$route.fullPath);
		// }
		// vm.$localStore.remove("user");
		// vm.$localStore.remove("permission");
		// vm.$router.push('/login');
		vm.$router.push({name: 'login'});
		throw new Error(status);
	}
	// 接口不存在
	else if (data.code === 404) {
		throw new Error(status);
	}
	// 其他异常信息
	else if (data.code === 500) {
		return data;
		//throw new Error(`code=${data.code}, message=${data.message}`);
	}
	// other 配置了路由拦截，防止无效报错，先注掉
	// else {
	// 	throw new Error(status || data.message || 'request.js other error');
	// 	// return data;
	// }
};
// 路由拦截 暂时弃用 会和页面的拦截冲突
// const clearRequest = {
// 	source: {
// 		token: null,
// 		cancel: null,
// 	}
// };
// const source = axios.CancelToken.source();
// axios.interceptors.request.use(config => {
// 	config.cancelToken = clearRequest.source.token;
// 	return config;
// }, error => {
// 	return Promise.reject(error)
// });

/**
 * 统一处理请求 __log 的情况
 * @param vm vue实例
 * @param config 请求参数配置
 */
let supportRequestParam = (vm, url, config) => {

	let data = config.data || {};
	let ignore = ['/login', '/session/check'];

	if (ignore.indexOf(url) !== -1) {
		return
	}

	// /**
	//  * 写法封装
	//  */
	// if (!data.__log) {
	// 	data.__log = {
	// 		trigger_page: vm.$route.meta.name || '',		// 触发页面
	// 		trigger_event: config.action || '',					// 触发事件
	// 	}
	// 	if (url === '/action') {
	// 		data.__log.trigger_event = ['select', 'update', 'insert', 'delete', 'export', 'import'].find(f => data[f]) || ''
	// 	}
	// }

}

export default {
	// clearRequest,
	//install 将组件注册成插件，方便使用Vue.use来全局调用
	install: function (Vue) {
		Vue.prototype.$request = function (url, config) {
			// 指定浏览器前缀
			const apiPrefix = '/api';
			// 补充套入 __log 用户操作日志相关信息
			supportRequestParam(this, url, config);

			// 请求默认配置
			config = config || {};
			config.headers = config.headers || {};
			if (!config.ignoreApiPrefix) {
				config.url = apiPrefix + url;
			} else {
				config.url = url;
			}

			return axios.request(config).then((response) => {

				// 根据响应的状态码返回不同消息
				let data = response.data;
				// 获得响应的message
				// 二进制大对象 BLOB (binary large object)
				if (config.responseType === 'blob') {
					// console.log(data.type);
					// let suffix = data.type.match(/\/(.*)$/)[1];
					// 文件导出
					let url = URL.createObjectURL(new Blob([data]));
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					link.setAttribute('download', config.fileName);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					return;
				}

				// 登录特殊处理
				if (url === '/login') {
					if (data.code === 500) {
						return data
					}
					return data.data
				}

				return parseStatusCode(this, data, data.code);

			}).catch((response) => {

				if (response instanceof Error) {
					let split = response.message.split(', ');
					let code = split[0].split('=')[1];
					let message = split[1].split('=')[1];
					console.error(code, message);
					throw new Error(message, code)
				}

				// 根据响应的状态码返回不同消息
				return parseStatusCode(this, {}, response.response && response.response.status);
			})
			// chrome 67 支持
			// .finally(() => {
			// })
		};
		Vue.prototype.$get = function (url, config) {
			config = Object.assign({}, config, { method: 'get' });
			return this.$request(url, config)
		};
		Vue.prototype.$post = function (url, config) {
			// 			// config = Object.assign({}, config, { method: 'post' }, { cancelToken: source.token });
			config = Object.assign({}, config, { method: 'post' });
			return this.$request(url, config)
		};
		Vue.prototype.$put = function (url, config) {
			config = Object.assign({}, config, { method: 'put' });
			return this.$request(url, config)
		};
		Vue.prototype.$delete = function (url, config) {
			config = Object.assign({}, config, { method: 'delete' });
			return this.$request(url, config)
		};
		Vue.prototype.$all = function (requestInfos) {
			if (!Array.isArray(requestInfos)) {
				requestInfos = [requestInfos]
			}
			return Promise.all(requestInfos.map(requestInfo => {
				if (is(String, requestInfo)) {
					requestInfo = [requestInfo]
				}
				const config = Object.assign({}, {method: 'post'}, requestInfo[1]);
				const url = requestInfo[0];
				return this.$request(url, config, true)
			}))
				.then(responses => {
					return responses
				})
				.catch((response) => {
					if (response.response.status === 401) {
						this.$router.push({
							name: 'login'
						})
					} else {
						// this.$message.error(response.response.data.message)
					}
				})
		};
	}
}
