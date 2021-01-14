<!-- 平台状态：使用平台推送给总线的内容进行展示 -->
<template>
  <div class="page-target_monitor">
    <div class="page-target_monitor_box">
      <div class="title"><i class="icon iconfont icon-jiankong title_i"></i>目标监控
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="定时监控还在存活的引擎的采集目标">
          <img src="../../../assets/images/hint.png" slot="reference" height="20" width="20">
        </el-popover>
      </div>
      <div class="list">
        <div class="conclusion">
          当前共监控{{ total }}个采集目标，存活目标数为{{ tableData.filter(data => (data.is_enable == 1)).length }}个，存活率{{ total == 0 ? 0 : (tableData.filter(data => (data.is_enable == 1)).length / total) * 100 }}%
        </div>
        <div class="app-table">
          <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="tableData" v-loading="loading">
            <el-table-column prop="crawl_target" label="目标URL" align="center">
              <template slot="header" slot-scope="scope">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="click">
                  <div>
                    <el-input v-model="searchForm.crawl_target" placeholder="请输入" style="max-width: 80%"
                              @keyup.enter.native="search"></el-input>
                    <el-button type="primary" @click="search" style="max-width: 20%">搜索</el-button>
                  </div>
                  <div slot="reference">
                    目标URL
                    <i class="icon iconfont icon-jiantou" style="font-size: 10px;cursor: pointer"></i>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="rules_id" label="所属规则" align="center">
              <template slot="header" slot-scope="scope">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="click">
                  <div>
                    <el-input v-model="searchForm.rules_id" placeholder="请输入" style="max-width: 80%"
                              @keyup.enter.native="search"></el-input>
                    <el-button type="primary" @click="search" style="max-width: 20%">搜索</el-button>
                  </div>
                  <div slot="reference">
                    所属规则
                    <i class="icon iconfont icon-jiantou" style="font-size: 10px;cursor: pointer"></i>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="is_enable" label="是否存活" align="center" sortable>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.is_enable == 1" type="success">是</el-tag>
                <el-tag v-if="scope.row.is_enable == 0" type="danger">否</el-tag>
                <el-tag v-else type="info">尚未检测</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_forward" label="是否跳转" align="center" sortable>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.is_forward == 1" type="danger">是</el-tag>
                <el-tag v-if="scope.row.is_forward == 0" type="success">否</el-tag>
                <el-tag v-else type="info">尚未检测</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_revision" label="是否改版" align="center" sortable>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.is_revision == 1" type="danger">是</el-tag>
                <el-tag v-if="scope.row.is_revision == 0" type="success">否</el-tag>
                <el-tag v-else type="info">尚未检测</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="update_time" label="最新监控时间" align="center" sortable>
              <template slot-scope="scope">
                <div v-if="scope.row.update_time">
                  {{ renderTime(scope.row.update_time) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="app-pagination">
            <el-pagination
              :total="total"
              :page-size="pageSize"
              :page-sizes="pageSizes"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"></el-pagination>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import permission from '@/components/mixin/permission';
  export default {
    mixins: [permission],
    name: 'target_monitor',
    data() {
      return {
          //列表相关
          loading: false,
          currentPage: 1,
          pageSize: 10,
          total: 0,
          pageSizes: [10, 20, 50, 100],
          tableData: [],
          newTableData: [],
          where: [],
          searchForm: {
              crawl_target: '',
              engine_name: ''
          }
      }
    },
    methods: {
        //修改分页数量
        handleSizeChange (val) {
            this.pageSize = val;
            this.tableData = this.newTableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        },
        // 切换分页
        handleCurrentChange (val) {
            this.currentPage = val;
            this.tableData = this.newTableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        },
        // 排序
        handleSortChange (column) {
            this.order = column.prop && column.order
                ? [column.prop + ' ' + column.order.replace("ending", "")]
                : [];
        },
        //搜索
        search() {
            this.loading = true;
            this.currentPage = 1;
            this.where = [];
            if(this.searchForm.crawl_target) {
                this.where.push("crawl_target%=%" + this.searchForm.crawl_target + "%")
            }
            if(this.searchForm.rules_id) {
                this.where.push("rules_id%=%" + this.searchForm.rules_id + "%")
            }
            this.$post('/action', {
                data: {
                    "select": "crawl_engine_monitor",
                    "where": this.where
                }
            }).then(data => {
                this.newTableData = data;
                this.tableData = this.newTableData.slice(0,10);
                this.total = data.length;
                this.loading = false;
            }).catch(err => {
                this.$message.error({ message: "搜索出错！", type: "error"});
                this.loading = false;
            })
        },
        //获取引擎存活的监控目标信息
        getUrl() {
            this.loading = true;
            this.$post('/action', {
                data: {
                    sql: "select * from crawl_engine_monitor",
                }
            }).then(data => {
                this.newTableData = data;
                this.tableData = this.newTableData.slice(0,10);
                this.total = data.length;
                this.loading = false;
            })
        },
        //时间转化
        renderTime(date) {
            var dateee = new Date(date).toJSON();
            return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        },
        load() {
            this.getUrl();
        },
        clear() {
        },
    },

    mounted() {
        this.load();
    },
    destroyed() {
        this.clear()
    }
  }
</script>

<style>
  .page-target_monitor {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color: #606266
  }
  .page-target_monitor .page-target_monitor_box{
    height: 100%;
    background: #fff;
  }
  .page-target_monitor .page-target_monitor_box .list {
    background: #fff;
    text-align: center;
    border-right: 1px solid #ebeef5;
    padding: 0 15px;
    position: relative;
  }
  .page-target_monitor .page-target_monitor .list:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .page-target_monitor .page-target_monitor_box .title {
    position: relative;
    /*padding-left: 15px;*/
    /*padding-top: 15px;*/
    /*padding-bottom: ;*/
    padding: 15px 0 15px 15px;
    font-size: 20px;
    height: 65px;
    line-height: 35px;
  }
  .page-target_monitor .page-target_monitor_box .title .title_i{
    margin-right:5px;
  }
  .page-target_monitor .page-target_monitor_box .title img {
    position: absolute;
    top: 50%;
    margin-top: -12px;
    margin-left: 5px;
  }
  .page-target_monitor .page-target_monitor_box .conclusion {
    font-size: 20px;
    height: 60px;
    line-height: 30px;
  }
  .page-target_monitor
  .page-target_monitor_box
  .list
  .el-table--small
  th,
  .page-target_monitor
  .page-target_monitor_box
  .list
  .el-table--small
  td {
    background: #fff;
    text-align: center;
  }
  .page-target_monitor
  .page-target_monitor_box
  .code {
    margin: 15px 0;
    background: #fff;
  }
  .page-target_monitor
  .page-target_monitor_box
  .el-table__expanded-cell {
    padding: 15px;
  }
</style>
