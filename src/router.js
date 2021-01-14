import Vue from 'vue'
import store from './store'
import Router from 'vue-router'
import axios from 'axios'
import request from './plugin/request'

Vue.use(Router);

// test 测试页面
import Demo from './views/demo'
import DemoFilter from './views/demo/filter'
import DemoRequest from './views/demo/request'
import DemoChart from './views/demo/chart'
import DemoDialog from './views/demo/dialog'

// 根页面
import main from '@/views/main.vue'
import empty from '@/views/empty.vue'

// 登录
const login = resolve => require(['@/views/login/login.vue'], resolve);
//其他请求的登录
const fixedLogin = resolve => require(['@/views/login/fixedLogin.vue'], resolve);
//单点登录
const singleSignOn = resolve => require(['@/views/login/singleSignOn.vue'], resolve)

// 注册
const register = resolve => require(['@/views/register/register.vue'], resolve);

// 错误页面
const page404 = resolve => require(['@/views/common/page-404.vue'], resolve);
const page403 = resolve => require(['@/views/common/page-403.vue'], resolve);
const page500 = resolve => require(['@/views/common/page-500.vue'], resolve);

// 引擎管理
const engine_manage_engine_info = resolve => require(['@/views/engine_manage/engine_manage_engine_info/engine_manage_engine_info.vue'], resolve);
const engine_manage_engine_list = resolve => require(['@/views/engine_manage/engine_manage_engine_list/engine_manage_engine_list.vue'], resolve);
const engine_manage_auth_search = resolve => require(['@/views/engine_manage/engine_manage_auth_search/engine_manage_auth_search.vue'], resolve);
const engine_manage_label_manage = resolve => require(['@/views/engine_manage/engine_manage_label_manage/engine_manage_label_manage.vue'], resolve);
const engine_manage_engine_registered = resolve => require(['@/views/engine_manage/engine_manage_engine_registered/engine_manage_engine_registered.vue'], resolve);
// 引擎接入认证
const engine_access_auth_admins = resolve => require(['@/views/engine_access_auth/engine_access_auth_admins/engine_access_auth_admins.vue'], resolve);
const engine_access_auth_monitor = resolve => require(['@/views/engine_access_auth/engine_access_auth_monitor/engine_access_auth_monitor.vue'], resolve);

const engine_manage_baseline_engine = resolve => require(['@/views/engine_manage/engine_manage_baseline_engine/engine_manage_baseline_engine.vue'], resolve);

// 系统配置管理
const view_task_config = resolve => require(['@/views/sys_config_manage/view_task_config/view_task_config.vue'], resolve);

// 引擎故障处理
const task_failure_list = resolve => require(['@/views/engine_fault_handle/task_failure_list/task_failure_list.vue'], resolve);

// 状态监控 已弃用
const condition_monitoring = resolve => require(['@/views/condition_monitoring/condition_monitoring.vue'], resolve);
const alarm_log_extraction = resolve => require(['@/views/condition_monitoring/alarm_log_extraction/alarm_log_extraction.vue'], resolve);
const acquisition_target_monitoring = resolve => require(['@/views/condition_monitoring/acquisition_target_monitoring/acquisition_target_monitoring.vue'], resolve);
const server_monitoring_monitor = resolve => require(['@/views/condition_monitoring/server_monitoring/server_monitoring_monitor.vue'], resolve);
const server_monitoring_search = resolve => require(['@/views/condition_monitoring/server_monitoring/server_monitoring_search.vue'], resolve);
const server_monitoring_table = resolve => require(['@/views/condition_monitoring/server_monitoring/server_monitoring_table.vue'], resolve);
const server_monitoring = resolve => require(['@/views/condition_monitoring/server_monitoring/server_monitoring.vue'], resolve);
// 状态监控 | 引擎状态
const engine_status = resolve => require(['@/views/condition_monitoring/engine_status/engine_status.vue'], resolve);
// 状态监控 | 平台状态
const platform_status = resolve => require(['@/views/condition_monitoring/platform_status/platform_status.vue'], resolve);
// 状态监控 | 目标监控
const target_monitor = resolve => require(['@/views/condition_monitoring/target_monitor/target_monitor.vue'], resolve);
// 状态监控 | 资源状态
const assets_status = resolve => require(['@/views/condition_monitoring/assets_status/assets_status.vue'], resolve);
// 状态监控 | 异常日志
const exception_log = resolve => require(['@/views/condition_monitoring/exception_log/exception_log.vue'], resolve);


