<!-- 引擎状态: 包括每个引擎的运行状态（正常、异常、离线等），每个引擎上传的异常列表以及统计信息 -->
<template>
  <div class="page-engine_status">
    <div class="page-engine_status_box">
      <div class="search_form">
        <div class="title"><i class="icon iconfont icon-jiankong"></i>引擎状态</div>
        <div class="inner">
          <span>引擎名称</span>
          <!--            <el-select v-model="searchData.engine" @change="serverchange()" class="fault_type" placeholder="请选择">-->
          <!--              <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value">-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <el-input v-model="searchForm.engine_name" placeholder="根据引擎名称搜索"></el-input>
          <el-input v-model="searchForm.engine_id" placeholder="根据引擎id搜索"></el-input>
        </div>
      </div>
      <div class="list" v-loading="loading">
        <el-table
          style="width:100%"
          border tooltip-effect="dark"
          :data="tableData.filter(data => (!searchForm.engine_name  || data.engine_name.includes(searchForm.engine_name)) && (!searchForm.engine_id || data.engine_id.includes(searchForm.engine_id)))">
          <el-table-column label="引擎名称" prop="engine_name">
          </el-table-column>
          <el-table-column label="运行状态" prop="status">
          </el-table-column>
          <el-table-column label="统计时间" prop="time" align="center">
          </el-table-column>
          <!--          <el-table-column label="引擎异常" prop="count">-->
          <!--            <template slot-scope="scope">-->
          <!--              <div v-if="scope.row.alarmCount == '0'">-->
          <!--                {{ scope.row.alarmCount }}-->
          <!--              </div>-->
          <!--              <div v-else>-->
          <!--                <el-button type="text" size="small" @click="viewError(scope.row)">{{ scope.row.alarmCount }}</el-button>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column label="统计信息" prop="alarmCount">-->
          <!--            <template slot-scope="scope">-->
          <!--              <div v-if="scope.row.count == '0'">-->
          <!--                {{ scope.row.count }}-->
          <!--              </div>-->
          <!--              <div v-else>-->
          <!--                <el-button type="text" size="small" @click="viewInfo(scope.row)">{{ scope.row.count }}</el-button>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="最新心跳">
          </el-table-column>
          <el-table-column label="心跳监测">
          </el-table-column>
        </el-table>
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
        <div class="app-table">
          <p class="label_p">异常状态</p>
          <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="platformData" v-loading="loading">
            <el-table-column prop="type" label="类型" align="center">
            </el-table-column>
            <el-table-column prop="level" label="级别" align="center">
            </el-table-column>
            <el-table-column prop="time" label="时间" align="center">
            </el-table-column>
            <el-table-column prop="detail" label="详情" align="center">
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="app-pagination">
          <el-pagination
            :total="errorDataTotal"
            :page-size="errorDataPageSize"
            :page-sizes="pageSizes"
            :current-page="errorDataCurrentPage"
            @size-change="errorDataHandleSizeChange"
            @current-change="errorDataHandleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <div class="app-table">
          <p class="label-p">统计信息</p>
          <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="countData" v-loading="loading">
            <el-table-column prop="" label="累计采集数据量" align="center"></el-table-column>
            <el-table-column prop="" label="累计采集数据量" align="center"></el-table-column>
            <el-table-column prop="" label="待发送数据量" align="center"></el-table-column>
            <el-table-column prop="" label="当前运行任务量" align="center"></el-table-column>
            <el-table-column prop="" label="历史累计采集失败次数" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="app-pagination">
          <el-pagination
            :total="countDataTotal"
            :page-size="countDataPageSize"
            :page-sizes="pageSizes"
            :current-page="countDataCurrentPage"
            @size-change="countDataHandleSizeChange"
            @current-change="countDataHandleCurrentChange"
            layout="total, size, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
      <el-dialog title="查看引擎详细异常信息" :visible.sync="errorVisible" :append-to-body="true" width="50%" :before-close="errorHandleClose">
        <el-table :data="errorData">
          <el-table-column label="异常级别" prop="level" align="center">
          </el-table-column>
          <el-table-column label="异常时间" prop="time" align="center"></el-table-column>
          <el-table-column label="异常类型" prop="type" align="center"></el-table-column>
          <el-table-column label="异常信息" prop="detail" align="center"></el-table-column>
          <!--          <el-table-column label="是否提交至总线" align="center">-->
          <!--            <template slot-scope="scope">-->
          <!--              <div v-if="scope.row.submit_status == '1'">是</div>-->
          <!--              <div v-else>否</div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
        </el-table>
        <div class="app-pagination">
          <el-pagination
            :total="errorTotal"
            :page-sizes="pageSizes"
            :page-size="errorPageSize"
            :current-page="errorCurrentPage"
            @size-change="errorHandleSizeChange"
            @current-change="errorHandleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
				<el-button @click="errorVisible = false">关 闭</el-button>
			</span>
      </el-dialog>
      <!-- 查看信息统计详细信息 -->
      <el-dialog title="查看引擎异常信息" :visible.sync="infoVisible" :append-to-body="true" width="50%" :before-close="infoHandleClose">
        <el-table :data="infoData">
          <el-table-column label="指标" prop="name">
            <!--            <template slot-scope="scope">-->
            <!--&lt;!&ndash;              <div v-if="scope.row.name != ''">{{ scope.row.name }}</div>&ndash;&gt;-->
            <!--              <div>{{ scope.row.id__crawl_engine_status_stats_data.name}}</div>-->
            <!--            </template>-->
          </el-table-column>
          <el-table-column label="值" prop="value"></el-table-column>
        </el-table>
        <div class="app-pagination">
          <el-pagination
            :total="infoTotal"
            :page-sizes="pageSizes"
            :page-size="infoPageSize"
            :current-page="infoCurrentPage"
            @size-change="infoHandleSizeChange"
            @current-change="infoHandleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
				<el-button @click="infoVisible = false">关 闭</el-button>
			</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import permission from '@/components/mixin/permission';
    export default {
        mixins: [permission],
        name: 'engine_status',
        data() {
            return {
                //查询
                searchData: {
                    engine: "境外采集引擎"
                },
                engines: [],

                searchForm: {},
                errorWhere: [],
                infoWhere: [],
                //列表相关
                loading: false,
                tableData: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                pageSizes: [20, 50, 100, 200],
                errorDataPageSize: 20,
                errorDataTotal: 0,
                errorDataCurrentPage: 1,
                countDataPageSize: 20,
                countDataTotal: 0,
                countDataCurrentPage: 1,
                platformData: [],
                countData: [],
                //弹窗相关
                infoVisible: false,
                errorVisible: false,
                errorCurrentPage: 1,
                infoCurrentPage: 1,
                errorTotal: 0,
                infoTotal: 0,
                errorPageSize: 20,
                infoPageSize: 20,
                errorData: [],
                infoData: [],
            }
        },
        methods: {
            // 修改分页数量
            handleSizeChange (val) {
                this.pageSize = val;
                this.list();
            },
            errorDataHandleSizeChange(val) {
                this.errorDataPageSize = val;
                this.errorDataList()
            },
            errorHandleSizeChange (val) {
                this.errorPageSize = val;
                this.errorList()
            },
            infoHandleSizeChange (val) {
                this.infoCurrentPage = val;
                this.infoList();
            },
            countDataHandleSizeChange(val) {
                this.countDataPageSize = val;
                this.countDataList();
            },
            // 切换分页
            handleCurrentChange (val) {
                this.currentPage = val;
                this.list();
            },
            errorDataHandleCurrentChange(val) {
                this.errorDataCurrentPage = val;
                this.errorDataList();
            },
            errorHandleCurrentChange(val) {
                this.errorCurrentPage = val;
                this.errorList()
            },
            infoHandleCurrentChange(val) {
                this.infoCurrentPage = val;
                this.infoList();
            },
            countDataHandleCurrentChange(val) {
                this.countDataCurrentPage = val;
                this.countDataList();
            },
            //关闭弹窗
            errorHandleClose() {
                this.errorVisible = false;
            },
            infoHandleClose() {
                this.infoVisible = false;
            },
            //查看引擎异常信息
            viewError(val) {
                this.errorVisible = true;
                this.errorList(val);
            },
            //查看统计信息
            viewInfo(val) {
                this.infoVisible = true;
                this.infoList(val);
            },
            //获得引擎列表
            engineList() {
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine",
                        "fields": ["engine_name", "engine_id"]
                    }
                }).then(data => {
                    for(let i=0;i<data.length;i++) {
                        var obj = {};
                        obj.value = data[i];
                        obj.label = data[i];
                        this.engines.push(obj)
                    }
                })
            },
            //获得引擎状态基础信息表
            list() {
                this.loading = true;
                this.$post('/engine/findEngineStatusList' , {
                }).then(data => {
                    this.loading = false;
                    if(data) {
                        this.tableData = data;
                        this.total = data.length;
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$message.error({ message: "获取列表失败!!!", type: "error"})
                })
            },
            //获得异常状态表
            errorDataList() {
                this.loading = true
                this.$post('/action', {
                    data: {
                        "select": "crawl_platform_alarms",
                        "limit": [(this.errorDataCurrentPage - 1) * this.errorDataPageSize, this.errorDataCurrentPage * this.errorDataPageSize],
                        "order": ['time desc']
                    }
                }).then(data => {
                    this.loading = false;
                    if(data) {
                        this.platformData = data.data;
                        this.errorDataTotal = data.total;
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$message.error({ message: "获取异常信息失败!!!", type: "error" })
                })
            },
            //获得引擎异常详细信息表
            errorList(val) {
                this.loading = true;
                this.errorWhere = 'crawl_engine_status.id=' + val.id
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine_alarms",
                        "join": "crawl_engine_status",
                        "limit": [(this.errorCurrentPage - 1) * this.errorPageSize, this.errorCurrentPage * this.errorPageSize],
                        "where": this.errorWhere
                    }
                }).then(data => {
                    this.loading = false;
                    if(data) {
                        this.errorData = data.data;
                        this.errorTotal = data.total;
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$message.error({ message: "获取异常信息失败!!!", type: "error" })
                })
            },
            //获得引擎统计信息表
            infoList(val) {
                this.loading = true;
                this.$post('/engine/statusStats/' + val.id, {
                }).then(data => {
                    this.loading = false;
                    this.infoData = data;
                    this.infoTotal = data.length;
                }).catch(error => {
                    this.loading = false;
                    this.message({ message: "获取统计信息失败!!!", type: "error"})
                })
            },
            //引擎统计信息
            countDataList(){},
            search() {
            },
            load() {
                this.list();
                this.errorDataList()
            },
            clear() {}
        },
        created() {
            // this.engineList();
        },
        mounted() {
            this.$user = JSON.parse(localStorage.user);
            this.load()
        },
        destroyed() {
            this.clear();
        }
    }
