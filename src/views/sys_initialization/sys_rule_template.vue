<template>
  <div class="sys_rule_template">
    <div class="sys_rule_template_box">
      <el-button type="danger" icon="el-icon-plus" @click="dialogFormVisible = true">添加</el-button>
      <!--添加模版-->
      <el-dialog title="添加规则模版" :visible.sync="dialogFormVisible" :append-to-body="true">
        <el-form :model="form" :rules="editRules" ref="form">
          <!--        必填项-->
          <el-form-item label="引擎ID" :label-width="formLabelWidth" prop="setting_rules_engine_id">
            <el-select v-model="form.setting_rules_engine_id" placeholder="请选择引擎">
              <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模版名称" :label-width="formLabelWidth" prop="setting_rules_name" >
            <el-input v-model="form.setting_rules_name" autocomplete="off" placeholder="请输入名称，例如caiji—url-v2，名称不可重复"></el-input>
          </el-form-item>

          <!--        选填项-->
          <el-form-item label="描述" :label-width="formLabelWidth" prop="setting_rules_desc">
            <!--         attention-->

            <el-input v-model="form.setting_rules_desc" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <!--        必填项-->
          <el-form-item label="规则类型" :label-width="formLabelWidth" prop="setting_rules_type">
            <el-select v-model="form.setting_rules_type" placeholder="选择类型" class="typeSelect">
              <el-option
                v-for="typeWords in setting_type"
                :key="typeWords.value"
                :label="typeWords.label"
                :value="typeWords.value"></el-option>

              <!--            <el-option label="文件" value="file" :key="file.value"></el-option>-->
              <!--            <el-option label="字符串" value="strOption" :key="strOption.value"></el-option>-->
              <!--            <el-option label="键值对" value="keyValue" :key="keyValue.value"></el-option>-->
              <!--            <el-option label="枚举" value="enumeration" :key="enumeration.value"></el-option>-->
            </el-select>
          </el-form-item>

          <!-- 字符串绑定输入框          -->
          <div  v-if="form.setting_rules_type=='strOption'">
            <el-form-item label="格式校验" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入用于格式验证的字符串"
                v-model="form.content">
              </el-input>
            </el-form-item>
          </div>
          <!--        键值对表单-->
          <div v-if="form.setting_rules_type=='keyValue'">
            <el-form-item label="规则模版定义" :label-width="formLabelWidth" >
              <table class=table11_6  >
                <thead>
                <tr>
                  <th>类型</th><th>名称</th><th>描述</th><th>操作</th>
                </tr>
                </thead>
                <tr v-for="item in form.content" :key="item.id" prop="type">
                  <td><el-select v-model="item.keyType" placeholder="请选择">
                    <el-option
                      v-for="keywords in keyValueSelects"
                      :key="keywords.value"
                      :label="keywords.label"
                      :value="keywords.value">
                    </el-option>
                  </el-select></td>
                  <td><el-input v-model="item['keyTypeInput']"></el-input></td>
                  <td><el-input  v-model="item['keyDescInput']" ></el-input></td>
                  <td>
                    <el-button class="deleted" @click="deleteKeyValue"
                               type="text"
                               size="small">移除
                    </el-button>
                  </td>
                </tr>
              </table>
              <el-button  class="add" @click="addKeyValue" icon="el-icon-plus">增加</el-button>
            </el-form-item>
          </div>
          <!--     枚举     -->
          <div v-if="form.setting_rules_type=='enumeration'">
            <el-form-item label="枚举定义" :label-width="formLabelWidth">
              <el-input
                v-model="form.content"
                type="textarea"
                :rows="2"
                placeholder="每行定义一个枚举">
              </el-input></el-form-item>
          </div>
          <!--自定义-->
          <div v-if="form.setting_rules_type=='Customize'">
            <el-form-item label="自定义" :label-width="formLabelWidth">
              <el-input
                v-model="form.content"
                type="textarea"
                :rows="2"
                placeholder="自定义html">
              </el-input>
            </el-form-item>
            <div class="text" @click="downLoad" id="mubanId">
              <i class="el-icon-download" style="color:blue;margin-left:-10px">下载自定义模板 </i>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="saveForm">确 定</el-button>
        </div>
      </el-dialog>
      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top: 10px">
        <el-table-column
          prop="engine_id"
          label="引擎ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="规则模版名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.row.id)"
              type="danger"
              size="small">
              移除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="app-pagination">
        <el-pagination :total="total"
                       :page-size="pageSize"
                       :page-sizes="pageSizes"
                       :current-page="currentPage"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>

