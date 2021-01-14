<template>
  <div class="page-engine_access_auth_label">
    <div class="page-engine_access_auth_label_box">
      <div class="label_form">
        <div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
        <div class="inner">
          <span>引擎名称</span>
          <el-input v-model="searchForm.engine_name" placeholder="请输入"></el-input>
          <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
<!--     table表格-->
  <div class="app-table">
    <p class="label_p">数据标签</p>
    <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="tableData" v-loading="loading" >
      <el-table-column prop="engine_id" label="引擎ID" align="center">
      </el-table-column>
      <el-table-column prop="engine_id__crawl_engine.engine_name" label="引擎名称" align="center">
      </el-table-column>
      <el-table-column prop="last_time" label="标签获取时间" align="center">
      </el-table-column>
      <el-table-column prop="tag_type" label="标签类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.tag_type =='1'" >日志</el-tag>
          <el-tag v-if="scope.row.tag_type =='2'" >文件</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="270">
        <template slot-scope="scope">
          <div class="app-table-column-operate">
            <el-button type="text" size="small" @click="update()">更新</el-button>
            <el-button type="text" size="small" @click="viewTag(scope.row)">查看</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
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
    <el-dialog title="查看标签数据" :visible.sync="dialogVisible" :append-to-body="true" width="50%" :before-close="handleClose">
      <pre style="padding:20px;background:#e3e6e8;border-radius:5px;">{{jsonData}}</pre>
      <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">关 闭</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
    import permission from '@/components/mixin/permission';
    export default {
        mixins: [permission],
        name: 'engine_label',
        data() {
            return {
                $user:null,//当前登录用户
                //查询
                searchForm: {},
                // 列表相关
                tableName: "crawl_engine_tag",
                loading: false,
                where: [],
                currentPage: 1,
                pageSize: 1,
                total: 0,
                pageSizes: [1, 50, 100, 200],
                tableData: [],
                multipleSelection: [],
                // xxx
                jsonData: '',
                dialogVisible: false,
            }
        },
        methods: {
            search() {
                this.currentPage = 1
                this.where = []
                if (this.searchForm.engine_name) {
                    this.where.push('engine_name%=%' + this.searchForm.engine_name + '%')
                }
                this.list();
            },
            //更新标签
            update() {
            },
            //查看标签数据
            viewTag(row) {
                let data = '';
                try {
                    data = JSON.stringify(JSON.parse(row.data), null, "\t")
                } catch(e){
                    data = row.data;
                }
                this.jsonData = data;
                this.dialogVisible = true;
            },
            // 修改分页数量
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
            handleClose() {
                this.dialogVisible = false;
            },

            //获取列表
            list() {
                this.loading = true;
                this.$post('/action', {
                    data: {
                        "select": this.tableName,
                        "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                        "join": "crawl_engine",
                        "where": this.where,
                    }
                }).then(data => {
                    this.loading = false;
                    if (data && Array.isArray(data.data)) {
                        this.tableData = data.data;
                        this.total = data.total
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$message.error({ message: "获取列表失败!!!", type: "error"})
                })
            },
            load() {
                this.list();
            },
            clear() {
            }
        },
        mounted() {
            // this.$user = JSON.parse(localStorage.user);
            // this.$store.getters.user
            this.load()
        },
        destroyed() {
            this.clear()
        }
    }
</script>

<style>
  .page-engine_access_auth_label {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color: #606266;
  }
  .page-engine_access_auth_label .page-engine_access_auth_label_box{
    height: 100%;
    background: #fff;
  }
  .page-engine_access_auth_label .page-engine_access_auth_label_box .label_form{
    background: #fff;
    padding: 15px;
  }
  .page-engine_access_auth_label .page-engine_access_auth_label_box .app-table{
    padding: 0 15px;
  }
  .page-engine_access_auth_label
    .page-engine_access_auth_label_box
    .label_form
    .title{
    height: 35px;
    line-height: 35px;
  }
  .page-engine_access_auth_label
    .page-engine_access_auth_label_box
    .label_form
    .title
    i {
    margin-right: 5px;
  }
  .page-engine_access_auth_label
    .page-engine_access_auth_label_box
    .label_form
    .inner
    .el-input {
    max-width: 30%;
    margin-right: 20px;
  }
  .page-engine_access_auth_label
    .page-engine_access_auth_label_box
    .label_form
    .inner
    > span {
    margin-right: 10px;
  }
  p.label_p{
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
</style>
