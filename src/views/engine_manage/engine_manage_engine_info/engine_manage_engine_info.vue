<template>
	<div class="page-registration_engine_info">
		<div class="page-registration_engine_info_box">
			<div class="title"><i class="icon iconfont icon-jisuanyinqing"></i>注册引擎</div>
			<div class="register">
				<el-form :model="registerForm" :rules="registerRules" label-width="150px" ref="registerForm">
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
					<el-form-item label="采集目标网址" prop="crawlTarget">
						<el-input v-model="registerForm.crawlTarget" placeholder="http://"></el-input>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="当需要输入多个采集目标网址时，请使用英文字符','将其分开">
              <img src="../../../assets/images/help_hint.png" slot="reference" height="26" width="26" style="margin-bottom: -8px">
            </el-popover>
					</el-form-item>
					<el-form-item label="标签" prop="tag">
						<el-input v-model="registerForm.tag" placeholder="请输入"></el-input>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="当需要输入多个标签时，请使用英文字符','将其分开">
              <img src="../../../assets/images/help_hint.png" slot="reference" height="26" width="26" style="margin-bottom: -8px">
            </el-popover>
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
                :value="engine.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
				</el-form>
			</div>
			<div class="page-registration_engine_info_submit_button">
<!--        <div style="display: inline-block;margin-right: 10px">-->
<!--        <el-upload-->
<!--          ref="upload"-->
<!--          :limit="1"-->
<!--          accept=".json"-->
<!--          action="#"-->
<!--          :on-change="uploadFile"-->
<!--          :auto-upload="false"-->
<!--          :show-file-list="false"-->
<!--          >-->
<!--          <el-button type="primary">导入文件</el-button>-->
<!--        </el-upload>-->
<!--        </div>-->
				<el-button type="primary" @click="submitForm('registerForm')" :loading="editBtnLoading">保存</el-button>
			</div>
		</div>
	</div>

</template>

<script>
	import permission from "@/components/mixin/permission";
	import { setTimeout } from 'timers';

	export default {
		mixins: [permission],
		name: "engine_manage_engine_info",
		data () {
			return {
			  //供应商列表
        providers: [],
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
        search: {},
        test: '123',
				// 注册表单验证
				registerRules: {
          user_id: [{ required: true, message: '请选择供应商', trigger: 'blur'},],
					engineName: [{ required: true, message: '请输入引擎名称', trigger: 'blur' },],
					engineVersion: [{ required: true, message: '请输入引擎版本', trigger: 'blur' },],
					tag: [{ required: true, message: '请输入标签', trigger: 'blur' },],
					crawlTarget: [
						{ required: true, message: '请输入采集目标网址', trigger: 'blur' },
						{ pattern: /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/, message: '请输入正确网址', trigger: 'blur' }
					],
          subjoinEngine: [{ required: true, message: '请选择普通引擎', trigger: 'blur'}]
				}
			};
		},
		methods: {
			clk_engineType (engineType) {
				this.registerForm.engineType = engineType;
			},
			submitForm (formName) {
          this.editBtnLoading = true;
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  console.log(this.registerForm.subjoinEngine);
                  this.$post('/engine/register', {
                      data: this.registerForm
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
                                  "detail": "注册引擎成功，对应引擎ID为" + data.id,
                                  "is_submitted": 0
                              }
                          }
                      });
                      if (this.registerForm.subjoinEngine != '') {
                          this.$post('/action', {
                              data: {
                                  "insert": "crawl_engine_base_relation",
                                  "values": {
                                      "engine_id": this.registerForm.subjoinEngine,
                                      "basis_engine_id": data.id
                                  }
                              }
                          }).then(data3 => {
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
                                          "detail": "新增对标引擎映射关系成功，对应引擎ID为" + this.registerForm.subjoinEngine + "对应基线引擎ID为" + data.id,
                                          "is_submitted": 0
                                      }
                                  }
                              });
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
                                          "detail": "新增对标引擎映射关系失败",
                                          "is_submitted": 0
                                      }
                                  }
                              });
                          });
                      }
                      this.editBtnLoading = false;
                      this.$message.success({message: '添加成功，即将跳转到引擎列表', type: 'success'});
                      this.resetForm('registerForm');
                      let router = this.$router;
                      setTimeout(function () {
                          router.push({name: 'engine_manage_engine_list'})
                      }, 1000);
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
                                  "detail": "注册引擎失败",
                                  "is_submitted": 0
                              }
                          }
                      });
                  })
              } else {
                  this.editBtnLoading = false;
                  return false;
              }
          });
			},
      // 处理json文件
      uploadFileDispose(file) {
          window.uploadObject = {};
          var reader = new FileReader();
          reader.onload = (evt) => {
                  // var fileString = evt.target.result.replace(/"/g, '').substring(1, evt.target.result.length - 1).split(",");
                  uploadObject = JSON.parse(evt.target.result);
                  // this.registerForm.engineName = fileString.engine_name;
                  // this.registerForm.engineVersion = fileString.engine_version;
                  // this.registerForm.crawlTarget = fileString.crawl_target;
                  // this.registerForm.tag = fileString.tag;
                  // this.registerForm.description = fileString.description;
                  // console.log(reader.result)
          };
          reader.readAsText(file.raw, "UTF-8")
      },
      // 上传json文件后对文件的处理
      uploadFile(file) {
			    this.uploadFileDispose(file);
			    console.log(uploadObject)
			    // this.uploadFileDispose(file).then(function(result) {
			    //     fileObject = result;
          //     var fileString = JSON.parse(result.target.result);
          // });
          this.$refs.upload.clearFiles();
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
      //获得引擎列表
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
			resetForm (formName) {
				this.$refs[formName].resetFields();
			}
		},
		mounted () {
		    this.getEngines();
		    this.list()
    }
	};
