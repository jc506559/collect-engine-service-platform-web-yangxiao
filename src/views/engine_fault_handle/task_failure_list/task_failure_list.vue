<template>
    <div class="page-task_failure_list">
        <div class="page-task_failure_list_box">
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
                <div class="inner">
                    <span>任务名称</span>
                    <el-input v-model="searchData.taskName" placeholder="请输入"></el-input>
                    <span>引擎名称</span>
                    <el-input v-model="searchData.engineName" placeholder="请输入"></el-input>
                    <span>采集目标</span>
                    <el-input v-model="searchData.collectionTarget" placeholder="请输入"></el-input>
                    <span>故障类型</span>
                    <el-select v-model="searchData.faultType" class="fault_type" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="list">
                <el-table :data="tableData" border style="width: 100%" @row-dblclick="getLogList()">
                    <el-table-column prop="taskName" label="任务名称">
                    </el-table-column>
                    <el-table-column prop="engineName" label="引擎名称">
                    </el-table-column>
                    <el-table-column prop="collectionTarget" label="采集目标">
                    </el-table-column>
                    <el-table-column prop="faultType" label="故障类型">
                        <template slot-scope="scope">
                            <el-select :value="scope.row.value">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="faultCause" label="故障原因">
                    </el-table-column>
                    <el-table-column prop="edit" label="操作" class-name="table_edit">
                        <template slot-scope="scope">
                            <el-button type="text" class="warning" size="small" @click="dialogTableVisible = true">警告</el-button>
                            <el-button type="text" size="small">导出状态</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="list_pagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400" />
                </div>
            </div>
        </div>

        <!-- 任务日志列表 -->
        <el-dialog class="task-dialog" append-to-body title="任务日志列表" :visible.sync="logListDialog" width="800px">
            <el-table :data="logListTableData" border style="width: 100%">
                <el-table-column prop="taskName" label="任务名称"></el-table-column>
                <el-table-column prop="engineName" label="引擎名称"></el-table-column>
                <el-table-column prop="collectionTarget" label="采集目标"></el-table-column>
                <el-table-column prop="collectionProgress" label="采集进度"></el-table-column>
                <el-table-column prop="receivingTime" label="接收时间"></el-table-column>
            </el-table>
            <div class="list_pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400" />
            </div>
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-xiangqing"></i>数据详情信息</div>
                <div class="inner">

                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import permission from "@/components/mixin/permission";

export default {
    mixins: [permission],
    name: "task_failure_list",
    data() {
        return {
            // 任务日志列表 dialog
            logListDialog: false,
            logListTableData: [
                {
                    taskName: "按照任务主线",
                    engineName: "名称xxx",
                    collectionTarget: "",
                    collectionProgress: "已经采集到的数据",
                    receivingTime: "2019-05-13"
                }
            ],
            options:[],
            searchData: {
                taskName: "",
                engineName: "",
                collectionTarget: "",
                faultType: ""
            },

            tableData: [
                {
                    taskName: "1",
                    engineName: "2",
                    collectionTarget: "3",
                    faultType: "a",
                    faultCause: "sdfldsfk",
                    edit: ""
                }
            ],
            currentPage4: 1
        };
    },
    methods: {
        // 任务日志列表
        getLogList() {
            this.logListDialog = true;
        },
        handleSizeChange() {},
        handleCurrentChange() {}
    },
    mounted() {}
};
</script>

<style>
.page-task_failure_list {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
}

.page-task_failure_list .page-task_failure_list_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
}

.page-task_failure_list .page-task_failure_list_box .search_form .title {
    height: 35px;
    line-height: 35px;
}

.page-task_failure_list .page-task_failure_list_box .search_form .title i {
    margin-right: 5px;
}

.page-task_failure_list .page-task_failure_list_box .search_form .inner {
    margin-top: 10px;
}

.page-task_failure_list
    .page-task_failure_list_box
    .search_form
    .inner
    .el-input {
    max-width: 16%;
    margin-right: 10px;
}

.page-task_failure_list
    .page-task_failure_list_box
    .search_form
    .inner
    .fault_type {
    margin-right: 10px;
}

.page-task_failure_list
    .page-task_failure_list_box
    .search_form
    .inner
    .fault_type
    .el-input {
    max-width: 100%;
}

.page-task_failure_list .page-task_failure_list_box .search_form .inner > span {
    margin-right: 5px;
}

.page-task_failure_list .page-task_failure_list_box .list {
    background: #fff;
    text-align: center;
    margin-top: 15px;
    border-right: 1px solid #ebeef5;
}

.page-task_failure_list .page-task_failure_list_box .list:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}

.page-task_failure_list .page-task_failure_list_box .list .table_edit .warning {
    color: #e6a23c;
}

.page-task_failure_list .page-task_failure_list_box .list .el-table--small th,
.page-task_failure_list .page-task_failure_list_box .list .el-table--small td {
    background: #fff;
    text-align: center;
}

.page-task_failure_list .page-task_failure_list_box .list .list_pagination {
    margin: 20px;
}

.task-dialog .list_pagination {
    margin: 20px 0;
}

.task-dialog .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
    margin-top: 15px;
    border: 1px solid #eee;
}

.task-dialog .search_form .title {
    height: 35px;
    line-height: 35px;
}

.task-dialog .search_form .title i {
    margin-right: 5px;
}

.task-dialog .search_form .content {
    min-height: 200px;
}

.task-dialog .search_form .inner {
    margin-top: 10px;
}
</style>
>
