<template>
    <div class="page-sys_initialization">
        <div class="page-sys_initialization_box">
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-xitongpeizhi"></i>系统信息</div>
                <div class="inner">
                    <el-table stripe border tooltip-effect="dark" :data="sysInfoTableData" v-loading="loading">
                      <el-table-column prop="name" label="模块名称" align="center" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="host" label="主机地址" align="center" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="status" label="运行状态" align="center">
                        <template slot-scope="scope">
                          <el-tag v-if="scope.row.status =='0'" type="danger">停止</el-tag>
                          <el-tag v-if="scope.row.status =='1'" type="success">运行中</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" fixed="right">
                        <template slot-scope="scope">
                          <div class="app-table-column-operate">
                            <el-button type="text" size="small" @click="editSysInfo('update', scope.row)">更新</el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  <!-- 分页 -->
                  <div class="app-pagination">
                    <el-pagination
                      :total="sysInfoTotal"
                      :page-sizes="pageSizes"
                      :page-size="sysInfoPageSize"
                      :current-page="sysInfoCurrentPage"
                      @size-change="sysInfoHandleSizeChange"
                      @current-change="sysInfoHandleCurrentChange"
                      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                  </div>
                </div>
              <!-- 更新系统信息 弹窗 类型名称(文本框) 版本(文本框) 数据格式-->
              <el-dialog
                width="750px"
                title="更新系统信息"
                :append-to-body="true"
                class="quota_type-edit-dialog"
                :before-close="closeEditSysInfo"
                :visible.sync="editSysInfoVisible">
                <el-form :model="editSysInfoForm" label-with="100px" ref="editForm">
                  <el-form-item label="模块名称" prop="name">
                    <el-input v-model="editSysInfoForm.name" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="主机地址" prop="host">
                    <el-input v-model="editSysInfoForm.host" clearable></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="closeEditSysInfo">取消</el-button>
                  <el-button type="primary" :loading="editBtnLoading" @click="saveEditSysInfo()">保存</el-button>
                </span>
              </el-dialog>
            </div>
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-shujuku"></i>总线配置</div>
                <div class="inner">
                    <el-table stripe border tooltip-effect="dark" :data="busConfigTableData" v-loading="loading">
                      <el-table-column prop="bus_url" label="总线系统URL" align="center" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column label="分布式文件系统" align="center">
                        <el-table-column prop="distributed_url" label="服务器URL" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="distributed_token" label="aws AccessKey" align="center" show-overflow-tooltip>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column prop="system_id" label="系统标识" align="center" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="system_num" label="总线序号" align="center" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column label="消息标签schema" align="center">
                        <template slot-scope="scope">
                          <div class="app-table-column-operate">
                            <el-button type="text" size="small" @click="viewTagMessageSchema('tagMessage',scope.row)">查看</el-button>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="文件标签schema" align="center">
                        <template slot-scope="scope">
                          <div class="app-table-column-operate">
                            <el-button type="text" size="small" @click="viewTagFileSchema('tagFile',scope.row)">查看</el-button>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="状态标签schema" align="center">
                        <template slot-scope="scope">
                          <div class="app-table-column-operate">
                            <el-button type="text" size="small" @click="viewTagStatusSchema('tagStatus',scope.row)">查看</el-button>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="状态标签JSON" align="center">
                        <template slot-scope="scope">
                          <div class="app-table-column-operate">
                            <el-button type="text" size="small" @click="viewTagStatusJson('tagStatusJson',scope.row)">查看</el-button>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="data_status_schema" label="状态数据schema" align="center">
                        <template slot-scope="scope">
                          <div class="app-table-column-operate">
                            <el-button type="text" size="small" @click="viewDataStatusSchema('dataStatus',scope.row)">查看</el-button>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="data_status_schemaId" label="状态数据schemaId" align="center">
                      </el-table-column>
                      <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                          <el-tag type="success">生效</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" fixed="right">
                        <template slot-scope="scope">
                          <div class="app-table-column-operate">
                            <el-button type="text" size="small" @click="editBusConfig('update', scope.row)">更新</el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  <!-- 分页 -->
                  <div class="app-pagination">
                    <el-pagination
                      :total="busConfigTotal"
                      :page-sizes="pageSizes"
                      :page-size="busConfigPageSize"
                      :current-page="busConfigCurrentPage"
                      @size-change="busConfigHandleSizeChange"
                      @current-change="busConfigHandleCurrentChange"
                      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                  </div>
                </div>
              <!-- 更新 & 查看 总线配置 弹窗 类型名称(文本框) 版本(文本框) 数据格式-->
              <el-dialog :title="viewDisplayTitle" :visible.sync="dialogVisible" :append-to-body="true" width="85%" :before-close="handleClose">
                <pre style="padding:20px;background:#e3e6e8;border-radius:5px;">{{ jsonData }}</pre>
                <span slot="footer" class="dialog-footer">
				          <el-button @click="dialogVisible = false">关 闭</el-button>
			          </span>
              </el-dialog>
              <el-dialog
                width="750px"
                title="更新总线配置"
                :append-to-body="true"
                class="quota_type-edit-dialog"
                :before-close="closeEditBusConfig"
                :visible.sync="editBusConfigVisible">
                <el-form :model="editBusConfigForm" label-with="100px" ref="editForm">
                  <el-form-item label="总线系统URL" prop="bus_url">
                    <el-input v-model="editBusConfigForm.bus_url" clearable placeholder="bus_url"></el-input>
                  </el-form-item>
                  <el-form-item label="分布式文件系统服务器URL" prop="distributed_url">
                    <el-input v-model="editBusConfigForm.distributed_url" clearable placeholder="distributed_url"></el-input>
                  </el-form-item>
                  <el-form-item label="分布式文件系统aws AccessKey" prop="distributed_token">
                    <el-input v-model="editBusConfigForm.distributed_token" clearable placeholder="distributed_token"></el-input>
                  </el-form-item>
                  <el-form-item label="系统标识" prop="system_id">
                    <el-input v-model="editBusConfigForm.system_id" clearable placeholder="system_id"></el-input>
                  </el-form-item>
                  <el-form-item label="总线序号" prop="system_num">
                    <el-input v-model="editBusConfigForm.system_num" clearable placeholder="system_num"></el-input>
                  </el-form-item>
                  <el-form-item label="消息标签schema" prop="tag_message_schema">
                    <el-input v-model="editBusConfigForm.tag_message_schema" clearable placeholder="tag_message_schema"></el-input>
                  </el-form-item>
                  <el-form-item label="文件标签schema" prop="tag_file_schema">
                    <el-input v-model="editBusConfigForm.tag_file_schema" clearable placeholder="tag_file_schema"></el-input>
                  </el-form-item>
                  <el-form-item label="状态标签schema" prop="tag_status_schema">
                    <el-input v-model="editBusConfigForm.tag_status_schema" clearable placeholder="tag_status_schema"></el-input>
                  </el-form-item>
                  <el-form-item label="状态标签JSON" prop="tag_status">
                    <el-input v-model="editBusConfigForm.tag_status" clearable placeholder="tag_status"></el-input>
                  </el-form-item>
                  <el-form-item label="状态数据schema" prop="data_status_schema">
                    <el-input v-model="editBusConfigForm.data_status_schema" clearable placeholder="data_status_schema"></el-input>
                  </el-form-item>
                  <el-form-item label="状态数据schemaID" prop="data_status_schemaId">
                    <el-input v-model="editBusConfigForm.data_status_schemaId" clearable placeholder="data_status_schemaId"></el-input>
                  </el-form-item>
                  <el-form-item label="管理中心id" prop="centen_id">
                    <el-input v-model="editBusConfigForm.centen_id" clearable placeholder="centen_id"></el-input>
                  </el-form-item>
                  <el-form-item label="状态数据X-Tag" prop="status_xtag">
                    <el-input v-model="editBusConfigForm.status_xtag" clearable placeholder="status_xtag"></el-input>
                  </el-form-item>
                  <el-form-item label="指令状态数据X-Tag" prop="instruct_status_xtag">
                    <el-input v-model="editBusConfigForm.instruct_status_xtag" clearable placeholder="instruct_status_xtag"></el-input>
                  </el-form-item>
                  <el-form-item label="规则状态数据X-Tag" prop="rule_status_xtag">
                    <el-input v-model="editBusConfigForm.rule_status_xtag" clearable placeholder="rule_status_xtag"></el-input>
                  </el-form-item>
                  <el-form-item label="审计日志状态数据X-Tag" prop="audit_log_status_xtag">
                    <el-input v-model="editBusConfigForm.audit_log_status_xtag" clearable placeholder="audit_log_status_xtag"></el-input>
                  </el-form-item>
                  <el-form-item label="认证密钥" prop="key">
                    <el-input v-model="editBusConfigForm.key" clearable placeholder="key"></el-input>
                  </el-form-item>
                  <el-form-item label="规则状态标签JSON" prop="tag_rule_status">
                    <el-input v-model="editBusConfigForm.tag_rule_status" clearable placeholder="tag_rule_status"></el-input>
                  </el-form-item>
                  <el-form-item label="审计日志状态标签JSON" prop="tag_audit_log_status" clearable placeholder="tag_audit_log_status">
                    <el-input v-model="editBusConfigForm.tag_audit_log_status" clearable placeholder="tag_audit_log_status"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="closeEditBusConfig">取消</el-button>
                  <el-button type="primary" :loading="editBtnLoading" @click="saveEditBusConfig">保存</el-button>
                </span>
              </el-dialog>
            </div>
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-i-data"></i>系统服务</div>
                <div class="inner">
                  <el-table stripe border tooltip-effect="dark" :data="sysServiceTableData" v-loading="loading">
                    <el-table-column prop="name" label="服务名称" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="status" label="运行状态" align="center">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.status =='0'" type="danger">停止</el-tag>
                        <el-tag v-if="scope.row.status =='1'" type="success">运行中</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="connect_info" label="连接信息" align="center" show-overflow-tooltip>
                    </el-table-column>
                  </el-table>
                  <!-- 分页 -->
                  <div class="app-pagination">
                    <el-pagination
                      :total="sysServiceTotal"
                      :page-sizes="pageSizes"
                      :page-size="sysServicePageSize"
                      :current-page="sysServiceCurrentPage"
                      @size-change="sysServiceHandleSizeChange"
                      @current-change="sysServiceHandleCurrentChange"
                      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import permission from "@/components/mixin/permission";