// 数据管理
const log_view_statistics = resolve => require(['@/views/log_view/log_view_statistics/log_view_statistics.vue'], resolve);
// 数据管理 | 日志管理
const log_view_log = resolve => require(['@/views/log_view/log_view_log/log_view_log.vue'], resolve);
// 数据管理 | 数据管理
const log_view_audit = resolve => require(['@/views/log_view/log_view_audit/log_view_audit.vue'], resolve);
// 数据管理 | 规则管理
const log_view_configuration = resolve => require(['@/views/log_view/log_view_configuration/log_view_configuration.vue'], resolve);
// 数据管理 | 规则管理
const log_view_regulation_manage = resolve => require(['@/views/log_view/log_view_regulation_manage/log_view_regulation_manage.vue'], resolve);

// 系统初始化
const sys_initialization = resolve => require(['@/views/sys_initialization/sys_initialization.vue'], resolve);
// 规则模版
const sys_rule_template = resolve => require(['@/views/sys_initialization/sys_rule_template.vue'], resolve);
// 管理中心
const user_manage = resolve => require(['@/views/manage_center/user_manage/user_manage.vue'], resolve);
const user = resolve => require(['@/views/manage_center/user_manage/user.vue'], resolve);
const role = resolve => require(['@/views/manage_center/user_manage/role.vue'], resolve);
const audit_log = resolve => require(['@/views/manage_center/audit_log/audit_log.vue'], resolve);


// 引擎管理
const engine_manage_list = resolve => require(['@/views/engine_manage/engine_manage_list/engine_manage_list.vue'], resolve);

