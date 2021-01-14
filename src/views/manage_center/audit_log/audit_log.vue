<template>
<div class="page-audit_log">
  <div class="page-audit_log_box">
    <div class="app-table">
      <p class="label_p">操作审计</p>
      <el-table stripe border tooltip-effect="dark" :data="tableData" v-loading="loading">
        <el-table-column prop="id" label="序号" align="center" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="user" label="用户" align="center" width="150" show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="right"
              width="400"
              trigger="click">
              <div>
                <el-input v-model="searchForm.username" placeholder="请输入" style="max-width: 80%" @keyup.enter.native="search"></el-input>
                <el-button type="primary" @click="search" style="max-width: 20%">搜索</el-button>
              </div>
              <div slot="reference">
                用户
                <i class="icon iconfont icon-jiantou" style="font-size: 10px;cursor: pointer"></i>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="log_time" label="时间" align="center" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.log_time.substring(0, 19) }}
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作类型" align="center" width="100" show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="right"
              width="400"
              trigger="click">
              <div>
                <el-input v-model="searchForm.operate" placeholder="请输入" style="max-width: 80%" @keyup.enter.native="search"></el-input>
                <el-button type="primary" @click="search" style="max-width: 20%">搜索</el-button>
              </div>
              <div slot="reference">
                操作类型
                <i class="icon iconfont icon-jiantou" style="font-size: 10px;cursor: pointer;"></i>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果" align="center" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="detail" label="描述" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" width="200">
          <template slot="header" slot-scope="scope">
            <el-button @click="exportAll('export')" type="text">导出全部</el-button>
          </template>
          <template slot-scope="scope">
            <el-button @click="exportRow('export', scope.row)" type="text">导出单行</el-button>
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
    <!-- 失败统计 -->
    <div class="app-table" style="padding-top: 0">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="title" name="1">
        <el-table stripe border tooltip-effect="dark" :data="defeatTableData" v-loading="defeatLoading">
          <el-table-column prop="id" label="序号" align="center" width="100">
          </el-table-column>
          <el-table-column prop="user" label="用户" align="center">
          </el-table-column>
          <el-table-column prop="log_time" label="时间" align="center">
          </el-table-column>
          <el-table-column prop="operate" label="操作类型" align="center">
          </el-table-column>
          <el-table-column prop="result" label="结果" align="center">
          </el-table-column>
          <el-table-column prop="detail" label="描述" align="center" width="500">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="app-pagination">
          <el-pagination
            :total="defeatTotal"
            :page-size="defeatPageSize"
            :page-sizes="defeatPageSizes"
            :current-page="defeatCurrentPage"
            @size-change="defeatHandleSizeChange"
            @current-change="defeatHandleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse>
    </div>
  </div>
</div>
</template>

