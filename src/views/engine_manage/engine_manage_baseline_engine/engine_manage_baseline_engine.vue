<template>
  <div class="page-baseline_engine">
    <div class="page-baseline_engine_box">
      <div class="search_form">
        <div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
        <div class="inner">
          <span>引擎名称</span>
          <el-input v-model="searchData.name" placeholder="请输入"></el-input>
          <span>标签</span>
          <el-input v-model="searchData.name" placeholder="请输入"></el-input>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <div class="list">
        <el-table :data="tableData" border style="width: 100%" @row-dblclick="getCalibrationRceport()">
          <el-table-column prop="id" label="引擎ID">
          </el-table-column>
          <el-table-column prop="engine_name" label="引擎名称">
          </el-table-column>
          <el-table-column prop="tag" label="引擎标签">
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
          </el-table-column>
          <el-table-column prop="status" label="运行状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status =='0'" type="danger">未启动</el-tag>
              <el-tag v-if="scope.row.status =='1'" type="success">已启动</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="verify_type" label="认证状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.verify_type == 0" type="danger">未认证</el-tag>
              <el-tag v-if="scope.row.verify_type == 1" type="success">已认证</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="edit" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small">注销</el-button>
              <el-button type="text" size="small">下发任务</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="list_pagination">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total"/>
        </div>
      </div>
    </div>

    <!-- 校验报告 -->
    <el-dialog class="alibration-dialog" append-to-body title="校验报告" :visible.sync="alibrationRceportDialog"
               width="800px">
      <ul class="task-log-list">
        <li class="title">任务日志</li>
        <li>日志</li>
        <li>日志</li>
        <li>日志</li>
        <li>日志</li>
        <li>日志</li>
        <li>采集数据量:<span class="blue">5</span>条</li>
      </ul>
      <footer class="dialog-footer">
        <el-button type="primary">下载</el-button>
      </footer>
    </el-dialog>
  </div>

</template>

<script>
  import permission from "@/components/mixin/permission";

  export default {
    mixins: [permission],
    name: "baseline_engine",
    data() {
      return {
        // 校验报告
        alibrationRceportDialog: false,

        searchData: {
          name: "",
          tag: ""
        },

        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        where: [],
      };
    },
    methods: {
      // 校验报告
      getCalibrationRceport() {
        this.alibrationRceportDialog = true;
      },
      handleSizeChange(val) {
          this.pageSize = val;
      },
      handleCurrentChange(val) {
          this.currentPage = val;
      },
      //获取基线引擎列表
      getBaselineEngine() {
        this.where.push("enabled=1");
        this.where.push("engine_type=1");
        this.$post('/action', {
            data: {
                "select": "crawl_engine",
                "join": "sys_user",
                "where": this.where,
                "limit": [(this.currentPage - 1) * pageSize, this.currentPage * pageSize],
            }
        }).then(data => {
            this.total = data.total;
            this.tableData = data.data;
        })
      },
    },
    mounted() {
    }
  };
</script>

<style>
  .page-baseline_engine {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
  }

  .page-baseline_engine .page-baseline_engine_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
  }

  .page-baseline_engine
  .page-baseline_engine_box
  .search_form
  .title {
    height: 35px;
    line-height: 35px;
  }

  .page-baseline_engine
  .page-baseline_engine_box
  .search_form
  .title
  i {
    margin-right: 5px;
  }

  .page-baseline_engine
  .page-baseline_engine_box
  .search_form
  .inner {
    margin-top: 10px;
  }

  .page-baseline_engine
  .page-baseline_engine_box
  .search_form
  .inner
  .el-input {
    max-width: 30%;
    margin-right: 20px;
  }

  .page-baseline_engine
  .page-baseline_engine_box
  .search_form
  .inner
  > span {
    margin-right: 10px;
  }

  .page-baseline_engine .page-baseline_engine_box .list {
    background: #fff;
    text-align: center;
    margin-top: 15px;
    border-right: 1px solid #ebeef5;
  }

  .page-baseline_engine .page-baseline_engine_box .list:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;

  }

  .page-baseline_engine
  .page-baseline_engine_box
  .list
  .el-table--small
  th,
  .page-baseline_engine
  .page-baseline_engine_box
  .list
  .el-table--small
  td {
    background: #fff;
    text-align: center;
  }

  .page-baseline_engine
  .page-baseline_engine_box
  .list
  .list_pagination {
    margin: 20px;
  }

  .alibration-dialog .task-log-list {
    border: 1px solid #ededed;
  }

  .alibration-dialog .task-log-list li.title {
    text-align: center;
    background-color: #fefefe;
  }

  .alibration-dialog .task-log-list li.title:hover {
    background-color: #fefefe;
    color: #898989;
  }

  .alibration-dialog .task-log-list li {
    height: 33px;
    line-height: 33px;
    padding: 0 16px;
    color: #898989;
    border-bottom: 1px solid #ededed;
    cursor: pointer;
  }

  .alibration-dialog .task-log-list li:hover {
    background-color: #f8f8ff;
    color: #73a2fc;
  }

  .alibration-dialog .task-log-list li:last-child {
    border-bottom: none;
  }

  .alibration-dialog .task-log-list li .blue {
    padding: 0 3px;
    color: #73a2fc;
  }

  .alibration-dialog .dialog-footer {
    margin-top: 20px;
    text-align: center;
  }


</style>