const router = new Router({
		//去掉地址栏中的hash符号
		mode: "history",
    routes: [{
        path: '/',
        redirect: '/login',
        name: '/'
    },
    {
        path: '/',
        redirect: '/register',
        name: 'register'
    },
    {
        path: '/main',
        name: 'main',
        component: main,
        children: [{
            path: '/',
            redirect: 'engine_manage',
        },
					// 注册引擎
					{
						path: 'engine_manage',
						name: 'engine_manage',
						component: empty,
						meta: {name: '引擎管理'},
						children: [
							{
								path: '/',
								redirect: 'engine_manage_engine_list',
							},
							{
								path: 'engine_manage_engine_info',
								name: 'engine_manage_engine_info',
								component: engine_manage_engine_info,
								meta: {name: '引擎注册'},
							},

							{
								path: 'engine_manage_engine_list',
								name: 'engine_manage_engine_list',
								component: engine_manage_engine_list,
								meta: {name: '引擎列表'},
							},
							{
								path: 'engine_manage_auth_search',
								name: 'engine_manage_auth_search',
								component: engine_manage_auth_search,
								meta: {name: '认证查询'},
							},
							{
								path: 'engine_manage_label_manage',
								name: 'engine_manage_label_manage',
								component: engine_manage_label_manage,
								meta: {name: '标签管理'},
							},
							//新增加注册流程页面
							{
								path: 'engine_manage_engine_registered',
								name: 'engine_manage_engine_registered',
								component: engine_manage_engine_registered,
								meta: {name: '注册流程'},
							},
							// {
							// 	path: 'engine_manage_baseline_engine',
							// 	name: 'engine_manage_baseline_engine',
							// 	// component: engine_manage_baseline_engine,
							// 	meta: {name: '基线引擎列表'},}

						]
					},
        // 引擎接入认证
        {
            path: 'engine_access_auth',
            name: 'engine_access_auth',
            component: empty,
            meta: { name: '引擎接入认证' },
            children: [{
                path: '/',
                redirect: 'engine_access_auth_search',
            },
            {
                path: 'engine_access_auth_admins',
                name: 'engine_access_auth_admins',
                component: engine_access_auth_admins,
                meta: { name: '引擎管理列表' },
            },
            {
                path: 'engine_access_auth_monitor',
                name: 'engine_access_auth_monitor',
                component: engine_access_auth_monitor,
                meta: { name: '状态监控' },
            },
            ]
        },
        // 系统配置管理
        {
            path: 'sys_config_manage',
            name: 'sys_config_manage',
            component: empty,
            meta: { name: '系统配置管理' },
            children: [{
                path: '/',
                redirect: 'view_task_config',
            },
            {
                path: 'view_task_config',
                name: 'view_task_config',
                component: view_task_config,
                meta: { name: '查看任务配置' },
            }
            ]
        },
        // 引擎故障处理
        {
            path: 'engine_fault_handle',
            name: 'engine_fault_handle',
            component: empty,
            meta: { name: '引擎故障处理' },
            children: [{
                path: '/',
                redirect: 'task_failure_list',
            },
            {
                path: 'task_failure_list',
                name: 'task_failure_list',
                component: task_failure_list,
                meta: { name: '故障列表' },
            },
            ]
        },
        // 状态监控
        {
            path: 'condition_monitoring',
            name: 'condition_monitoring',
            component: empty,
            meta: { name: '状态监控' },
            children: [
                // {
                //     path: '/',
                //     redirect: 'alarm_log_extraction',
                // },
                // {
                //     path: 'alarm_log_extraction',
                //     name: 'alarm_log_extraction',
                //     component: alarm_log_extraction,
                //     meta: { name: '告警日志提取' },
                // },
                // {
                //     path: 'acquisition_target_monitoring',
                //     name: 'acquisition_target_monitoring',
                //     component: acquisition_target_monitoring,
                //     meta: { name: '采集目标监控' },
                // },
                // {
                //     path: 'server_monitoring',
                //     name: 'server_monitoring',
                //     component: server_monitoring,
                //     meta: { name: '服务器监控' },
								// 		children: [
								// 			{
								// 				path: '/',
								// 				redirect: 'server_monitoring_monitor'
								// 			},
								// 			{
								// 				path: 'server_monitoring_monitor',
								// 				name: 'server_monitoring_monitor',
								// 				component: server_monitoring_monitor,
								// 				meta: { name: "服务器监控"},
								// 			},
								// 			{
								// 				path: 'server_monitoring_search',
								// 				name: 'server_monitoring_search',
								// 				component: server_monitoring_search,
								// 				meta: { name: "服务器查找"},
								// 			},
								// 			{
								// 				path: 'server_monitoring_table',
								// 				name: 'server_monitoring_table',
								// 				component: server_monitoring_table,
								// 				meta: { name: "服务器表"},
								// 			},
								// 		]
                // },
                {
                    path: '/',
                    redirect: 'engine_status',
                },
                {
                    path: 'engine_status',
                    name: 'engine_status',
                    component: engine_status,
                    meta: { name: '引擎状态' },
                },
                {
                    path: 'platform_status',
                    name: 'platform_status',
                    component: platform_status,
                    meta: { name: '平台状态' },
                },
                {
                    path: 'target_monitor',
                    name: 'target_monitor',
                    component: target_monitor,
                    meta: { name: '目标监控' },
                },
                {
                    path: 'assets_status',
                    name: 'assets_status',
                    component: assets_status,
                    meta: { name: '资源状态' },
                },
                {
                    path: 'exception_log',
                    name: 'exception_log',
                    component: exception_log,
                    meta: { name: '异常日志' },
                },
            ]
        },
        // 数据管理
        {
            path: 'log_view',
            name: 'log_view',
            component: empty,
            meta: { name: '数据管理' },
            children: [
                {
                    path: '/',
                    redirect: 'log_view_platform',
                },
                {
                    path: 'log_view_statistics',
                    name: 'log_view_statistics',
                    component: log_view_statistics,
                    meta: { name: '日志查看与统计' },
                },
                {
                    path: 'log_view_log',
                    name: 'log_view_log',
                    component: log_view_log,
                    meta: { name: '日志管理' },
                },
                {
                    path: 'log_view_audit',
                    name: 'log_view_audit',
                    component: log_view_audit,
                    meta: { name: '数据管理' },
                },
								{
										path: 'log_view_configuration',
										name: 'log_view_configuration',
										component: log_view_configuration,
										meta: { name: '规则管理' }
								},
							  {
							  		path: 'log_view_regulation_manage',
										name: 'log_view_regulation_manage',
										component: log_view_regulation_manage,
										meta: { name: '规则管理' }
								}
            ]
        },
        // 系统初始化
        {
							path: 'sys_initialization',
            name: 'sys_initialization',
            component:  empty,
            meta: { name: '系统配置' },
            children: [{
                path: '/',
                redirect: 'sys_initialization'
            }, {
                path: 'sys_initialization',
                name: 'sys_initialization',
                component: sys_initialization,
                meta: { name: '初始化数据入库' },
            },
							{
								path: 'sys_rule_template',
								name: 'sys_rule_template',
								component: sys_rule_template,
								meta:{ name: '规则模版' },
						}]
        },
        // 管理中心
        {
            path: 'manage_center',
            name: 'manage_center',
            component: empty,
            meta: { name: '管理中心' },
						//原本的
            // children: [
            //     {
            //         path: '/',
            //         redirect: 'user_manage',
            //     },
            //     {
            //         path: 'user_manage',
            //         name: 'user_manage',
            //         component: user_manage,
            //         meta: { name: '用户中心' },
            //     }
            // ]
            children: [
                {
                    path: '/',
                    redirect: 'user',
                },
                {
                    path: 'user',
                    name: 'user',
                    component: user,
                    meta: { name: '用户管理' },
                },
                {
                    path: 'role',
                    name: 'role',
                    component: role,
                    meta: { name: '角色权限管理' },
                },
								{
										path: 'audit_log',
										name: 'audit_log',
										component: audit_log,
										meta: { name: '操作审计' }
								}
            ]
        },
					//没写的
					// 引擎管理
					// {
					//     path: 'engine_manage',
					//     name: 'engine_manage',
					//     component: empty,
					//     meta: { name: '引擎管理' },
					//     children: [{
					//             path: '/',
					//             redirect: 'engine_manage_list',
					//         },
					//         {
					//             path: 'engine_manage_list',
					//             name: 'engine_manage_list',
					//             component: engine_manage_list,
					//             meta: { name: '引擎管理列表' },
					//         }
					//     ]
					// },
        // 引擎管理
        {
            path: 'engine_manage',
            name: 'engine_manage',
            component: empty,
            meta: { name: '引擎管理' },
            children: [{
                path: '/',
                redirect: 'engine_manage_list',
            },
            {
                path: 'engine_manage_list',
                name: 'engine_manage_list',
                component: engine_manage_list,
                meta: { name: '引擎管理列表' },
            }
            ]
        },
        ]
    },
    {
        path: '*',
        component: page404
    },
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/register',
        name: 'register',
        component: register
    },
    {
        path: '/404',
        name: 'page-404',
        component: page404
    },
    {
        path: '/403',
        name: 'page-403',
        component: page403
    },
    {
        path: '/500',
        name: 'page-500',
        component: page500
    },
		{
				path: '/fixedLogin',
				name: 'fixedLogin',
				component: fixedLogin
		},
		{
				path: '/singleSignOn',
				name: 'singleSignOn',
				component: singleSignOn
		},
    {
        path: '/demo',
        name: 'demo',
        component: Demo,
        children: [{
            path: 'filter',
            name: 'demo.filter',
            component: DemoFilter
        },
        {
            path: 'request',
            name: 'demo.request',
            component: DemoRequest
        },
        {
            path: 'chart',
            name: 'demo.chart',
            component: DemoChart
        },
        {
            path: 'dialog',
            name: 'demo.dialog',
            component: DemoDialog
        },
        ]
    },
    ]
});

