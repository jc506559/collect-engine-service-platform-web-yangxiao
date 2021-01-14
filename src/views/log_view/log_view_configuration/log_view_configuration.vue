<template>
  <div class="page-log_view_configuration">
    <div class="page-log_view_configuration_box">
      <div class="search_form">
        <div class="title"><i class="icon iconfont icon-jisuanyinqing title_i"></i>规则管理
          <el-button style="float: right;" @click="refresh" icon="el-icon-refresh"></el-button>
        </div>
      </div>
      <div class="list">
        <div class="app-table">
          <div>
            <p class="label_p">平台规则数据</p>
            <el-button style="float: right;" @click="addRules" type="primary">添加平台规则</el-button>
            <div class="inner">
              <el-select v-model="rules.type" @change="platformRulesServerChange()">
                <el-option v-for="ruleType in ruleTypes" :key="ruleType.value" :label="ruleType.label" :value="ruleType.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <el-table stripe border tooltip-effect="dark" :data="platformRulesData" v-loading="platformRulesLoading">
            <el-table-column prop="rules_type" label="规则类型" align="center" width="400" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.rules_type == 1">广告数据过滤规则</div>
                <div v-if="scope.row.rules_type == 2">采集栏目过滤规则</div>
                <div v-if="scope.row.rules_type == 3">采集网址过滤规则</div>
              </template>
            </el-table-column>
            <el-table-column prop="rules_id" label="规则id" align="center"width="200" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="rules_value" label="规则内容" align="left" show-overflow-tooltip>
              <!--                <template slot-scope="scope">-->
              <!--                  <div style="text-align: left">-->
              <!--                    <el-popover-->
              <!--                      placement="top-start"-->
              <!--                      trigger="hover"-->
              <!--                      :content="scope.row.rules_value"-->
              <!--                      width="500">-->
              <!--                      <el-button slot="reference" type="text"><div v-if="scope.row.rules_value.length < 150">{{ scope.row.rules_value }}</div><div v-else>{{ scope.row.rules_value.substring(0,150) }}...</div></el-button>-->
              <!--                    </el-popover>-->
              <!--                  </div>-->
              <!--                </template>-->
            </el-table-column>
            <el-table-column prop="effective" label="是否生效" align="center" width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.effective == 1">是</div>
                <div v-if="scope.row.effective == 0">否</div>
              </template>
            </el-table-column>
            <el-table-column prop="ping" label="下发延时" align="center" width="150" show-overflow-tooltips>
              <template slot-scope="scope">
                <div v-if="scope.row.ping">{{ scope.row.ping }}</div>
              </template>
            </el-table-column>
            <template slot="empty">
              暂无规则数据
            </template>
          </el-table>
          <div class="app-pagination">
            <el-pagination
              :total="PlatformRulesDataTotal"
              :page-size="PlatformRulesDataPageSize"
              :page-sizes="platformRulesPageSizes"
              :current-page="PlatformRulesDataCurrentPage"
              @size-change="platformRulesDataHandleSizeChange"
              @current-change="platformRulesDataHandleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="list2">
        <div class="app-table">
          <div>
            <p class="label_p">引擎配置数据</p>
            <el-button style="float: right;margin-bottom: 10px" @click="addEngineConfiguration()" type="primary" >添加配置</el-button>
            <!--              <div class="inner">-->
            <!--                <el-select v-model="searchData.engine" @change="serverChange()" v-loading="selectLoading">-->
            <!--                  <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value">-->
            <!--                  </el-option>-->
            <!--                </el-select>-->
          </div>
          <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="configurationData" v-loading="loading">
            <el-table-column type="expand" width="40">
              <template slot-scope="scope">
                <div v-if="scope.row.baseline_engine_result">
                  <el-form label-position="left" inline class="demo-table-expand" >
                    <div v-if="scope.row.baseline_engine_result.res">
                      <div v-for="(log,index) in scope.row.baseline_engine_result.res[0].data.result.log" :key="log.content" >
                        <el-form-item :label="(index + 1).toString()" :class="log.level">
                          <div v-if="log.level == 'info'">
                            <span style="color: #45c130">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                          </div>
                          <div v-if="log.lever == 'warning'">
                            <span style="color: #df5000">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                          </div>
                          <div v-if="log.level == 'error'">
                            <span style="color: #c9302c">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                          </div>
                        </el-form-item>
                      </div>
                    </div>
                    <div v-else>
                      <div v-for="(log,index) in scope.row.baseline_engine_result.result.log" :key="log.content" >
                        <el-form-item :label="(index + 1).toString()" :class="log.level">
                          <div v-if="log.level == 'info'">
                            <span style="color: #45c130">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                          </div>
                          <div v-if="log.lever == 'warning'">
                            <span style="color: #df5000">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                          </div>
                          <div v-if="log.level == 'error'">
                            <span style="color: #c9302c">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                          </div>
                        </el-form-item>
                      </div>
                    </div>
                  </el-form>
                  <div style="margin-top: 20px; float: left">
                    <el-button @click="exportBaselineEngineResult(scope.row)">下载全部结果</el-button>
                  </div>
                </div>
                <div v-else style="text-align: center">
                  <span style="color: #888888;">尚未反馈结果</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="engine_id" label="引擎ID" align="center" width="250" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="task_setting_rules_attrs" label="配置附加" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.task_setting_rules_attrs == null">无</div>
                <div v-else style="text-align: left">
                  <el-tag  v-for="item in scope.row.task_setting_rules_attrs" :key="item">{{ item }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="task_setting_rules_value" label="规则内容" align="left" width="500" show-overflow-tooltip>
              <!--                <template slot-scope="scope">-->
              <!--                  <div style="text-align: left">-->
              <!--                    <el-popover-->
              <!--                      placement="top-start"-->
              <!--                      trigger="hover"-->
              <!--                      :content="scope.row.task_setting_rules_value"-->
              <!--                      width="300">-->
              <!--                      <el-button slot="reference" type="text"><div v-if="scope.row.task_setting_rules_value.length < 100">{{scope.row.task_setting_rules_value}}</div><div v-else>{{ scope.row.task_setting_rules_value.substring(0,100) }}...</div></el-button>-->
              <!--                    </el-popover>-->
              <!--                  </div>-->
              <!--                </template>-->
            </el-table-column>
            <el-table-column prop="storage_time" label="入库时间" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.storage_time.substring(0, 19) }}
              </template>
            </el-table-column>
            <el-table-column prop="dispatched" label="是否下发至引擎" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.dispatched == 1">是</div>
                <div v-if="scope.row.dispatched == 0">否</div>
              </template>
            </el-table-column>
            <el-table-column prop="ping" label="下发延时" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.ping">{{ scope.row.ping }}</div>
              </template>
            </el-table-column>
            <template slot="empty">
              暂无数据
            </template>
          </el-table>
          <div class="app-pagination">
            <el-pagination
              :total="dataTotal"
              :page-size="dataPageSize"
              :page-sizes="pageSizes"
              :current-page="dataCurrentPage"
              @size-change="dataHandleSizeChange"
              @current-change="dataHandleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="app-table">
          <p class="label_p" >引擎指令信息</p>
          <el-table stripe border tooltip-effect="dark" ref="engineCommand" :data="commandData" v-loading="commandLoading">
            <el-table-column label="引擎Id" prop="engine_id" align="center" width="300" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="指令描述" prop="description" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="指令入库时间" prop="storage_time" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.storage_time">{{ scope.row.storage_time.substring(0, 19) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="是否应用指令" prop="dispatched" align="center" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.dispatched == 1">是</div>
                <div v-if="scope.row.dispatched == 0">否</div>
                <div v-else>否</div>
              </template>
            </el-table-column>
            <el-table-column label="指令下发时间" prop="dispatch_time" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.dispatch_time">{{ scope.row.dispatch_time.substring(0,19)}}</div>
                <div v-else>暂未下发</div>
              </template>
            </el-table-column>
            <el-table-column label="下发延时" prop="ping" align="center" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.ping">{{ scope.row.ping }}</div>
              </template>
            </el-table-column>
            <el-table-column label="指令参数" prop="args" align="center" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.args">{{ scope.row.args }}</div>
                <div v-else>无</div>
              </template>
            </el-table-column>
            <el-table-column label="指令状态" prop="status" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.status == 'running'">运行中</div>
                <div v-if="scope.row.status == 'finished'">已完成</div>
                <div v-else>无</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="app-pagination">
            <el-pagination
              :total="commandDataTotal"
              :page-size="commandDataPageSize"
              :page-sizes="pageSizes"
              :current-page="commandDataCurrentPage"
              @size-change="commandDataHandleSizeChange"
              @current-change="commandDataHandleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 引擎规则配置 -->
      <el-dialog width="750px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeEditDialog" :title="dialogTitle" :visible.sync="editDialogVisible">
        <el-form :model="addEngineConfigurationForm" label-width="100px" :rules="editRules" ref="engineConfigurationForm">
          <el-form-item label="引擎ID" :label-width="formLabelWidth" prop="engine_id">
            <el-select v-model="addEngineConfigurationForm.engine_id" placeholder="请选择引擎" style="width: 550px">
              <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规则模版" :label-width="formLabelWidth"  prop="select_mod_id">
            <el-select v-model="addEngineConfigurationForm.select_mod_id" placeholder="请选择模版" style="width: 550px" @change="change_mod">
              <el-option v-for="mod in mods" :key="mod.id" :label="mod.label" :value="mod.id" ></el-option>
            </el-select>
          </el-form-item>

          <!--规则模版-->

          <!--            文件-->
          <div v-if="addEngineConfigurationForm.mod_type[addEngineConfigurationForm.select_mod_id]=='file'">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">不能超过20M</div>
            </el-upload>
          </div>
          <!-- 字符串绑定输入框          -->
          <div  v-if="addEngineConfigurationForm.mod_type[addEngineConfigurationForm.select_mod_id]=='strOption'" :rules="editRules">
            <el-form-item label="格式校验" :label-width="formLabelWidth" prop="task_setting_rules_value">
              <el-input style="width: 545px" v-model="addEngineConfigurationForm.task_setting_rules_value"  placeholder="请输入字符串"></el-input>
            </el-form-item>
          </div>
          <!--        键值对表单-->
          <div v-if="addEngineConfigurationForm.mod_type[addEngineConfigurationForm.select_mod_id]=='keyValue'" >
            <el-form-item label="规则模版定义" :label-width="formLabelWidth" prop="task_setting_rules_value">
              <div v-for="item in keyValueName " :key="item.keyDescInput" >
                <span style="margin-right:22px">{{ item.keyTypeInput}}</span><el-input :label-width="formLabelWidth" placeholder="请输入" style="width:500px;margin-bottom: 10px" v-model="item['keyDes']"></el-input>
                <br>
                <!--                  <span style="margin-right: 24px">{{ item.keyDescInput}}</span><el-input  :label-width="formLabelWidth"placeholder="请输入" style="width:500px;margin-bottom: 10px" v-model="item['keyInput']"></el-input>-->
              </div>
            </el-form-item>
          </div>
          <!--     枚举     -->
          <div v-if="addEngineConfigurationForm.mod_type[addEngineConfigurationForm.select_mod_id]=='enumeration'">
            <el-form-item label="枚举定义" :label-width="formLabelWidth" prop="task_setting_rules_value">
              <el-select  v-model="addEngineConfigurationForm.task_setting_rules_value" style="width: 550px" >
                <el-option v-for="enumeration in enumeration_list"  :key="enumeration" :label="enumeration" :value="enumeration" >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-if="addEngineConfigurationForm.mod_type[addEngineConfigurationForm.select_mod_id]=='Customize'">
            <el-form-item label="自定义" :label-width="formLabelWidth" prop="task_setting_rules_value">
              <iframe  id="myIframe" :srcdoc="src" frameborder="1" height="100%" width="90%" scrolling="auto">
              </iframe>
