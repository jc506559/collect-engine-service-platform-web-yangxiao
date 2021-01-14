<template>
    <div class="page-view_task_config">
        <div class="page-view_task_config_box">
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
                <div class="inner">
                    <span>引擎名称</span>
                    <el-input v-model="searchData.taskName" placeholder="请输入"></el-input>
                    <span>下发时间</span>
                    <el-date-picker v-model="searchData.downTime" type="date" placeholder="选择日期时间" default-time="12:00:00" prefix-icon="icon iconfont icon-shijian2" clear-icon>
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="list">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="taskName" label="任务名称" width="150px">
                    </el-table-column>
                    <el-table-column prop="downTime" label="下发时间" width="120px">
                    </el-table-column>
                    <el-table-column prop="effectiveState" label="生效状态" width="80px">
                    </el-table-column>
                    <el-table-column prop="taskConfig" label="配置">
                    </el-table-column>
                </el-table>
                <div class="list_pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400" />
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import permission from "@/components/mixin/permission";

export default {
    mixins: [permission],
    name: "view_task_config",
    data() {
        return {
            searchData: {
                taskName: "",
                downTime: ""
            },

            tableData: [
                {
                    taskName: "222",
                    downTime: 2012 - 12,
                    effectiveState: "生效",
                    taskConfig: "233卡拉斯科"
                }
            ],
            currentPage4: 1
        };
    },
    methods: {
        handleSizeChange() {},
        handleCurrentChange() {}
    },
    mounted() {}
};
</script>

<style>
.page-view_task_config {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
}
.page-view_task_config .page-view_task_config_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
}
.page-view_task_config .page-view_task_config_box .search_form .title {
    height: 35px;
    line-height: 35px;
}
.page-view_task_config .page-view_task_config_box .search_form .title i {
    margin-right: 5px;
}
.page-view_task_config .page-view_task_config_box .search_form .inner {
    margin-top: 10px;
}
.page-view_task_config
    .page-view_task_config_box
    .search_form
    .inner
    .el-input {
    max-width: 30%;
    margin-right: 20px;
}
.page-view_task_config .page-view_task_config_box .search_form .inner > span {
    margin-right: 10px;
}
.page-view_task_config .page-view_task_config_box .search_form .inner
.el-input__prefix{
    right:5px;
    left: auto;
    width: 16px;
}
.page-view_task_config .page-view_task_config_box .list {
    background: #fff;
    text-align: center;
    margin-top: 15px;
    border-right: 1px solid #ebeef5;
}
.page-view_task_config .page-view_task_config_box .list:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.page-view_task_config .page-view_task_config_box .list .el-table--small th,
.page-view_task_config .page-view_task_config_box .list .el-table--small td {
    background: #fff;
    text-align: center;
}
.page-view_task_config .page-view_task_config_box .list .list_pagination {
    margin: 20px;
}
</style>