export default {
    mixins: [permission],
    name: "sys_initialization",
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
            //当前登录用户
            $user:null,
            //页数相关
            pageSizes: [20, 50, 100, 200],
            //加载相关
            loading: false,
            //系统信息表相关
            sysInfoTableData: [],
            sysInfoTableName: "crawl_paltform_sys_info",
            sysInfoWhere: [],
            sysInfoCurrentPage: 1,
            sysInfoPageSize: 20,
            sysInfoTotal: 0,
            //总线配置表相关
            busConfigTableData: [],
            busConfigTableName: "crawl_bus_config",
            busConfigWhere: [],
            busConfigCurrentPage: 1,
            busConfigPageSize: 20,
            busConfigTotal: 0,
            //系统服务表相关
            sysServiceTableData: [],
            sysServiceTableName: "crawl_paltform_sys_info",
            sysServiceWhere: [],
            sysServiceCurrentPage: 1,
            sysServicePageSize: 20,
            sysServiceTotal: 0,
            //当前row
            currentRow: null,
            //更新和查看总线配置相关
            jsonData: '',
            dialogVisible: false,
            viewDisplayTitle: '',
            viewDisplay: {
              "tagMessage": "查看消息标签schema",
              "tagFile": "查看文件标签schema",
              "tagStatus": "查看状态标签schema",
              "tagStatusJson": "查看状态标签JSON",
              "dataStatus": "查看状态数据schema"
            },
            editBusConfigVisible: false,
            editBtnLoading: false,
            editBusConfigType: "",
            editBusConfigForm: {
                bus_url: null,
                distributed_url: null,
                distributed_token: null,
                system_id: null,
                system_num: null,
                tag_message_schema: null,
                tag_file_schema: null,
                tag_status_schema: null,
                tag_status: null,
                data_status_schema: null,
                data_status_schemaId: null,
                id: null,
                centen_id: null,
                status_xtag: null,
                instruct_status_xtag: null,
                rule_status_xtag: null,
                audit_log_status_xtag: null,
                key: null,
                tag_rule_status: null,
                tag_audit_log_status: null,
            },
            //更新系统信息相关
            editSysInfoVisible: false,
            editSysInfoType: "",
            editSysInfoForm: {
                name: null,
                host: null,
                id: null,
            }
        };
    },
    methods: {
        showOverflow() {
            this.overflow = true
        },
        search() {
            this.sysInfoCurrentPage = 1
            this.busConfigCurrentPage = 1
            this.sysServiceCurrentPage = 1
            this.sysInfoWhere = []
            this.busConfigWhere = []
            this.sysServiceWhere = []
            this.sysInfoList();
            this.sysServiceList();
            this.busConfigList();
        },
        //修改分页数量
        sysInfoHandleSizeChange (val) {
            this.sysInfoPageSize = val;
            this.sysInfoList();
        },
        busConfigHandleSizeChange (val) {
            this.busConfigPageSize = val;
            this.busConfigList();
        },
        sysServiceHandleSizeChange (val) {
            this.sysServicePageSize = val;
            this.sysServiceList();
        },
        // 切换分页
        sysInfoHandleCurrentChange (val) {
            this.busConfigCurrentPage = val;
            this.busConfigList();
        },
        busConfigHandleCurrentChange (val) {
            this.busConfigCurrentPage = val;
            this.busConfigList();
        },
        sysServiceHandleCurrentChange (val) {
            this.sysServiceCurrentPage = val;
            this.sysServiceList();
        },
        // 排序
        handleSortChange (column) {
            // console.log(column, prop, order);
            this.order = column.prop && column.order
                ? [column.prop + ' ' + column.order.replace("ending", "")]
                : [];
            this.sysInfoList();
            this.busConfigList();
            this.sysServiceList();
        },
        //关闭查看弹窗
        handleClose() {
            this.dialogVisible = false;
        },
        //关闭更新总线配置的弹窗
        closeEditBusConfig() {
            this.$confirm('是否确认关闭修改表单', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                this.editBusConfigVisible = false;
                this.resetEditForm();
            }).catch(() => {

            });
        },
        //关闭更新系统信息弹窗
        closeEditSysInfo() {
            this.editSysInfoVisible = false;
            this.resetEditForm();
        },
        //表单重置
        resetEditForm() {
            let editForm = this.$refs["editForm"];
            if(editForm) {
                editForm.clearValidate();
                editForm.resetFields();
            }
        },
        //查看消息标签schema
        viewTagMessageSchema(type,row) {
            this.viewDisplayTitle = this.viewDisplay[type];
            let data = '';
            try {
                data = JSON.stringify(JSON.parse(row.tag_message_schema), null, "\t")
            } catch(e) {
                data = row.tag_message_schema;
            }
            this.jsonData = data;
            this.dialogVisible = true;
        },
        //查看文件标签schema
        viewTagFileSchema(type,row) {
            this.viewDisplayTitle = this.viewDisplay[type];
            let data = '';
            try {
                data = JSON.stringify(JSON.parse(row.tag_file_schema), null, "\t")
            } catch(e) {
                data = row.tag_file_schema;
            }
            this.jsonData = data;
            this.dialogVisible = true;
        },
        //查看状态标签schema
        viewTagStatusSchema(type,row) {
            this.viewDisplayTitle = this.viewDisplay[type];
            let data = '';
            try {
                data = JSON.stringify(JSON.parse(row.tag_status_schema), null, "\t")
            } catch(e) {
                data = row.tag_status_schema;
            }
            this.jsonData = data;
            this.dialogVisible = true;
        },
        //查看状态标签JSON
        viewTagStatusJson(type, row) {
            this.viewDisplayTitle = this.viewDisplay[type];
            let data = '';
            try {
                data = JSON.stringify(JSON.parse(row.tag_status), null, "\t")
            } catch(e) {
                data = row.tag_status;
            }
            this.jsonData = data;
            this.dialogVisible = true;
        },
        //查看状态数据schema
        viewDataStatusSchema(type, row) {
            this.viewDisplayTitle = this.viewDisplay[type];
            let data = '';
            try {
                data = JSON.stringify(JSON.parse(row.data_status_schema), null, "\t")
            } catch(e) {
                data = row.data_status_schema;
            }
            this.jsonData = data;
            this.dialogVisible = true;
        },
        //更新总线配置
        editBusConfig(type, row) {
            this.editBusConfigVisible = true;
            this.editBusConfigType = type;
            if(type === 'update') {
                this.editBusConfigDetail(row);
            }else {
                this.currentRow = row;
            }
        },
        //更新系统信息
        editSysInfo(type, row) {
            this.editSysInfoVisible = true;
            this.editSysInfoType = type;
            if(type === 'update') {
                this.editSysInfoDetail(row);
            }else {
                this.currentRow = row;
            }
        },
        editSysInfoDetail(row) {
            this.editRow = row;
            for(let k in this.editSysInfoForm) {
                this.editSysInfoForm[k] = row[k] || '';
            }
        },
        editBusConfigDetail(row) {
            this.editRow = row;
            for (let k in this.editBusConfigForm) {
                this.editBusConfigForm[k] = row[k] || '';
            }
        },
        //保存总线配置更新
        saveEditBusConfig() {
            this.$post('/action', {
                data: {
                    "update": this.busConfigTableName,
                    "values": {
                        bus_url: this.editBusConfigForm.bus_url,
                        distributed_url: this.editBusConfigForm.distributed_url,
                        distributed_token: this.editBusConfigForm.distributed_token,
                        system_id: this.editBusConfigForm.system_id,
                        system_num: this.editBusConfigForm.system_num,
                        tag_message_schema: this.editBusConfigForm.tag_message_schema,
                        tag_file_schema: this.editBusConfigForm.tag_file_schema,
                        tag_status_schema: this.editBusConfigForm.tag_status_schema,
                        tag_status: this.editBusConfigForm.tag_status,
                        data_status_schema: this.editBusConfigForm.data_status_schema,
                        data_status_schemaId: this.editBusConfigForm.data_status_schemaId,
                        centen_id: this.editBusConfigForm.centen_id,
                        status_xtag: this.editBusConfigForm.status_xtag,
                        instruct_status_xtag: this.editBusConfigForm.instruct_status_xtag,
                        rule_status_xtag: this.editBusConfigForm.rule_status_xtag,
                        audit_log_status_xtag: this.editBusConfigForm.audit_log_status_xtag,
                        key: this.editBusConfigForm.key,
                        tag_rule_status: this.editBusConfigForm.tag_rule_status,
                        tag_audit_log_status: this.editBusConfigForm.tag_audit_log_status
                    },
                    "where": ['id=' + this.editBusConfigForm.id]
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
                            "detail": "修改总线配置成功，目前总线地址为" + this.editBusConfigForm.bus_url,
                            "is_submitted": 0
                        }
                    }
                });
                this.editBusConfigForm = {
                    bus_url: '',
                    distributed_url: '',
                    distributed_token: '',
                    system_id: '',
                    system_num: '',
                    tag_message_schema: '',
                    tag_file_schema: '',
                    tag_status_schema: '',
                    tag_status: '',
                    data_status_schema: '',
                    data_status_schemaId: '',
                    id: '',
                    centen_id: '',
                    status_xtag: '',
                    instruct_status_xtag: '',
                    rule_status_xtag: '',
                    audit_log_status_xtag: '',
                    key: '',
                    tag_rule_status: '',
                    tag_audit_log_status: ''
                };
                this.$message.success({ message: "更新成功", type: "success"});
                this.editBusConfigVisible = false;
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
                            "detail": "修改总线配置失败",
                            "is_submitted": 0
                        }
                    }
                });
                this.editBusConfigForm = {
                    bus_url: '',
                    distributed_url: '',
                    distributed_token: '',
                    system_id: '',
                    system_num: '',
                    tag_message_schema: '',
                    tag_file_schema: '',
                    tag_status_schema: '',
                    tag_status: '',
                    data_status_schema: '',
                    data_status_schemaId: '',
                    id: '',
                    centen_id: '',
                    status_xtag: '',
                    instruct_status_xtag: '',
                    rule_status_xtag: '',
                    audit_log_status_xtag: '',
                    key: '',
                    tag_rule_status: '',
                    tag_audit_log_status: ''
                };
                this.$message.error({ message: "更新失败", type: "error"});
                this.editBusConfigVisible = false;
            })
        },
        //保存系统信息更新
        saveEditSysInfo() {
            this.$post('/action', {
                data: {
                    "update": this.sysInfoTableName,
                    "values": {
                        name: this.editSysInfoForm.name,
                        host: this.editSysInfoForm.host
                    },
                    'where': ['id=' + this.editSysInfoForm.id]
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
                            "detail": "修改系统信息成功，对应ID为" + this.editSysInfoForm.id,
                            "is_submitted": 0
                        }
                    }
                });
                this.editSysInfoForm = {
                    name: '',
                    host: '',
                    id: '',
                };
                this.$message.success({ message: "更新成功", type: "success"});
                this.editSysInfoVisible = false;
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
                            "detail": "修改系统信息失败，对应ID为" + this.editSysInfoForm.id,
                            "is_submitted": 0
                        }
                    }
                });
                this.editSysInfoForm = {
                    name: '',
                    host: '',
                    id: '',
                };
                this.$message.error({ message: "更新失败", type: "error"});
                this.editSysInfoVisible = false;
            })
        },
        //获取系统信息
        sysInfoList() {
            this.loading = true;
            this.$post('/action', {
                data: {
                    "select": this.sysInfoTableName,
                    "limit": [(this.sysInfoCurrentPage - 1) * this.sysInfoPageSize, this.sysInfoCurrentPage * this.sysInfoPageSize],
                    "where":"is_service = 1"
                }
            }).then(data=> {
                if(data && Array.isArray(data.data)) {
                    this.sysInfoTableData = data.data;
                    this.sysInfoTotal = data.total
                }
                this.loading = false;
            }).catch(error => {
                this.loading = false;
                this.$message.error({ message: "获取系统服务列表失败!!!", type: "error"})
            })
        },
        //获取总线配置
        busConfigList() {
            this.loading = true;
            this.$post('/action', {
                data: {
                    "select": this.busConfigTableName,
                    "limit":[(this.busConfigCurrentPage - 1) * this.busConfigPageSize, this.busConfigCurrentPage * this.busConfigPageSize],
                }
            }).then(data=> {
                if(data && Array.isArray(data.data)) {
                    this.busConfigTableData = data.data;
                    this.busConfigTotal = data.total
                }
                this.loading = false;
            }).catch(error => {
              this.loading = false;
              this.$message.error({ message: "获取总线配置列表失败!!!", type: "error"})
            })
        },
        //获取系统服务
        sysServiceList() {
            this.loading = true;
            this.$post('/action', {
                data: {
                    "select": this.sysServiceTableName,
                    "limit":[(this.sysServiceCurrentPage - 1) * this.sysServicePageSize, this.sysServiceCurrentPage * this.sysServicePageSize],
                    "where": "is_service = 2"
                }
            }).then(data=> {
                if(data && Array.isArray(data.data)) {
                    this.sysServiceTableData = data.data;
                    this.sysServiceTotal = data.total
                }
                this.loading = false;
            }).catch(error => {
                this.loading = false;
                this.$message.error({ message: "获取系统服务列表失败!!!", type: "error"})
            })
        },
        load() {
            this.sysInfoList();
            this.busConfigList();
            this.sysServiceList();
        },
        clear() {
        },
    },
    mounted() {
        this.$user = JSON.parse(localStorage.user);
        this.load()
    },
    destroyed() {
        this.clear()
    }
};
</script>