<script>
    import permission from '@/components/mixin/permission';
    import fileSaver from 'file-saver';
    import moment from 'moment'

    export default {
        mixins: [permission],
        name: "audit_log",
        data () {
            return {
                //表格相关
                loading: false,
                total: 0,
                pageSize: 20,
                pageSizes: [20, 50, 100, 200],
                currentPage: 1,
                tableData: [],
                activeNames: "",
                title: "失败统计",
                defeatTableData: [],
                defeatLoading: false,
                defeatTotal: 0,
                defeatPageSize: 20,
                defeatPageSizes: [20, 50, 100, 200],
                defeatCurrentPage: 1,
                where: [],
                searchForm: {
                    username: '',
                    operate: ''
                },
                source: null,
            }
        },
        methods: {
            search() {
              this.currentPage = 1;
              this.where = [];
              if(this.searchForm.username) {
                  this.where.push('user%=%' + this.searchForm.username + '%');
              }
              if(this.searchForm.operate) {
                  this.where.push("operate=" + this.searchForm.operate)
              }
              this.list();
            },
            //获取操作审计
            list() {
                this.loading = true;
                this.$post('/action', {
                    data: {
                        "select": "audit_log",
                        "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                        "order": "log_time desc",
                        "where": this.where,
                    },
                }).then(data => {
                    this.loading = false;
                    if (data && Array.isArray(data.data)) {
                        this.tableData = data.data;
                        this.total = data.total
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message.error({ message: "获取列表失败！", type: "error"})
                })
            },
            //获取失败操作审计
            defeatList() {
                this.defeatLoading = true;
                this.$post('/action', {
                    data: {
                        "select": "audit_log",
                        "limit": [(this.defeatCurrentPage - 1) * this.defeatPageSize, this.defeatCurrentPage * this.defeatPageSize],
                        "where": ["result=失败"],
                        "order": "log_time desc"
                    }
                }).then(data => {
                    this.defeatLoading = false;
                    if (data && Array.isArray(data.data)) {
                        this.defeatTableData = data.data;
                        this.defeatTotal = data.total;
                        this.title = "失败审计(" + data.total + ")"
                    }
                }).catch(err => {
                    this.defeatLoading = false;
                    this.$message.error({ message: "获取列表失败！", type: "error"})
                })
            },
            //修改分页数量
            handleSizeChange(val) {
                this.pageSize = val;
                this.list();
            },
            defeatHandleSizeChange(val) {
              this.defeatPageSize = val;
              this.defeatList();
            },
            //切换分页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.list();
            },
            defeatHandleCurrentChange(val) {
                this.defeatCurrentPage = val;
                this.defeatList();
            },
            handleChange() {
                this.activeNames = "1";
                this.defeatList();
            },
            //导出全部
            exportAll(type) {
                let data = [];
                let date = this.$nowYearMonthDay();
                for(let i = 0; i < this.tableData.length; i++) {
                    let obj = {};
                    obj['序号'] = this.tableData[i].id;
                    obj['用户'] = this.tableData[i].user;
                    obj['客户端地址'] = this.tableData[i].client;
                    obj['时间'] = this.tableData[i].log_time;
                    obj['操作'] = this.tableData[i].operate;
                    obj['结果'] = this.tableData[i].result;
                    obj['描述'] = this.tableData[i].detail;
                    if(this.tableData[i].is_submitted == 0) {
                        obj['是否上报'] = '未上报'
                    } else if(this.tableData[i].is_submitted == 1){
                        obj['是否上报'] = '已上报'
                    }
                    data.push(obj)
                }
                let blob = new Blob([JSON.stringify(data)], {type: ""});
                fileSaver.saveAs(blob, `操作审计日志-${date}.json`)
            },
            //导出单行
            exportRow(type, row) {
                let date = this.$nowYearMonthDay();
                let obj = {};
                obj['序号'] = row.id;
                obj['用户'] = row.user;
                obj['客户端地址'] = row.client;
                obj['时间'] = row.log_time;
                obj['操作'] = row.operate;
                obj['结果'] = row.result;
                obj['描述'] = row.detail;
                if(row.is_submitted == 0) {
                    obj['是否上报'] = '未上报'
                } else if(row.is_submitted == 1){
                    obj['是否上报'] = '已上报'
                }
                let blob = new Blob([JSON.stringify(obj)], {type: ""});
                fileSaver.saveAs(blob, `操作审计日志-${date}.json`)
            },
            // post() {
            //     if(this.source){
            //         this.source.cancel();
            //     }
            //     var this_ = this;
            //     this.source = axios.CancelToken.source();
            //     this.$post('/action', {
            //         data: {
            //             "select": "crawl_platform_log"
            //         },
            //         cancelToken: this_.source.token
            //     }).then(data => {
            //         console.log("查询结果")
            //     }).catch(err => {
            //         this.$message({ message: err, type: "error"})
            //     })
            // },
        },
        mounted() {
            this.list();
            this.defeatList();
        }
    }
</script>

<style>
  .page-audit_log {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  font-size: 14px;
  color: #606266;
}
  .page-audit_log .page-audit_log_box {
  /*height: 100%;*/
  background: #fff;
}
  .page-audit_log .page-audit_log_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
  }
  .page-audit_log .page-audit_log_box .search_form .title {
    height: 35px;
    line-height: 35px;
  }
  .page-audit_log
  .page-audit_log_box
  .search_form
  .title
  i {
    margin-right: 5px;
  }
  .page-audit_log
  .page-audit_log_box
  .search_form
  .inner {
    margin-top: 10px;
  }
  .page-audit_log
  .page-audit_log_box
  .search_form
  .inner
  > span {
    margin-right: 10px;
  }
  .page-audit_log
  .page-audit_log_box
  .search_form
  .inner {
    margin-top: 10px;
  }
  .page-audit_log
  .page-audit_log_box
  .search_form
  .inner
  .el-input {
    max-width: 30%;
    margin-right: 20px;
  }
  .page-audit_log
  .page-audit_log_box
  .search_form
  .inner
  > span {
    margin-right: 10px;
  }
  .page-audit_log .page-audit_log_box .app-table {
    padding: 15px;
  }
  .page-audit_log .page-audit_log_box .app-table p.label_p {
    margin-bottom: 15px;
    font-size: 20px;
  }
  .page-audit_log .page-audit_log_box .export_all {
    float: left;
    /*margin-left: 20px;*/
  }
  .el-collapse-item__header {
    color: #c9302c;
    font-size: 20px;
  }
  .el-collapse-item__header i{
    color: #000000;
  }
</style>
