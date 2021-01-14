<template>
    <div class="sidebar">
        <!-- 一级菜单 -->
        <el-menu class="el-menu-vertical-demo menu" :collapse="!expand" :default-active="$route.path" :unique-opened="true" @open="handleOpen">
            <el-submenu :index="`${index}`" v-for="(item,index) in permissionMenu" :key="item.name">
                <template slot="title">
                    <i class="icon iconfont" :class="item.icon"></i>
                    <span>{{item.name}}</span>
                </template>
                <el-menu-item-group v-if="isChildren(item)">
                    <el-menu-item :index="`/main/${item.routerName}/${secondItem.routerName}`" v-for="(secondItem, index) in item.children" @click="activeItem(secondItem)" v-if="secondItem.show" :key="secondItem.name">
                        <template>
                            <i class="icon iconfont icon-caiji"></i>
                            {{secondItem.name}}
                        </template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    // <ul class="menu" :class="expand ? 'fat' : 'thin'">
    //         <!-- 一级菜单项 -->
    //         <li v-for="(item, index) in permissionMenu" @click.stop="activeItem(item)" class="menu-item menu-first-item" :class="{active: item.active}" v-if="item.show">
    //             <i class="icon iconfont" :class="item.icon"></i>
    //             <span class="item-text">{{item.name}}</span>
    //             <!-- 没有子菜单, 隐藏小图标 -->
    //             <i v-if="isChildren(item)" class="el-icon-caret-right"></i>

    //             <!-- 二级菜单 -->
    //             <ul v-if="isChildren(item)" class="menu sub-menu">
    //                 <!-- 二级菜单项 -->
    //                 <li v-for="(secondItem, index) in item.children" @click.stop="activeItem(secondItem)" class="menu-item" :class="{active: secondItem.active}" v-if="secondItem.show">
    //                     <span class="item-text">{{secondItem.name}}</span>
    //                     <!-- 没有子菜单, 隐藏小图标 -->
    //                     <i v-if="isChildren(secondItem)" class="el-icon-caret-right"></i>

    //                     <!-- 三级菜单 -->
    //                     <ul v-if="isChildren(secondItem)" class="menu sub-menu">
    //                         <!-- 三级菜单项 -->
    //                         <li v-for="(thirdItem, index) in secondItem.children" @click.stop="activeItem(thirdItem)" class="menu-item" :class="{active: thirdItem.active}" v-if="thirdItem.show">
    //                             <span class="item-text">{{thirdItem.name}}</span>
    //                             <!-- 没有子菜单, 隐藏小图标 -->
    //                             <!--<i v-if="isChildren(thirdItem)" class="el-icon-caret-right"></i>-->
    //                         </li>
    //                     </ul>
    //                 </li>
    //             </ul>
    //         </li>
    //     </ul>
    name: "app-sidebar",
    props: ["expand"],
    watch: {
        // 如果路由有变化，会再次执行该方法
        $route: "activeMenu"
    },
    computed: {
        permission() {
            let permission =
                this.localStore.get("permission") ||
                this.$store.state.permission;
            return permission || {};
        }
    },
    data() {
        return {
            // 被权限过滤后当前菜单
            permissionMenu: [],
            // 所有的菜单模板
            menu: {
                main: [
                    {
                        icon: "icon-guanli1",
                        name: "引擎管理",
                        routerName: "engine_manage",
                        children: [
                            {
                            icon: "icon-caiji",
                            name: "注册流程",
                            routerName: "engine_manage_engine_registered"
                            },
                            {
                                icon: "icon-caiji",
                                name: "引擎列表",
                                routerName: "engine_manage_engine_list",
                            },
                            {
                                icon: "icon-caiji",
                                name: "引擎注册",
                                routerName: "engine_manage_engine_info"
                            },
                            {
                                icon: "icon-caiji",
                                name: "认证查询",
                                routerName: "engine_manage_auth_search"
                            },
                            {
                                icon: "icon-caiji",
                                name: "标签管理",
                                routerName: "engine_manage_label_manage"
                            },

                            // {
                            //     icon: "icon-caiji",
                            //     name: "基线引擎列表",
                            //     routerName: "engine_manage_baseline_engine"
                            // },
                        ]
                    },
                    //这个是没有归类的
                    // {
                    //     icon: "icon-guanli",
                    //     name: "系统配置管理",
                    //     routerName: "view_task_config",
                    //     children: [
                    //         {
                    //             icon: "icon-caiji",
                    //             name: "查看任务配置",
                    //             routerName: "view_task_config"
                    //         }
                    //     ]
                    // },
                    {
                        icon: "icon-jiankong",
                        name: "状态监控",
                        routerName: "condition_monitoring",
                        children: [
                            {
                                icon: "icon-caiji",
                                name: "引擎状态",
                                routerName: "engine_status"
                            },
                            {
                                icon: "icon-caiji",
                                name: "平台状态",
                                routerName: "platform_status"
                            },

                            {
                                icon: "icon-caiji",
                                name: "目标监控",
                                routerName: "target_monitor"
                            },
                            {
                                icon: "icon-caiji",
                                name: "资源状态",
                                routerName: "assets_status"
                            },
                            //页面无用，但是里面代码有用
                            // {
                            //     icon: "icon-caiji",
                            //     name: "异常日志",
                            //     routerName: "exception_log"
                            // },
                        ]
                    },
                    //以后可能会加
                    // {
                    //     icon: "icon-guzhang",
                    //     name: "故障处置",
                    //     routerName: "engine_fault_handle",
                    //     children: [
                    //         {
                    //             icon: "icon-caiji",
                    //             name: "故障列表",
                    //             routerName: "task_failure_list"
                    //         }
                    //     ]
                    // },
                    {
                        icon: "icon-chakanxiangqing",
                        name: "数据管理",
                        routerName: "log_view",
                        children: [
                            // {
                            //     icon: "icon-caiji",
                            //     name: "日志查看与统计",
                            //     routerName: "log_view_statistics"
                            // },
                            {
                                icon: "icon-caiji",
                                name: "规则管理",
                                routerName: "log_view_configuration"
                            },
                            {
                                icon: "icon-caiji",
                                name: "数据查询",
                                routerName: "log_view_audit"
                            },
                            {
                                icon: "icon-caiji",
                                name: "日志管理",
                                routerName: "log_view_log"
                            },
                            // {
                            //     icon: 'icon-caiji',
                            //     name: '规则管理',
                            //     routerName: 'log_view_regulation_manage'
                            // },
                        ]
                    },
                    {
                        icon: "icon-xitong",
                        name: "系统配置",
                        routerName: "sys_initialization",
                        children: [
                            {
                                icon: "icon-caiji",
                                name: "初始化数据入库",
                                routerName:"sys_initialization"
                            },
                            {
                                icon: "icon-guize",
                                name: "规则模版",
                                routerName:"sys_rule_template"
                            }
                        ]
                    },
                    {
                        icon: "icon-guanlizhongxin",
                        name: "管理中心",
                        routerName: "manage_center",
                        children: [
                            {
                                icon: "icon-xitong",
                                name: "用户管理",
                                routerName: "user"
                            },
                            {
                                icon: "icon-xitong",
                                name: "角色权限管理",
                                routerName: "role"
                            },
                            {
                                icon: "icon-xitong",
                                name: "操作审计",
                                routerName: "audit_log"
                            }
                        ]
                    },
                ]
            }
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            this.activeItem(this.permissionMenu[key]);
        },
        // 是否有子菜单
        isChildren(item) {
            return item.children && item.children.length > 0;
        },
        // 设置菜单选中
        activeMenu() {
            let menu = JSON.parse(
                JSON.stringify(this.menu[this.$store.state.navName])
            );
            this.eachActive(menu);
            // @特殊处理, 如果子页面有访问权限, 那么文件夹的也有访问权限
            let arr = this.getPermissionRoute(
                this.$router.options.routes,
                this.permission,
                []
            );
            this.permissionMenu = this.getPermissionMenu(
                menu,
                this.permission,
                arr
            );
            // console.log(this.permissionMenu)
            // @特殊处理, 如果所有菜单都没有配置权限, 则侧边栏消失
            if (
                Array.isArray(this.permissionMenu) &&
                this.permissionMenu.length > 0 &&
                !this.permissionMenu.some(v => v.show)
            ) {
                this.$store.commit("sidebarShow", { sidebarShow: false });
            }
        },
        // 取得有访问权限的父路由
        getPermissionRoute(router, permission, arr) {
            router.forEach(item => {
                // 如果是组, 开始递归
                if (Array.isArray(item.children)) {
                    arr.concat(
                        this.getPermissionRoute(item.children, permission, arr)
                    );
                    // @特殊处理, 如果子菜单有个别有访问权限, 则组也可见
                    let show = item.children.some(v => v.meta.show);
                    !item.meta && (item.meta = {});
                    show && arr.push(item.name);
                    item.meta.show = show;
                } else {
                    // 判断单个路由是否有访问权限
                    let per = permission[item.name];
                    let show = per && per.query ? true : false;
                    !item.meta && (item.meta = {});
                    item.meta.show = show;
                    show && arr.push(item.name);
                }
            });
            // console.log(arr);
            return arr;
        },
        // 权限控制
        getPermissionMenu(menu, permission, arr) {
            menu.forEach(item => {
                let show = true;
                // 如果是组, 开始递归
                if (Array.isArray(item.children)) {
                    if (item.children.length > 0) {
                        this.getPermissionMenu(item.children, permission, arr);
                        // @特殊处理, 如果子菜单都不可见, 则组也不可见
                        show = item.children.some(v => v.show);
                    }
                } else {
                    // console.log(item.routerName);
                    // 判断是否拥有权限
                    let per = permission[item.routerName];
                    show = per && per.query ? true : false;
                }
                // @特殊处理, 如果子页面有访问权限, 那么文件夹的也有访问权限
                if (arr.includes(item.routerName)) {
                    show = true;
                }
                this.$set(item, "show", show);
            });
            return menu;
        },
        // 递归遍历菜单
        eachActive(arr) {
            arr.forEach(item => {
                // @特殊处理, 递归执行eachActive会清空active的赋值, 所以当 active = undefined | false 赋值
                if (!item.active) {
                    this.$set(item, "active", this.matchMenuWithRoute(item));
                }
                if (Array.isArray(item.children)) {
                    this.eachActive(item.children);
                }
            });
        },
        // 将路由和菜单项匹配
        matchMenuWithRoute(item) {
            // 子路由会继承父路由的params参数
            const routeParams = this.$route.params;
            return !!this.$route.matched.find(match => {
                // 路由名 & 参数
                let sameRouter = match.name === item.routerName;
                let sameParams = true;
                // 过滤没有配置参数的情况
                if (item.params) {
                    sameParams =
                        JSON.stringify(item.params) + "" ===
                        JSON.stringify(routeParams) + "";
                }
                return sameRouter && sameParams;
            });
        },
        // 点击菜单事件
        activeItem: function(item) {
            // console.log("*****");
            if (item.children && item.children.length > 0) {
                // @特殊处理, 选中有子菜单的父菜单时, 默认选中第一个可显示的子菜单
                this.activeItem(item.children.find(v => v.show));
            } else {
                let path = { name: item.routerName };
                item.params && (path.params = item.params);
                item.routerName && this.$router.push(path);
            }
        }
    },
    mounted() {
        this.activeMenu();
    }
};
</script>

