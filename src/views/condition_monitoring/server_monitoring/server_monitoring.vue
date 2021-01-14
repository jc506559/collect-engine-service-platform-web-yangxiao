<template>
  <div class="page-server_monitoring">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="服务器监控" name="monitor">
        <server_monitoring_monitor></server_monitoring_monitor>
      </el-tab-pane>
      <el-tab-pane label="服务器查找" name="search">
        <server_monitoring_search></server_monitoring_search>
      </el-tab-pane>
<!--      <el-tab-pane label="服务器表" name="table">-->
<!--        <server_monitoring_table></server_monitoring_table>-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
  import permission from '@/components/mixin/permission';
  import server_monitoring_monitor from "./server_monitoring_monitor";
  import server_monitoring_search from "./server_monitoring_search";
  import server_monitoring_table from "./server_monitoring_table";
  export default {
    mixins: [permission],
    name: 'server_monitoring',
    components: {
        server_monitoring_monitor,
        server_monitoring_search,
        // server_monitoring_table
    },
    data() {
      return {
          activeName: 'monitor'
      }
    },
    methods: {
        handleClick(tab, event) {
            this.activeName = tab.name;
            // this.$router.push(tab.name);
        }
    },
    mounted() {
    }
  }
</script>

<style>
  .page-server_monitoring {
    width: 100%;
    height: calc(100% - 51px);
    padding: 0 15px;
    font-size: 14px;
  }
  .page-server_monitoring .el-tabs{
    min-height: calc(100% - 41px);
  }
  .page-server_monitoring .el-tabs--card>.el-tabs__header{
    margin:0;
  }
  .page-server_monitoring::after {
    content: "";
    clear: both;
    display: block;
  }
  .page-server_monitoring .el-tabs {
    background: #fff;
  }
</style>
