## 前后端分离之前端框架

### 项目介绍

#### 浏览器兼容性

    Edge 12+   Firefox 55+    Chrome 60+    Safari 10+

#### 框架构成

    vue-cli3 + vue2 + vue-router3 + vuex3 + element-ui2

#### 图标字体

    iconfont

### 环境安装

 本项目依赖 node.js， 使用前先安装 node.js 和 cnpm（显著提升依赖包的下载速度）。


 1. 自行下载并安装 node.js:

        https://nodejs.org/en/download/

 2. 然后安装 cnpm 命令(安装 cnpm 提高安装速度):

        npm install -g cnpm --registry=https://registry.npm.taobao.org

        或者:

        npm install --registry=http://registry.npm.taobao.org

 3. 安装依赖

        npm install 或者 cnpm install

 4. 执行构建并启动服务

        npm start   |  npm run serve
        
 5. 运行模拟服务器(postman)
 
        npm run mock
        
 6. 打包构建
 
        npm run build

### 基础命令


 ##### 开发构建 + 启动服务器

        npm start

 ##### 开发构建

        npm run build


##### 配置信息

      网站监测(云监测) 服务端部署

      接口
       登录登出接口
       全局API接口，该接口通过air-db的JSON请求方式进行操作，air-db文档地址:https://github.com/mengxianun/air-db
       用户角色权限功能，接口通过全局API接口实现

      文档
       项目API接口文档在项目根目录下的api文件夹，地址:http://122.114.95.115/website-monitor/website-monitor-service/tree/master/api

      服务端项目地址
       http://122.114.95.115:8091

      数据库
       IP:122.114.95.115
       端口:3306
       数据库:website
       用户名:website
       密码: 123456

      数据库脚本
       数据库脚本在 http://122.114.95.115/website-monitor/website-monitor-service/tree/master/src/main/resources/schema

##### 备份

      <template>
        <div class="page-user_log">
          <el-button>aaa</el-button>
        </div>
      </template>

      <script>
        import permission from '@/components/mixin/permission';
        export default {
          mixins: [permission],
          name: 'user_log',
          data() {
            return {}
          },
          methods: {},
          mounted() {
          }
        }
      </script>

      <style>
        .page-user_log {

        }
      </style>

##### 账号密码
admin aigo@2019

##### 菜单

      1. 注册引擎 registration_engine
          1-1. 录入注册引擎信息 registration_engine_info ---查 添加 修改 删除
          1-2. 注册引擎信息列表 registration_engine_list   ---查

      2. 引擎接入认证 engine_access_auth
          2-1. 引擎接入认证查询 engine_access_auth_search ---查
          2-2. 引擎管理列表 engine_access_auth_admins ---查 修改 导出
          2-3. 状态监控 engine_access_auth_monitor---查

      3. 系统配置管理 sys_config_manage
          3-1. 查看任务配置 view_task_config ---查

      4. 引擎故障处理 engine_fault_handle
          4-1. 任务故障列表 task_failure_list ---查 修改 导出
          4-2. 基线引擎 baseline_engine ---查 修改

      5. 状态监控 condition_monitoring
          5-1. 告警日志提取 alarm_log_extraction ---查
          5-2. 采集目标监控 acquisition_target_monitoring ---查
          5-2. 服务器监控 server_monitoring ---查

      6. 日志查看 log_view
          6-1. 日志查看与统计 log_view_statistics ---查

      7. 系统初始化 sys_initialization ---查 修改

      8. 管理中心 manage_center
          8-1. 用户管理 user ---查 修改 添加 删除 导入 导出
          8-2. 权限管理 role ---查 修改 添加 删除

      9. 引擎管理 engine_manage
          9-1. 引擎管理列表 engine_manage_list ---查 修改 导出

# git 常用命令

    git add .                   提交到暂存区
    git status                  查看状态
    git commit -m '提交注释'     提交到本地
    git status
    git pull                    拉取远端的代码到本地
    git status
    git push                    把本地代码推送到远端
    git status
    
    
    git branch -a               查看所有分支本地和远端（origin）
    
    
## 个人备注
* main.js：项目入口
* main.vue：页面效果
