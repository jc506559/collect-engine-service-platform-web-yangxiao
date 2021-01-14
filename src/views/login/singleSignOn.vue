<template>
  <div class="page-single-sign-on">
    <div class="page-single-sign-on_box">
      <div class="center">
        {{ message }}
      </div>
    </div></div>
</template>

<script>
    import cryptoUtil from '@/lib/cryptoUtil'

    export default {
        name: "singleSignOn",
        data() {
            return {
                system_id: "",
                key: "",
                message: "正在进行单点登录..."
            }
        },
        methods: {
            getQueryStringArgs() {
                return window.location.href.split('?')[1].split("&")[0].split("=")[1].replace("%2F", "/")
            },
            load() {
                let sha256 = require('js-sha256').sha256;
                //获取ticked
                let ticked = this.getQueryStringArgs();
                let sign;
                //在数据库中获取系统编码和key
                this.$post('/login', {
                    data: {
                        "params": "QVhBEex5m9iLuGO7ulkMgVtQcZtdq/TmuYlvrDyIlvKgETOaL3L4ifXw0Rs1qfcO"
                    }
                }).then(data => {
                    this.$store.commit("user", data);
                    let obj = {};
                    obj.client = data.remoteIp;
                    this.$store.commit("client", obj);
                    this.$post('/action', {
                        data: {
                            "sql": "select * from crawl_bus_config"
                        }
                    }).then(data => {
                        this.key = data[0].key;
                        this.system_id = data[0].system_id.toString();
                        //计算sign
                        // sign = this.strToHexCharCode(sha256(this.system_id + '-' + ticked + '-' + this.key));
                        sign = sha256(this.system_id + '-' + ticked + '-' + this.key);
                        let obj = {"ticket": ticked, "system": parseInt(this.system_id), "sign": sign};
                        this.$post2('/CheckTicket', {
                            data: obj
                        }).then(data => {
                            if(data.error) {
                                this.message = data.error
                            } else {
                                let obj = {};
                                obj.roleId = 1;
                                obj.username = data.user.id;
                                obj.accountType = 1;
                                obj.name = data.user.name;
                                obj.password = "123456";
                                obj.companyName = "综合业务管理系统";
                                obj = JSON.parse(JSON.stringify(obj));
                                obj.password = cryptoUtil.encrypt(obj.password.trim());
                                this.$post('/user', {
                                    data: obj
                                }, true).then((data) => {
                                    if (data.id && data.id !== 0) {
                                        this.$post('/action', {
                                            data: {
                                                "insert": "audit_log",
                                                "values": {
                                                    "user": this.localStore.get("user").username,
                                                    "client": this.localStore.get("client").client,
                                                    "operate": "注册",
                                                    "result": "成功",
                                                    "object_type": "平台",
                                                    "object_id": 0,
                                                    "detail": "注册用户成功，用户名为" + obj.username,
                                                    "is_submitted": 0
                                                }
                                            }
                                        });
                                        let obj2 = {};
                                        obj2.username = obj.username;
                                        obj2.password = "123456";
                                        obj2 = JSON.stringify(obj2);
                                        obj2 = cryptoUtil.encrypt(obj2);
                                        this.$post("/login", {
                                            data: {
                                                "params": obj2
                                            }
                                        }).then(data => {
                                            if (data.code === 500) {
                                                this.loading = false;
                                                this.$post('/action', {
                                                    data: {
                                                        "insert": "audit_log",
                                                        "values": {
                                                            "user": obj.username,
                                                            "operate": "登录",
                                                            "result": "失败",
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
                                                            "client": this.localStore.get("client").client,
                                                            "operate": "登录",
                                                            "result": "成功",
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
                                    } else if(data.message == '用户名已存在'){
                                        this.$post('/action', {
                                            data: {
                                                "insert": "audit_log",
                                                "values": {
                                                    "user": this.localStore.get("user").username,
                                                    "client": this.localStore.get("client").client,
                                                    "operate": "注册",
                                                    "result": "失败",
                                                    "object_type": "平台",
                                                    "object_id": 0,
                                                    "detail": "用户注册失败,用户名已存在",
                                                    "is_submitted": 0
                                                }
                                            }
                                        });
                                        let obj2 = {};
                                        obj2.username = obj.username;
                                        obj2.password = "123456";
                                        obj2 = JSON.stringify(obj2);
                                        obj2 = cryptoUtil.encrypt(obj2);
                                        this.$post("/login", {
                                            data: {
                                                "params": obj2
                                            }
                                        }).then(data => {
                                            if (data.code === 500) {
                                                this.loading = false;
                                                this.$post('/action', {
                                                    data: {
                                                        "insert": "audit_log",
                                                        "values": {
                                                            "user": obj.username,
                                                            "operate": "登录",
                                                            "result": "失败",
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
                                                            "client": this.localStore.get("client").client,
                                                            "operate": "登录",
                                                            "result": "成功",
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
                                    }
                                })
                            }
                        })
                    })
                })

            },
           strToHexCharCode(str) {
              if(str === "")
              return "";
              var hexCharCode = [];
              for(var i = 0; i < str.length; i++) {
                hexCharCode.push((str.charCodeAt(i)).toString(16));
              }
              return hexCharCode.join("");
    }
        },
        mounted() {
            this.load();
        }
    }
</script>

<style>
.page-single-sign-on {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  font-size: 14px;

}
.page-single-sign-on .page-single-sign-on_box .center {
  color: #606266;
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
