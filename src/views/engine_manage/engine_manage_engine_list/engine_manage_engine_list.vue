<template>
	<div class="page-registration_engine_list">
		<div class="page-registration_engine_list_box">
			<div class="search_form">
				<div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
				<div class="inner">
					<span>引擎名称</span>
					<el-input v-model="searchForm.engine_name" placeholder="请输入" @keyup.enter.native="search"></el-input>
					<span>标签</span>
					<el-input v-model="searchForm.tag" placeholder="请输入" @keyup.enter.native="search"></el-input>
					<el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
				</div>
			</div>
			<div class="list" v-loading="loading">
				<el-table
          border tooltip-effect="dark"
          :data="tableData" style="width:
          100%" ref="singleTable"
          :highlight-current-row="true"
          @expand-change="selectCurrentRow"
          row-key="id"
          :expand-row-keys="openRow">
					<el-table-column type="expand">
						<template slot-scope="props">
							<!-- 引擎类型列表 -->
							<engineType ref="engineType" />
						</template>
					</el-table-column>
					<el-table-column prop="id__crawl_task_setting_engine_relation.task_setting_rules_range_no" label="引擎ID" sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.id__crawl_task_setting_engine_relation">{{ scope.row.id__crawl_task_setting_engine_relation.task_setting_rules_range_no }}</div>
              <div v-if="!scope.row.id__crawl_task_setting_engine_relation">{{ scope.row.id }} </div>
            </template>
					</el-table-column>
					<el-table-column prop="engine_name" label="引擎名称">
					</el-table-column>
          <el-table-column prop="engine_type" label="引擎类型" sortable>
            <template slot-scope="scope">
              <div v-if="scope.row.engine_type == 0">普通引擎</div>
              <div v-if="scope.row.engine_type == 1">基线引擎</div>
            </template>
          </el-table-column>
					<el-table-column prop="engine_version" width="80px" label="引擎版本">
					</el-table-column>
					<el-table-column prop="tag" label="标签" ref="columnRef">
            <template slot-scope="scope">
              <div style="text-align: left">
                <el-tag v-for="item in scope.row.tag" :key="item"
                        closable
                        @close="handleClose(scope.row.id,item)"
                >{{ item }}</el-tag>
