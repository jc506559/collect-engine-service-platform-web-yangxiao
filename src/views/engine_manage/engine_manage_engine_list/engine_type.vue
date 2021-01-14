<template>
	<!-- 引擎类型管理 -->
	<div>
		<!-- table表格 -->
		<div class="app-table">
			<!-- 表格 -->
			<el-table stripe border tooltip-effect="dark" ref="tableElement" :data="tableData" v-loading="loading">
				<!-- <el-table-column prop="engine_id" label="引擎ID" align="center">
				</el-table-column> -->
				<el-table-column prop="id" label="类型id" align="center">
				</el-table-column>
				<el-table-column prop="name" label="类型名称" align="center">
				</el-table-column>
				<el-table-column prop="version" label="类型版本" align="center">
				</el-table-column>
				<!-- <el-table-column prop="data_format" label="数据格式" align="center">
				</el-table-column> -->
				<el-table-column prop="enabled" label="状态" align="center">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.enabled =='2'" type="danger">已删除</el-tag>
						<el-tag v-if="scope.row.enabled =='1'" type="success">正常</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="270">
					<template slot-scope="scope">
						<div class="app-table-column-operate">
							<el-button type="text" size="small" @click="editConfirm('update', scope.row)">编辑</el-button>
							<el-button type="text" size="small" v-if="scope.row.enabled ==1"  @click="del('id', scope.row)">删除</el-button>
							<el-button type="text" size="small" @click="viewDataType(scope.row)">查看数据格式</el-button>
							<el-button type="text" size="small" @click="inputDataTypeBusId(scope.row)">录入总线数据类型id</el-button>
							<el-button type="text" size="small" @click="searchData(scope.row)">查询当天数据量</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<!-- <div class="app-pagination">
			<el-pagination :total="total" :page-size="pageSize" :page-sizes="pageSizes" :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
		</div> -->
		<!-- 新增 & 编辑 弹窗 类型名称(文本框) 版本(文本框) 数据格式-->
		<el-dialog width="750px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeEditDialog" :title="editDialogDisplayTitle" :visible.sync="editDialogVisible">
			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
				<el-form-item label="类型名称" prop="name">
					<el-input v-model="editForm.name" clearable placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="类型版本" prop="version">
					<el-input v-model="editForm.version" clearable placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="数据格式" prop="data_format">
					<el-input v-model="editForm.data_format" clearable placeholder="请输入" rows="6" type="textarea"></el-input>
				</el-form-item>
        <el-form-item label="XTag" prop="xtag">
          <el-input v-model="editForm.xtag" clearable placeholder="请输入"></el-input>
        </el-form-item>
				<el-form-item label="类型描述" prop="description">
					<el-input v-model="editForm.description" clearable placeholder="请输入" rows="3" type="textarea"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeEditDialog">取消</el-button>
				<el-button type="primary" :loading="editBtnLoading" @click="saveEditForm()">保存</el-button>
			</span>
		</el-dialog>
		<el-dialog title="查看数据格式" :visible.sync="dialogVisible" :append-to-body="true" width="50%" :before-close="handleClose">
			<pre style="padding:20px;background:#e3e6e8;border-radius:5px;">{{jsonData}}</pre>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">关 闭</el-button>
			</span>
		</el-dialog>
		<el-dialog title="录入总线数据类型ID" :visible.sync="showBusDataType" :append-to-body="true" width="30%" :before-close="handleClose">
			<el-input v-model="updateBusDataType.bus_data_type_id" clearable placeholder="请输入" type="text"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="saveBusDataType">保存</el-button>
				<el-button @click="showBusDataType = false">关 闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import permission from "@/components/mixin/permission";
	import axios from 'axios'
	import { mapGetters } from 'vuex'
	// 公共方法
	export default {
		mixins: [permission],
		name: 'engine_type',
		computed: {
			...mapGetters([
				'engineRowDetail',
				'addEngineTypeStatus'
			])
		},
		watch: {
			engineRowDetail (newValue) {
				this.list()
			},
			addEngineTypeStatus (newValue) {
				this.editConfirm('insert', newValue)
			}
		},
		data () {
			// 用于自定义验证 是否重名
			let validateRename = (rule, value, callback) => {
			  // trim()方法用于去除字符串的头尾空格
				value = value.trim();
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
				// 查询
				searchForm: {},
				// 过滤
				filterFields: ['name'],
				filterValue: '',
				// 编辑相关
				editBtnLoading: false,
				editDialogVisible: false,
				editDialogType: "",
				editDialogDisplayTitle: "",   // 编辑弹出框的标题
				editDialogDisplay: {          // 编辑弹出框的标题映射
					"insert": "新建数据类型",
					"update": "编辑数据类型信息"
				},
				editForm: {
					id: null,
					data_format: null,
					name: null,
					version: null,
					engine_id: null,
					regeister_status: null,
					verify_type: null,
					enabled: null,
					status: null,
					description: null,
          xtag: null,
				},
				editFormRules: {
					name: [
						{ required: true, message: '请输入引擎类型', trigger: 'blur' },
						{ validator: validateRename, trigger: 'blur' },
					],
					version: [
						{ required: true, message: '请输入类型版本', trigger: 'blur' },
					],
					data_format: [
						{ required: true, message: '请输入数据格式', trigger: 'blur' },
					],

				},
				engineEditForm: {
					id: null,
					data_format: null,
					name: null,
					version: null,
					engine_id: null,
					regeister_status: null,
					verify_type: null,
					enabled: null,
					status: null,
					description: null
				},
				engineEditFormRules: {
					name: [
						{ required: true, message: '请输入引擎类型', trigger: 'blur' },
						{ validator: validateRename, trigger: 'blur' },
					],
					version: [
						{ required: true, message: '请输入版本', trigger: 'blur' },
					],
					data_format: [
						{ required: true, message: '请输入数据格式', trigger: 'blur' },
					],

				},
				// 删除相关
				deleteBatchBtnDisabled: true,
				// 列表相关
				tableName: "crawl_engine_data_type",
				loading: false,
				order: ['id desc'],
				where: [],
				currentPage: 1,
				pageSize: 20,
				total: 0,
				pageSizes: [20, 50, 100, 200],
				tableData: [],
				multipleSelection: [],
				// 当前row
				currentRow: null,
				// 引擎认证
				engineVisible: false,
				dialogVisible: false,
				jsonData: '',
				updateBusDataType:{
					id:'',
					bus_data_type_id:''
				},
				showBusDataType: false
			}
		},
		methods: {
			// 查看数据格式
			viewDataType (row) {
				let data_format = '';
				try {
					data_format = JSON.stringify(JSON.parse(row.data_format), null, "\t")
				} catch(e){
					data_format = row.data_format;
				}
				this.jsonData = data_format;
				this.dialogVisible = true;
			},
			// 查看数据格式
			inputDataTypeBusId (row) {
				this.updateBusDataType = {
					bus_data_type_id: row.bus_data_type_id,
					id: row.id
				};
				this.showBusDataType = true;
			},
			// 查询当天数据量
			searchData (row) {
			// debugger
				axios.get('/api/engine/statistics', {
					headers: {
						"EngineId": row.engine_id,
						"DataTypeId": row.id,
					}
				}).then(res => {
				    let data = res.data;
					if(data.code == 200){
						this.$message.success({ message: JSON.stringify(data.data), type: 'success' })
					}else{
						this.$message.error({ message: data.message , type: 'error' });
					}
				}).catch(err => {
					this.$message.error({ message: '查询失败', type: 'error' })
				})
			},
			saveBusDataType(){
				this.$post('/action', {
					data: {
						"update": this.tableName,
						"values": {
							bus_data_type_id: this.updateBusDataType.bus_data_type_id
						},
						"where": ['id=' + this.updateBusDataType.id]
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
                        "detail": "修改总线数据类型ID成功，对应数据类型ID为" + this.updateBusDataType.id,
                        "is_submitted": 0
                    }
                }
            });
					this.updateBusDataType = {
						bus_data_type_id: '',
						id: ''
					};
					this.$message.success({ message: "修改成功", type: "success" });
					this.showBusDataType = false;
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
                        "detail": "修改总线数据类型ID失败，对应数据类型ID为" + this.updateBusDataType.id,
                        "is_submitted": 0
                    }
                }
            });
					this.updateBusDataType = {
						bus_data_type_id: '',
						id: ''
					};
					this.$message.error({ message: "保存失败", type: "error" });
					this.showBusDataType = false;
				});
			},
			handleClose () {
				this.dialogVisible = false
			},
			// 搜索
			search () {
				this.currentPage = 1
				this.where = []
				if (this.searchForm.name) {
					this.where.push('name%=%' + this.searchForm.name + '%')
				}
				if (this.searchForm.data_format) {
					this.where.push('data_format%=%' + this.searchForm.data_format + '%')
				}
				this.list()
			},
			// 过滤
			filter (evt) {
				this.currentPage = 1
				this.where = []
				// 如果回车并且有值那么请求列表
				if (this.filterValue && evt.keyCode === 13) {
					this.where = this.filterFields.map(d => {
						return { "or": d + '%=%' + this.filterValue + "%" }
					})
				}
				this.list()
			},
			// 关闭弹窗
			closeEditDialog () {
				this.editDialogVisible = false;
				this.resetEditForm();
			},
			// 新增 & 编辑
			editConfirm (type, row) {
				this.editDialogVisible = true;
				this.editDialogType = type;
				this.editDialogDisplayTitle = this.editDialogDisplay[type];
				if (type === 'update') {
					this.detail(row);
				} else {
					this.currentRow = row;
				}
			},
			// 保存
			saveEditForm () {
				this[this.editDialogType]();
			},
			// 新增
			insert () {
				// 表单验证
				this.$refs["editForm"].validate((valid) => {
					if (valid) {
						this.editBtnLoading = true;
						let editForm = JSON.parse(JSON.stringify(this.editForm));
						let obj = {};
						let currentRow = this.currentRow;
						obj[`dataFormat`] = editForm.data_format;
						obj[`engineId`] = currentRow.id;
						obj[`name`] = editForm.name;
						obj[`version`] = editForm.version;
						obj[`description`] = editForm.description;
						obj[`xtag`] = editForm.xtag;
						obj[`isEngine`] = 1;
						this.$post('/engine/engineDataType', {
							data: obj
						}).then(data => {
							this.editBtnLoading = false;
							this.editDialogVisible = false;
							this.$message.success({ message: '新建引擎类型成功', type: 'success' });
              this.resetEditForm();
							this.list();
						}).catch(err => {
							this.$message.error({ message: "新建引擎类型失败", type: "error" })
							this.editBtnLoading = false
						})
					}
				});
			},
			// 更新时查询单条
			detail (row) {
				this.editRow = row;
				for (let k in this.editForm) {
					this.editForm[k] = row[k] || '';
				}
			},
			// 修改更新
			update () {
				// 表单验证
				this.$refs["editForm"].validate((valid) => {
					if (valid) {
						this.editBtnLoading = true;
						this.editBtnLoading = true;
						let editForm = JSON.parse(JSON.stringify(this.editForm));
						let obj = {};
						let currentRow = this.currentRow;
						obj[`dataFormat`] = editForm.data_format;
						obj[`id`] = editForm.id;
						obj[`name`] = editForm.name;
						obj[`version`] = editForm.version;
						obj[`description`] = editForm.description;
						obj[`engineId`] = editForm.engine_id;
						obj[`xtag`] = editForm.xtag;
						this.$post('/engine/updateEngineDataType', {
							data: obj
						}).then(data => {
							this.$message.success({ message: "修改成功", type: "success" });
							this.editBtnLoading = false;
							this.editDialogVisible = false;
							this.list();
						}).catch(err => {
							this.$message.error({ message: "修改失败", type: "error" })
							this.editBtnLoading = false
						})
					}
				});
			},
			// 表单重置
			resetEditForm () {
				let editForm = this.$refs["editForm"];
				if (editForm) {
					editForm.clearValidate();
					editForm.resetFields();
				}
				// @特殊处理, 针对编辑情况的重置
				for (let k in this.editForm) {
					this.editForm[k] = '';
				}
			},
			// 删除
			del (field, row) {
				this.$confirm('此操作将删除该数据, 是否继续?', '删除', {
					confirmButtonText: '保存',
					type: 'warning'
				}).then(() => {
					let ids = this.multipleSelection.map(v => v.id).join(',')
					row && (ids = [row[field]].join(','))
					this.$post(
						`/engine/deleteEngineDataType/${ids}`
					).then(data => {
						this.$message.success({ type: 'success', message: '删除成功' });
						this.list();
					}).catch(err => {
						this.$message.error({ type: 'error', message: '删除失败' });
					})
				}).catch(() => { });
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
			// 勾选选中项, 并批量删除按钮状态
			handleSelectionChange (arr) {
				// 部分选择
				if (arr.length >= 1) {
					this.deleteBatchBtnDisabled = false;
				} else {
					this.deleteBatchBtnDisabled = true;
				}
				this.multipleSelection = arr;
			},
			// 排序 （yangxiao个人备注 这个在哪会用到？）
			handleSortChange (column) {
				this.order = column.prop && column.order
					? [column.prop + ' ' + column.order.replace("ending", "")]
					: [];
				this.list();
			},
			// 获取列表
			list () {
				let engineRowDetail = this.engineRowDetail;
				this.where = ["enabled=1"];
				this.where.push(`engine_id=${engineRowDetail ? engineRowDetail.id : null}`)
				this.loading = true;
				this.$post('/action', {
					data: {
						"select": this.tableName,
						"limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
						"where": this.where,
						"order": this.order
					}
				}).then(data => {
					this.loading = false;
					if (data && Array.isArray(data.data)) {
						this.tableData = data.data;
						this.total = data.total
					}
				}).catch(error => {
					this.loading = false;
					this.$message.error({ message: "获取列表失败", type: "error" })
				})
			},
			load () {
			},
			clear () {
			}
		},
		mounted () {
			this.load()
		},
		destroyed () {
			this.clear()
		}
	}
</script>

<style>
</style>