<style>
  .div123123 {
    height: auto;
    width: 200px;
  }
.page-sys_initialization {
    width: 100%;
    height: 100%;
    font-size: 14px;
}
.page-sys_initialization .page-sys_initialization_box {
    width: 100%;
    height: 100%;
    padding: 0 15px;
}
.el-popper[x-placement^=bottom] {
  word-wrap: break-word;
  word-break: break-all;
}
.page-sys_initialization .page-sys_initialization_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
    margin-bottom: 15px;
}
.page-sys_initialization .page-sys_initialization_box .search_form .title {
    height: 35px;
    line-height: 35px;
}
.page-sys_initialization .page-sys_initialization_box .search_form .title i {
    margin-right: 5px;
}
.page-sys_initialization .page-sys_initialization_box .search_form .content {
    min-height: 200px;
}
.page-sys_initialization .page-sys_initialization_box .search_form .inner {
    margin-top: 10px;
}
.page-sys_initialization .page-sys_initialization_box .search_form .inner .el-button--text {
  /*color:#606266;*/
}
.page-sys_initialization
    .page-sys_initialization_box
    .search_form
    .inner
    .el-input {
    /*max-width: 18%;*/
    margin-right: 15px;
    margin-bottom: 15px;
}
.page-sys_initialization
    .page-sys_initialization_box
    .search_form
    .inner
    .el-date-editor {
    max-width: 32%;
    margin-right: 10px;
}
.page-sys_initialization
    .page-sys_initialization_box
    .search_form
    .inner
    .fault_type {
    margin-right: 10px;
}
.page-sys_initialization
    .page-sys_initialization_box
    .search_form
    .inner
    .fault_type
    .el-input {
    max-width: 100%;
}
.page-sys_initialization
    .page-sys_initialization_box
    .search_form
    .inner
    > span {
    margin-right: 5px;
    display: inline-block;
    min-width: 30px;
}
  .page-sys_initialization
  .page-sys_initialization_box
  .inner
  .hiddenDiv {
    white-space: nowrap;
    /*text-overflow: ellipsis;*/
    overflow: hidden;
}
.page-sys_initialization .page-sys_initialization_box .line_charts {
    padding: 15px;
    background: #fff;
    margin: 15px 0;
}
.page-sys_initialization .page-sys_initialization_box .list {
    background: #fff;
    text-align: center;
    margin-top: 15px;
    border-right: 1px solid #ebeef5;
}

.page-sys_initialization .page-sys_initialization_box .list:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.page-sys_initialization
    .page-sys_initialization_box
    .list
    .table_edit
    .warning {
    color: #e6a23c;
}
.page-sys_initialization .page-sys_initialization_box .list .el-table--small th,
.page-sys_initialization
    .page-sys_initialization_box
    .list
    .el-table--small
    td {
    background: #fff;
    text-align: center;
}
.page-sys_initialization .page-sys_initialization_box .list .list_pagination {
    margin: 20px;
}
</style>
>