<!--           <iframe  id="myIframe" src="/static/log_view_configuration_customize.html" frameborder="1" width="90%" scrolling="auto">-->
<!--           </iframe>-->
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
				    <el-button @click="closeEditDialog">取消</el-button>
          <!--            取消了点击事件@click="saveEditForm('engineConfigurationForm')"-->
				    <el-button type="primary" :loading="editBtnLoading" @click="saveEditForm('engineConfigurationForm')">保存</el-button>
			    </span>
      </el-dialog>
      <!-- 平台规则配置 -->
      <el-dialog width="750px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeEditRulesDialog" title="配置平台规则" :visible.sync="editRulesDialogVisible">
        <el-form :model="rules" label-width="100px" :rules="platformRulesEditRules" ref="editRulesForm">
          <el-form-item label="规则类型" prop="rules_type">
            <el-input v-model="rulesType" clearable :disabled="true" prop="rulesType"></el-input>
          </el-form-item>
          <el-form-item label="规则内容" prop="value">
            <el-input v-model="rules.value" clearable placeholder="请输入规则内容" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
				    <el-button @click="closeEditRulesDialog">取消</el-button>
				    <el-button type="primary" :loading="editRulesLoading" @click="saveEditRulesForm('editRulesForm')">保存</el-button>
			    </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import permission from '@/components/mixin/permission';
