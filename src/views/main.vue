<template>
  <div id="app">
    <div class="app-header">
      <app-header @setExpand="setExpand" :expand="expand"></app-header>
    </div>
    <div class="app-container">
      <div class="app-sidebar" :style="{width: space}" v-show="sidebarShow">
        <app-sidebar :expand="expand"></app-sidebar>
      </div>
      <div class="app-content" :style="{paddingLeft: space}">
        <!--面包屑 -->
        <app-breadcrumb></app-breadcrumb>
        <!-- 页面 -->
        <div class="app-page">
          <router-view v-if="isRouterAlive"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import appHeader from '@/layout/app-header'
  import appSidebar from '@/layout/app-sidebar'

  export default {
      name: 'app',
      components: {
          appHeader,
          appSidebar
      },
      computed: {
          sidebarShow() {
              return this.$store.state.sidebarShow
          },
          user() {
              let user = this.localStore.get("user") || this.$store.state.user;
              return user || {}
          },
          space() {
              if (!this.sidebarShow) {
                  return 0;
              }
              return this.expand ? '240px' : '65px'
          },
          permission() {
              let permission = this.localStore.get("permission") || this.$store.state.permission;
              return permission || {}
          }
      },
      provide() {
          return {
              reload: this.reload,
          }
      },
      data() {
          return {
              expand: true,
              isRouterAlive: true,
          }
      },
      methods: {
          setExpand(expand) {
              this.expand = expand;
          },
          //局部刷新页面
          reload() {
              this.isRouterAlive = false;
              this.$nextTick(function() {
                  this.isRouterAlive = true;
              })
          }
      },
      mounted() {
          // @特殊处理, 如果没有用户登录信息, 跳转到登录页面
          if (!this.user.name) {
              this.$router.push({name: 'login'})
          }
          // @特殊处理, 如何一个菜单都没有配置, 侧边栏隐藏, 并main也不会显示
          if (this.$route.name === 'main') {
              if (this.sidebarShow) {
                  this.$router.push({name: 'dashboard'})
              } else {
                  this.$router.push({name: Object.keys(this.permission)[0]})
              }
          }
      }
  }
</script>

<style>
  #app {
    /* 对字体进行抗锯齿渲染 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    position: relative;
  }

  #app .app-header {
    position: relative;
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
    z-index: 3;
  }

  #app .app-container {
    height: calc(100% - 60px);
    position: relative;
  }

  #app .app-sidebar {
    background: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 2;
    transition: all 0.15s ease;
  }

  #app .app-content {
    position: relative;
    height: 100%;
    background: #e3e6e8;

    z-index: 1;
    overflow: auto;
    transition: all 0.15s ease;
  }

  #app .app-page {
    position: relative;
    height: calc(100% - 70px);
    overflow: auto;
  }
</style>

