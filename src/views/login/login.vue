<template>
  <div class="app-login">
    <!--logo-->
    <h1 class="app-login-logo">互联网信息采集服务平台</h1>
    <div class="app-login-box">
      <!-- 左侧图片 -->
      <img src="../../assets/images/login-pic.png" class="app-login-box-img">
      <!-- 右侧表单 -->
      <div class="form-box">
        <!--name-->
        <div class="header">欢迎登录</div>
        <!--login-form-->
        <el-form ref="loginForm" :rules="loginFormRules" :model="loginForm" label-width="0px">
          <el-form-item label="" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" @keyup.enter.native="submit"
                      autofocus="true"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"
                      @keyup.enter.native="submit"></el-input>
          </el-form-item>
          <!--verification-->
          <!-- <div class="verification">
            <el-form-item label="">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" type="text" @keyup.enter.native="submit"></el-input>
            </el-form-item>
            <div class="verification-code" @click="changeCaptcha">
              <img :src="captchaURL" @load="loadImg">
            </div>
          </div> -->
          <el-form-item>
            <el-button type="primary" class="app-loginin-btn" :loading="loading" @click="submit">登录</el-button>
          </el-form-item>

          <el-form-item>
            	<div style="text-align:center;color:#ccc">没有账号？  <font @click="register" style="text-align:right;color:#6C8CFF;cursor:pointer">去注册</font></div>
          </el-form-item>
        </el-form>
        <div class="rememberPassword">
          <!--<el-checkbox v-model="rememberPassword">记住密码</el-checkbox>-->
          <!--<a href="#" class="forget-password">忘记密码？</a>-->
        </div>

        <div class="warning" v-show="messageVisible">
          {{message}}。请重试。如果总是不能登录，请<!--点击“忘记密码”或--> 联系管理员。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import cryptoUtil from '@/lib/cryptoUtil'

  export default {
    name: "app",
    data() {
      return {
        loading: false,
        //登陆表单
        loginForm: {
          username: "",
          password: "",
          // captcha: ""
        },
        loginFormRules:{
        	username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
        	password: [{ required: true, message: '请输入密码', trigger: 'blur' },],
        },
        captchaURL: '/api/captcha?identify=' + Date.now(),
        repeatChangeCaptcha: false,
        //记住密码
        rememberPassword: false,
        //账号密码输入错误提示
        messageVisible: false,
        message: "您的用户名和密码错误",
        ip: '',
      };
    },
    methods: {
      register(){
          this.$router.push('/register');
      },
      submit() {
      this.$refs['loginForm'].validate((valid) => {
			this.loading = true;
			if (valid) {
				 // @特殊处理, 补充密码加密
		        let loginForm = JSON.stringify(this.loginForm);
		        loginForm = cryptoUtil.encrypt(loginForm);

		        this.$post("/login", {
		          data: {
		            "params": loginForm
		          }
		        }).then(data => {
		          if (data.code === 500) {
					      this.loading = false;
		            this.message = data.message;
		            this.messageVisible = true;
                  this.$post('/action', {
                      data: {
                          "insert": "audit_log",
                          "values": {
                              "user": this.loginForm.username,
                              "operate": "登录",
                              "result": "失败",
                              "client": this.localStore.get("client").client,
                              "object_type": "平台",
                              "object_id": 0,
                              "detail": "用户登录失败",
                              "is_submitted": 0
                          }
                      }
                  });
		          } else {
		            this.$store.commit("user", data);
		            let obj = {};
		            obj.client = data.remoteIp;
		            this.$store.commit("client", obj);
                  this.$post('/action', {
                      data: {
                          "insert": "audit_log",
                          "values": {
                              "user": this.localStore.get("user").username,
                              "operate": "登录",
                              "result": "成功",
                              "client": this.localStore.get("client").client,
                              "object_type": "平台",
                              "object_id": 0,
                              "detail": "用户登录成功",
                              "is_submitted": 0
                          }
                      }
                  });
		            // 取得权限
		            this.$post("/action", {
		              data: {
		                "select": "sys_role",
		                "where": "id=" + data.roleId,
		                "join": ["sys_role_permission", "sys_permission"]
		              }
		            }).then(per => {
		              if (Array.isArray(per) && per.length > 0) {
		                this.$store.commit("permission", per[0].id__sys_role_permission.permission_id__sys_permission);
		                // @特殊处理 session失效被阻止到登录页面, 需要返回最后的访问页面
		                let before403Path = this.localStore.get("before_403_path");
		                if (before403Path) {
		                  this.$router.push(before403Path);
		                  this.localStore.remove("before_403_path");
		                } else {
		                  this.$router.push('/main');
		                }
		              }
		            });
		          }
		        });
			} else {
				this.loading = false
				console.log('error submit!!');
				return false;
			}
		});
      },
      changeCaptcha() {
        // console.log(this.repeatChangeCaptcha);
        if (!this.repeatChangeCaptcha) {
          this.repeatChangeCaptcha = true;
          this.captchaURL = this.captchaURL.split("?")[0] + '?identify=' + Date.now()
        }
      },
      loadImg() {
        this.repeatChangeCaptcha = false;
      }
    },
    mounted() {
    }
  };
