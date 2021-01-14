<template>
  <div class="app-register">
    <!--logo-->
    <h1 class="app-register-logo">基础平台采集引擎</h1>
    <div class="app-register-box">
      <!-- 左侧图片 -->
      <img src="../../assets/images/login-pic.png" class="app-register-box-img">
      <!-- 右侧表单 -->
      <div class="form-box">
        <!--name-->
        <div class="header">供应商注册</div>
        <!--login-form-->
        <el-form ref="loginForm" :rules="registerFormRules" :model="loginForm" label-width="0px">
          <el-form-item label="" prop="name">
            <el-input v-model="loginForm.name" placeholder="请输入昵称" @keyup.enter.native="submit"
                      autofocus="true"></el-input>
          </el-form-item>
          <el-form-item label="" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" @keyup.enter.native="submit"
                      autofocus="true"></el-input>
          </el-form-item>
          <el-form-item label="" prop="companyName">
            <el-input v-model="loginForm.companyName" placeholder="请输入公司名"
                      @keyup.enter.native="submit"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码"  type="password"
                      @keyup.enter.native="submit"></el-input>
          </el-form-item>
          <el-form-item label="" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="请输入电话"  @keyup.enter.native="submit"></el-input>
          </el-form-item>
          <el-form-item label="" prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱"  @keyup.enter.native="submit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="app-registerin-btn" :loading="loading" @click="submit">注册</el-button>
          </el-form-item>
          <el-form-item>
            	<div style="margin-top:10px;text-align:center;color:#ccc">已有账号，<font @click="login" style="text-align:right;color:#6C8CFF;cursor:pointer">立即登录</font></div>
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
    name: "register",
    data() {
      return {
        loading: false,
        //登陆表单
        registerFormRules:{
        	name: [{ required: true, message: '请输入昵称', trigger: 'blur' },],
        	username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
        	companyName: [{ required: true, message: '请输入公司名', trigger: 'blur' },],
        	password: [{ required: true, message: '请输入密码', trigger: 'blur' },],
        },
        loginForm: {
          name:"",
          username: "",
          companyName:"",
          password: "",
          phone:"",
          email:"",
          accountType:1
        },
        repeatChangeCaptcha: false,
        //记住密码
        rememberPassword: false,
        //账号密码输入错误提示
        messageVisible: false,
        message: "您的用户名和密码错误"
      };
    },
    methods: {
      login(){
          this.$router.push('/login');
      },
      submit() {
      	this.$refs['loginForm'].validate((valid) => {
			this.loading = true;
			if (valid) {
			    let loginForm = this.loginForm;
		        loginForm.password = cryptoUtil.encrypt(loginForm.password)
		        this.$post("/rewrite/user/register", {
		          data: loginForm
		        }).then(data => {
		          if (data.code === 500) {
		             this.$message.error({ message: '该用户名已存在！', type: 'error' });
					this.loading = false;
		          } else {
		             this.$message.success({ message: '注册成功，即将跳转到登录页面', type: 'success' });
		             this.resetForm('loginForm');
					 let router = this.$router;
					 setTimeout(function(){
						router.push("/login");
					 },1000);
		          }
		        });
        	} else {
				this.loading = false
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
		resetForm (formName) {
			this.$refs[formName].resetFields();
		},
      loadImg() {
        this.repeatChangeCaptcha = false;
      }
    },
    mounted() {
      // console.log(cryptoUtil.encrypt('123'), cryptoUtil.decrypt(cryptoUtil.encrypt('123')))
    }
  };
</script>

<style>
.app-register .app-register-box .el-form-item--mini.el-form-item, .app-register .app-register-box .el-form-item--small.el-form-item{
	margin-bottom:0px;
}
.el-form-item__error{
	margin-top:-7px;
	z-index:99;
}
  .app-register {
    width: 100%;
    height: 100%;
    background-image: url(../../assets/images/login-bg.jpg);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .app-register .app-register-logo {
    width: 206px;
    height: 78px;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 20px;
    padding: 31px 0 0 39px;
  }

  .app-register .app-register-box {
    width: 920px;
    height: 481px;
    background-color: #ffffff;
    position: relative;
    top: 30%;
    transform: translateY(-10%);
    border-radius: 30px;
    margin: 0 auto;
  }

  .app-register .app-register-box .app-register-box-img {
    position: absolute;
    left: 0;
    top: 0;
  }

  .app-register .app-register-box .form-box {
    width: 300px;
    position: absolute;
    right: 60px;
  }

  .app-register .app-register-box .header {
    font-size: 24px;
    text-align: center;
    margin: 50px 0px 10px 0;
    color: #1b5b9e;
    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(91, 91, 91, 1)), to(rgba(51, 51, 51, 1)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 500;
  }

  .app-register .app-register-box .verification {
    width: 100%;
    position: relative;
  }

  .app-register .app-register-box .verification .verification-input .el-input__inner {
    padding-left: 15px;
  }

  .app-register .app-register-box .verification .verification-code {
    height: 40px;
    line-height: 40px;
    position: absolute;
    bottom: 16px;
    right: 0;
    text-align: center;
    cursor: pointer;
  }

  .app-register .app-register-box .verification .verification-code img {
    width: 146px;
    height: 38px;
  }

  .app-register .app-register-box .el-input--small .el-input__inner {
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

  .app-register .app-register-box .el-input--small .el-input__inner:last-child {
    margin-bottom: 7px;
  }

  .app-register .app-register-box .icon {
    font-size: 20px;
    line-height: 40px;
    color: #a3a3a3;
    margin-left: 2px;
    padding-right: 5px;
    border-right: 1px solid #e8e8e8;
  }

  .app-register .app-register-box .app-registerin-btn {
    width: 100%;
    height: 46px;
    font-size: 16px;
    background: linear-gradient(to bottom, #72a3f9, #6e88f6);
    margin: 20px 0px 0 0;
    border: none;
    border-radius: 30px;
    transition: background 1s;
    box-shadow: 0px 3px 5px rgba(166, 166, 166, 0.3);
  }

  .app-register .app-register-box .app-registerin-btn:hover {
    background: linear-gradient(to bottom, #5792fb, #5171f8);
  }

  .app-register .app-register-box .app-registerin-btn:active {
    background: linear-gradient(to bottom, #5792fb, #5171f8);
    box-shadow: none;
  }

  .app-register .app-register-box .rememberPassword {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }

  .app-register .app-register-box .rememberPassword .forget-password {
    text-decoration: none;
    color: #3d9df4;
    font-size: 14px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .app-register .app-register-box .warning {
    font-size: 12px;
    color: #ee1515;
    text-align: justify;
    line-height: 20px;
  }

  .app-register .app-register-box .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>
