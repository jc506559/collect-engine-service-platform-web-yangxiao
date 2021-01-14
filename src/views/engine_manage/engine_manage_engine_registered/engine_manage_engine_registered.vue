<template>
  <div class="engine_manage_engine_registered">
  <div class="engine_manage_engine_registered_box">
    <div class="register_box" style="border:1px solid #e2edf3" >
    <el-steps :active="active" finish-status="success" space="80%" align-center style="margin-top: 50px">
      <el-step title="步骤 1" description="填写引擎注册信息">
      </el-step>
      <el-step title="步骤 2" description="填写配置格式">
      </el-step>
      <el-step title="步骤 3" description="填写数据类型并进行引擎认证">
      </el-step>
    </el-steps>
<!--注册页面-->

    <div class="register" v-if="active==0">
      <el-form class="registerForm" :model="registerForm" :rules="registerRules" label-width="150px" ref="registerForm" key="register">
        <el-form-item label="引擎模板">
          <el-radio :label="0" v-model="registerForm.engineType">普通引擎</el-radio>
          <el-radio :label="1" v-model="registerForm.engineType">基线引擎</el-radio>
        </el-form-item>
        <el-form-item label="引擎名称" prop="engineName">
          <el-input v-model="registerForm.engineName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称" prop="user_id">
          <el-select v-model="registerForm.user_id" placeholder="请选择供应商名称">
            <el-option
              v-for="item in providers"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="引擎版本" prop="engineVersion">
          <el-input v-model="registerForm.engineVersion" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="引擎描述" prop="description">
          <el-input type="textarea" v-model="registerForm.description" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item v-if="registerForm.engineType == 1" label="选择附加引擎" prop="subjoinEngine">
          <el-select v-model="registerForm.subjoinEngine">
            <el-option
              v-for="engine in engines"
              :key="engine.value"
              :label="engine.label"
              :value="engine.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
<!--配置格式-->
    <div class="Layout" v-if="active==1" >
      <!-- 新增添加配置格式 -->

        <el-form class="LayoutForm" style="width: 600px" :model="configurationForm" :rules="configurationFormRules"  ref="addConfigurationForm" label-width="100px" key="Layout">
          <el-form-item label="数据格式" prop="data_format" label-width="120px">
            <el-input v-model="configurationForm.data_format" clearable placeholder="请输入" rows="6" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="数据格式描述" prop="description" label-width="120px">
            <el-input v-model="configurationForm.description" clearable placeholder="请输入" rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-form>
<!--      <div class="saveBtn">-->
<!--        <span slot="footer" class="dialog-footer">-->
<!--				<el-button  @click="closeConfigurationDialog">取消</el-button>-->
<!--				<el-button type="primary" :loading="editBtnLoading" @click="saveConfigurationForm()">保存</el-button>-->
<!--			 </span></div>-->
    </div>
<!--    数据类型-->
    <div class="Type" v-if="active==2" >
      <el-form style="width: 600px" :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px"key="Type">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="editForm.name" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="类型版本" prop="version">
          <el-input v-model="editForm.version" clearable placeholder="请输入"></el-input>
        </el-form-item>
<!--        <el-form-item label="数据格式" prop="data_format">-->
<!--          <el-input v-model="editForm.data_format" clearable placeholder="请输入" rows="6" type="textarea"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="XTag" prop="xtag">
          <el-input v-model="editForm.xtag" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="类型描述" prop="description">
          <el-input v-model="editForm.description" clearable placeholder="请输入" rows="3" type="textarea"></el-input>
        </el-form-item>
      </el-form>
<!--      <div class="cancelDiv" >-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--				<el-button @click="closeEditDialog">取消</el-button>-->
<!--				<el-button type="primary" :loading="editBtnLoading" @click="saveEditForm()">保存</el-button>-->
<!--			</span></div>-->




    </div>



      <!--按钮-->

    <div class="basicInfo" v-if="active==0"></div>
    <div class="basicLayout" v-if="active==1"></div>
    <div class="basicType" v-if="active==2"></div>
    <div class="basicIdentification" v-if="active==3"></div>


    <el-button class="changeBtnPrev" @click="prev" v-if="active==1||active==2">上一步</el-button>
    <el-button class="changeBtnNext"  @click="next" v-if="active==0||active==1">下一步</el-button>
      <!--    引擎认证-->
    <el-button @click="addEngine" v-if="active==2">提交并验证引擎</el-button>
    </div>



  </div>
