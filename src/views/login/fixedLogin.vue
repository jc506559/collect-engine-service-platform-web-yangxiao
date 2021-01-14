<template>
</template>

<script>
    export default {
        name: "fixedLogin",
        data() {
            return {
                token: '',
            }
        },
        methods: {
            getQueryStringArgs() {
                return window.location.href.split('?')[1].split("=")[1].replace("%2F", "/")
            },
            list() {
                this.$post("/login", {
                    data: {
                        "params": this.token,
                    }
                }).then(data => {{
                    if(data.code === 500) {
                        this.message = data.message;
                        this.$post('/action', {
                            data: {
                                "insert": "audit_log",
                                "values": {
                                    // "user": this.localStore.get("user").username,
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
                    }else{
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
                    }
                });
            }
        },
        mounted() {
            this.token = this.getQueryStringArgs();
            this.list();
        }
    }
</script>

<style>

</style>
