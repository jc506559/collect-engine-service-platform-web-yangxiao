<template>
  <div class="page-server_monitoring_table">
    <div class="list">
      <el-table :data="tableData" border style="width: 100%" @row-dblclick="toContrast()">
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="acquisitionTarget" label="采集目标"></el-table-column>
        <el-table-column prop="ifAvailable" label="是否可用"></el-table-column>
        <el-table-column prop="ifJump" label="是否发生跳转"></el-table-column>
        <el-table-column prop="ifRevision" label="是否改版"></el-table-column>
        <el-table-column prop="lastMonitoringTime" label="最近一次监控时间"></el-table-column>
      </el-table>
      <div class="list_pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400" />
      </div>

      <!-- 采集目标监控对比 -->
      <el-dialog class="contrast-dialog" append-to-body title="新旧版对比" :visible.sync="contrastDialog" width="800px">
        <ul class="contrast-list">
          <li class="left item">
            <h1 class="header">old</h1>
            <code class="con">

            </code>
          </li>
          <li class="right item">
            <h1 class="header">new</h1>
            <code class="con">

            </code>
          </li>
        </ul>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import permission from "@/components/mixin/permission";

export default {
    mixins: [permission],
    name: "server_monitoring_table",
    data() {
        return {
            // 对比dialog
            contrastDialog: false,

            tableData: [
                {
                    taskName: "按照任务主线",
                    acquisitionTarget: "",
                    ifAvailable: "是",
                    ifJump: "xxxxxx",
                    ifRevision: "是",
                    lastMonitoringTime: "2019-05-13"
                }
            ]
        };
    },
    methods: {
        // 对比
        toContrast() {
            this.contrastDialog = true;
        },
        handleSizeChange(){

        },
        handleCurrentChange(){}
    }
};
</script>

<style>
.page-server_monitoring_table .list {
    background: #fff;
    text-align: center;
    border: 1px solid #ebeef5;
    border-top: 15px solid #f8fafc;
}

.page-server_monitoring_table .list:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}

.page-server_monitoring_table .list .table_edit .warning {
    color: #e6a23c;
}

.page-server_monitoring_table .list .el-table--small th,
.page-server_monitoring_table .list .el-table--small td {
    background: #fff;
    text-align: center;
}

.page-server_monitoring_table .list .list_pagination {
    margin: 20px;
}

.contrast-dialog .contrast-list {
    width: 100%;
    height: 470px;
    overflow: hidden;
    position: relative;
    border: 1px solid #eee;
}

.contrast-dialog .contrast-list .item .header {
    color: #333;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #fdfdfd;
    border-bottom: 1px solid #eee;
}

.contrast-dialog .contrast-list .item .con {
    position: absolute;
    width: 100%;
    height: calc(100% - 30px);
    top: 31px;
    overflow-y: auto;
}

.contrast-dialog .contrast-list .left {
    width: 50%;
    height: 100%;
    position: absolute;
    border-right: 1px solid #eee;
    left: 0;
}

.contrast-dialog .contrast-list .right {
    width: 50%;
    height: 100%;
    position: absolute;
    right: 0;
}
</style>
