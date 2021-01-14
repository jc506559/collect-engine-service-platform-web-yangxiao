<!-- 异常日志：每个引擎回传回来的error日志，包括日志的级别，引擎ID，引擎名称，日志时间，日志内容（设置最大显示长度，可展开看全部） -->
<template>
  <div class="page-exception_log">
    <div class="page-exception_log_box">
      <div class="app-table">
<!--        <div class="title1"><i class="icon iconfont icon-baogao"></i>异常日志</div>-->
        <div class="search_form">
          <div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
          <div class="inner">
            <span>引擎名称</span>
            <el-input v-model="searchForm.engine_name" placeholder="请输入"></el-input>
            <span>引擎id</span>
            <el-input v-model="searchForm.engine_id" placeholder="请输入"></el-input>
            <span>日志时间</span>
            <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <el-button type="primary" @click="search" icon="el-icon-search" v-loading="loading">搜索</el-button>
          </div>
        </div>
        <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="tableData" v-loading="loading">
          <el-table-column prop="level" label="日志级别" align="center">
          </el-table-column>
          <el-table-column prop="engine_id" label="引擎id" align="center">
          </el-table-column>
          <el-table-column prop="engine_id__crawl_engine.engine_name" label="引擎名称" align="center">
          </el-table-column>
          <el-table-column prop="time" label="日志时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.time.substring(0, 19)}}
            </template>
          </el-table-column>
          <el-table-column label="日志内容" align="center">
<!--            <template slot-scope="scope">-->
<!--              <p class="hiddenDiv">{{ scope.row.detail }}</p>-->
<!--              <el-popover placement="bottom" trigger="click">-->
<!--                <textarea style="border:0;border-radius:5px;" cols="60" rows="10">{{ scope.row.detail }}</textarea>-->
<!--                <el-button slot="reference">查看</el-button>-->
<!--              </el-popover>-->
<!--            </template>-->
            <template slot-scope="scope">
              <div class="app-table-column-operate">
                <el-button type="text" size="small" @click="viewDetail('日志内容', scope.row)">查看</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 查看弹窗 -->
      <el-dialog :title="viewDisplayTitle" :visible.sync="dialogVisible" :append-to-body="true" width="85%" :before-close="handleClose">
        <pre style="padding: 20px;background: #e3e6e8;border-radius: 5px; white-space: pre-wrap"> {{ jsonData }}</pre>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
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
</template>

<script>
  import permission from '@/components/mixin/permission';
  export default {
    mixins: [permission],
    name: 'exception_log',
    data() {
      return {
          //列表相关
          searchForm: {},
          where: [],
          loading: false,
          currentPage: 1,
          pageSize: 20,
          total: 0,
          pageSizes: [20, 50, 100, 200],
          tableData: [],
          //弹窗相关
          viewDisplayTitle: '',
          dialogVisible: false,
          jsonData: ''
      }
    },
    methods: {
        search() {
            this.loading = false;
            this.currentPage = 1
            this.where = [];
            this.where.push("level=ERROR");
            this.where.push("engine_id!=");
            this.where.push("engine_id!=null");
            if (this.searchForm.engine_name) {
                this.where.push('engine_name%=%' + this.searchForm.engine_name + '%')
            }
            if (this.searchForm.engine_id) {
                this.where.push('engine_id%=%' + this.searchForm.engine_id + '%')
            }
            if(this.searchForm.time) {
                let time = this.searchForm.time;
                this.where.push(`time=${time[0]}~${time[1]}`)
            }
            this.list();
        },
        //修改分页数量
        handleSizeChange (val) {
            this.pageSize = val;
            this.list();
        },
        // 切换分页
        handleCurrentChange (val) {
            this.currentPage = val;
            this.list();
        },
        // 排序
        handleSortChange (column) {
            // console.log(column, prop, order);
            this.order = column.prop && column.order
                ? [column.prop + ' ' + column.order.replace("ending", "")]
                : [];
            this.list();
        },
        list() {
          this.loading = true;
          if(this.where.length == 0) {
              this.where.push('level=ERROR');
              this.where.push("time=" + this.startTime() + "~" + this.endTime());
              this.where.push("engine_id!=");
          }
          this.$post('/action', {
              data: {
                  "select": "crawl_log",
                  "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                  "join": "crawl_engine",
                  "where": this.where,
                  "order": ['time desc']
              }
          }).then(data => {
              this.loading = false;
              if(data) {
                  this.tableData = data.data;
                  this.total = data.total
              }
          }).catch(error => {
              this.loading = false;
              this.$message.error({ message: "获取列表失败", type: "error"})

          })
        },
        //查看日志内容
        viewDetail(title, row) {
            this.viewDisplayTitle = title;
            let data = '';
            try {
                data = JSON.stringify(JSON.parse(row.detail), null, "\t");
                console.log(data)
            }catch (e) {
                data = row.detail;
            }
            this.jsonData = data;
            this.dialogVisible = true;
        },
        //关闭查看弹窗
        handleClose() {
            this.dialogVisible = false
        },
        startTime() {
            var date = new Date(new Date(new Date().toLocaleDateString()).getTime());
            var start = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1):(date.getMonth() + 1))+ "-" + (date.getDate() < 10 ? "0" + date.getDate():date.getDate()) + " " + (date.getHours()<10?"0"+date.getHours():date.getHours()) + ":" + (date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()) + ":" + (date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds())
            return start;
        },
        endTime() {
            var date = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
            var end = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            return end;
        },
        load() {
            this.list();
        },
        clear() {}
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
  .page-exception_log {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color: #606266
  }
  .page-exception_log .page-exception_log_box{
    height: 100%;
    background: #fff;
  }
  .page-exception_log .page-exception_log_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
  }
  .page-exception_log
  .page-exception_log_box
  .search_form
  .title {
    height: 35px;
    line-height: 35px;
  }
  .page-exception_log
  .page-exception_log_box
  .search_form
  .title
  i {
    margin-right: 5px;
  }
  .page-exception_log
  .page-exception_log_box
  .search_form
  .inner {
    margin-top: 10px;
  }
  .page-exception_log
  .page-exception_log_box
  .search_form
  .inner
  .el-input {
    max-width: 20%;
    margin-right: 20px;
  }
  .page-exception_log
  .page-exception_log_box
  .search_form
  .inner
  > span {
    margin-right: 10px;
  }
  .page-exception_log .page-exception_log_box .list {
    background: #fff;
    text-align: center;
    border-right: 1px solid #ebeef5;
    padding: 0 15px;
  }
  .page-exception_log .page-exception_log_box .list:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .page-exception_log .page-exception_log_box .title1 {
    padding-top: 15px;
    padding-left: 15px;
    font-size: 20px;
    line-height: 35px;
  }
  .page-exception_log .page-exception_log_box .title {
    font-size: 20px;
    line-height: 35px;
  }
  .page-exception_log .page-exception_log_box .title i{
    margin-right:10px;
  }
  .page-exception_log
    .page-exception_log_box
    .app-table
    .hiddenDiv {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .page-exception_log
    .page-exception_log_box
    .list
    .el-table--small
    th,
  .page-exception_log
    .page-exception_log_box
    .list
    .el-table--small
    td {
    background: #fff;
    text-align: center;
  }
  .page-exception_log
    .page-exception_log_box
    .code {
    margin: 15px 0;
    background: #fff;
  }
  .page-exception_log
    .page-exception_log_box
    .el-table__expanded-cell {
    padding: 15px;
  }
</style>