<!--                <el-input class="input-new-tag"-->
<!--                          v-if="inputVisible[scope.row.id]"-->
<!--                          v-model="inputValue"-->
<!--                          ref="tagInput"-->
<!--                          size="small"-->
<!--                          @keyup.enter.native="handleInputConfirm(scope.row.id)"-->
<!--                          @blur="handleInputConfirm(scope.row.id)"-->
<!--                ></el-input>-->
                <el-input class="input-new-tag"
                          v-model="inputValue[scope.row.engine_name]"
                          ref="tagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                          placeholder="增加标签"
                ></el-input>
              </div>
            </template>
					</el-table-column>
					<el-table-column prop="user_id" width="80px" label="供应商">
						<template slot-scope="scope">
							{{scope.row.user_id__sys_user.name}}
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="接入时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.create_time.substring(0,19) }}
            </template>
					</el-table-column>
					<el-table-column prop="status" label="运行状态" align="center">
						<template slot-scope="scope">
							<el-tag v-if="scope.row.status =='0'" type="danger">未启动</el-tag>
							<el-tag v-if="scope.row.status =='1'" type="success">已启动</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="verify_type" label="认证状态" align="center">
						<template slot-scope="scope">
							<el-tag v-if="scope.row.verify_type =='0'" type="danger">未认证</el-tag>
							<el-tag v-if="scope.row.verify_type =='1'" type="success">已认证</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="edit" label="操作">
						<template slot-scope="scope">
							<el-button v-if="scope.row.enabled ==1" type="text" size="small" @click="editConfirm('update', scope.row)" :disabled="!getPermission('update')">编辑</el-button>
							<el-button v-if="scope.row.enabled ==1" type="text" size="small" @click="del('id', scope.row)">注销</el-button>
							<el-button v-if="scope.row.enabled ==1" type="text" size="small" @click="addType(scope.row)">添加数据类型</el-button>
							<el-button v-if="scope.row.enabled ==1" type="text" size="small" @click="addEngine(scope.row)">引擎认证</el-button>
              <!-- 新增录入ID的页面 -->
              <el-button v-if="scope.row.enabled ==1" type="text" size="small" @click="addId(scope.row)">录入ID</el-button>
              <el-button v-if="scope.row.enabled ==1" type="text" size="small" @click="addConfiguration(scope.row, 'add')" :disabled="!getPermission('add')">添加配置格式</el-button>
              <el-button v-if="scope.row.enabled ==1" type="text" size="small" @click="addTaskSetting(scope.row)">添加任务配置</el-button>
              <el-button v-if="scope.row.engine_type == 1" type="text" size="small" @click="addEngineBaseRelation(scope.row)">配置普通引擎映射关系</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="app-pagination">
					<el-pagination :total="total" :page-size="pageSize" :page-sizes="pageSizes" :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
				</div>
			</div>
			<!-- 新增 & 编辑 弹窗  -->
			<el-dialog width="750px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeEditDialog" :title="editDialogDisplayTitle" :visible.sync="editDialogVisible">
				<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="140px">
					<el-form-item label="引擎名称" prop="engine_name">
						<el-input v-model="editForm.engine_name" clearable placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="引擎版本" prop="engine_version">
						<el-input v-model="editForm.engine_version" clearable placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="采集目标网址" prop="crawl_target">
						<el-input v-model="editForm.crawl_target" clearable placeholder="请输入" rows="3" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="标签" prop="tag">
						<el-input v-model="editForm.tag" clearable placeholder="请输入"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="closeEditDialog">取消</el-button>
					<el-button type="primary" :loading="editBtnLoading" @click="saveEditForm()">保存</el-button>
				</span>
			</el-dialog>
      <!-- 新增录入ID的弹窗 -->
      <el-dialog width="500px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeAddId" title="录入ID" :visible.sync="AddIdVisible">
        <el-form :model="AddIdForm" label-width="140px" ref="addIdForm">
          <el-form-item label="任务配置规则列表项生效范围项编号" prop="task_setting_rules_range_no">
            <el-input v-model="AddIdForm.task_setting_rules_range_no" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="引擎Id" prop="engine_id">
            <el-input v-model="AddIdForm.engine_id" disabled></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
					<el-button @click="closeAddId">取消</el-button>
					<el-button type="primary" :loading="editBtnLoading" @click="saveAddId()">保存</el-button>
				</span>
      </el-dialog>
      <!-- 配置基线引擎与普通引擎的映射关系 -->
      <el-dialog width="500px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeAddId" title="配置基线引擎与普通引擎映射关系" :visible.sync="engineBaseRelationVisible">
        <el-form :model="engineBaseRelationForm" label-width="140px" ref="engineBaseRelationForm" :rules="engineBaseRelationFormRules">
          <el-form-item label="基线引擎ID" prop="basis_engine_id">
            <el-input v-model="engineBaseRelationForm.basis_engine_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="对应普通引擎ID" prop="engine_id">
            <el-input v-model="engineBaseRelationForm.engine_id"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
				<el-button @click="closeAddId">取消</el-button>
				<el-button type="primary" @click="saveEngineBaseRelation()">保存</el-button>
			</span>
      </el-dialog>
      <!-- 新增添加配置格式的弹窗 -->
      <el-dialog width="750px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeConfigurationDialog" title="添加配置格式" :visible.sync="configurationDialogVisible">
        <el-form :model="configurationForm" :rules="configurationFormRules"  ref="addConfigurationForm" label-width="100px">
<!--          <el-form-item label="类型名称" prop="name" label-width="120px">-->
<!--            <el-input v-model="configurationForm.name" clearable placeholder="请输入"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="数据格式版本" prop="version" label-width="120px">-->
<!--            <el-input v-model="configurationForm.version" clearable placeholder="请输入"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="数据格式" prop="data_format" label-width="120px">
            <el-input v-model="configurationForm.data_format" clearable placeholder="请输入" rows="6" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="数据格式描述" prop="description" label-width="120px">
            <el-input v-model="configurationForm.description" clearable placeholder="请输入" rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
				<el-button @click="closeConfigurationDialog">取消</el-button>
				<el-button type="primary" :loading="editBtnLoading" @click="saveConfigurationForm()">保存</el-button>
			</span>
      </el-dialog>
		</div>
		<engineType v-if="!engineRowDetail" v-show="false" />
	</div>
</template>

