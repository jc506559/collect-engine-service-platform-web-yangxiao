<template>
    <div class="page-condition_monitoring">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="警告日志提取" name="first">
                <serverMonitoringSearch :data="11" />
                <serverMonitoringTable />
            </el-tab-pane>
            <el-tab-pane label="目标存活" name="second">
                <serverMonitoringSearch :data="12" />
                <serverMonitoringTable />
            </el-tab-pane>
            <el-tab-pane label="服务器监控" name="third">
                <serverMonitoringMonitor />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import permission from "@/components/mixin/permission";
import serverMonitoringSearch from "@/views/condition_monitoring/server_monitoring/server_monitoring_search";
import serverMonitoringTable from "@/views/condition_monitoring/server_monitoring/server_monitoring_table";
import serverMonitoringMonitor from "@/views/condition_monitoring/server_monitoring/server_monitoring_monitor";
export default {
    mixins: [permission],
    components: {
        serverMonitoringSearch,
        serverMonitoringTable,
        serverMonitoringMonitor
    },
    name: "condition_monitoring",
    data() {
        return {
            activeName: "first"
        };
    },
    methods: {
        handleClick() {}
    },
    mounted() {}
};
</script>

<style>
.page-condition_monitoring {
    width: 100%;
    height: calc(100% - 51px);
    padding: 0 15px;
    font-size: 14px;
}
.page-condition_monitoring .el-tabs{
    min-height: calc(100% - 41px);
}
.page-condition_monitoring .el-tabs--card>.el-tabs__header{
    margin:0;
}
.page-condition_monitoring::after {
    content: "";
    clear: both;
    display: block;
}
.page-condition_monitoring .el-tabs {
    background: #fff;
}
</style>
