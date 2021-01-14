<template>
    <div class="page-log_view_log">
        <div class="page-log_view_log_box">
            <div class="search_form">
                <div class="title"><i class="icon iconfont icon-chaxun title_i"></i>搜索条件
                  <el-button style="float: right;" @click="refresh" icon="el-icon-refresh"></el-button>
                </div>
                <div class="inner">
                  <span>选择日志类型</span>
                  <el-select v-model="searchData.type" class="fault_type" placeholder="请选择日志大类" @change="serverTypeChange()" clearable v-loading="typeLoading">
                    <el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value"></el-option>
                  </el-select>
                  <el-select v-model="searchData.subType" class="fault_type" placeholder="请选择日志子类" @change="serverChange()" clearable v-loading="subTypeLoading">
                    <el-option v-for="subtype in subTypes" :key="subtype.value" :label="subtype.label" :value="subtype.value"></el-option>
                  </el-select>
                  <span>日志级别</span>
                  <el-select v-model="searchData.level" class="fault_type" placeholder="请选择" @change="serverChangeLevel()">
                    <el-option v-for="logLevel in logLevels" :key="logLevel.value" :label="logLevel.label" :value="logLevel.value">
                    </el-option>
                  </el-select>
<!--                  <el-button type="primary" @click="searchByCondition" icon="el-icon-search" v-loading="loading">搜索</el-button>-->
                  <el-button type="primary" @click="serverChange()" icon="el-icon-search" v-loading="loading">搜索</el-button>
                  <el-button v-show="chartShow" type="primary" @click="chartShowChange">隐藏图表</el-button>
                  <el-button v-show="!chartShow" type="primary" @click="chartShowChange">显示图表</el-button>
                </div>
            </div>
            <div class="line_charts" v-show="chartShow">
                <el-row :gutter="4">
                  <el-col :span="12">
                      <p class="line_charts_title">日志数量(按时间统计)</p>
                      <ve-line :data="dataByDate" v-show="dataByDay.show" :extend="dataByDayExtend" v-loading="logByTimeLoading" style="margin-top: 30px" :data-empty="dataByDayEmpty"></ve-line>
                  </el-col>
                  <el-col :span="12">
                    <p class="line_charts_title">日志数量(按级别统计当天)</p>
                    <ve-histogram :data="dataByLogLevel" :extend="dataByLogLevelExtend" style="margin-top: 30px" v-loading="logByLevelLoading" :data-empty="logByLevelEmpty"></ve-histogram>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <p class="line_charts_title">日志数量(按类型统计)</p>
                    <ve-histogram :data="dataByLogType" :extend="dataByLogTypeExtend" style="margin-top: 30px" v-loading="logByTypeLoading" :data-empty="logByTypeEmpty"></ve-histogram>
                  </el-col>
                </el-row>
            </div>

            <div class="list">
              <div class="app-table">
                <p class="label_p" >日志信息</p>
                <div class="list_time">
                  <span style="margin-right: 10px">日志记录时间</span>
                  <el-date-picker
                    v-model="searchData.time"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="serverTimeChange()"
                    :picker-options="pickerOptions">
                  </el-date-picker>
<!--                  <el-time-picker-->
<!--                    is-range-->
<!--                    v-model="searchData.time"-->
<!--                    range-separator="至"-->
<!--                    start-placeholder="开始时间"-->
<!--                    end-placeholder="结束时间"-->
<!--                    placeholder="选择时间范围"-->
<!--                    @change="serverTimeChange()">-->
<!--                  </el-time-picker>-->
                </div>
                <el-table :data="tableData" border style="width: 100%" v-loading="logLoading">
                  <el-table-column prop="time" label="日志记录时间" width="300" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ scope.row.time.substring(0,19) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="type" label="日志大类" width="200" align="center" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="subtype" label="日志子类" width="300" align="center" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="level" label="日志级别" width="100" align="center" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="content" label="日志内容" align="left" show-overflow-tooltip>
                  </el-table-column>
                </el-table>
                <div class="list_pagination">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="pageSizes"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                  </el-pagination>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import permission from "@/components/mixin/permission";