<script>
	import permission from "@/components/mixin/permission";
	import engineType from './engine_type';
	import axios from 'axios'
	import { mapGetters } from 'vuex'
	export default {
		mixins: [permission],
		name: "engine_manage_engine_list",
		computed: {
			...mapGetters({
				engineRowDetail: "engineRowDetail"
			})
		},
		data () {
			return {
				//openRow
				openRow: [1],
				$user:null,//当前登录用户
				// 查询
				searchForm: {},
				// 过滤
				filterFields: ['name'],
				filterValue: '',
				// 页面标题描述相关
				// 编辑相关
				editBtnLoading: false,
				editDialogVisible: false,
        configurationDialogVisible: false,
        AddIdVisible: false,
				editDialogType: "",
				editDialogDisplayTitle: "",   // 编辑弹出框的标题
				editDialogDisplay: {          // 编辑弹出框的标题映射
					"insert": "新建",
					"update": "编辑引擎信息"
				},
        //增加引擎标签相关
        inputVisible: {},
        inputValue: {},
				//注册表单信息
				editForm: {
					engine_name: "",
					engine_version: "",
					tag: "",
					crawl_target: "",
					type: [],
					id: null,
				},
        // 添加配置格式表单信息
        configurationForm: {
				    name: null,
            version: null,
            data_format: null,
            description: null,
            enabled: null,
            engine_id: null,
        },
        //录入ID表单信息
        AddIdForm: {
				    task_setting_rules_range_no: "",
            engine_id: ""
        },
				// 注册表单验证
				editFormRules: {
					engine_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
					engine_version: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
					tag: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
					crawl_target: [{ required: true, message: '请输入活动名称', trigger: 'blur' },],
				},
        // 配置格式表单验证
        configurationFormRules: {
            // name: [
            //     { required: true, message: '请输入引擎类型', trigger: 'blur' },
            // ],
            version: [
                { required: true, message: '请输入类型版本', trigger: 'blur' },
            ],
            data_format: [
                { required: true, message: '请输入数据格式', trigger: 'blur' },
            ],
        },
        // 配置基线引擎与普通引擎映射关系验证
        engineBaseRelationFormRules: {
				  engine_id: [
              { required: true, message: '请输入普通引擎ID', trigger: 'blur'}
          ]
        },
				// 删除相关
				deleteBatchBtnDisabled: true,
				// 列表相关
				tableName: "crawl_engine",
				loading: false,
				order: ['id'],
				where: [],
				currentPage: 1,
				pageSize: 20,
				total: 0,
				pageSizes: [20, 50, 100, 200],
				tableData: [],
				multipleSelection: [],
				currentRow: null,
        engineBaseRelationVisible: false,
        engineBaseRelationForm: {
				    basis_engine_id: null,
            engine_id: null
        },
        engineBaseRelationType: ''
			}
		},
		components: {
			engineType
		},
		methods: {
        // 权限管理，获取该用户在该页面的权限
        getPermission(type) {
            return this.permission.engine_manage_engine_list[type];
        },
        // 认证引擎
        addEngine(row) {
            axios.get('/api/engine/authentication', {
                headers: {
                    "Source": encodeURI('百度'), //固定写死
                    "EngineId": row.id,// crawl_engine 表的id 字段
                }
            }).then(res => {
                let data = res.data;
                if (data.code == 200) {
                    this.$message.success({message: '认证成功', type: 'success'});
                    this.list();
                } else {
                    this.$message.error({message: data.message, type: 'error'});
                }
            }).catch(err => {
                this.$message.error({message: '认证失败', type: 'error'})
            })
        },
        //新增引擎类型
        addType(val) {
            this.$store.commit('addEngineTypeStatus', null);
            this.$nextTick(() => {
                this.$store.commit('addEngineTypeStatus', val)
            })
        },
        // 选中当前行
        selectCurrentRow(val) {
            this.$store.commit('engineRowDetail', null);
            this.$nextTick(() => {
                let openRow = JSON.parse(JSON.stringify(this.openRow));
                if (openRow == val.id) {
                    this.openRow = null;
                    this.$store.commit('engineRowDetail', null)
                } else {
                    this.openRow = [val.id];
                    this.$store.commit('engineRowDetail', val)
                }
            });
            this.currentRow = val;
        },
        // 搜索
        search() {
            this.currentPage = 1;
            this.where = [];
            if (this.searchForm.engine_name) {
                this.where.push('engine_name%=%' + this.searchForm.engine_name + '%')
            }
            if (this.searchForm.tag) {
                this.where.push('tag%=%' + this.searchForm.tag + '%')
            }
            this.list();
        },
        // 标签移除与增加功能组
        handleClose(id, tag) {
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].id == id) {
                    this.tableData[i].tag.splice(this.tableData[i].tag.indexOf(tag), 1);
                    this.$post('/action', {
                        data: {
                            "update": "crawl_engine",
                            "where": "id=" + id,
                            "values": {
                                "tag": this.tableData[i].tag.toString()
                            }
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
                                    "detail": "更新引擎标签成功，对应引擎ID为" + id,
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.$message.success({message: "修改成功", type: "success"})
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
                                    "detail": "更新引擎标签失败",
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.$message.error({message: "修改失败", type: "error"})
                    })
                }
            }
        },
        handleInputConfirm(row) {
            let inputValue = this.inputValue[row.engine_name];
            this.inputValue[row.engine_name] = null;
            if (inputValue) {
                for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].id == row.id) {
                        if (this.tableData[i].tag) {
                            this.tableData[i].tag.push(inputValue);
                        } else {
                            this.tableData[i].tag = [];
                            this.tableData[i].tag.push(inputValue);
                        }
                        this.$post('/action', {
                            data: {
                                "update": "crawl_engine",
                                "where": "id=" + row.id,
                                "values": {
                                    "tag": this.tableData[i].tag.toString()
                                }
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
                                        "detail": "更新引擎标签成功，对应引擎ID为" + row.id,
                                        "is_submitted": 0
                                    }
                                }
                            });
                            this.$message.success({message: "修改成功", type: "success"})
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
                                        "detail": "更新引擎标签失败",
                                        "is_submitted": 0
                                    }
                                }
                            });
                            this.$message.error({message: "修改失败", type: "error"})
                        })
                    }
                }
            }
            this.inputVisible[row.engine_name] = false;
        },
        // 关闭弹窗
        closeEditDialog() {
            this.editDialogVisible = false;
            this.resetEditForm();
        },
        closeAddId() {
            this.engineBaseRelationVisible = false;
            this.AddIdVisible = false;
            this.resetEditForm();
        },
        closeConfigurationDialog() {
            this.configurationDialogVisible = false;
            this.resetEditForm()
        },
        // 新增 & 编辑
        editConfirm(type, row) {
            //验证权限
            if (this.getPermission(type)) {
                this.editDialogVisible = true;
                this.editDialogType = type;
                this.editDialogDisplayTitle = this.editDialogDisplay[type];
                if (type === 'update') {
                    this.detail(row);
                }
            } else {
                this.$message.error({message: "没有操作权限", type: "error"})
            }

        },
        addId(row) {
            this.AddIdVisible = true;
            this.AddIdForm.engine_id = row.id;
            //如果引擎已经录入过，就在页面上显示出录入的数值
            this.$post('/action', {
                data: {
                    "select": "crawl_task_setting_engine_relation",
                    "where": "engine_id=" + row.id
                }
            }).then(data => {
                if (data.length != 0) {
                    this.AddIdForm.task_setting_rules_range_no = data[0].task_setting_rules_range_no
                }
            })
        },
        addConfiguration(row, type) {
            if (this.getPermission(type)) {
                this.configurationDialogVisible = true;
                this.configurationForm.engine_id = row.id;
                this.configurationForm.enabled = row.status;
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine_setting_format",
                        "where": "engine_id=" + row.id
                    }
                }).then(data => {
                    if (data.length != 0) {
                        this.configurationForm.data_format = data[0].format;
                        this.configurationForm.description = data[0].description
                    }
                })
            } else {
                this.$message.error({message: "没有操作权限", type: "error"})
            }
        },
        //添加任务配置
        addTaskSetting(row) {
            this.$router.push({
                name: "log_view_configuration",
                params: {
                    id: row.id
                }
            })
        },
        //配置基线引擎与普通引擎的映射关系
        addEngineBaseRelation(row) {
            this.$post('/action', {
                data: {
                    "select": "crawl_engine_base_relation",
                    "where": ["basis_engine_id=" + row.id]
                }
            }).then(data => {
                if (data.length != 0) {
                    for (let k in this.engineBaseRelationForm) {
                        this.engineBaseRelationForm[k] = data[0][k];
                        this.engineBaseRelationType = 'update';
                    }
                } else {
                    this.engineBaseRelationForm.basis_engine_id = row.id;
                    this.engineBaseRelationType = 'insert'
                }
                this.engineBaseRelationVisible = true;
            })
        },
        //保存基线引擎与普通引擎的映射关系
        saveEngineBaseRelation() {
            //更新或新增
            if (this.engineBaseRelationType == 'update') {
                this.$post('/action', {
                    data: {
                        "select": "crawl_task_setting_engine_relation",
                        "where": ["task_setting_rules_range_no=" + this.engineBaseRelationForm.engine_id]
                    }
                }).then(data => {
                    if (data.length != 0) {
                        this.$post('/action', {
                            data: {
                                "update": "crawl_engine_base_relation",
                                "where": ["basis_engine_id=" + this.engineBaseRelationForm.basis_engine_id],
                                values: {
                                    "engine_id": data[0].engine_id
                                }
                            }
                        }).then(data => {
                            this.$message.success({message: "添加映射关系成功！", type: "success"});
                            this.engineBaseRelationVisible = false;
                        }).catch(data => {
                            this.$message.error({message: "添加映射关系失败！", type: "error"});
                            this.engineBaseRelationVisible = false;
                        })
                    } else {
                        this.$post('/action', {
                            data: {
                                "update": "crawl_engine_base_relation",
                                "where": ["basis_engine_id=" + this.engineBaseRelationForm.basis_engine_id],
                                values: {
                                    "engine_id": this.engineBaseRelationForm.engine_id
                                }
                            }
                        }).then(data => {
                            this.$message.success({message: "添加映射关系成功！", type: "success"});
                            this.engineBaseRelationVisible = false;
                        }).catch(data => {
                            this.$message.error({message: "添加映射关系失败！", type: "error"});
                            this.engineBaseRelationVisible = false;
                        })
                    }
                })
            } else {
                this.$post('/action', {
                    data: {
                        "select": "crawl_task_setting_engine_relation",
                        "where": ["task_setting_rules_range_no=" + this.engineBaseRelationForm.engine_id]
                    }
                }).then(data => {
                    if (data.length != 0) {
                        this.$post('/action', {
                            data: {
                                "insert": "crawl_engine_base_relation",
                                values: {
                                    "basis_engine_id": this.engineBaseRelationForm.basis_engine_id,
                                    "engine_id": data[0].engine_id
                                }
                            }
                        }).then(data => {
                            this.$message.success({message: "添加映射关系成功！", type: "success"});
                            this.engineBaseRelationVisible = false;
                        }).catch(data => {
                            this.$message.error({message: "添加映射关系失败！", type: "error"});
                            this.engineBaseRelationVisible = false;
                        })
                    } else {
                        this.$post('/action', {
                            data: {
                                "insert": "crawl_engine_base_relation",
                                values: {
                                    "basis_engine_id": this.engineBaseRelationForm.basis_engine_id,
                                    "engine_id": this.engineBaseRelationForm.engine_id
                                }
                            }
                        }).then(data => {
                            this.$message.success({message: "添加映射关系成功！", type: "success"});
                            this.engineBaseRelationVisible = false;
                        }).catch(data => {
                            this.$message.error({message: "添加映射关系失败！", type: "error"});
                            this.engineBaseRelationVisible = false;
                        })
                    }
                })
            }
        },
        // 保存
        saveEditForm() {
            this[this.editDialogType]();
        },
        saveAddId() {
            this.$post('/action', {
                data: {
                    "select": "crawl_task_setting_engine_relation",
                    "where": "engine_id=" + this.AddIdForm.engine_id
                }
            }).then(data => {
                if (data.length != 0) {
                    this.where = "engine_id=" + this.AddIdForm.engine_id;
                    this.updateTaskSettingRulesRangeNo();
                } else {
                    this.addTaskSettingRulesRangeNo();
                }
                this.AddIdVisible = false;
                this.editBtnLoading = false;
                this.resetEditForm()
            }).catch(err => {
                this.AddIdVisible = false;
                this.editBtnLoading = false;
                this.$message.error({message: "录入ID失败", type: "error"});
                this.resetEditForm()
            });
        },
        saveConfigurationForm() {
            this.$post('/action', {
                data: {
                    "select": "crawl_engine_setting_format",
                    "where": "engine_id=" + this.configurationForm.engine_id
                }
            }).then(data => {
                if (data.length != 0) {
                    this.$post('/action', {
                        data: {
                            "update": "crawl_engine_setting_format",
                            "values": {
                                // "name": this.configurationForm.name,
                                // "version": this.configurationForm.version,
                                "format": this.configurationForm.data_format,
                                "enabled": this.configurationForm.enabled,
                                "description": this.configurationForm.description
                            },
                            "where": "engine_id=" + this.configurationForm.engine_id,
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
                                    "detail": "更新配置格式成功，配置格式内容为" + this.configurationForm.data_format,
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.configurationDialogVisible = false;
                        this.$message.success({message: "配置数据格式成功", type: "success"})
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
                                    "detail": "更新配置格式失败",
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.configurationDialogVisible = false;
                        this.$message.error({message: err, type: "error"})
                    })
                } else {
                    this.$post('/action', {
                        data: {
                            "insert": "crawl_engine_setting_format",
                            "values": {
                                "engine_id": this.configurationForm.engine_id,
                                // "name": this.configurationForm.name,
                                // "version": this.configurationForm.version,
                                "format": this.configurationForm.data_format,
                                "enabled": this.configurationForm.enabled,
                                "description": this.configurationForm.description
                            },
                        }
                    }).then(data => {
                        this.$post('/action', {
                            data: {
                                "insert": "audit_log",
                                "values": {
                                    "user": this.localStore.get("user").username,
                                    "operate": "新增",
                                    "result": "成功",
                                    "client": this.localStore.get("client").client,
                                    "object_type": "平台",
                                    "object_id": 0,
                                    "detail": "添加配置格式成功，配置格式内容为" + this.configurationForm.data_format,
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.configurationDialogVisible = false;
                        this.$message.success({message: "配置数据格式成功", type: "success"})
                    }).catch(err => {
                        this.$post('/action', {
                            data: {
                                "insert": "audit_log",
                                "values": {
                                    "user": this.localStore.get("user").username,
                                    "operate": "新增",
                                    "result": "失败",
                                    "client": this.localStore.get("client").client,
                                    "object_type": "平台",
                                    "object_id": 0,
                                    "detail": "添加配置格式失败",
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.configurationDialogVisible = false;
                        this.$message.error({message: err, type: "error"})
                    })
                }
            })

        },
        // 新增
        insert() {
            // 表单验证
            this.$refs["editForm"].validate((valid) => {
                if (valid) {
                    this.editBtnLoading = true;
                    let editForm = JSON.parse(JSON.stringify(this.editForm));
                    editForm.create_id = this.user.id;
                    delete editForm.id
                    this.loading = true;
                    this.$post('/action', {
                        data: {
                            'insert': this.tableName,
                            "values": editForm
                        }
                    }).then(res => {
                        this.loading = false;
                        this.editBtnLoading = false;
                        this.editDialogVisible = false;
                        this.$message.success({message: '新建指标类型成功', type: 'success'});
                        this.resetEditForm();
                        this.list();
                    }).catch(err => {
                        this.loading = false;
                        this.$message.error({message: "新建指标类型失败", type: "error"});
                        this.editBtnLoading = false
                    })
                }
            });
        },
        // 更新时查询单条
        detail(row) {
            this.editRow = row;
            for (let k in this.editForm) {
                if (k === 'tag' && row[k]) {
                    this.editForm[k] = row[k].toString();
                } else {
                    this.editForm[k] = row[k] || '';
                }
            }
        },
        // 修改更新
        update() {
            this.loading = true;
            // 表单验证
            this.$refs["editForm"].validate(async (valid) => {
                if (valid) {
                    this.editBtnLoading = true;
                    let editForm = JSON.parse(JSON.stringify(this.editForm));
                    let this_ = this;
                    //更新引擎表
                    let updateCrawlEngine = function(editForm) {
                        return new Promise((resolve, reject) => {
                            this_.$post('/action', {
                                data: {
                                    "update": this_.tableName,
                                    "values": editForm,
                                    "where": ["id=" + editForm.id]
                                }
                            }).then(data => {
                                if(data) {
                                    resolve();
                                } else {
                                    reject();
                                }
                            }).catch(err => {
                                reject();
                            })
                        })
                    };
                    //删除URL表里所有内容
                    let deleteEngineUrl = function(editForm) {
                        return new Promise((resolve, reject) => {
                            this_.$post('/action', {
                                data: {
                                    "delete": "crawl_engine_monitor",
                                    "where": ["engine_id=" + editForm.id]
                                }
                            }).then(data => {
                                resolve();
                            }).catch(err => {
                                reject();
                            })
                        })
                    };
                    let insertEngineUrl = function(editForm) {
                        return new Promise((resolve, reject) => {
                            let crawlTarget = editForm.crawl_target.split(",");
                            for(let i = 1; i<= crawlTarget.length; i++) {
                                this_.$post('/action', {
                                    data: {
                                        "insert": "crawl_engine_monitor",
                                        "values": {
                                            "engine_id": editForm.id,
                                            "crawl_target": crawlTarget[i-1]
                                        }
                                    }
                                }).then(data => {
                                    if(i == crawlTarget.length) {
                                        resolve();
                                    }
                                }).catch(err => {
                                    reject();
                                })
                            }
                        })
                    };
                    Promise.all([await deleteEngineUrl(editForm), updateCrawlEngine(editForm), insertEngineUrl(editForm)]).then(result => {
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
                                    "detail": "更新引擎信息成功，对应引擎ID为" + editForm.id,
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.loading = false;
                        this.$message.success({message: "修改成功", type: "success"});
                        this.editBtnLoading = false;
                        this.editDialogVisible = false;
                        this.resetEditForm();
                        this.list();
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
                                    "detail": "更新引擎信息失败",
                                    "is_submitted": 0
                                }
                            }
                        });
                        this.loading = false;
                        this.$message.error({message: "修改失败", type: "error"});
                        this.editBtnLoading = false
                    });
                }
            });
        },
        // 表单重置
        resetEditForm() {
            let editForm = this.$refs["editForm"];
            let addIdForm = this.$refs["addIdForm"];
            let configurationForm = this.$refs["addConfigurationForm"];
            let engineBaseEngineForm = this.$refs["engineBaseRelationForm"];
            if (editForm) {
                editForm.clearValidate();
                editForm.resetFields();
            }
            if (addIdForm) {
                addIdForm.clearValidate();
                addIdForm.resetFields();
            }
            if (configurationForm) {
                configurationForm.clearValidate();
                configurationForm.resetFields();
            }
            if (engineBaseEngineForm) {
                engineBaseEngineForm.clearValidate();
                engineBaseEngineForm.resetFields();
            }
            // @特殊处理, 针对编辑情况的重置
            for (let k in this.editForm) {
                this.editForm[k] = '';
            }
            for (let k in this.AddIdForm) {
                this.AddIdForm[k] = '';
            }
            for (let k in this.configurationForm) {
                this.configurationForm[k] = '';
            }
            for (let k in this.engineBaseRelationForm) {
                this.engineBaseRelationForm[k] = ''
            }
        },
        // 删除
        del(field, row) {
            this.$confirm('此操作将注销该引擎, 是否继续?', '注销', {
                confirmButtonText: '保存',
                type: 'warning'
            }).then(() => {
                //
                let ids = this.multipleSelection.map(v => v.id).join(',');
                row && (ids = [row[field]].join(','))
                this.loading = true;
                this.$post(
                    `/engine/deleteEngine/${ids}`
                ).then(data => {
                    this.loading = false;
                    this.$message.success({type: 'success', message: '注销成功'});
                    this.list();
                }).catch(err => {
                    this.loading = false;
                    this.$message.error({type: 'error', message: '注销失败'});
                })
            }).catch(() => {
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
        // 勾选选中项, 并批量删除按钮状态
        handleSelectionChange(arr) {
            // 部分选择
            if (arr.length >= 1) {
                this.deleteBatchBtnDisabled = false;
            } else {
                this.deleteBatchBtnDisabled = true;
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
        // 获取列表
        list() {
            if (this.$user.roleId != 1) {
                this.where.push('user_id=' + this.$user.id);
            }
            this.where.push('enabled=' + 1);
            this.loading = true;
            this.$post('/action', {
                data: {
                    "select": this.tableName,
                    "join": ['sys_user', 'crawl_task_setting_engine_relation'],
                    "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                    "where": this.where,
                    "order": this.order
                }
            }).then(data => {
                this.loading = false;
                if (data && Array.isArray(data.data)) {
                    this.tableData = data.data;
                    for (var i = 0; i < this.tableData.length; i++) {
                        this.inputVisible[this.tableData[i].id] = false;
                        if (this.tableData[i].tag) {
                            this.tableData[i].tag = this.tableData[i].tag.split(",");
                        }
                    }
                    this.total = data.total;
                }
            }).catch(error => {
                this.loading = false;
                this.$message.error({message: "获取列表失败", type: "error"})
            })
        },
        //更新引擎任务配置规则列表项生效范围项编号
        updateTaskSettingRulesRangeNo() {
            this.$post('/action', {
                data: {
                    "update": "crawl_task_setting_engine_relation",
                    "where": this.where,
                    "values": {
                        "engine_id": this.AddIdForm.engine_id,
                        "task_setting_rules_range_no": this.AddIdForm.task_setting_rules_range_no
                    }
                }
            }).then(data => {
                if (data.code == 200) {
                    this.$message.success({message: "录入ID成功！", type: "success"});
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
                                "detail": "更新引擎任务配置规则列表项生效范围项编号成功，对应编号为" + this.AddIdForm.task_setting_rules_range_no + "对应引擎ID为" + this.AddIdForm.engine_id,
                                "is_submitted": 0
                            }
                        }
                    });
                } else {
                    this.$message.error({message: "录入ID失败！", type: "error"});
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
                                "detail": "更新引擎任务配置规则列表项生效范围项编号失败",
                                "is_submitted": 0
                            }
                        }
                    });
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
                            "detail": "更新引擎任务配置规则列表项生效范围项编号失败",
                            "is_submitted": 0
                        }
                    }
                });
            })
        },
        //添加引擎任务配置规则列表项生效范围项编号
        addTaskSettingRulesRangeNo() {
            this.$post('/action', {
                data: {
                    "insert": "crawl_task_setting_engine_relation",
                    "values": {
                        "engine_id": this.AddIdForm.engine_id,
                        "task_setting_rules_range_no": this.AddIdForm.task_setting_rules_range_no
                    }
                }
            }).then(data => {
                this.$post('/action', {
                    data: {
                        "insert": "audit_log",
                        "values": {
                            "user": this.localStore.get("user").username,
                            "operate": "新增",
                            "result": "成功",
                            "client": this.localStore.get("client").client,
                            "object_type": "平台",
                            "object_id": 0,
                            "detail": "添加引擎任务配置规则列表生效范围项编号成功，引擎id为" + this.AddIdForm.engine_id,
                            "is_submitted": 0
                        }
                    }
                });
                this.$message.success({message: "录入id成功!", type: "success"})
            }).then(err => {
                this.$post('/action', {
                    data: {
                        "insert": "audit_log",
                        "values": {
                            "user": this.localStore.get("user").username,
                            "operate": "新增",
                            "result": "失败",
                            "client": this.localStore.get("client").client,
                            "object_type": "平台",
                            "object_id": 0,
                            "detail": "添加引擎任务配置规则列表生效范围项编号失败",
                            "is_submitted": 0
                        }
                    }
                });
                this.$message.error({message: "录入id失败！", type: "error"})
            })
        },
        load() {
            this.list();
        },
        clear() {
        }
    },
		mounted () {
			this.$user = JSON.parse(localStorage.user);
			this.load();
		},
		destroyed () {
			this.clear()
		},
	};
