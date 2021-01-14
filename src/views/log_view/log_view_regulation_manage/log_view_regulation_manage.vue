<template>
  <div class="page-log_view_regulation_manage">
    <div class="page-log_view_regulation_manage_box">
      <div class="search_form">
        <div class="title">
          <i class="icon iconfont icon-jisuanyinqing"></i>规则管理
        </div>
        <div class="inner">
          <el-select v-model="rules.type" @change="serverChange()" clearable>
            <el-option v-for="ruleType in ruleTypes" :key="ruleType.value" :label="ruleType.label" :value="ruleType.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="list">
        <div class="app-table">
            <p class="label_p" >平台规则数据</p>
            <el-button style="float: right; margin-right: 25px" @click="addRules" type="primary">添加平台规则</el-button>
          <el-table stripe border tooltip-effect="dark" :data="platformRulesData" v-loading="loading">
            <el-table-column prop="rules_type" label="规则类型" align="center" width="400">
              <template slot-scope="scope">
                <div v-if="scope.row.rules_type == 1">广告数据过滤规则</div>
                <div v-if="scope.row.rules_type == 2">采集栏目过滤规则</div>
                <div v-if="scope.row.rules_type == 3">采集网址过滤规则</div>
              </template>
            </el-table-column>
            <el-table-column prop="rules_id" label="规则id" align="center"width="200">
            </el-table-column>
            <el-table-column prop="rules_value" label="规则内容" align="center">
              <template slot-scope="scope">
                <div style="text-align: left">
                  <el-popover
                  placement="top-start"
                  trigger="hover"
                  :content="scope.row.rules_value"
                  width="500">
                    <el-button slot="reference" type="text"><div v-if="scope.row.rules_value.length < 150">{{ scope.row.rules_value }}</div><div v-else>{{ scope.row.rules_value.substring(0,150) }}...</div></el-button>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="effective" label="是否生效" align="center" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.effective == 1">是</div>
                <div v-if="scope.row.effective == 0">否</div>
              </template>
            </el-table-column>
            <el-table-column prop="ping" label="下发延时" align="center" width="150">
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
              :page-sizes="pageSizes"
              :current-page="PlatformRulesDataCurrentPage"
              @size-change="platformRulesDataHandleSizeChange"
              @current-change="platformRulesDataHandleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
      <div>
      </div>
      <!-- 平台规则配置 -->
      <el-dialog width="750px" class="quota_type-edit-dialog" :append-to-body="true" :before-close="closeEditRulesDialog" title="配置平台规则" :visible.sync="editRulesDialogVisible">
        <el-form :model="rules" label-width="100px" :rules="editRules" ref="editRulesForm">
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
    export default {
        name: "log_view_regulation_manage",
        data() {
            return {
                //表格数据相关
                platformRulesData: [],
                loading: false,
                //表格分页相关
                PlatformRulesDataTotal: 0,
                PlatformRulesDataPageSize: 10,
                pageSizes: [10, 50, 100, 200],
                PlatformRulesDataCurrentPage: 1,
                //规则类型
                ruleTypes: [
                    { label: '广告数据过滤规则', value: 1 },
                    { label: '采集栏目过滤规则', value: 2 },
                    { label: '采集网址过滤规则', value: 3 },
                ],
                rules: {
                    type: null,
                    value: null,
                    effective: 0,
                },
                //配置规则表单相关
                editRulesDialogVisible: false,
                editRules: {
                    value: [
                        { required: true, message: '请输入规则内容', trigger: 'blur' }
                    ],
                },
                rulesType: null,
                editRulesLoading: false,
                //用于生成随机字符串
                chars: ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
            }
        },
        methods: {
            //用于生成随机字符串
            generateMixed(n) {
                var res = "";
                for (var i = 0; i < n; i++) {
                    var id = Math.ceil(Math.random() * 35);
                    res += this.chars[id];
                }
                return res;
            },
            //修改分页数量
            platformRulesDataHandleSizeChange(val) {
                this.PlatformRulesDataPageSize = val;
                if(this.rules.type) {
                    this.getPlatformRulesByType()
                } else {
                    this.getPlatformRules()
                }
            },
            //切换分页
            platformRulesDataHandleCurrentChange(val){
                this.PlatformRulesDataCurrentPage = val;
                if(this.rules.type) {
                    this.getPlatformRulesByType()
                } else {
                    this.getPlatformRules()
                }
            },
            serverChange() {
              this.loading = true;
              this.getPlatformRulesByType();
            },
            //点击配置平台规则按钮
            addRules() {
              if(this.rules.type) {
                  this.editRulesDialogVisible = true;
                  this.rulesType = this.ruleTypes[this.rules.type-1].label;
              } else {
                  this.$message.error({ message: '请先选择规则类型', type: 'error'})
              }
            },
            //关闭配置规则的弹出表单
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
            //保存表单
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
                            this.$message.success({ message: "添加平台规则成功", type: "success" });
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
                            this.editRulesLoading = true;
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
            //获取所有平台规则数据
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
                    this.loading = false;
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
                }).catch(err => {
                    this.$message.error({ message: '获取平台规则失败', type: 'error'});
                    this.loading = false;
                })
            },
            //根据类型获取平台规则
            getPlatformRulesByType() {
                if(this.rules.type == '') {
                    this.platformRulesData = [];
                    this.$post('/action', {
                        data: {
                            "select": "crawl_platform_rules",
                        }
                    }).then(data => {
                        this.platformRulesData = data;
                        this.PlatformRulesDataTotal = data.length;
                        this.loading = false;
                    }).catch(err => {
                        this.$message.error({ message: '获取平台规则失败', type: 'error'});
                        this.loading = false;
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
                        this.loading = false;
                    }).catch(err => {
                        this.$message.error({ message: '获取平台规则失败', type: 'error'});
                        this.loading = false;
                    })
                }
            },
            //毫秒转时间
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
                var milliseconds = my_time - (seconds * 1000)
                var time = secondsRound + '秒' + milliseconds + '毫秒';
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
            //重置已经判断的表单规则
            resetForm (formName) {
                this.$refs[formName].resetFields();
            },
            load() {
                this.getPlatformRules();
            },
        },
        mounted() {
            this.load();
        }
    }
</script>

<style>
    .page-log_view_regulation_manage {
      width: 100%;
      height: 100%;
      padding: 0 15px;
      font-size: 14px;
      color: #606266
    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box {
      height: 100%;
      background: #fff;
    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .search_form{
      padding: 15px;
      overflow: hidden;
    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .title {
      font-size: 20px;
      height: 35px;
      line-height: 35px;
    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .inner {

    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .list {
      background: #fff;
      text-align: center;
      border-right: 1px solid #ebeef5;
      padding: 0 15px;
    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .list:after {
      content: '.';
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .list .app-table .label_p {
      float: left;
      font-size: 18px;
      height: 35px;
      line-height: 35px;
      text-align: left;
    }
    /* 更改element-ui固定样式 */
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .el-popper[x-placement^=bottom] {
      word-wrap: break-word;
      word-break: break-all;
    }
    .el-popover {
      overflow-wrap: break-word;
    }
    .page-log_view_regulation_manage .page-log_view_regulation_manage_box .el-button--text {
      color:#606266;
    }
</style>