import fileSaver from 'file-saver';

export default {
  mixins: [permission],
  name: "log_view_configuration",
  inject: ['reload'],
  data() {
    return {
      //文件
      src: '',
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      //添加引擎表单规则
      editRules: {
        task_setting_rules_attrs: [
          { required: true, message: '请输入规则附加', trigger: 'blur' }
        ],
        // task_setting_rules_value: [
        //     { required: true, message: '请输入规则内容', trigger: 'blur' }
        // ],
        engine_id: [
          {required: true, message: '请选择引擎id', trigger: 'change'}
        ],
        select_mod_id: [
          { required: true, message: '请选择模版名称', trigger: 'change' }
        ],
        strInput:[{required: true, checkType:"string", message: '请输入规则内容', trigger: 'blur'},
          {pattern:/^[A-Za-z]+$/,message: '请输入正确内容', trigger: 'blur' }]
      },
      rule: {

      },
      //key 键值对中的值 双向绑定
      keyDes:'',
      keyInput:'',
      searchData: {},
      enumerationabc: '',
      addEngineConfigurationForm: {
        content:null,
        enumeration_list:[],
        select_mod_id:'',
        add:[],
        mod_type: {},
        engine_id: '',
        name:'',
        task_setting_rules_range_no: null,
        task_setting_rules_attrs: null,
        task_setting_rules_value: null,
        task_setting_rules_type: 2,
        task_setting_rules_id: 0,
        task_setting_version: 1,
        task_setting_level: 2,
        dispatched: 0,
        reported: 0,
      },
      keyValueSelects:[{
        value: 'string',
        label: '字符串'
      }, {
        value: 'integer',
        label: '整数'
      }],
      task_setting_rules_value:null,

      engines: [],
      selectLoading: true,
      //表单相关 列表相关
      loading: true,
      configurationData: [],
      dataTotal: 0,
      pageSizes: [10, 20, 50, 100],
      dataPageSize: 10,
      dataCurrentPage: 1,
      editDialogVisible: false,
      editBtnLoading: false,
      dialogTitle: '',
      dialogTitleList: {
        engine: '添加引擎配置数据',
        platform: '添加平台配置数据'
      },
      //平台表格相关
      platformConfigurationData: [],
      //指令表格相关
      commandData: [],
      commandLoading: false,
      commandDataTotal: 0,
      commandDataPageSize: 10,
      commandDataCurrentPage: 1,
      //引擎在总线编号
      engineBus: [],
      //基线引擎运行反馈
      baselineEngineResult: null,
      //引擎名称
      engineName: "",

      //平台规则相关
      platformRulesData: [],
      platformRulesLoading: false,
      //平台规则相关表格分页相关
      PlatformRulesDataTotal: 0,
      PlatformRulesDataPageSize: 10,
      platformRulesPageSizes: [10, 50, 100, 200],
      PlatformRulesDataCurrentPage: 1,
      //规则类型
      ruleTypes: [
        { label: '全部', value: '全部'},
        { label: '广告数据过滤规则', value: 1 },
        { label: '采集栏目过滤规则', value: 2 },
        { label: '采集网址过滤规则', value: 3 },
      ],
      rules: {
        type: null,
        value: null,
        effective: 0,
      },
      //键值对
      keyTypeInput:'',
      // keyDescInput:'',
      keyType:'',
      //配置规则表单相关
      editRulesDialogVisible: false,
      platformRulesEditRules: {
        value: [
          { required: true, message: '请输入规则内容', trigger: 'blur' }
        ],
      },
      rulesType: null,
      editRulesLoading: false,
      //用于生成随机字符串
      chars: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
      // 新加的模版类型
      enumeration:[],
      keyValue:'',
      strOption:'',
      Customize:'',
      formLabelWidth:'100px',
      mods:[],
      //键值对描述
      inputKeyValue:'',
      keyValueName:'',
      strOptionValue:'',
      //枚举
      enumeration_list:[],
      // task_setting_rules_value:'',
    }
  },
  // computed: {
  //   editBtnLoading: function() {
  //     console.log("loading改变");
  //     console.log(this.editBtnLoading);
  //   }
  // },
  methods: {
    //局部刷新页面
    refresh() {
      this.reload();
    },
    //修改分页数量
    dataHandleSizeChange(val) {
      this.dataPageSize = val;
      this.configurationList()
    },
    commandDataHandleSizeChange(val) {
      this.commandDataPageSize = val
      this.getEngineCommand()
    },
    platformRulesDataHandleSizeChange(val) {
      this.PlatformRulesDataPageSize = val;
      if(this.rules.type) {
        this.getPlatformRulesByType()
      } else {
        this.getPlatformRules()
      }
    },
    //切换分页
    dataHandleCurrentChange(val) {
      this.dataCurrentPage = val;
      this.configurationList();
    },
    commandDataHandleCurrentChange(val) {
      this.commandDataCurrentPage = val;
      this.getEngineCommand();
    },
    platformRulesDataHandleCurrentChange(val){
      this.PlatformRulesDataCurrentPage = val;
      if(this.rules.type) {
        this.getPlatformRulesByType()
      } else {
        this.getPlatformRules()
      }
    },
    //添加平台规则
    addRules() {
      if(this.rules.type) {
        this.editRulesDialogVisible = true;
        this.rulesType = this.ruleTypes[this.rules.type-1].label;
      } else {
        this.$message.error({ message: '请先选择规则类型', type: 'error'})
      }
    },
    closeEditRulesDialog() {
      this.resetForm('editRulesForm');
      this.editRulesDialogVisible = false;
      this.rules = {
        type: this.rules.type,
        value: null,
        effective: 0,
      };
      this.rulesType = null;
    },
    saveEditRulesForm(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          let date2 = new Date();
          let date = (new Date().getTime()).toString().substring(6,12);
          this.editRulesLoading = true;
          let ruleId = this.generateMixed(2) + date + this.generateMixed(8);
          this.$post('/action', {
            data: {
              "insert": "crawl_platform_rules",
              "values": {
                "rules_id": ruleId,
                "rules_type": this.rules.type,
                "rules_value": this.rules.value,
                "effective": this.rules.effective,
                "storage_time": this.format(date2, "yyyy-MM-dd HH:mm:ss"),
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
                  "detail": "添加平台规则成功，规则id为" + ruleId,
                  "is_submitted": 0
                }
              }
            });
            this.resetForm(formName);
            this.editRulesLoading = false;
            this.editRulesDialogVisible = false;
            this.$message.success({ message: "添加平台规则成功", type: "success" })
            this.getPlatformRulesByType();
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
                  "detail": "添加平台规则失败",
                  "is_submitted": 0
                }
              }
            });
            this.resetForm(formName);
            this.editRulesLoading = false;
            this.editRulesDialogVisible = false;
            this.$message.error({ message: "添加平台规则失败", type: "error" })
          })
          this.rules = {
            type: this.rules.type,
            value: null,
            effective: 0,
          };
          this.rulesType = null;
        } else {
          this.editRulesLoading = false;
          return false
        }
      })
    },
    //时间戳转换为时间
    timeFormat(val) {
      let date = new Date(val);
      let Y = date.getFullYear(); // 年
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); // 月
      let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''; // 日
      let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 时
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 分
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 秒
      date = Y+'-'+M+'-'+D + " " + h + ":" + m + ':' + s;
      return date;
    },
    //切换平台规则
    // platformRulesServerChange() {
    //
    //   this.getPlatformRulesByType();
    // },
    //切换引擎
    // serverChange() {
    //     this.$forceUpdate();
    //     this.configurationData = [];
    //     this.configurationList();
    //     this.getEngineCommand();
    // },
    //获取引擎列表
    engineList() {
      this.engines = [];
      this.selectLoading = true;
      this.$post('/action', {
        data: {
          "select": "crawl_engine",
          "fields": ["engine_name", "id"],
          "where": ["enabled=1"]
        }
      }).then(data => {
        if(Array.isArray(data)) {
          if(data.length != 0) {
            // this.engines.push({value: '全部', label: '全部'});
            for (let i = 0; i < data.length; i++) {
              var obj = {};
              obj.value = data[i].id;
              obj.label = data[i].engine_name;
              this.engines.push(obj)
            }
            let engineId = this.$route.params.engineId;
            if(typeof (engineId) == 'string') {
              this.searchData.engine = engineId;
            } else {
              this.searchData.engine = '全部';
            }
            this.configurationList();
            this.getEngineCommand();
          }
        }
        this.selectLoading = false;
        this.loading = false;
      })
    },
    //获取引擎配置信息
    configurationList() {
      this.loading = true;
      let where = [];
      if(this.searchData.engine != '' && this.searchData.engine != '全部') {
        where.push("engine_id=" + this.searchData.engine)
      }
      this.$post('/action', {
        data: {
          "select": "crawl_task_setting",
          "where": where,
          "limit": [(this.dataCurrentPage - 1) * this.dataPageSize, this.dataCurrentPage * this.dataPageSize],
        }
      }).then(data => {
        if(typeof data != 'undefined') {
          if(data.length != 0) {
            this.configurationData = data.data;
            this.dataTotal = data.total;
            for(var i = 0; i < this.configurationData.length; i++) {
              if(this.configurationData[i].task_setting_rules_attrs) {
                // this.configurationData[i].task_setting_rules_attrs = this.configurationData[i].task_setting_rules_attrs.replace(/"/g,'');
                // this.configurationData[i].task_setting_rules_attrs = (this.configurationData[i].task_setting_rules_attrs.substring(1,this.configurationData[i].task_setting_rules_attrs.length - 1)).split(",");
                this.configurationData[i].task_setting_rules_attrs = this.configurationData[i].task_setting_rules_attrs.split(",")
              }
              if(this.configurationData[i].baseline_engine_result) {
                this.configurationData[i].baseline_engine_result = JSON.parse(this.configurationData[i].baseline_engine_result);
              }
            }
            for(let i = 0; i < this.configurationData.length; i++) {
              if(this.configurationData[i].dispatched == 1) {
                if(!(Date.parse(this.configurationData[i].dispatch_time) - Date.parse(this.configurationData[i].storage_time))) {
                  this.configurationData[i].ping = "无延时";
                } else {
                  this.configurationData[i].ping = this.formatDuring(Date.parse(this.configurationData[i].dispatch_time) - Date.parse(this.configurationData[i].storage_time))
                }
              } else {
                this.configurationData[i].ping = "未下发"
              }
            }
          }
          this.loading = false;
        }
      }).catch(error => {
        this.$message.error({ message: "获取配置信息失败！", type: "error" });
        this.loading = false;
      })
    },
    addEngineConfiguration() {
      this.dialogTitle = this.dialogTitleList.engine;
      this.editDialogVisible = true;
      for(let i = 0; i < this.engineBus.length; i++) {
        if(this.searchData.engine == this.engineBus[i].id) {
          this.addEngineConfigurationForm.task_setting_rules_range_no = this.engineBus[i].task_setting_rules_range_no;
          this.addEngineConfigurationForm.engine_id = this.engineBus[i].id;
        }
      }
    },
    childContent() {
      return new Promise((resolve, reject) => {
        document.getElementById("myIframe").contentWindow
          .postMessage('{"type": "commit"}');
        window.addEventListener('message', function (ruleString) {
          console.log("2");
          let data = ruleString.data
          let obj = JSON.parse(data)
          resolve(obj.rule);
        }, false)
      })
    },
    //保存表单同时对输入规则进行验证
    saveEditForm(formName) {
      let that = this;
      console.log(1)
      this.$refs[formName].validate(async (valid) => {
        if(valid) {
          this.editBtnLoading = true;
          let timestamp = Date.parse(new Date()) / 1000;
          let date = new Date();
          if(this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id]=='Customize'){
            console.log(this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id])
            await this.childContent().then(result => {
              console.log(result)
              this.addEngineConfigurationForm.task_setting_rules_value = result;
              // this.addEngineConfigurationForm.task_setting_rules_value = JSON.stringify(this.addEngineConfigurationForm.task_setting_rules_value)
            });
          }
          else if(this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id]=='keyValue') {
            let obj = {};
            this.keyValueName.forEach(item => {
              obj[item.keyTypeInput] = item.keyDes;
            })
            this.addEngineConfigurationForm.task_setting_rules_value = JSON.stringify(obj)
          }
          console.log(3)
          //模版名称和engine id 需要对应
          //可能设计异步的问题
          // this.$post('/action',{
          //   data:{
          //     "select": "crawl_engine_module",
          //     "join": "crawl_engine",
          //     // "where": [`crawl_engine=${id}`, "crawl_engine_data_module.engine_id"]
          //   }
          // }).then(res=>{
          //   res.forEach(item=>{
          //      if (item.name != null){
          //       console.log('可以')
          //      }else{
          //        console.log('没有对应模版')
          //      }
          //   })
          // })

          this.$post('/action', {
            data: {
              "insert": "crawl_task_setting",
              "values": {
                "engine_id": this.addEngineConfigurationForm.engine_id,
                "task_setting_rules_range_no": this.addEngineConfigurationForm.task_setting_rules_range_no,
                "task_setting_rules_attrs": this.addEngineConfigurationForm.task_setting_rules_attrs,
                "task_setting_rules_value": this.addEngineConfigurationForm.task_setting_rules_value,
                "task_setting_rules_type": this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id],
                "task_setting_rules_id": this.addEngineConfigurationForm.task_setting_rules_id,
                "task_setting_version": this.addEngineConfigurationForm.task_setting_version,
                "task_setting_level": this.addEngineConfigurationForm.task_setting_level,
                "task_setting_id": timestamp,
                "dispatched": this.addEngineConfigurationForm.dispatched,
                "reported": this.addEngineConfigurationForm.reported,
                "storage_time": this.format(date, "yyyy-MM-dd HH:mm:ss"),
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
                  "detail": "配置任务规则成功，对应引擎ID为" + this.addEngineConfigurationForm.engine_id,
                  "is_submitted": 0
                }
              }
            });
            this.resetForm(formName);
            this.editBtnLoading = false;
            this.editDialogVisible = false;
            this.$message.success({ message: '新建配置数据成功', type: 'success' });
            this.engineList();
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
                  "detail": "配置任务规则失败",
                  "is_submitted": 0
                }
              }
            });
            this.resetForm(formName);
            this.editBtnLoading = false;
            this.editDialogVisible = false;
            this.$message.error({ message: '新建配置数据失败', type: 'error'});
            this.engineList();
          })
        } else {
          this.editBtnLoading = false;
          return false;
        }
      })
    },

    // //关闭表单
    closeEditDialog() {
      this.resetForm('engineConfigurationForm');
      this.editDialogVisible = false;
      // this.addEngineConfigurationForm = {
      //     engine_id: null,
      //     task_setting_rules_range_no: null,
      //     task_setting_rules_attrs: null,
      //     task_setting_rules_value: null,
      //     task_setting_rules_type: 2,
      //     task_setting_rules_id: 0,
      //     task_setting_version: 1,
      //     task_setting_level: 2,
      //     dispatched: 0,
      //     reported: 0,
      // };
    },
    //获取引擎指令
    getEngineCommand() {
      this.commandLoading = true;
      let where = [];
      if(this.searchData.engine != '' && this.searchData.engine != '全部') {
        where.push("engine_id=" + this.searchData.engine)
      }
      this.$post('/action', {
        data: {
          "select": "crawl_engine_instruction",
          "where": where,
          "limit": [(this.commandDataCurrentPage - 1) * this.commandDataPageSize, this.commandDataCurrentPage * this.commandDataPageSize]
        }
      }).then(data => {
        if(typeof data != 'undefined') {
          this.commandData = data.data;
          this.commandLoading = false;
          this.commandDataTotal = data.total;
          for(let i = 0; i < this.commandData.length; i++) {
            if(this.commandData[i].dispatched == 1) {
              if(!(Date.parse(this.commandData[i].dispatch_time) - Date.parse(this.commandData[i].storage_time))){
                this.commandData[i].ping = "无延时";
              } else {
                this.commandData[i].ping = this.formatDuring(Date.parse(this.commandData[i].dispatch_time) - Date.parse(this.commandData[i].storage_time));
              }
            } else {
              this.commandData[i].ping = "未下发"
            }
          }
        }
      }).catch(err => {
        this.$message.error({ message: "获取引擎指令信息失败", type: "error"});
        this.commandLoading = false;
      })
    },
    //计算延时（含毫秒）
    formatDuring(my_time) {
      // var days    = my_time / 1000 / 60 / 60 / 24;
      // var daysRound = Math.floor(days);
      // var hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
      // var hoursRound = Math.floor(hours);
      // var minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
      // var minutesRound = Math.floor(minutes);
      // var seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
      // var secondsRound = Math.floor(seconds)
      // var time = daysRound + '天' + hoursRound + '小时' + minutesRound + '分' + secondsRound + '秒'
      // return time;
      var seconds = my_time / 1000;
      var secondsRound = Math.floor(seconds);
      var millisecond = my_time - (seconds * 1000)
      var time = secondsRound + '秒' + millisecond + '毫秒';
      return time;
    },
    //utc标准时间转换为后端使用的时间
    format(time, format) {
      var t = new Date(time);
      var tf = function (i) { return (i < 10 ? '0' : '') + i };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear());
            break;
          case 'MM':
            return tf(t.getMonth() + 1);
            break;
          case 'mm':
            return tf(t.getMinutes());
            break;
          case 'dd':
            return tf(t.getDate());
            break;
          case 'HH':
            return tf(t.getHours());
            break;
          case 'ss':
            return tf(t.getSeconds());
            break;
        }
      })
    },
    //用于生成随机字符串
    generateMixed(n) {
      var res = "";
      for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += this.chars[id];
      }
      return res;
    },
    //获取引擎在总线的对应编号
    getEngineBus() {
      this.$post('/action', {
        data: {
          sql: "select * from crawl_engine as a left join crawl_task_setting_engine_relation as b on a.id = b.engine_id"
        }
      }).then(data => {
        this.engineBus = data;
      }).catch(error => {
        this.$message.error({ message: "获取引擎在总线对应编号失败！", type: "error"})
      })
    },
    //获取所有平台规则
    getPlatformRules() {
      this.loading = true;
      this.$post('/action', {
        data: {
          "select": "crawl_platform_rules",
          "limit": [(this.PlatformRulesDataCurrentPage - 1) * this.PlatformRulesDataPageSize, this.PlatformRulesDataCurrentPage * this.PlatformRulesDataPageSize],
        }
      }).then(data => {
        this.platformRulesData = data.data;
        this.PlatformRulesDataTotal = data.total;
        for(let i = 0; i < this.platformRulesData.length; i++) {
          if(this.platformRulesData[i].effective == 1) {
            if(!(Date.parse(this.platformRulesData[i].effective_time) - Date.parse(this.platformRulesData[i].storage_time))) {
              this.platformRulesData[i].ping = "无延时";
            } else {
              this.platformRulesData[i].ping = this.formatDuring(Date.parse(this.platformRulesData[i].effective_time) - Date.parse(this.platformRulesData[i].storage_time))
            }
          } else {
            this.platformRulesData[i].ping = "未下发"
          }
        }
        this.platformRulesLoading = false;
      }).catch(err => {
        this.$message.error({ message: '获取平台规则失败', type: 'error'});
        this.platformRulesLoading = false;
      })
    },
    //根据类型获取平台规则
    getPlatformRulesByType() {
      this.platformRulesLoading = true;
      if(this.rules.type == '' || this.rules.type == '全部') {
        this.platformRulesData = [];
        this.$post('/action', {
          data: {
            "select": "crawl_platform_rules",
          }
        }).then(data => {
          this.platformRulesData = data;
          this.PlatformRulesDataTotal = data.length;
          this.platformRulesLoading = false;
        }).catch(err => {
          this.$message.error({ message: '获取平台规则失败', type: 'error'});
          this.platformRulesLoading = false;
        })
      } else {
        this.platformRulesData = [];
        this.$post('/action', {
          data: {
            "select": "crawl_platform_rules",
            "where": ["rules_type=" + this.rules.type]
          }
        }).then(data => {
          this.platformRulesData = data;
          this.PlatformRulesDataTotal = data.length;
          this.platformRulesLoading = false;
        }).catch(err => {
          this.$message.error({ message: '获取平台规则失败', type: 'error'});
          this.platformRulesLoading = false;
        })
      }
    },
    //导出基线引擎配置任务反馈结果
    exportBaselineEngineResult(row) {
      let date = this.$nowYearMonthDay();
      this.engineName = this.engines.find(val => val.value == this.searchData.engine).label;
      let obj = {};
      obj["任务配置id"] = row.id;
      obj["引擎名称"] = this.engineName;
      obj["对应引擎id"] = row.engine_id;
      obj["任务配置附加属性"] = row.task_setting_rules_attrs;
      obj["任务内容"] = row.task_setting_rules_value;
      obj["基线引擎返回结果"] = row.baseline_engine_result;
      let blob = new Blob([JSON.stringify(obj)], {type: ""});
      fileSaver.saveAs(blob, `${this.engineName}反馈结果-${date}.json`)
    },
    //重置已经判断的表单规则
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    load() {
      this.rules.type = '全部';
      this.getEngineBus();
      this.getPlatformRules();
    },
    //获取mods
    getMods(){
      // const that = this
      this.addEngineConfigurationForm.mod_type = {}
      this.$post('/action',{
        data:{
          "select":"crawl_engine_module"
        }
      }).then(res => {
        // console.log(res)
        res.forEach(val => {
          let obj = {};
          obj.label = val.name;
          obj.id = val.id;
          obj.content = val.content;
          this.addEngineConfigurationForm.mod_type[val.id] = val.type
          this.mods.push(obj);
          // console.log(this.enumeration_list)

          // console.log(this.addEngineConfigurationForm.type)
        })
      })
    },
    //改变模版
    change_mod(val){
      // console.log("result", val)
      this.enumeration_list = []
      this.$post('/action',{
        data: {
          "select": "crawl_engine_module",
          "where": [`id=${val}`],
        }
      }).then(res=>{
        // console.log(res)
        if(this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id]=='enumeration'){
          this.enumeration_list = res[0].content.split("\n")
        }
        else if(this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id]=='keyValue'){
          this.keyValueName = JSON.parse(res[0].content)
          // console.log('++++++'+this.addEngineConfigurationForm.task_setting_rules_value)


        }
        else if(this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id]=='strOption'){
        }else if(this.addEngineConfigurationForm.mod_type[this.addEngineConfigurationForm.select_mod_id]=='Customize'){
          this.src = res[0].content
          // console.log(this.src)
        }

      }).catch(err => {
        console.log('error')})
    },


    //上传文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // getChildMsg() {
    //   if (event.origin == this.src) {  // 校验一下来源
    //     console.log('父页面获取到信息是：' + event.data);
    //   }
    // },

  },
  created() {
    this.engineList();
  },
  mounted() {
    this.load();
    this.getMods();
    // this.getEngines()
    // this.iframe = document.getElementById('myIframe').contentWindow;
    // window.addEventListener('message', this.getChildMsg, false);
  },

}
</script>