</script>

<style>
  .app-login {
    width: 100%;
    height: 100%;
    background-image: url(../../assets/images/login-bg.jpg);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .app-login .app-login-logo {
    width: 260px;
    height: 78px;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 20px;
    padding: 31px 0 0 39px;
  }

  .app-login .app-login-box {
    width: 920px;
    height: 481px;
    background-color: #ffffff;
    position: relative;
    top: 30%;
    transform: translateY(-10%);
    border-radius: 30px;
    margin: 0 auto;
  }

  .app-login .app-login-box .app-login-box-img {
    position: absolute;
    left: 0;
    top: 0;
  }

  .app-login .app-login-box .form-box {
    width: 300px;
    position: absolute;
    right: 60px;
  }

  .app-login .app-login-box .header {
    font-size: 24px;
    text-align: center;
    margin: 88px 0 40px 0;
    color: #1b5b9e;
    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(91, 91, 91, 1)), to(rgba(51, 51, 51, 1)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }

  .app-login .app-login-box .verification {
    width: 100%;
    position: relative;
  }

  .app-login .app-login-box .verification .verification-input .el-input__inner {
    padding-left: 15px;
  }

  .app-login .app-login-box .verification .verification-code {
    height: 40px;
    line-height: 40px;
    position: absolute;
    bottom: 16px;
    right: 0;
    text-align: center;
    cursor: pointer;
  }

  .app-login .app-login-box .verification .verification-code img {
    width: 146px;
    height: 38px;
  }

  .app-login .app-login-box .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
    color: #a4a4a4;
    font-size: 14px;
    padding: 0 4px;
    border: none;
    border-bottom: 1px solid #d9d9d9;
    border-radius: 0;
    margin-bottom: 26px;
  }

  .app-login .app-login-box .el-input--small .el-input__inner:last-child {
    margin-bottom: 10px;
  }

  .app-login .app-login-box .icon {
    font-size: 20px;
    line-height: 40px;
    color: #a3a3a3;
    margin-left: 2px;
    padding-right: 5px;
    border-right: 1px solid #e8e8e8;
  }

  .app-login .app-login-box .el-form-item--mini.el-form-item,
  .app-login .app-login-box .el-form-item--small.el-form-item {
    margin-bottom: 15px;
  }

  .app-login .app-login-box .app-loginin-btn {
    width: 100%;
    height: 46px;
    font-size: 16px;
    background: linear-gradient(to bottom, #72a3f9, #6e88f6);
    margin: 11px 0px;
    border: none;
    border-radius: 30px;
    transition: background 1s;
    box-shadow: 0px 3px 5px rgba(166, 166, 166, 0.3);
  }

  .app-login .app-login-box .app-loginin-btn:hover {
    background: linear-gradient(to bottom, #5792fb, #5171f8);
  }

  .app-login .app-login-box .app-loginin-btn:active {
    background: linear-gradient(to bottom, #5792fb, #5171f8);
    box-shadow: none;
  }

  .app-login .app-login-box .rememberPassword {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }

  .app-login .app-login-box .rememberPassword .forget-password {
    text-decoration: none;
    color: #3d9df4;
    font-size: 14px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .app-login .app-login-box .warning {
    font-size: 12px;
    color: #ee1515;
    text-align: justify;
    line-height: 20px;
  }

  .app-login .app-login-box .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.3);
  }

</style>