</script>

<style>
  .page-engine_status {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color: #606266
  }
  .page-engine_status .page-engine_status_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
  }
  .page-engine_status
  .page-engine_status_box
  .search_form
  .title{
    font-size: 20px;
    height: 35px;
    line-height: 35px;
  }
  .page-engine_status
  .page-engine_status_box
  .search_form
  .title
  i {
    margin-right: 5px;
  }
  .page-engine_status
  .page-engine_status_box
  .search_form
  .inner {
    margin-top: 15px;
  }
  .page-engine_status
  .page-engine_status_box
  .search_form
  .inner
  .el-input {
    max-width: 30%;
    margin-right: 20px;
  }
  .page-engine_status
  .page-engine_status_box
  .search_form
  .inner
  > span {
    margin-right: 10px;
  }
  .page-engine_status .page-engine_status_box .list {
    background: #fff;
    text-align: center;
    border-right: 1px solid #ebeef5;
    padding: 0 15px;
  }
  .page-engine_status .page-engine_status_box .list:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .page-engine_status .page-engine_status_box .title i{
    margin-right:10px;
  }
  .page-engine_status
  .page-engine_status_box
  .list
  .app-table
  .label_p {
    font-size: 15px;
    height: 35px;
    line-height: 35px;
    text-align: left;
  }

  .page-engine_status
  .page-engine_status_box
  .list
  .el-table--small
  th,
  .page-engine_status
  .page-engine_status_box
  .list
  .el-table--small
  td {
    background: #fff;
    text-align: center;
  }
  .page-engine_status
  .page-engine_status_box
  .code {
    margin: 15px 0;
    background: #fff;
  }
  .page-engine_status
  .page-engine_status_box
  .el-table__expanded-cell {
    padding: 15px;
  }
</style>