<style>
.page-log_view_configuration {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  font-size: 14px;
  color: #606266
}

.page-log_view_configuration_box {
  /*height: 100%;*/
  /*background: #fff;*/
}

.page-log_view_configuration .page-log_view_configuration_box .search_form {
  background: #fff;
  padding: 15px 15px 0 15px;
  overflow: hidden;
}
.page-log_view_configuration .page-log_view_configuration_box .inner {
  float: left;
  margin-bottom: 15px;
}
.page-log_view_configuration .page-log_view_configuration_box .el-tag {
  margin-right: 10px;
}

.page-log_view_configuration .page-log_view_configuration_box .el-button--text {
  color:#606266;
}

.page-log_view_configuration .page-log_view_configuration_box .search_form .title {
  font-size: 20px;
  height: 35px;
  line-height: 35px;
}
.page-log_view_configuration .page-log_view_configuration_box .search_form .title .title_i {
  margin-right: 5px;
}
.page-log_view_configuration .page-log_view_configuration_box .search_form .title .checkout {
  display: inline;
  float: right;
  font-size: 14px;
}

.page-log_view_configuration .page-log_view_configuration_box .list {
  background: #fff;
  text-align: center;
  border-right: 1px solid #ebeef5;
  padding: 0 15px;
}
.page-log_view_configuration .page-log_view_configuration_box .list2 {
  margin-top: 15px;
  background: #fff;
  text-align: center;
  border-right: 1px solid #ebeef5;
  padding: 15px;
}
.page-log_view_configuration .page-log_view_configuration_box .list2:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.page-log_view_configuration .page-log_view_configuration_box .list:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.page-log_view_configuration .page-log_view_configuration_box .list .app-table .label_p {
  display: block;
  font-size: 18px;
  height: 35px;
  line-height: 35px;
  text-align: left;
}