</script>

<style>
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
margin-bottom:28px;
}
.page-registration_engine_info {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
}
.page-registration_engine_info .el-button--small,
.el-button--small.is-round {
    position: relative;
    top: -1px;
    padding: 6px;
}

.page-registration_engine_info .page-registration_engine_info_box {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 15px 30px;
}
.page-registration_engine_info .page-registration_engine_info_box .el-form-item__content span {
  height: 26px;
  width: 26px;
}
.page-registration_engine_info .page-registration_engine_info_box .register {
  width: 80%;
}
.page-registration_engine_info .page-registration_engine_info_box .el-form {
  width: 100%;
}
.page-registration_engine_info .page-registration_engine_info_box .register .el-input {
  width: 80%;
}
.page-registration_engine_info .page-registration_engine_info_box .register .el-textarea {
  width: 80%;
}
.page-registration_engine_info .page-registration_engine_info_box .register .el-button {
  margin-left: 10px;
}
.page-registration_engine_info .page-registration_engine_info_box .title {
    height: 65px;
    line-height: 35px;
}
.page-registration_engine_info .page-registration_engine_info_box .title i{
    margin-right:10px;
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .register
    input {
    /*max-width: 40%;*/
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .page-registration_engine_info_box_field {
    display: flex;
    margin-top: 10px;
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .page-registration_engine_info_box_field
    > div {
    border: 1px solid #ccc;
    min-height: 35px;
    border-radius: 2px;
    padding: 10px;
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .page-registration_engine_info_box_field
    .field {
    width: 70%;
    margin-right: 15px;
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .page-registration_engine_info_box_field
    .info {
    width: 30%;
    position: relative;
    padding-top: 45px;
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .page-registration_engine_info_box_field
    .info
    .info_title {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    padding: 0 10px;
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .page-registration_engine_info_box_field
    .info
    .save {
    text-align: center;
}
.page-registration_engine_info
    .page-registration_engine_info_box
    .page-registration_engine_info_box_field
    .info
    .save
    button {
    padding: 8px 15px;
}
.page-registration_engine_info .page-registration_engine_info_submit_button {
    text-align: center;
}
.page-registration_engine_info
    .page-registration_engine_info_submit_button
    button {
    padding: 8px 15px;
}
 /*element-ui固定样式修改 */
.page-registration_engine_info .page-registration_engine_info_box .el-input--small .el-input__icon {
  line-height: 32px;
}
.el-select__caret {
  height: 32px;
}
</style>
