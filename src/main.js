import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import localStore from 'store'									// 浏览器存储
import store from './store' 									  // vuex
import router from './router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import localStorageExpire from "./plugin/localStorageExpire";
import VCharts from 'v-charts'
import ECharts from 'echarts'

import Filter from './plugin/filter'
import Request from './plugin/request'
import Request2 from './plugin/request2'
import Request3 from './plugin/request3'
import timeformat from "./plugin/timeformat";
import Components from './components'
import OnlyMessage from './plugin/OnlyMsgBox'

import '@/assets/styles/reset.css'							// 重置样式
import '@/assets/styles/media.css'							// 媒体查询
import '@/assets/fonts/iconfont.css'						// 图标字体
import 'element-ui/lib/theme-chalk/index.css' 	// element-ui
import '@/assets/styles/theme.css'							// 定制element-ui
import '@/assets/styles/main.css'
import dayjs from 'dayjs'      //将时间准换成标准格式
Vue.prototype.dayjs = dayjs;
// 主样式文件

Vue.use(ElementUI, { locale, size: 'small' });
Vue.use(Filter);
Vue.use(Request);
Vue.use(Request2);
Vue.use(Request3);
Vue.use(Components);
Vue.use(localStorageExpire);
Vue.use(VCharts);
Vue.use(ECharts);
Vue.use(timeformat);
Vue.use(OnlyMessage);

// Vue.use(ElementUI, { size: 'small'}); // size用于改变组件的默认尺寸，zIndex设置弹框的初始 z-index（默认值:2000）

// 添加实例方法, 使用基于Promise的HTTP请求插件
Vue.prototype.axios = axios;
// 添加实例方法, 使用本地存储插件
Vue.prototype.localStore = localStore;
Vue.prototype.$message = OnlyMessage;

// 权限指令
let permission = '';
Vue.directive('permission', {
	bind: function (el, binding, vnode) {
		!permission && (permission = localStore.get("permission"));
		let [module, ... action] = binding.value.split('.');
		// 具备模块的权限, 并具备模块的动作权限
		// let per = permission[module];
		// if (!per || !action.some(v => per[v]) ) {
		// 	el.style = 'display:none !important';
		// }
	}
});

// 阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false;

let app = new Vue({
	router,
	store,
	render: h => h(App)
	//相当于render: function(createElement) { return createElement(App) }
}).$mount('#app');

export default app;
