<template>
    <div class="page-log_view_statistics">
        <div class="page-log_view_statistics_box">
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
                <div class="inner">
                    <span>选择日志类型</span>
                    <el-select v-model="searchData.logType" class="fault_type" placeholder="请选择">
                        <el-option :key="1" label="a" value="aa" />
                    </el-select>
                    <span>日志记录时间</span>
                    <el-date-picker v-model="searchData.logTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="line_charts">
                <app-line-chart style="height:300px; width:100%;display:inline-block;" :data="lineData"></app-line-chart>
            </div>

            <div class="list">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column prop="logTime" label="日志记录时间">
                    </el-table-column>
                    <el-table-column prop="logType" label="日志类型">
                    </el-table-column>
                    <el-table-column prop="logLevel" label="日志级别" width="100px">
                    </el-table-column>
                    <el-table-column prop="logContent" label="日志内容" width="200px">
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
    name: "task_failure_list",
    data() {
        return {
            searchData: {
                logType: "",
                logTime: ""
            },
            lineData: [
                {
                    name: "aaa",
                    data: [
                        {
                            name: "2012-01",
                            value: 221
                        },
                        {
                            name: "2012-02",
                            value: 191
                        },
                        {
                            name: "2012-03",
                            value: 121
                        },
                        {
                            name: "2012-04",
                            value: 209
                        },{
                            name: "2012-05",
                            value: 29
                        },
                        {
                            name: "2012-06",
                            value: 309
                        },
                        {
                            name: "2012-07",
                            value: 119
                        },
                        {
                            name: "2012-08",
                            value: 89
                        },
                    ]
                }
            ],
            tableData: [
                {
                    logTime: "1",
                    logType: "2",
                    logLevel: "3",
                    logContent: "a"
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
.page-log_view_statistics {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
}
.page-log_view_statistics .page-log_view_statistics_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
}
.page-log_view_statistics .page-log_view_statistics_box .search_form .title {
    height: 35px;
    line-height: 35px;
}
.page-log_view_statistics .page-log_view_statistics_box .search_form .title i {
    margin-right: 5px;
}
.page-log_view_statistics .page-log_view_statistics_box .search_form .inner {
    margin-top: 10px;
}
.page-log_view_statistics
    .page-log_view_statistics_box
    .search_form
    .inner
    .el-input {
    max-width: 16%;
    margin-right: 10px;
}
.page-log_view_statistics
    .page-log_view_statistics_box
    .search_form
    .inner
    .el-date-editor {
    max-width: 32%;
    margin-right: 10px;
}
.page-log_view_statistics
    .page-log_view_statistics_box
    .search_form
    .inner
    .fault_type {
    margin-right: 10px;
}
.page-log_view_statistics
    .page-log_view_statistics_box
    .search_form
    .inner
    .fault_type
    .el-input {
    max-width: 100%;
}
.page-log_view_statistics
    .page-log_view_statistics_box
    .search_form
    .inner
    > span {
    margin-right: 5px;
}
.page-log_view_statistics .page-log_view_statistics_box .line_charts {
    padding: 15px;background: #fff;margin:15px 0;
}
.page-log_view_statistics .page-log_view_statistics_box .list {
    background: #fff;
    text-align: center;
    margin-top: 15px;
    border-right: 1px solid #ebeef5;
}

.page-log_view_statistics .page-log_view_statistics_box .list:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.page-log_view_statistics
    .page-log_view_statistics_box
    .list
    .table_edit
    .warning {
    color: #e6a23c;
}
.page-log_view_statistics
    .page-log_view_statistics_box
    .list
    .el-table--small
    th,
.page-log_view_statistics
    .page-log_view_statistics_box
    .list
    .el-table--small
    td {
    background: #fff;
    text-align: center;
}
.page-log_view_statistics .page-log_view_statistics_box .list .list_pagination {
    margin: 20px;
}
</style>

