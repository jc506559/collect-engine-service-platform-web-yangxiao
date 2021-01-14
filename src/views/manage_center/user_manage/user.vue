<template>
  <div class="page-user">
    <!-- 新增 & 批量删除 -->
    <div style="padding:15px;">
      <div class="app-page-box-content clearfix">
        <el-button type="success" @click="editConfirm('insert')">新增</el-button>
        <el-button type="danger" :disabled="delBatchBtnDisabled" @click="delBatchConfirm">批量删除</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div class="app-page-box">
      <!-- 表格 -->
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
          prop="username"
          label="用户名"
          sortable="custom">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="联系人"
          sortable="custom">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          prop="company_name"
          label="公司名"
          sortable="custom">
          <template slot-scope="scope">{{ scope.row.company_name }}</template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          sortable="custom">
          <template slot-scope="scope">
            <div v-if="scope.row.phone">{{ scope.row.phone }}</div>
            <div v-else>未填写</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          sortable="custom">
          <template slot-scope="scope">
            <div v-if="scope.row.email">{{ scope.row.email }}</div>
            <div v-else>未填写</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sys_user_role.sys_role.name"
          label="角色"
          sortable="custom">
          <template slot-scope="scope">{{ scope.row.id__sys_user_role.role_id__sys_role.name }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120px"
          sortable="custom">
          <template slot-scope="scope">
            <!-- @特殊处理 自己不能修改自己以及综合业务管理系统单点登录创建的用户-->
            <el-select size="mini" :disabled="user.id === scope.row.id || scope.row.company_name === '综合业务管理系统'"
                       v-model="scope.row.status" @change="changeStatus(scope.row)" >
              <el-option
                v-for="item in statusList"
                :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="150px"
          sortable="custom">
          <template slot-scope="scope">{{ scope.row.create_time | datetime }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140px">
          <template slot-scope="scope">
            <!--综合业务管理系统单点登录的用户不应该可以被修改或删除 -->
            <el-button type="text" @click="editConfirm('update', scope.row)" v-show="scope.row.company_name !== '综合业务管理系统'">修改</el-button>
            <!-- <div class="operation-line"></div> -->
            <el-button @click="delConfirm(scope.row)" v-show="user.id !== scope.row.id && scope.row.company_name !== '综合业务管理系统'" type="text" class="text-color-red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <el-dialog class="edit-dialog" width="40%" append-to-body :before-close="resetEditForm" :title="editDialogDisplayTitle"
               :visible.sync="editDialogVisible">
      <el-form status-icon label-width="85px"
               :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户名:" prop="username">
          <input type="password" name="username" style="position: fixed;left: -9999px;">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="联系人:" prop="name">
          <input type="password" name="name" style="position: fixed;left: -9999px;">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="公司名:" prop="companyName">
          <input type="password" name="companyName" style="position: fixed;left: -9999px;">
          <el-input v-model="editForm.companyName"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <input type="password" name="password" style="position: fixed;left: -9999px;">
          <el-input type="password" v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPassword">
          <el-input type="password" v-model="editForm.checkPassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item class="margin-bottom-clear" label="角色:" prop="roleId">
          <el-select v-model="editForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  class="margin-bottom-clear" label="账户类型:" prop="accountType">
          <el-select v-model="editForm.accountType" placeholder="请选择" @change="serverChange">
            <el-option
            v-for="item in accountType"
            :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="closeEditForm">取消</el-button>
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
  import cryptoUtil from '@/lib/cryptoUtil'
  import permission from '@/components/mixin/permission';
  export default {
    mixins: [permission],
    name: 'user',
    computed: {
      // 批量删除的连续姓名
      delBatchNameList() {
        return this.multipleSelection.map(v => v.name).join(", ");
      },
      user() {
        let user = this.localStore.get("user") || this.$store.state.user;
        return user || {}
      }
    },
    data() {

      // 自定义验证 密码确认
      let validateCheckPassword = (rule, value, callback) => {
        let password = this.editForm.password;
        if (value !== password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };

      // 自定义验证 是否重名
      let validateRename = (rule, value, callback) => {
        let display = {username: '用户名', name: '姓名'}; // company_name: '公司名'
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

      return {
        // 表名
        tableName: 'sys_user',
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
          username: [
            {required: true, message: '字段不能为空', trigger: 'blur'},
            {validator: validateRename, trigger: 'blur'},
            {pattern: /^[a-zA-Z]{1}\w*$/, message: '以英文字母开头，只能填写英文字母、数字、下划线', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '字段不能为空', trigger: 'blur'},
            {validator: validateRename, trigger: 'blur'},
          ],
          companyName: [
            {required: true, message: '字段不能为空', trigger: 'blur'},
            // {validator: validateRename, trigger: 'blur'},
          ],
          password: [
            {required: true,min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur'}
          ],
          checkPassword: [
            {required: true,min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'blur'},
            {validator: validateCheckPassword, trigger: 'blur'}
          ],
          phone: [
            {pattern: /^1[3|4|5|8][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur'}
          ],
          email: [
            {type: "email", message: '不是邮箱类型', trigger: 'blur'},
            {required: true, message: '字段不能为空', trigger: 'blur'},
          ],
          roleId: [
            {required: true, message: '字段不能为空', trigger: 'change'},
          ],
          accountType: [
            {required: true, message: '字段不能为空', trigger: 'change'},
          ]
        },
        editForm: {
          id: '',
          name: '',
          email: '',
          phone: '',
          username: '',
          companyName: '',
          password: '',
          checkPassword: '',
          roleId: '',
          account_type: null,
        },
        accountType: [{
            value: 1,
            label: '引擎供应商'
        },{
            value: 2,
            label: '平台用户',
            disabled: true
        }
        ],
        statusList: [                   // 用户状态
          {value: 1, label: "正常"},
          {value: 2, label: "锁定"},
        ],
        roleList: [],                   // 角色列表 下拉框
        // 删除弹窗
        delRow: {},                     // 删除时当前临时记录
        delBtnLoading: false,           // 删除弹出框确定按钮的loding
        delDialogVisible: false,        // 删除弹出框弹出框显示状态
        delBatchBtnLoading: false,      // 批量删除弹出框确定按钮的loding
        delBatchDialogVisible: false,   // 批量删除弹出框显示状态
        delBatchBtnDisabled: true,      // 批量删除按钮的禁用状态
        // 列表相关
        where: [],
        order: ["create_time desc"],
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
        this.editDialogVisible = true;
        this.editDialogType = type;
        this.editDialogDisplayTitle = this.editDialogDisplay[type];
        if (type === 'update') {
          this.detail(row);
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
            // @特殊处理, 补充密码加密
            let editForm = JSON.parse(JSON.stringify(this.editForm));
            editForm.password = cryptoUtil.encrypt(editForm.password.trim());
            editForm.checkPassword = cryptoUtil.encrypt(editForm.checkPassword.trim());

            this.editBtnLoading = true;
            this.$post('/user', {
              data: editForm
            }, true).then((data) => {
                this.resetEditForm();
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
      detail(row) {
        this.editRow = row;
        for (let k in this.editForm) {
          if (k === 'roleId') {
            this.editForm['roleId'] = row.id__sys_user_role.role_id || '';
          }
          else if (k !== 'password') {
            this.editForm[k] = row[k] || '';
          }
        }
      },
      // 更新
      update() {
        // 表单验证
        this.$refs["editForm"].validate((valid) => {
          if (valid) {
            // @特殊处理, 补充密码加密
            let editForm = JSON.parse(JSON.stringify(this.editForm));
            editForm.password = cryptoUtil.encrypt(editForm.password.trim())
            editForm.checkPassword = cryptoUtil.encrypt(editForm.checkPassword.trim())

            this.editBtnLoading = true;
            this.$put('/user/' + editForm.id, {
              data: editForm
            }, true).then((data) => {
              this.resetEditForm();
              if (data && data.count === 1) {
                this.editBtnLoading = false;
                this.$message.success({message: '更新成功', type: 'success'});
                this.list();
              }
            })
          }
        });
      },
      // 表单重置
      resetEditForm() {
        this.editDialogVisible = false;
        let editForm = this.$refs["editForm"];
        editForm.clearValidate();
        editForm.resetFields();
        // @特殊处理, 针对编辑情况的重置
        for (let k in this.editForm) {
          this.editForm[k] = '';
        }
      },
      closeEditForm() {
          this.editDialogVisible = false;
          this.resetForm('editForm');
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
                "delete": "sys_user_role",
                "where": "user_id=" + this.delRow.id
              }
            ]
          }
        }, true).then((data) => {
          if (Array.isArray(data) && data[0].count === 1 && data[1].count === 1) {
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
                          "detail": "删除用户成功，对应用户名为" + this.delRow.name,
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
                          "detail": "删除用户对应角色成功，对应用户名为" + this.delRow.name,
                          "is_submitted": 0
                      }
                  }
              });
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
                        "detail": "删除用户失败，对应用户名为" + this.delRow.name,
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
                        "detail": "删除用户对应角色失败，对应用户名为" + this.delRow.name,
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
                "delete": "sys_user_role",
                "where": "user_id=" + ids
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
                        "detail": "批量删除用户成功，对应用户ID为" + ids,
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
                        "detail": "删除用户对应角色成功，对应ID为" + this.delRow.name,
                        "is_submitted": 0
                    }
                }
            });
          let len = this.multipleSelection.length;
          if (Array.isArray(data) && data[0].count === len && data[1].count === len) {
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
                        "detail": "批量删除用户失败，对应用户ID为" + ids,
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
                        "detail": "批量删除用户对应角色失败，对应用户ID为" + ids,
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
        // @特殊处理 自己不能删除自己以及综合业务管理系统单点登录注册的用户
        return row.id !== this.user.id && row.company_name !== '综合业务管理系统'
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
            "join": ["sys_user_role", "sys_role"],
            "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
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
      // 修改用户状态
      changeStatus(row) {
        let value = {
          "status": row.status
        }
        row.status === 1 && (value["login_error_count"] = 0)
        this.$post('/action', {
          data: {
            "update": this.tableName,
            "where": 'id=' + row.id,
            "values": value
          }
        }, true).then((data) => {
          if (data && data.count === 1) {
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
                          "detail": "修改用户状态成功，对应用户ID为" + row.id,
                          "is_submitted": 0
                      }
                  }
              });
            this.$message.success({message: '状态修改成功', type: 'success'});
          }
        }).catch(err => {
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
                        "detail": "修改用户状态失败，对应用户ID为" + this.editSysInfoForm.id,
                        "is_submitted": 0
                    }
                }
            });
        })
      },
      // 获取角色列表
      getRoleList() {
        this.$post('/action', {
          data: {
            "select": "sys_role",
            "fields": ["name as label", "id as value"]
          }
        }, true).then((data) => {
          this.roleList = data;
          for(var i = 0; i < this.roleList.length; i ++){
              // 管理员选项不可用
              if(this.roleList[i].label == "管理员") {
                  this.roleList[i].disabled = true;
              }
          }

        })
      },
      serverChange() {
        this.$forceUpdate();
      },
      //重置已经判断的表单规则
      resetForm (formName) {
          this.$refs[formName].resetFields();
      },
      // 加载
      load() {
        this.getRoleList();
        this.list();
      },
    },
    mounted() {
      this.load();
    }
  }
</script>

<style>
  .page-user .app-page-box{
		padding:0 15px;
  }
</style>
