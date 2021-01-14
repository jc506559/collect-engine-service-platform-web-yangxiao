<template>
  <div class="page-role">
    <!-- 新增 & 批量删除 -->
    <div style="padding:15px;">
      <div class="app-page-box-content clearfix">
        <el-button type="success" @click="editConfirm('insert')">新增</el-button>
        <el-button type="danger" :disabled="delBatchBtnDisabled" @click="delBatchConfirm">批量删除</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div class="app-page-box">

      <el-table
        stripe
        border
        tooltip-effect="dark"
        ref="tableData"
        v-loading="loading"
        :data="tableData"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          :selectable="handleSelectable"
          width="36">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          sortable="custom">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="描述">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140px">
          <template slot-scope="scope">
            <el-button type="text" @click="editConfirm('update', scope.row)">修改</el-button>
            <!-- <div class="operation-line"></div> -->
            <el-button @click="delConfirm(scope.row)" v-show="user.roleId !== scope.row.id" type="text" class="text-color-red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="app-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="total"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

    <!-- 新增 & 编辑 dialog -->
    <el-dialog class="edit-dialog role-edit-dialog" width="50%" append-to-body @close="resetEditForm()"
               :title="editDialogDisplayTitle"
               :visible.sync="editDialogVisible">

      <el-form status-icon label-width="85px"
               :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item class="margin-bottom-clear" label="权限配置:" prop="permissionIds">
          <el-table
            stripe
            border
            :data="permissionList">
            <el-table-column
              prop="name"
              align="left"
              label="模块名">
              <template slot-scope="scope">{{ scope.row.module_name }}</template>
            </el-table-column>
            <el-table-column
              prop="select"
              align="center"
              width="55px"
              label="查询">
              <template slot-scope="scope">
                <el-checkbox v-if="scope.row.query" :disabled="scope.row.query.disabled"
                             v-model="scope.row.query.value"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="insert"
              align="center"
              width="55px"
              label="新增">
              <template slot-scope="scope">
                <el-checkbox v-if="scope.row.add" :disabled="scope.row.query.disabled"
                             v-model="scope.row.add.value"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="update"
              align="center"
              width="55px"
              label="编辑">
              <template slot-scope="scope">
                <el-checkbox v-if="scope.row.update" :disabled="scope.row.query.disabled"
                             v-model="scope.row.update.value"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="delete"
              align="center"
              width="55px"
              label="删除">
              <template slot-scope="scope">
                <el-checkbox v-if="scope.row.delete" :disabled="scope.row.query.disabled"
                             v-model="scope.row.delete.value"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="import"
              align="center"
              width="55px"
              label="导入">
              <template slot-scope="scope">
                <el-checkbox v-if="scope.row.import" :disabled="scope.row.query.disabled"
                             v-model="scope.row.import.value"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="export"
              align="center"
              width="55px"
              label="导出">
              <template slot-scope="scope">
                <el-checkbox v-if="scope.row.export" :disabled="scope.row.query.disabled"
                             v-model="scope.row.export.value"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="editBtnLoading" @click="editSave()">保存</el-button>
      </span>
    </el-dialog>

    <!-- 删除 dialog -->
    <el-dialog class="del-dialog" append-to-body title="提示" :visible.sync="delDialogVisible" width="40%">
      <span>确认删除 {{ delRow.name }} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="del" :loading="delBtnLoading">确定</el-button>
      </span>
    </el-dialog>

    <!-- 批量删除 dialog -->
    <el-dialog class="del-batch-dialog" append-to-body title="提示" :visible.sync="delBatchDialogVisible" width="40%">
      <span>确认批量删除 {{ delBatchNameList }} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delBatchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="delBatch" :loading="delBatchBtnLoading">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import permission from '@/components/mixin/permission';
  export default {
    mixins: [permission],
    name: 'role',
    computed: {
      // 批量删除的连续姓名
      delBatchNameList() {
        return this.multipleSelection.map(v => v.name).join(",");
      },
      user() {
        let user = this.localStore.get("user") || this.$store.state.user;
        return user || {}
      }
    },
    data() {

      // 自定义验证 是否重名
      let validateRename = (rule, value, callback) => {
        let display = {name: '角色名'};
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
            "fields": ["name"]
          }
        }, true).then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            callback(new Error(display[rule.field] + ' ' + value + ' 已存在, 请更换' + display[rule.field] + '重试'))
          } else {
            callback();
          }
        })
      };

      // 自定义必填项复杂验证
      let validateRequired = (rule, value, callback) => {
        let ids = this.getPermissionIds();
        if (ids.length > 0) {
          callback();
        } else {
          callback(new Error('字段不能为空'))
        }
      };

      return {
        // 表名
        tableName: 'sys_role',
        // 新增 & 编辑
        editRow: {},                  // 编辑时当前临时记录
        editDialogVisible: false,     // 编辑弹出框显示状态
        editBtnLoading: false,        // 编辑弹出框的保存按钮的loading
        editDialogType: "",           // 编辑弹出框的当前状态, 是编辑, 还是新增
        editDialogDisplayTitle: "",   // 编辑弹出框的标题
        editDialogDisplay: {          // 编辑弹出框的标题映射
          "insert": "新增",
          "update": "编辑"
        },
        //表单验证
        editFormRules: {
          name: [
            {required: true, message: '字段不能为空', trigger: 'blur'},
            // {pattern: /^[a-zA-Z]{1}\w*$/, message: '以英文字母开头，只能填写英文字母、数字、下划线', trigger: 'blur'},
            {validator: validateRename, trigger: 'blur'},
          ],
          description: [],
          permissionIds: [
            {validator: validateRequired, trigger: 'change'},
          ]
        },
        editForm: {
          id: '',
          name: '',
          description: '',
          permissionIds: []
        },
        permissionType: ['query', 'add', 'update', 'delete', 'import', 'export'],
        permissionListTpl: [],          // 权限列表模板
        permissionList: [],             // 权限列表
        // 删除弹窗
        delRow: {},                     // 删除时当前临时记录
        delBtnLoading: false,           // 删除弹出框确定按钮的loding
        delDialogVisible: false,        // 删除弹出框弹出框显示状态
        delBatchBtnLoading: false,      // 批量删除弹出框确定按钮的loding
        delBatchDialogVisible: false,   // 批量删除弹出框显示状态
        delBatchBtnDisabled: true,      // 批量删除按钮的禁用状态
        // 列表相关
        where: [],
        order: ["id asc"],
        loading: true,
        tableData: [],
        total: 0,
        pageSize: 20,
        pageSizes: [20, 50, 100, 200],
        currentPage: 1,
        multipleSelection: []
      }
    },
    methods: {
      // 新增 & 编辑
      editConfirm(type, row) {
        // 复制权限模板
        this.permissionList = JSON.parse(JSON.stringify(this.permissionListTpl));
        // 显示dialog
        this.editDialogVisible = true;
        this.editDialogType = type;
        this.editDialogDisplayTitle = this.editDialogDisplay[type];

        let modules = ["user", "role"];
        if (type === 'update') {
          this.detail(row, modules);
        } else {
          // @特殊处理 新增需要隐藏用户管理和角色管理
          this.filterPermissionList(modules);
        }
      },
      // 保存事件
      editSave() {
        this[this.editDialogType]();
      },
      // 新增
      insert() {
        // 表单验证
        this.$refs["editForm"].validate((valid) => {
          if (valid) {
            this.editBtnLoading = true;
            this.editForm.permissionIds = this.getPermissionIds();
            this.$post('/role', {
              data: this.editForm
            }, true).then((data) => {
              if (data.id !== 0) {
                this.editBtnLoading = false;
                this.editDialogVisible = false;
                this.$message.success({message: '新增成功', type: 'success'});
                this.list();
              }
            })
          }
        });
      },
      // 更新时查询单条
      detail(row, modules) {
        this.editRow = row;
        // @特殊处理
        // 管理员(id == 1) 禁用所有选项, 其他角色 隐藏用户管理和角色管理
        if (row.id === 1) {
          this.setDisabledPermissionList(modules);
        } else {
          this.filterPermissionList(modules);
        }
        let ids = row.id__sys_role_permission.permission_id__sys_permission.map(v => v.id);
        for (let k in this.editForm) {
          if (k === 'permissionIds') {
            //  设置权限列表选中
            this.setSelectedPermissionList(ids);
          } else {
            this.editForm[k] = row[k] || '';
          }
        }
      },
      // 更新
      update() {
        // 表单验证
        this.$refs["editForm"].validate((valid) => {
          if (valid) {
            this.editBtnLoading = true;
            this.editForm.permissionIds = this.getPermissionIds();
            this.$put('/role/' + this.editForm.id, {
              data: this.editForm
            }, true).then((data) => {
              if (data && data.count === 1) {
                this.editBtnLoading = false;
                this.editDialogVisible = false;
                this.$message.success({message: '更新成功', type: 'success'});
                this.list();
              }
            })
          }
        });
      },
      // 表单重置
      resetEditForm() {
        let editForm = this.$refs["editForm"];
        editForm.clearValidate();
        editForm.resetFields();
        // @特殊处理, 针对编辑情况的重置
        for (let k in this.editForm) {
          this.editForm[k] = '';
        }
      },
      // 删除框
      delConfirm(row) {
        this.delRow = row;
        this.delDialogVisible = true;
      },
      // 删除
      del() {
        this.delBtnLoading = true;
        this.$post('/action', {
          data: {
            "transaction": [
              {
                "delete": this.tableName,
                "where": "id=" + this.delRow.id
              },
              {
                "delete": "sys_role_permission",
                "where": "role_id=" + this.delRow.id
              }
            ]
          }
        }, true).then((data) => {
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "成功",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "删除角色成功，对应角色ID为" + this.delRow.id,
                        "is_submitted": 0
                    }
                }
            });
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "成功",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "删除角色对应权限成功，对应角色ID为" + this.delRow.id,
                        "is_submitted": 0
                    }
                }
            });
          if (Array.isArray(data) && data[0].count === 1 && data[1].count > 0) {
            this.delBtnLoading = false;
            this.delDialogVisible = false;
            this.$message.success({message: '删除成功', type: 'success'});
            this.list();
          }
        }).catch(err => {
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "失败",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "删除角色失败，对应角色ID为" + this.delRow.id,
                        "is_submitted": 0
                    }
                }
            });
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "失败",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "删除角色对应权限成功，对应角色ID为" + this.delRow.id,
                        "is_submitted": 0
                    }
                }
            });
        });
      },
      // 批量删除框
      delBatchConfirm() {
        this.delBatchDialogVisible = true;
      },
      // 批量删除
      delBatch() {
        this.delBatchBtnLoading = true;
        let ids = this.multipleSelection.map(v => v.id).join(',');
        this.$post('/action', {
          data: {
            "transaction": [
              {
                "delete": this.tableName,
                "where": 'id=' + ids
              },
              {
                "delete": "sys_role_permission",
                "where": "role_id=" + ids
              }
            ]
          }
        }, true).then(data => {
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "成功",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "批量删除角色成功，对应角色ID为" + ids,
                        "is_submitted": 0
                    }
                }
            });
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "成功",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "批量删除角色对应权限成功，对应角色ID为" + ids,
                        "is_submitted": 0
                    }
                }
            });
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "失败",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "删除角色对应权限失败，对应角色ID为" + ids,
                        "is_submitted": 0
                    }
                }
            });
          let len = this.multipleSelection.length;
          if (Array.isArray(data) && data[0].count === len && data[1].count > 0) {
            this.delBatchBtnLoading = false;
            this.delBatchDialogVisible = false;
            this.$message.success({message: '批量删除成功', type: 'success'});
            this.list();
          }
        }).catch(err => {
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "失败",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "批量删除角色失败，对应角色ID为" + ids,
                        "is_submitted": 0
                    }
                }
            });
            this.$post('/action', {
                data: {
                    "insert": "audit_log",
                    "values": {
                        "user": this.localStore.get("user").username,
                        "operate": "删除",
                        "result": "失败",
                        "client": this.localStore.get("client").client,
                        "object_type": "平台",
                        "object_id": 0,
                        "detail": "删除角色对应权限失败，对应角色ID为" + ids,
                        "is_submitted": 0
                    }
                }
            });
        });
      },
      // 修改分页数量
      handleSizeChange(val) {
        this.pageSize = val;
        this.list();
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.list();
      },
      // 行首的复选框是否可以被勾选
      handleSelectable(row, index) {
        // @特殊处理 自己不能删除自己
        return row.id !== this.user.roleId;
      },
      // 勾选选中项, 并批量删除按钮状态
      handleSelectionChange(arr) {
        // 全部选择 this.$refs.multipleTable.data.length === val.length
        // 部分选择
        if (arr.length >= 1) {
          this.delBatchBtnDisabled = false;
        } else {
          this.delBatchBtnDisabled = true;
        }
        this.multipleSelection = arr;
      },
      // 排序
      handleSortChange(column) {
        // console.log(column, prop, order);
        this.order = column.prop && column.order
          ? [column.prop + ' ' + column.order.replace("ending", "")]
          : [];
        this.list();
      },
      // 列表
      list() {
        this.loading = true;
        this.$post('/action', {
          data: {
            "select": this.tableName,
            "join": ["sys_role_permission", "sys_permission"],
            "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
            "where": this.where,
            "order": this.order
          }
        }).then((data) => {
          this.loading = false;
          if (data && Array.isArray(data.data)) {
            this.total = data.total;
            this.tableData = data.data;
          }
        })
      },
      // 加载权限列表
      loadPermissionListTpl() {
        this.$post('/action', {
          data: {
            "select": "sys_permission",
            "order": "id asc"
          }
        }, true).then((data) => {
          if (Array.isArray(data)) {
            let modules = [];            // 控制顺序
            let values = {};             // 分组
            this.permissionListTpl = []; // 重置
            // 分类
            data.forEach(v => {
              if (!values[v.module]) {
                modules.push(v);
                values[v.module] = []
              }
              values[v.module].push(v);
            });
            // 聚合
            modules.forEach(m => {
              let item = {
                "module": m.module,
                "module_name": m.module_name,
              };
              values[m.module].forEach(v => {
                item[v.action] = {
                  id: v.id,
                  value: false,
                  disabled: false,
                };
              });
              this.permissionListTpl.push(item);
            });
            // console.log(this.permissionListTpl);
          }
        })
      },
      // 过滤权限列表的指定模块
      filterPermissionList(modules) {
        this.permissionList = this.permissionList.filter(v => {
          return !(modules.indexOf(v.module) !== -1)
        })
      },
      // 设置权限列表 指定模块的操作复选框 为禁用状态
      setDisabledPermissionList(modules) {
        let type = this.permissionType;
        this.permissionList.forEach(v => {
          type.forEach(t => {
            // modules.indexOf(v.module) !== -1 ? true : false
            v[t] && (v[t].disabled = true);
          });
        })
      },
      // 设置权限列表 指定模块的操作复选框 选中状态
      setSelectedPermissionList(ids) {
        let type = this.permissionType;
        this.permissionList.forEach(v => {
          type.forEach(t => {
            v[t] && (v[t].value = ids.indexOf(v[t].id) !== -1 ? true : false);
          });
        });
      },
      // 获取权限列表里面的选中id
      getPermissionIds() {
        let ids = [];
        let type = this.permissionType;
        this.permissionList.forEach(v => {
          type.forEach(t => {
            v[t] && v[t].value && ids.push(v[t].id);
          });
        });
        return ids;
      },
      // 加载
      load() {
        this.loadPermissionListTpl();
        this.list();
      },
    },
    mounted() {
      this.load();
    }
  }
</script>

<style>
  .page-role .app-page-box{
		padding:0 15px;
  }
  .role-edit-dialog .el-form-item.is-error .el-form-item__content .el-table {
    border: 1px solid #f56c6c;
    border-radius: 5px;
  }
</style>