</script>
<style>
.page-registration_engine_list {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
}
.page-registration_engine_list .page-registration_engine_list_box .el-tag {
  margin-right: 10px;
}
.page-registration_engine_list .page-registration_engine_list_box .button-new-tag {
  height: 24px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}
.page-registration_engine_list .page-registration_engine_list_box .input-new-tag {
  height: 24px;
  width: 90px;
  vertical-align: bottom;
}
.page-registration_engine_list .page-registration_engine_list_box .input-new-tag .el-input__inner{
  height: 22px;
  padding-top: 4px;
}
.page-registration_engine_list .page-registration_engine_list_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
}
.page-registration_engine_list
    .page-registration_engine_list_box
    .search_form
    .title {
    height: 35px;
    line-height: 35px;
}
.page-registration_engine_list
    .page-registration_engine_list_box
    .search_form
    .title
    i {
    margin-right: 5px;
}
.page-registration_engine_list
    .page-registration_engine_list_box
    .search_form
    .inner {
    margin-top: 10px;
}
.page-registration_engine_list
    .page-registration_engine_list_box
    .search_form
    .inner
    .el-input {
    max-width: 30%;
    margin-right: 20px;
}
.page-registration_engine_list
    .page-registration_engine_list_box
    .search_form
    .inner
    > span {
    margin-right: 10px;
}
.page-registration_engine_list .page-registration_engine_list_box .list {
    background: #fff;
    text-align: center;
    border-right: 1px solid #ebeef5;
    padding: 0 15px;
}
.page-registration_engine_list .page-registration_engine_list_box .list:after{
     content:".";
     display:block;
     height:0;
     clear:both;
     visibility:hidden;

}
.page-registration_engine_list
    .page-registration_engine_list_box
    .list
    .el-table--small
    th,
.page-registration_engine_list
    .page-registration_engine_list_box
    .list
    .el-table--small
    td {
    background: #fff;
    text-align: center;
}
.page-registration_engine_list
    .page-registration_engine_list_box
    .code{
        margin: 15px 0;
        background: #fff;
    }
.page-registration_engine_list
.page-registration_engine_list_box .el-table__expanded-cell{
  padding: 15px;
}
</style>