<style>
.sidebar {
    height: 100%;
}

.sidebar .menu {
    border-radius: 0;
    text-align: left;
    box-sizing: border-box;
}

.sidebar .menu-item {
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    color: #666;
    padding-left: 17px;
    font-size: 14px;
    position: relative;
}

.sidebar .menu-item .item-text {
    padding-left: 10px;
}
.sidebar .el-menu-item-group .el-menu-item.is-active {
    background: -webkit-gradient(
        linear,
        left top,
        right top,
        from(#71a3f8),
        to(#6e88f6)
    );
    background: linear-gradient(to right, #71a3f8, #6e88f6);
    color: #fff;
}
.sidebar .menu-item .el-icon-caret-right {
    position: absolute;
    right: 15px;
    top: 20px;
}

.sidebar .menu-item.active .el-icon-caret-right {
    color: #74a4f9;
}

.sidebar .sub-menu > .menu-item .el-icon-caret-right {
    position: absolute;
    right: 15px;
    top: 15px;
}

.sidebar .menu-item .icon {
    position: relative;
    top: 1px;
    color: #888;
}

.sidebar .menu-item:hover {
    color: #74a4f9;
}

.sidebar .menu-item:hover .icon {
    color: #74a4f9;
}

.sidebar .menu-item.active {
    color: #fff;
}

.sidebar .menu-item .sub-menu .item-text {
    color: #fff;
}

.sidebar .menu-item .sub-menu .item-text:hover {
    color: #74a4f9;
}

.sidebar .menu-first-item.active > .icon {
    color: #74a4f9;
}

.sidebar .menu-first-item.active > .item-text {
    color: #74a4f9;
}

.sidebar .menu-item:hover > .sub-menu {
    display: block;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
}

.sidebar .menu-item > .sub-menu {
    display: none;
    position: absolute;
    width: 180px;
    right: -180px;
    top: 5px;
    background-color: RGBA(17, 23, 32, 0.85);
    box-shadow: 4px 4px 9px RGBA(0, 0, 0, 0.28);
    transition: all 0.25s;
    transform-origin: top;
    padding: 0.5rem 0;
    border-bottom: 1px solid #252525;
}

.sidebar .sub-menu > .menu-item {
    height: 40px;
    line-height: 40px;
}

/* 收起情况 */

.sidebar .menu.thin {
}

.sidebar .menu.thin .menu-first-item > .item-text {
    display: none;
}

.sidebar .menu.thin .menu-first-item:hover > .item-text {
    position: absolute;
    bottom: -12px;
    left: 5px;
    z-index: 2;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    display: block;
    border-radius: 3px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    white-space: nowrap;
    padding: 0 5px;
}

.sidebar .menu.thin .menu-first-item > .el-icon-caret-right {
    display: none;
}

.sidebar .el-submenu__title i {
    margin-right: 10px;
}
</style>