.page-log_view_configuration .page-log_view_configuration_box .list2 .app-table .label_p {
  display: block;
  font-size: 18px;
  height: 35px;
  line-height: 35px;
  text-align: left;
}

.el-popper[x-placement^=bottom] {
  word-wrap: break-word;
  word-break: break-all;
}
.page-log_view_configuration .page-log_view_configuration_box .demo-table-expand {
  font-size: 0;
}
.page-log_view_configuration .page-log_view_configuration_box .demo-table-expand label {
  width: 30px;
}
.page-log_view_configuration .page-log_view_configuration_box .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.info .el-form-item__label {
  color: #45c130;
}
.error .el-form-item__label {
  color: #c9302c;
}
.warning .el-form-item__label {
  color: #df5000;
}
.page-log_view_configuration .page-log_view_configuration_box .el-form-item__content {
  float: left;
}
/*键值对style*/
.table11_6 th {
  background-color: #ffffff;
  color: #b5b4b4
}
.table11_6,.table11_6 th,.table11_6 td {
  font-size:0.95em;
  text-align:center;
  padding:4px;
  border-collapse:collapse;
}
.table11_6 th,.table11_6 td {
  border-bottom:1px inset #e9eeef;
  width: 300px;
}
.upload-demo{
  position: absolute;
  left: 123px;
}
</style>

