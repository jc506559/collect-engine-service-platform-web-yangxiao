<template>
  <div class="page-server_monitoring_search">
    <div class="search_form">
      <div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
      <div class="inner">
        <span>任务名称</span>
        <el-input v-model="searchData.taskName" placeholder="请输入"></el-input>
        <span>采集目标</span>
        <el-input v-model="searchData.collectionTarget" placeholder="请输入"></el-input>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import permission from "@/components/mixin/permission";
export default {
    mixins: [permission],
    name:"server_monitoring_search",
    data(){
        return{
            searchData:{
                taskName:"",
                collectionTarget:"",
            }
        }
    }

};
</script>
<style >
.page-server_monitoring_search .search_form {
    background: #fff;
    padding: 0 15px 15px 15px;
    overflow: hidden;
}
.page-server_monitoring_search .search_form .title {
    height: 35px;
    line-height: 35px;
}
.page-server_monitoring_search .search_form .title i {
    margin-right: 5px;
}
.page-server_monitoring_search .search_form .inner {
    margin-top: 10px;
}
.page-server_monitoring_search .search_form .inner .el-input {
    max-width: 16%;
    margin-right: 10px;
}
.page-server_monitoring_search .search_form .inner .fault_type {
    margin-right: 10px;
}
.page-server_monitoring_search .search_form .inner .fault_type .el-input {
    max-width: 100%;
}
.page-server_monitoring_search .search_form .inner > span {
    margin-right: 5px;
}
</style>