export default {

  name: "sys_rule_template",
  data(){
    return{
      fileUrl:"/static/自定义模版.txt",
      //必填项
      editRules: {
        setting_rules_engine_id: [{
          required: true, message: '请选择引擎id', trigger: 'change'
        }],
        setting_rules_name: [
          { required: true, message: '请输入规则模版名称', trigger: 'blur' }
        ],
        setting_rules_type: [
          { required: true, message: '请输入正则格式的字符串', trigger: 'blur' }
        ]
      },

      engines:[],
      //展示list
      tableData:[],
      value:'',
      keyValueTable:[],
      file:'',
      //字符串
      // strOption:'',
      //枚举
      enumeration:[],
      // 键值对
      kValue:'',
      SelectOption:'',
      //键值对的类型选择
      keyValueSelects:[{
        value: 'string',
        label: '字符串'
      }, {
        value: 'integer',
        label: '整数'
      }],
      //type状态
      setting_type:[
        //   {
        //   value: 'file',
        //   label: '文件'
        // },
        {
          value: 'strOption',
          label: '字符串'
        }, {
          value: 'keyValue',
          label: '键值对'
        }, {
          value: 'enumeration',
          label: '枚举'
        }, { value: 'Customize',
          label: '自定义'
        }],
      //键值对描述
      keyDescInput:'',
      //键值对名称输入
      keyTypeInput:'',
      //增加模版
      dialogTableVisible: false,
      dialogFormVisible: false,
      //新增获取的form表单
      form: {
        setting_rules_name:'',
        setting_rules_type:'',
        setting_rules_desc:'',
        setting_rules_engine_id:'',
        keyValueTable:[],

        content:null,
      },
      formLabelWidth:'100px',
      //分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [20, 50, 100, 200],
      keyValue_Select:false,
      multipleSelection:[],

    }
  },
  created() {
  },
  methods: {
    //   键值对
    addKeyValue(){
      try {
        console.log(this.form.content.length)
      }catch {
        this.form.content = [];
      }

      // for(var i=0; i<this.form.content.length;i++){
      //

      this.form.content.push({ "keyTypeInput": "", "keyDescInput": "", "keyType": ""});
      //   console.log(this.form.content)
      // }
    },
    deleteKeyValue(index){
      this.form.content.splice(index,1)
    },
    cancel(){
      // this.resetForm('form');
      this.dialogFormVisible =false;
      this.resetForm();
    },
    getTableData(){
      this.$post('/action',{
        data:{
          "select":"crawl_engine_module"
        }
      }).then(res=>{
        this.tableData = res
        this.total = res.length
      })
    },
    checkSameMod(){
      return new Promise((resolve, reject) => {
        this.$post('/action', {
          data: {
            "select": "crawl_engine_module",
          }
        }).then(res => {
          res.forEach(item => {
            if (item.name == this.form.setting_rules_name) {
              reject("模板名称重复，请重新输入名称！")
            }
          })
          resolve()
        })
      })

    },
    saveForm(form){
      this.$refs.form.validate(async (valid) => {
        let date = this.$format("YYYY-MM-DD HH:mm:ss", new Date())
        if (valid) {
          if (this.form.setting_rules_type == 'keyValue') {
            this.form.content = JSON.stringify(this.form.content)
            console.log(1)
          } else {
            this.form.content = this.form.content
          }
          await this.checkSameMod().then(res =>{
            console.log("success")
            this.$post('/action', {
              data: {
                "insert": "crawl_engine_module",
                "values": {
                  "engine_id": this.form.setting_rules_engine_id,
                  "name": this.form.setting_rules_name,
                  "type": this.form.setting_rules_type,
                  "content":this.form.content,
                  "description":  this.form.setting_rules_desc,
                  "storage_time": date,
                }
              }
            }).then(res => {
              this.$post('/action',{
                data:{
                  "select":"crawl_engine_module"
                }
              }).then(res=>{
                this.tableData = res
                this.total = res.length
              })
              this.dialogFormVisible =false;
              this.resetForm();
              this.form.content = null
            })
          }).catch(err => {
            this.resetForm()
            this.$message.error({ message: err, type: "error" })
          })
         }
      })
    },
    resetForm () {
      this.$refs.form.resetFields();
      // this.form.content=[];
    },
    //获取引擎id
    getEngines() {
      this.$post('/action', {
        data: {
          "select": "crawl_engine",
        }
      }).then(res => {
        res.forEach(val => {
          let obj = {};
          obj.value = val.id;
          obj.label = val.engine_name;
          this.engines.push(obj);
        })
      })
    },
    //移除tableData每一行
    deleteRow(rows) {
      this.$post('/action', {
        data: {
          "delete": "crawl_engine_module",
          "where":[`id=${rows}`,]
        }
      }).then(res => {
        this.tableData = res
        this.total = res.length
        this.getTableData();
      })
    },

    downLoad() {
      this.click();
    },
    click() {
      let link = document.createElement("a");
      link.download = '自定义模版';
      link.href = this.fileUrl;
      link.click();
      link.remove();
    },
    //分页
    handleSizeChange(val){
      this.pageSize = val;
      this.saveForm()
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.saveForm();
    },
  },
  mounted() {
    this.getEngines();
    this.getTableData()
  }
}
</script>

<style>
.sys_rule_template{
  width: 100%;
  height: 100%;
  padding: 0 15px;
  font-size: 14px;
}
.sys_rule_template_box{
  background: #fff;
  padding: 15px;
  width: 100%;

}
.typeSelect{
  width: 578px;
}
.table11_6 table {
  width:100%;
  margin:15px 0;
  border:0;
}
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
/*.table11_6 tr {*/
/*  border: 1px solid #ffffff;*/
/*}*/
/*.table11_6 tr:nth-child(odd){*/
/*  background-color: #f8f8f8;*/
/*}*/
/*.table11_6 tr:nth-child(even){*/
/*  background-color:#ffffff;*/
/*}*/


</style>
