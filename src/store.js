
import Vue from 'vue'
import Vuex from 'vuex'
import localStore from 'store'		// 浏览器存储

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	uploadObject: {},
    sidebarShow: true,
    navName: '',
    user: {},
		client: {},
    permission: {},
    engineRowDetail: null,
    addEngineTypeStatus: null
  },
  mutations: {
    sidebarShow (state, params) {
      state.sidebarShow = params.sidebarShow;
    },
    navName (state, params) {
      state.navName = params.navName;		// 切换导航和菜单
    },
    user (state, params) {
      localStore.set('user', params);
      state.user = params;
    },
		client (state, params) {
    	localStore.set('client',params);
    	state.client = params;
		},
    permission (state, params) {
      let permission = {};
      // 转换格式
      if (Array.isArray(params)) {
        params.forEach(v => {
          if (!permission[v.module]) {
            permission[v.module] = {}
          }
          permission[v.module][v.action] = true;
        });
      }
      localStore.set('permission', permission);
      state.permission = permission;
    },
    engineRowDetail (state, params) {
      state.engineRowDetail = params
    },
    addEngineTypeStatus (state, params) {
      state.addEngineTypeStatus = params
    }
  },
  actions: {

  },
  getters: {
  	user: (state) => {
  		return state.user || localStroe.get('user') || {}
		},
		client: (state) => {
  		return state.client || localStore.get('client') || {}
		},
    engineRowDetail: (state) => {
      return state.engineRowDetail
    },
    addEngineTypeStatus: (state) => {
      return state.addEngineTypeStatus
    }
  }
})