</div>
</template>
<script>
import permission from "@/components/mixin/permission";
import axios from "axios";

export default {
  mixins: [permission],
  name: "engine_manage_engine_registered",

  data(){
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
    }
    return {
      //配置相关
      active: 0,
      //供应商列表
      providers:[],
      //引擎列表
      engines: [],
      //注册表单信息
      editBtnLoading: false,
      registerForm: {
        user_id: "",
        engineName: "",
        engineVersion: "",
        tag: "",
        crawlTarget: "",
        engineType: 0,
        description: "",
        subjoinEngine: ""
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
      //新增数据类型
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
      search: {},
      test: '123',
      // 注册表单验证
      registerRules: {
        user_id: [{ required: true, message: '请选择供应商', trigger: 'blur'},],
        engineName: [{ required: true, message: '请输入引擎名称', trigger: 'blur' },],
        engineVersion: [{ required: true, message: '请输入引擎版本', trigger: 'blur' },],
        tag: [{ required: true, message: '请输入标签', trigger: 'blur' },],
        crawlTarget: [],
        subjoinEngine: [{ required: true, message: '请选择普通引擎', trigger: 'blur'}]
      },
      // 配置格式表单验证
      configurationFormRules: {
        version: [
          { required: true, message: '请输入类型版本', trigger: 'blur' },
        ],
        data_format: [
          { required: true, message: '请输入数据格式', trigger: 'blur' },
        ],
      },
    }
  },
  methods:{
    //选择附加引擎
    getEngines() {
      this.$post('/action', {
        data: {
          "select": "crawl_engine",
          "fields": ["id", "engine_name"],
          "where": ["engine_type=0", "enabled=1"]
        }
      }).then(data => {
        for(let i = 0; i < data.length; i++) {
          let obj = {};
          obj.label = data[i].engine_name;
          obj.value = data[i].id;
          this.engines.push(obj)
        }
      }).catch(err => {
        this.$message.error({ message: "获取引擎列表失败", type: "error"})
      })
    },
    // 获得供应商列表
    list() {
      this.loading = true;
      this.$post('/action', {
        data: {
          "select": "sys_user",
          "join": ["sys_user_role", "sys_role"],
          "limit": [0,999],
          "order": ["create_time desc"],
        }
      }).then((data) => {
        this.loading = false;
        if (data && Array.isArray(data.data)) {
          for(var i = 0; i < data.data.length; i ++) {
            let obj = {};
            obj.label = data.data[i].username;
            obj.value = data.data[i].id;
            this.providers.push(obj)
          }
        }
      }).catch(error => {
        this.loading = false;
        this.$message.error({ message: "获取供应商列表失败", type: "error"})
      })
    },
    prev(){
      if (this.active--<0){
        this.active =0
      }
    },
    next(){
      if (this.active++>3){
        this.active=0
      }
    },
  //配置
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
    closeConfigurationDialog() {
      this.configurationDialogVisible = false;
      // this.resetEditForm()
    },
    // 增加数据类型关闭不保存
    closeEditDialog () {
      this.editDialogVisible = false;
      // this.resetEditForm();
    },
    // 增加数据类型保存
    saveEditForm () {
      this[this.editDialogType]();
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
      console.log(this.addEngine())
    },

  },
    mounted() {
    this.list()
    this.getEngines()
    }
}
</script>

<style scoped>
.engine_manage_engine_registered{
  background-color:white;
  height: 1200px;
  margin-left: 15px;
  margin-right: 15px;
}
.registerForm{
  width: 600px;
  position: absolute;
  margin-top: 70px;
  background-color:white;
}
.LayoutForm{
  margin-top: 70px;
  margin-left: 54px;
}
.changeBtnPrev{
  margin-left: 350px;
}
.changeBtnNext{
position: absolute;
  left: 410px;
  bottom: 0;
}
.register{
  height: 450px;
 margin-left: 16%;
}
.Layout{
  height: 350px;
  margin-left: 10%;
}
.Type{
  height: 350px;
  margin-top: 70px;
  margin-left: 14%;
}
.register_box{
 top:50px;
  position: relative;
  width: 900px;
  height: 100%;
 left: 11%;
}
.saveBtn{
  margin-left: 537px;
}
.cancelDiv{
  margin-left: 474px;
}
</style>

