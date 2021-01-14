<template>
  <div class="page-engine_manage_label_manage">
    <div class="page-engine_manage_label_manage_box">
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
      <el-table-column prop="engine_id" label="引擎ID" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="engine_id__crawl_engine.engine_name" label="引擎名称" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="last_time" label="标签获取时间" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.last_time.substring(0,19) }}
        </template>
      </el-table-column>
      <el-table-column prop="tag_type" label="标签类型" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.tag_type =='1'" >日志</el-tag>
          <el-tag v-if="scope.row.tag_type =='2'" >文件</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="270">
        <template slot-scope="scope">
          <div class="app-table-column-operate">
            <el-button type="text" size="small" @click="editConfirm('update', scope.row)">更新</el-button>
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
      <!-- 更新 & 查看 弹窗 类型名称(文本框) 版本(文本框) 数据格式-->
    </div>
    <el-dialog title="查看标签数据" :visible.sync="dialogVisible" :append-to-body="true" width="50%" :before-close="handleClose">
      <pre style="padding:20px;background:#e3e6e8;border-radius:5px;">{{ jsonData }}</pre>
      <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">关 闭</el-button>
			</span>
    </el-dialog>
    <el-dialog
      width="750px"
      class="quota_type-edit-dialog"
      :append-to-body="true"
      :before-close="closeEditDialog"
      :title="editDialogDisplayTitle"
      :visible.sync="editDialogVisible">
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-with="100px">
        <el-form-item label="数据信息" prop="data">
          <el-input v-model="editForm.data" clearable placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取消</el-button>
        <el-button type="primary" :loading="editBtnLoading" @click="saveEditForm()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import permission from '@/components/mixin/permission';
    export default {
        mixins: [permission],
        name: 'engine_manage_label_manage',
        data() {
            // 自定义验证 是否重名
            let validateRename = (rule, value, callback) => {
                value = value.trim()
                let display = { name: '引擎类型名称' };
                // 编辑情况下, 过滤自己的名字
                if (this.editDialogType === 'update') {
                    if (this.editRow[rule.field] === value) {
                        return callback();
                    }
                }
                this.$post('/action', {
                    data: {
                        "select": this.tableName,
                        "where": rule.field + '=' + value,
                    }
                }, true).then((data) => {
                    if (Array.isArray(data) && data.length > 0) {
                        callback(new Error(display[rule.field] + ' ' + value + ' 已存在, 请更换' + display[rule.field] + '重试'))
                    } else {
                        callback();
                    }
                })
            };
            return {
                $user:null,//当前登录用户
                //查询
                searchForm: {},
                // 列表相关
                tableName: "crawl_engine_tag",
                loading: false,
                where: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                pageSizes: [20, 50, 100, 200],
                tableData: [],
                //当前row
                currentRow: null,
                //编辑和查看相关
                jsonData: '',
                editBtnLoading: false,
                dialogVisible: false,
                editDialogVisible: false,
                editDialogType: "",
                editDialogDisplayTitle: "",   // 编辑弹出框的标题
                editDialogDisplay: {          // 编辑弹出框的标题映射
                    "update": "编辑数据类型信息"
                },
                editFormRules: {
                    data: [
                        { required: true, message: '请输入标签数据', trigger: 'blur'},
                        { validator: validateRename, trigger: 'blur'},
                    ]
                },
                editForm: {
                    data: null,
                    engine_id: null,
                }
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
            editConfirm(type, row) {
                this.editDialogVisible = true;
                this.editDialogType = type;
                this.editDialogDisplayTitle = this.editDialogDisplay[type];
                if(type === 'update') {
                    this.detail(row);
                }else {
                    this.currentRow = row;
                }
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
            handleClose() {
                this.dialogVisible = false;
            },
            //关闭弹窗
            closeEditDialog() {
                this.editDialogVisible = false;
                this.resetEditForm();
            },
            //保存
            saveEditForm() {
                this.$post('/action', {
                    data: {
                        "update": this.tableName,
                        'values': {
                            data: this.editForm.data
                        },
                        'where': ['id=' + this.editForm.engine_id ]
                    }
                }).then(data => {
                    this.$post('/action', {
                        data: {
                            "insert": "audit_log",
                            "values": {
                                "user": this.localStore.get("user").username,
                                "operate": "更新",
                                "result": "成功",
                                "client": this.localStore.get("client").client,
                                "object_type": "平台",
                                "object_id": 0,
                                "detail": "修改引擎标签JSON成功，对应引擎标签ID为" + this.editForm.engine_id,
                                "is_submitted": 0
                            }
                        }
                    });
                    this.editForm = {
                        data: '',
                        engine_id: ''
                    };
                    this.$message.success({ message: "修改成功", type: "success"});
                    this.editDialogVisible = false;
                    this.search();
                }).catch(error => {
                    this.$post('/action', {
                        data: {
                            "insert": "audit_log",
                            "values": {
                                "user": this.localStore.get("user").username,
                                "operate": "更新",
                                "result": "失败",
                                "client": this.localStore.get("client").client,
                                "object_type": "平台",
                                "object_id": 0,
                                "detail": "修改引擎标签JSON失败，对应引擎标签ID为" + this.editForm.engine_id,
                                "is_submitted": 0
                            }
                        }
                    });
                    this.editForm = {
                        data: '',
                        engine_id: ''
                    };
                    this.$message.error({ message: "更新失败", type: "error"});
                    this.editDialogVisible = false;
                })
            },
            // 更新时查询单条
            detail (row) {
                this.editRow = row;
                for (let k in this.editForm) {
                    this.editForm[k] = row[k] || '';
                }
            },
            //表单重置
            resetEditForm() {
                let editForm = this.$refs["editForm"];
                if(editForm) {
                    editForm.clearValidate();
                    editForm.resetFields();
                }
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
            this.$user = JSON.parse(localStorage.user);
            this.load()
        },
        destroyed() {
            this.clear()
        }
    }
</script>

<style>
  .page-engine_manage_label_manage {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color: #606266;
  }
  .page-engine_manage_label_manage .page-engine_manage_label_manage_box{
    height: 100%;
    background: #fff;
  }
  .page-engine_manage_label_manage .page-engine_manage_label_manage_box .label_form{
    background: #fff;
    padding: 15px;
  }
  .page-engine_manage_label_manage .page-engine_manage_label_manage_box .app-table{
    padding: 0 15px;
  }
  .page-engine_manage_label_manage
    .page-engine_manage_label_manage_box
    .label_form
    .title{
    height: 35px;
    line-height: 35px;
  }
  .page-engine_manage_label_manage
    .page-engine_manage_label_manage_box
    .label_form
    .title
    i {
    margin-right: 5px;
  }
  .page-engine_manage_label_manage
    .page-engine_manage_label_manage_box
    .label_form
    .inner
    .el-input {
    max-width: 30%;
    margin-right: 20px;
  }
  .page-engine_manage_label_manage
    .page-engine_manage_label_manage_box
    .label_form
    .inner
    > span {
    margin-right: 10px;
  }
  .page-engine_manage_label_manage
    .page-engine_manage_label_manage_box
    .app-table
    p.label_p{
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
  }
  .page-engine_manage_label_manage
    .page-engine_manage_label_manage_box
    .demo-table-expand
    label {
    width: 90px;
    color: #99a9bf;
  }
</style>
