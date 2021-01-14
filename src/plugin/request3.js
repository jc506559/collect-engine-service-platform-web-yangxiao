import axios from 'axios'

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
		console.log("session已失效，但是还没有做任何动作")
		// @特殊处理 阻止到登录页面之前, 需要记录最后的访问页面
		// if (vm.$route.fullPath !== '/login') {
		// 	vm.$localStore.set("before_403_path", vm.$route.fullPath);
		// }
		// vm.$localStore.remove("user");
		// vm.$localStore.remove("permission");
		// vm.$router.push('/login');
		vm.$router.push({name: 'login'});
		console.log("session已失效，应返回至登录界面");
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
	// other
	else {
		throw new Error(status || data.message || 'request.js other error');
		// return data;
	}
}

export default {
	install: function (Vue) {
		Vue.prototype.$request3 = function (url, config) {

			// 指定浏览器前缀
			const apiPrefix = '/DataType';

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

				return data;

			}).catch((response) => {

				if (response instanceof Error) {
					console.log(response.message);
					let split = response.message.split(', ');
					let code = split[0].split('=')[1];
					let message = split[1].split('=')[1];
					console.error(code, message)
					throw new Error(message, code)
				}

				// 根据响应的状态码返回不同消息
				return parseStatusCode(this, {}, response.response && response.response.status);
			})
			// chrome 67 支持
			// .finally(() => {
			// })
		}
		Vue.prototype.$get3 = function (url, config) {
			config = Object.assign({}, config, { method: 'get' });
			return this.$request3(url, config)
		};
		Vue.prototype.$post3 = function (url, config) {
			config = Object.assign({}, config, { method: 'post' })
			return this.$request3(url, config)
		}
	}
}