import axios from 'axios'

export default {
    mixins: [permission],
    name: "log_view_log",
    inject: ['reload'],
    data() {
        return {
            dataByLogType: {
                columns: ['日志类型', '日志数量'],
                rows: [
                    // { '日志类型': '1/1', '日志数量': 1393, },
                ]
            },
            dataByLogLevel: {
                columns: ['日志级别','日志数量'],
                rows: [
                ]
            },
            dataByDate: {
              columns: ['日期','日志数量'],
              rows: [
                  // { '日期': '2019/1/1', '日志数量': 1300 },
              ]
            },
            dataByDay: {
                rows: [],
                show: true,
            },
            dataByMonth: {
                rows: [],
                show: false,
            },
            dataByYear: {
                show: false,
            },
            dataByLogTypeExtend: {
                legend: {
                    top: '20',
                },
                yAxis: {
                    min: 1,
                    type: "log",
                    axisLine: {
                        show: false,
                    }
                },
                dataZoom: [{
                    type: 'slider',
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 50,
                }],
                series: {
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: "top"
                    //     }
                    // }
                    //     type: 'bar',
                    //     barWidth: '10%'
                    // },
                    // dataZoom: [{
                    //     type: 'slider',
                    //     show: true,
                    //     realtime: true,
                    //     start: 0,
                    //     end: 100,
                    // }],
                },
                xAxis: {
                    axisLabel: {
                        interval:0,
                        rotate:20,
                        show: true,
                    },
                    //控制x轴文字的偏移量
                    offset: 5,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '13%',
                },
                // series: {
                //     label: {
                //         normal: {
                //             show: true
                //         }
                //     }
                // }
            },
            dataByDayExtend: {
              legend: {
                  top: '20'
              },
              xAxis: {
                  axisLabel: {
                      interval:0,
                      rotate:20,
                      show: true,
                  },
                  //控制x轴文字的偏移量
                  offset: 5,
                  grid: {
                  }
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
              },
              series: {
                  label: {
                      normal: {
                          show: true
                      }
                  }
              }
            },
            dataByLogLevelExtend: {
                barWidth: "10%",
                label: { show: true, position: "top" },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                },
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            pageSizes: [10, 50, 100, 200],
            searchData: {
                logType: "",
                logTime: "",
                time: '',
                level: "ERROR",
                type: "",
                subType: ""
            },
            where:[],
            where2: null,
            tableData: [],
            loading: false,
            time: [],
            logLoading: false,
            logByTimeLoading: true,
            dataByDayEmpty: false,
            logByTypeLoading: true,
            logByTypeEmpty: false,
            logByLevelLoading: true,
            logByLevelEmpty: false,
            //日志级别下拉框所需数据
            logLevels: [
                { label: "INFO", value: "INFO" },
                { label: "ERROR", value: "ERROR"},
                { label: "所有类型", value: "all"}
            ],
            //日志大类
            types: [],
            typeLoading: false,
            //日志小类
            subTypes: [],
            subTypeLoading: false,
            //控制图表显示
            chartShow: true,
            //控制请求
            source: null,
            source2: null,
            source3: null,
            source4: null,
            //promise链
            getDataByDayAndTypePromise: null,
            //日期选择器时间选项
            pickerOptions: {
                //结束时间不超过当天
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.46e6
                }
            }
        };
    },
    methods: {
        //局部刷新页面
        refresh() {
          this.reload();
        },
        // 用于获取相对于当天日期的日期
        getDay(day){
            var today = new Date();
            var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            var tDate = today.getDate();
            tMonth = this.doHandleMonth(tMonth + 1);
            tDate = this.doHandleMonth(tDate);
            return tYear+"-"+tMonth+"-"+tDate;
        },
        doHandleMonth(month){
            var m = month;
            if(month.toString().length == 1){
                m = "0" + month;
            }
            return m;
        },
        //选择查询条件后触发的查询
        searchByCondition() {
            this.logLoading = true;
            this.currentPage = 1;
            this.where = [];
            if(this.searchData.type != '') {
                this.where.push("type=" + this.searchData.type)
            }
            if(this.searchData.subType != '') {
                this.where.push("subtype=" + this.searchData.subType)
            }
            if(this.searchData.time.length != 0) {
                let time = this.searchData.time;
                this.where.push(`time=${time[0]}~${time[1]}`)
            }
            if(this.searchData.level != 'all') {
                this.where.push("level=" + this.searchData.level)
            }
            this.$post('/action', {
                data: {
                    "select": "crawl_platform_log",
                    "where": this.where,
                    "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                    "order": ["time desc"]
                }
            }).then(data => {
                this.tableData = data.data;
                this.total = data.total;
                this.logLoading = false;
            }).catch(err => {
                this.$message.error({ message: "搜索失败", type: "error"});
                this.logLoading = false;
            })
        },
        //选择日志类型后触发的钩子
        serverChange() {
            if(this.source4) {
                this.source4.cancel("请求被取消");
            }
            this.dataByDate = {
                columns: ['日期','日志数量'],
                rows: []
            };
            this.where = [];
            this.currentPage = 1;
            this.tableData = [];
            this.total = 0;
            this.searchData.time = '';
            if(this.searchData.level != 'all') {
                this.where.push("level=" + this.searchData.level)
            }
            if(this.searchData.type) {
                this.where.push("type=" + this.searchData.type);
            }
            if(this.searchData.subType) {
                this.where.push("subtype=" + this.searchData.subType)
            }
            this.logLoading = true;
            this.logByTimeLoading = true;
            this.source4 = new axios.CancelToken.source();
            this.$post('/action', {
                data: {
                    "select": "crawl_platform_log",
                    "where": this.where,
                    "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                    "order": ["time desc"]
                },
                cancelToken: this.source4.token
            }).then(data => {
                if(typeof data != 'undefined') {
                    this.logLoading = false;
                    this.tableData = data.data;
                    this.total = data.total;
                }
            }).catch(res => {
                this.$message.error({ message: "获取日志详细信息失败！", type: "error"});
                this.logLoading = false;
            });
            for(let i = 0; i < 7; i++) {
                let obj = {};
                obj.日期 = this.getDay(i-7);
                obj.日志数量 = null;
                this.dataByDate.rows.push(obj)
            }
            this.getCountByLogLevel();
            this.getDataByDayAndTypeCount();
        },
        getDataByDayAndTypeCount() {
            if(this.source2) {
                this.source2.cancel("请求被取消");
            }
            this.source2 = new axios.CancelToken.source();
            Promise.all([this.getDataByDayAndType(this.getDay(-8), this.getDay(-7)),
                this.getDataByDayAndType(this.getDay(-7), this.getDay(-6)),
                this.getDataByDayAndType(this.getDay(-6), this.getDay(-5)),
                this.getDataByDayAndType(this.getDay(-5), this.getDay(-4)),
                this.getDataByDayAndType(this.getDay(-4), this.getDay(-3)),
                this.getDataByDayAndType(this.getDay(-3), this.getDay(-2)),
                this.getDataByDayAndType(this.getDay(-2), this.getDay(-1)),]).then(result => {
                for(let i = 0; i < result.length; i++) {
                    if(result[i].length != 0) {
                        let count = 0;
                        for(let j = 0; j < result[i].length; j++) {
                            count += result[i][j].count
                        }
                        this.dataByDate.rows[i].日志数量 = count;
                    } else {
                        this.dataByDate.rows[i].日志数量 = 0;
                    }
                }
                this.logByTimeLoading = false;
            }).catch(err => {
                if(err.message != "请求被取消"){
                    this.$message.error({ message: "按时间获取日志数量失败！", type: "error" });
                    this.logByTimeLoading = false;
                }
            });
        },
        //选择日志级别后触发的钩子
        serverChangeLevel() {
            if(this.source4) {
                this.source4.cancel("请求被取消");
            }
            this.dataByDate = {
                columns: ['日期','日志数量'],
                rows: []
            };
            this.where = [];
            this.currentPage = 1;
            this.tableData = [];
            this.total = 0;
            this.searchData.time = '';
            if(this.searchData.level != 'all') {
                this.where.push("level=" + this.searchData.level)
            }
            if(this.searchData.type) {
                this.where.push("type=" + this.searchData.type);
            }
            if(this.searchData.subType) {
                this.where.push("subtype=" + this.searchData.subType)
            }
            this.logLoading = true;
            this.logByTimeLoading = true;
            this.source4 = new axios.CancelToken.source();
            this.$post('/action', {
                data: {
                    "select": "crawl_platform_log",
                    "where": this.where,
                    "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                    "order": ["time desc"]
                },
                cancelToken: this.source4.token
            }).then(data => {
                if(typeof data != 'undefined') {
                    this.logLoading = false;
                    this.tableData = data.data;
                    this.total = data.total;
                }
            }).catch(res => {
                this.$message.error({ message: "获取日志详细信息失败！", type: "error"});
                this.logLoading = false;
            });
            for(let i = 0; i < 7; i++) {
                let obj = {};
                obj.日期 = this.getDay(i-7);
                obj.日志数量 = null;
                this.dataByDate.rows.push(obj)
            }
            this.getDataByDayAndTypeCount();
        },
        //选择日志记录时间后触发的钩子
        serverTimeChange() {
            if(this.source4) {
                this.source4.cancel("请求被取消");
            }
            this.logLoading = true;
            this.where = [];
            this.currentPage = 1;
            this.tableData = [];
            this.total = 0;
            if(this.searchData.level != 'all') {
                this.where.push("level=" + this.searchData.level)
            }
            if(this.searchData.type) {
                this.where.push("type=" + this.searchData.type);
            }
            if(this.searchData.subType) {
                this.where.push("subtype=" + this.searchData.subType)
            }
            if(Array.isArray(this.searchData.time)) {
                if(this.searchData.time.length != 0) {
                    let time = this.searchData.time;
                    this.where.push(`time=${time[0]}~${time[1]}`)
                }
            }
            this.source4 = axios.CancelToken.source();
            this.$post('/action', {
                data: {
                    "select": "crawl_platform_log",
                    "where": this.where,
                    "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                    "order": ["time desc"]
                },
                cancelToken: this.source4.token
            }).then(data => {
                if(typeof data != 'undefined') {
                    this.logLoading = false;
                    this.tableData = data.data;
                    this.total = data.total;
                }
            }).catch(err => {
                this.$message.error({ message: "搜索失败", type: "error"});
                this.logLoading = false;
            });
        },
        //选择日志大类后触发的钩子
        serverTypeChange() {
            if(this.searchData.type != '') {
                if(this.source) {
                    this.source.cancel("请求取消");
                }
                this.logLoading = true;
                this.subTypeLoading = true;
                this.searchData.subType = '';
                this.logByTimeLoading = true;
                this.logByLevelLoading = true;
                this.subTypes = [];
                this.source = axios.CancelToken.source();
                this.$post('/action', {
                    data: {
                        "sql": `SELECT DISTINCT subtype FROM crawl_platform_log_statistics where type='${this.searchData.type}'`
                    },
                    cancelToken: this.source.token,
                }).then(data => {
                    if(Array.isArray(data) && data.length != 0) {
                        for(let i = 0; i < data.length; i++) {
                            let obj = {};
                            obj.value = data[i].subtype;
                            obj.label = data[i].subtype;
                            this.subTypes.push(obj)
                        }
                        this.searchData.subType = this.subTypes[0].value;
                        this.subTypeLoading = false;
                        this.serverChange();
                    } else {
                        this.typeLoading = false;
                        this.subTypeLoading = false;
                        this.logLoading = false;
                        this.logByTimeLoading = false;
                        this.dataByDayEmpty = true;
                        this.logByLevelLoading = false;
                        this.logByLevelEmpty = true;
                    }
                }).catch(res => {
                    this.$message.error({ message: "获取日志类失败", type: "error"});
                    this.subTypeLoading = false;
                })
            } else {
                if(this.source4) {
                    this.source4.cancel("请求被取消");
                }
                this.searchData.subType = '';
                this.logByTimeLoading = true;
                this.logByLevelLoading = true;
                this.logLoading = true;
                this.where = [];
                this.currentPage = 1;
                this.tableData = [];
                this.total = 0;
                this.searchData.time = '';
                if(this.searchData.level != 'all') {
                    this.where.push("level=" + this.searchData.level)
                }
                if(Array.isArray(this.searchData.time)) {
                    if(this.searchData.time.length != 0) {
                        let time = this.searchData.time;
                        this.where.push(`time=${time[0]}~${time[1]}`)
                    }
                }
                this.source4 = new axios.CancelToken.source();
                this.$post('/action', {
                    data: {
                        "select": "crawl_platform_log",
                        "where": this.where,
                        "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                        "order": ["time desc"]
                    },
                    cancelToken: this.source4.token
                }).then(data => {
                    if(typeof data != 'undefined') {
                        this.logLoading = false;
                        this.tableData = data.data;
                        this.total = data.total;
                    }
                }).catch(res => {
                    this.$message.error({ message: "获取日志详细信息失败！", type: "error"});
                    this.logLoading = false;
                });
                this.getDataByTime();
                this.getCountByLogLevel();
            }
        },
        chartShowChange() {
          this.chartShow = !this.chartShow;
        },
        //获取日志类型对应的日志量
        getCountByLogType() {
            this.$post('/action', {
                data: {
                    sql: `select type, subtype, count(*) as count from crawl_platform_log where time>${this.getDay(0)} GROUP BY type, subtype`
                }
            }).then(data => {
                if(Array.isArray(data) && data.length != 0) {
                    data.forEach(val => {
                        let obj = {};
                        obj.日志类型 = val.type + '_' + val.subtype;
                        obj.日志数量 = val.count;
                        this.dataByLogType.rows.push(obj)
                    });
                    this.logByTypeLoading = false;
                } else {
                    this.logByTypeLoading = false;
                    this.logByTypeEmpty = true;
                }
            })
        },
        getCountByLevel(where) {
            return new Promise((resolve, reject) => {
                this.$post('/action', {
                    data: {
                        "select": "crawl_platform_log",
                        "where": where,
                        "fields": ["count(*) as count"]
                    },
                    cancelToken: this.source3.token
                }).then(data => {
                    if(typeof data != 'undefined') {
                        resolve(data)
                    } else {
                        throw new Error("请求被取消")
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //获取日志级别对应的日志量
        getCountByLogLevel() {
            if(this.source3) {
                this.source3.cancel();
            }
            this.source3 = new axios.CancelToken.source();
            this.logByLevelLoading = true;
            this.dataByLogLevel.rows = [];
            if(this.searchData.type != '') {
                let errorWhere = [];
                let infoWhere = [];
                let warnWhere = [];
                errorWhere.push("type=" + this.searchData.type);
                infoWhere.push("type=" + this.searchData.type);
                warnWhere.push("type=" + this.searchData.type);
                if(this.searchData.subType) {
                    errorWhere.push("subtype=" + this.searchData.subType);
                    infoWhere.push("subtype=" + this.searchData.subType);
                    warnWhere.push("subtype=" + this.searchData.subType)
                }
                errorWhere.push(`time=${this.getDay(0)} 00:00:00~${this.getDay(0)} 23:59:58`);
                infoWhere.push(`time=${this.getDay(0)} 00:00:00~${this.getDay(0)} 23:59:58`);
                warnWhere.push(`time=${this.getDay(0)} 00:00:00~${this.getDay(0)} 23:59:58`);
                errorWhere.push("level=ERROR");
                infoWhere.push("level=INFO");
                warnWhere.push("level=WARN");
                Promise.all([this.getCountByLevel(infoWhere), this.getCountByLevel(warnWhere), this.getCountByLevel(errorWhere)]).then(result => {
                    for(let i = 0; i < result.length; i++) {
                        let obj = {};
                        obj.日志级别 = i==0?'INFO':i==1?'WARN':'ERROR';
                        obj.日志数量 = result[i][0].count;
                        this.dataByLogLevel.rows.push(obj)
                    }
                    this.logByLevelLoading = false;
                }).catch(err => {
                    if(err.message != '请求被取消'){
                        this.$message.error({ message: "获取日志详细信息失败！", type: "error" });
                        this.logByLevelLoading = false;
                    }
                });
            } else {
                if(this.source3) {
                    this.source3.cancel();
                }
                this.source3 = new axios.CancelToken.source();
                let errorWhere = [];
                let infoWhere = [];
                let warnWhere = [];
                errorWhere.push(`time=${this.getDay(0)} 00:00:00~${this.getDay(0)} 23:59:58`);
                infoWhere.push(`time=${this.getDay(0)} 00:00:00~${this.getDay(0)} 23:59:58`);
                warnWhere.push(`time=${this.getDay(0)} 00:00:00~${this.getDay(0)} 23:59:58`);
                errorWhere.push("level=ERROR");
                infoWhere.push("level=INFO");
                warnWhere.push("level=WARN");
                Promise.all([this.getCountByLevel(infoWhere), this.getCountByLevel(warnWhere), this.getCountByLevel(errorWhere)]).then(result => {
                    for(let i = 0; i < result.length; i++) {
                        let obj = {};
                        obj.日志级别 = i==0?'INFO':i==1?'WARN':'ERROR';
                        if(result[i].length != 0) {
                            obj.日志数量 = result[i][0].count;
                        } else {
                            obj.日志数量 = 0;
                        }
                        this.dataByLogLevel.rows.push(obj)
                    }
                    this.logByLevelLoading = false;
                }).catch(err => {
                    if(err.message != '请求被取消') {
                        this.$message.error({ message: "获取日志详细信息是失败！", type: "error"});
                        this.logByLevelLoading = false;
                    }
                });
            }
        },
        //获取日志大类
        getType() {
            this.typeLoading = true;
            this.subTypeLoading = true;
            this.$post('/action', {
                data: {
                    "sql": "SELECT DISTINCT type FROM crawl_platform_log"
                }
            }).then(data => {
                if(Array.isArray(data) && data.length != 0) {
                    for(let i = 0; i < data.length; i++) {
                        let obj = {};
                        obj.value = data[i].type;
                        obj.label = data[i].type;
                        this.types.push(obj)
                    }
                    this.searchData.type = this.types[0].value;
                    this.typeLoading = false;
                    this.serverTypeChange();
                } else {
                    this.typeLoading = false;
                    this.subTypeLoading = false;
                    this.logLoading = false;
                    this.logByTimeLoading = false;
                    this.dataByDayEmpty = true;
                    this.logByLevelLoading = false;
                    this.logByLevelEmpty = true;
                }
            }).catch(err => {
                this.$message.error({ message: "获取日志大类失败", type: "error"})
            })
        },
        getDataByTime() {
            if(this.source2) {
                this.source2.cancel();
            }
            this.source2 = axios.CancelToken.source();
            this.dataByDate = {
                columns: ['日期','日志数量'],
                rows: []
            };
            for(let i = 0; i < 7; i++) {
                let obj = {};
                obj.日期 = this.getDay(i-7);
                obj.日志数量 = null;
                this.dataByDate.rows.push(obj)
            }
            Promise.all([this.getDataByDay(this.getDay(-8), this.getDay(-7)),
                this.getDataByDay(this.getDay(-7), this.getDay(-6)),
                this.getDataByDay(this.getDay(-6), this.getDay(-5)),
                this.getDataByDay(this.getDay(-5), this.getDay(-4)),
                this.getDataByDay(this.getDay(-4), this.getDay(-3)),
                this.getDataByDay(this.getDay(-3), this.getDay(-2)),
                this.getDataByDay(this.getDay(-2), this.getDay(-1))]).then(result => {
                    for(let i = 0; i < result.length; i++) {
                        if(result[i].length != 0) {
                            let count = 0;
                            for(let j = 0; j < result[i].length; j++) {
                                count += result[i][j].count
                            }
                            this.dataByDate.rows[i].日志数量 = count;
                        } else {
                            this.dataByDate.rows[i].日志数量 = 0;
                        }
                    }
                    this.logByTimeLoading = false;
            }).catch(err => {
                if(err.message != '请求被取消') {
                    this.$message.error({ message: "按天获取日志数量失败！", type: "error"});
                    this.logByTimeLoading = false;
                }
            });
            this.serverTimeChange();
        },
        getDataByDay(day1, day2) {
            return new Promise((resolve, reject) => {
                this.$post('/action', {
                    data: {
                        "select": "crawl_platform_log",
                        "where": [`time=${day1}~${day2} `],
                        "fields": ["count(*) as count"],
                    },
                    cancelToken: this.source2.token
                }).then(data => {
                    if(typeof data != 'undefined') {
                        resolve(data)
                    } else {
                        throw new Error("请求被取消")
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //用promise.all解决问题
        getDataByDayAndType(day1, day2) {
            return new Promise((resolve, reject) => {
                this.where2 = [];
                if(this.searchData.level != 'all') {
                    this.where2.push("level=" + this.searchData.level)
                }
                if(this.searchData.type) {
                    this.where2.push("type=" + this.searchData.type)
                }
                if(this.searchData.subType) {
                    this.where2.push("subtype=" + this.searchData.subType)
                }
                this.where2.push(`time=${day1}~${day2}`);
                this.$post('/action', {
                    data: {
                        "select": "crawl_platform_log_statistics",
                        "where": this.where2,
                    }
                }).then(data => {
                    if(typeof data != 'undefined') {
                        resolve(data)
                    } else {
                        throw new Error("请求被取消")
                    }
                }).catch(err => {
                    reject(err)
                })
                // this.where2.push("time=" + day + " " + "00:00:00" + "~" + day + " " + "23:59:59");
                // this.$post('/action', {
                //     data: {
                //         "select": "crawl_platform_log",
                //         "where": this.where2,
                //         "fields": ["count(*) as count"],
                //     },
                //     cancelToken: this.source2.token
                // }).then(data => {
                //     if(typeof data != 'undefined') {
                //         resolve(data)
                //     } else {
                //         throw new Error("请求被取消")
                //     }
                // }).catch(err => {
                //     reject(err)
                // })
            })
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.logChange();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.logChange();
        },
        logChange() {
            if(this.source4) {
                this.source.cancel();
            }
            this.logLoading = true;
            if(this.searchData.level != 'all') {
                this.where.push("level=" + this.searchData.level)
            }
            if(this.searchData.type) {
                this.where.push("type=" + this.searchData.type);
            }
            if(this.searchData.subType) {
                this.where.push("subtype=" + this.searchData.subType)
            }
            if(Array.isArray(this.searchData.time)) {
                let time = this.searchData.time;
                this.where.push(`time=${time[0]}~${time[1]}`)
            }
            this.source4 = new axios.CancelToken.source();
            this.$post('/action', {
                data: {
                    "select": "crawl_platform_log",
                    "where": this.where,
                    "limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
                    "order": ["time desc"]
                },
                cancelToken: this.source4.token
            }).then(data => {
                if(typeof data != 'undefined') {
                    this.logLoading = false;
                    this.tableData = data.data;
                    this.total = data.total;
                }
            }).catch(res => {
                this.$message.error({ message: "获取日志详细信息失败！", type: "error"});
                this.logLoading = false;
            });
        },
        load() {
            this.logLoading = true;
            this.getType();
            this.getCountByLogType();
            let day = this.getDay(0) + ' 23:59:59';
            day = new Date(Date.parse(day.replace(/-/g, "/"))).getTime();
            this.pickerOptions.disabledDate = function(time) {
                return time.getTime() > day
            }
        }
    },
    mounted() {
        this.load();
    }
};
</script>

<style>
.page-log_view_log {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
}
.page-log_view_log .page-log_view_log_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
}
.page-log_view_log .page-log_view_log_box .search_form .title {
    font-size: 20px;
    height: 35px;
    line-height: 35px;
}
.page-log_view_log .page-log_view_log_box .search_form .title .title_i {
    margin-right: 5px;
}
.page-log_view_log .page-log_view_log_box .search_form .inner {
    margin-top: 10px;
}

.page-log_view_log
    .page-log_view_log_box
    .search_form
    .inner
    .el-input {
    max-width: 16%;
    margin-right: 10px;
}
.page-log_view_log
    .page-log_view_log_box
    .search_form
    .inner
    .el-date-editor {
    max-width: 32%;
    margin-right: 10px;
}
.page-log_view_log
    .page-log_view_log_box
    .search_form
    .inner
    .fault_type {
    margin-right: 10px;
}
.page-log_view_log
    .page-log_view_log_box
    .search_form
    .inner
    .fault_type
    .el-input {
    max-width: 100%;
}
.page-log_view_log
    .page-log_view_log_box
    .search_form
    .inner
    > span {
    margin-right: 5px;
}
.page-log_view_log .page-log_view_log_box .el-button--text {
  color:#606266;
}
.page-log_view_log .page-log_view_log_box .line_charts {
    padding: 15px;background: #fff;margin:15px 0;
}
.page-log_view_log .page-log_view_log_box .line_charts .line_charts_title {
  float: left;
  color: #000000;
  font-size: 18px;
  height: 35px;
  line-height: 35px;
  text-align: left;
}
.page-log_view_log .page-log_view_log_box .list {
  padding: 0 15px;
    background: #fff;
    text-align: center;
    margin-top: 15px;
    border-right: 1px solid #ebeef5;
}

.page-log_view_log .page-log_view_log_box .list:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.page-log_view_log
    .page-log_view_log_box
    .list
    .table_edit
    .warning {
    color: #e6a23c;
}
.page-log_view_log
    .page-log_view_log_box
    .list
    .el-table--small
    th,
.page-log_view_log
    .page-log_view_log_box
    .list
    .el-table--small
    td {
    background: #fff;
    text-align: center;
}
.page-log_view_log .page-log_view_log_box .list .list_pagination {
    margin: 20px;
}
.page-log_view_log .page-log_view_log_box .list .list_time {
  float: left;
  margin: 50px 0 10px -70px;
}
.page-log_view_log .page-log_view_log_box .list .app-table .label_p {
  margin-top: 15px;
  float: left;
  font-size: 18px;
  height: 35px;
  line-height: 35px;
  text-align: left;
}
.page-log_view_log .page-log_view_log_box .list .app-table .label_p .log_detail {
  text-align: center;
}
/*用于修改element-ui内的固定样式*/
.el-popover--plain {
  overflow-wrap: break-word;
}
.v-charts-data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: rgba(255, 255, 255, .9);
  color: #888;
  font-size: 14px;
}
</style>