// 被忽略的路由地址
const ignore = [
    '/', 'login', 'register', 'page-404', 'page-403', 'page-500','engine_manage_engine_registered',
    'demo', 'demo.filter', 'demo.request', 'demo.chart', 'demo.dialog', 'fixedLogin','singleSignOn',
	  'sys_rule_template',
]

/**
 * 主要用来拦截路由的钩子
 * @param to Route: 即将要进入的目标 路由对象
 * @param from: Route: 当前导航正要离开的路由
 * @param next: Function: 一定要调用该方法来 resolve 这个钩子
 * *个人疑问：在这个钩子中，to的属性是通过什么设置的，比如它的meta字段
 */
router.beforeEach((to, from, next) => {
    let path = to.path === '/' ? to.path : to.path.substring(1);
    let index = path.indexOf('/');
    // 控制菜单显示
    store.commit('sidebarShow', { sidebarShow: true });
    // 控制导航菜单
    store.commit('navName', { navName: index === -1 ? path : path.substring(0, index) });
    //路由拦截 暂时弃用，因为会和页面的请求拦截冲突
    // const CancelToken = axios.CancelToken;
    // request.clearRequest.source.cancel && request.clearRequest.source.cancel();
    // request.clearRequest.source = CancelToken.source();
    // 控制页面权限
    // // @特殊处理, 过滤无关路由, 可以显示的路由, 权限内的路由
    let permission = Vue.prototype.localStore.get("permission") || store.state.permission;
    let per = permission[to.name];
		// // 在被忽略的路由中没有找到将要进入的路由，则判断权限
    if (ignore.indexOf(to.name) !== -1 || to.meta.show || per && per.query) {
        next();
    } else {
        if (!to.name) {
            router.push({ name: 'page-404' });
        } else {
            router.push({ name: 'page-403' });
        }
    }
    next()
});

export default router
