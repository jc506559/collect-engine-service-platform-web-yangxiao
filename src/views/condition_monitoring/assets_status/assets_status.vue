<template>
  <div class="assets_status">
    <div class="assets_status_box">
      <!-- 第一数据 -->
      <div class="chart_a">
        <div class="fault_type">
          <img src="../../../assets/images/node.png" width="20" height="20" class="node_image">
          <div class="node_value">节点选择</div>
          <div class="node_select">
            <el-select v-model="searchData.server" @change="serverchange()" placeholder="请选择">
              <el-option v-for="item in servers" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-button style="float: right;" @click="refresh" icon="el-icon-refresh"></el-button>
        </div>
      </div>
      <div class="server_basic_message">
        <el-row :gutter="16">
          <el-col :span="24">
            <el-card class="card_box2">
              <div class="div1">
                <img src="../../../assets/images/IP.png" width="60" height="60">
                <p class="p_name">IP地址</p>
                <p class="p_value" v-if="searchData.server == 'node4'">192.168.110.4</p>
                <p class="p_value" v-if="searchData.server == 'node5'">192.168.110.5</p>
                <p class="p_value" v-if="searchData.server == 'node7'">192.168.110.7</p>
                <p class="p_value" v-if="!searchData.server">N/A</p>
              </div>
              <div class="div1">
                <img src="../../../assets/images/server_run.png" width="60" height="60">
                <p class="p_name">运行情况</p>
                <p class="p_value">正常</p>
              </div>
              <!--              <div class="div1">-->
              <!--                <img src="../../../assets/images/system.png" width="60" height="60">-->
              <!--                <p class="p_name">操作系统</p>-->
              <!--                <p class="p_value" v-if="!searchData.server">N/A</p>-->
              <!--                <p class="p_value" v-if="searchData.server">CentOS 6.0</p>-->
              <!--              </div>-->
              <div class="div1">
                <img src="../../../assets/images/hardDisk.png" width="60" height="60">
                <p class="p_name">硬盘</p>
                <p class="p_value">{{ diskSpace }}</p>
              </div>
              <div class="div1">
                <img src="../../../assets/images/CPU.png" width="60" height="60">
                <p class="p_name">CPU</p>
                <p class="p_value">{{ data.cpu_cores }}核</p>
              </div>
              <div class="div1">
                <img src="../../../assets/images/TCP.png" width="60" height="60">
                <p class="p_name">TCP连接数</p>
                <p class="p_value">{{ TCP }}</p>
              </div>
              <div class="div1">
                <img src="../../../assets/images/server_run_day.png" width="60" height="60">
                <p class="p_name">运行天数</p>
                <p class="p_value">{{ data.server_run }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-card class="card_box3 CPU_use">
              <p>CPU使用率</p>
              <ve-histogram :data="CPUUseData" height="300px" style="margin-top: 15px"
                            :extend="CPUExtend"></ve-histogram>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="card_box3 load">
              <p>负载</p>
              <ve-line :data="loadData" :settings="loadSettings" height="300px" :legend-visible="false"
                       style="margin-top: 15px"></ve-line>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="card_box3 memory_use">
              <p>内存使用</p>
              <ve-ring :data="ringData" :title="ringTitle" :settings="ringSettings" height="320px"
                       legend-position="right" style="margin-top: -60px;margin-left: -30px" :extend="memoryExtend"
                       v-loading="memoryLoading"></ve-ring>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-card class="card_box4 disk_use">
              <p>磁盘空间占用</p>
              <ve-ring :data="diskUseData" :title="diskUseDataTitle" height="320px" legend-position="right"
                       style=" margin-top: -60px;margin-left: -30px" :extend="diskExtend"
                       v-loading="diskLoading"></ve-ring>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="card_box4 update_flow">
              <p>流量上传/下载</p>
              <ve-line :data="networkData" width="auto" height="300px" :legend-visible="false"
                       :extend="barExtend"></ve-line>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="card_box4 download_flow">
              <p>磁盘IO</p>
              <ve-bar :data="IOData" height="360px" style="margin-top: -10px" :extend="IOExtend" :settings="IOSettings"
                      v-loading="IOLoading"></ve-bar>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
    import echarts from 'echarts'
    import permission from '@/components/mixin/permission';
    export default {
        mixins: [permission],
        name: 'assets_status',
        inject: ['reload'],
        data() {
            this.lineSettings = {

            }
            this.loadSettings = {
                area: true
            }
            this.ringSettings = {
                dimension: '数值1',
                metrics: '数值2'
            }
            this.ringTitle = {
                text: '',
                subtext: '总内存',
                top: '57%',
                x: 'center',
                y: 'center',
            }
            this.diskUseDataTitle = {
                text: '',
                subtext: '总磁盘空间',
                top: '57%',
                x: 'center',
                y: 'center'
            }
            return {
                IOSettings: {
                    legendName: {
                    }
                },
                //CPU相关信息的图表
                CPUUseData: {
                    columns: ['时间', '用户态', '系统态', 'IO等待', '空闲'],
                    rows: [
                        // { '时间': '19:00', '用户态': 2, '系统态': 3, 'IO等待': 1, '空闲': 4},
                        // { '时间': '19:10', '用户态': 4, '系统态': 7, 'IO等待': 3, '空闲': 5},
                        // { '时间': '19:20', '用户态': 5, '系统态': 3, 'IO等待': 4, '空闲': 6},
                        // { '时间': '19:30', '用户态': 3, '系统态': 2, 'IO等待': 6, '空闲': 3},
                        // { '时间': '19:40', '用户态': 2, '系统态': 5, 'IO等待': 1, '空闲': 2},
                        // { '时间': '19:50', '用户态': 1, '系统态': 4, 'IO等待': 5, '空闲': 2},
                    ]
                },
                //load负载图表
                loadData: {
                    columns: ['日期', '负载'],
                    rows: [
                        // { '日期': null, '负载': null },
                        // { '日期': null, '负载': null },
                        // { '日期': null, '负载': null },
                        // { '日期': null, '负载': null },
                        // { '日期': null, '负载': null },
                        // { '日期': null, '负载': null },
                    ]
                },
                //磁盘IO
                IOData: {
                    columns: ['名称',],
                    rows: [
                        // { '名称': '磁盘读取成功总字节数', '值1': 120, '值2': 130},
                    ]
                },
                memoryExtend: {
                  tooltip: {
                      trigger: 'item',
                      formatter: "{b} : {c}" + "G " + "({d}%)"
                  }
                },
                diskExtend: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c}" + "G " + "({d}%)"
                    }
                },
                barExtend: {
                    yAxis: {
                        // type: 'log',
                        axisLabel: {
                            formatter: '{value} kb'
                        },
                        // min: 1,
                        axisLine: {
                            show: false,
                        }
                    },
                },
                CPUExtend: {
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    // legend: {
                        // left: '175',
                    // },
                    series: {
                        type: 'bar',
                        barWidth: '10%'
                    },
                    legend: {
                        left: 190,
                    }
                },
                IOExtend: {
                    xAxis: {
                        type: "log",
                        min: 1,
                        splitLine: {
                            show: false,
                        },
                        show: false
                    },
                    series: {
                        type: 'bar',
                        barWidth: '10%',
                        label: {
                            show: true,
                            position: 'right'
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false,
                        }
                    },
                    legend: {
                        top: '30',
                    }
                },
                servers:[],
                searchData:{
                },
                //磁盘空间
                diskSpace: "N/A",
                data:{
                    server_run: "N/A",
                    cpu_cores: "N/A",
                    memory:{
                        total: "N/A",
                        free: "N/A",
                        use: "N/A"
                    }
                },
                //TCP连接数
                TCP: 0,
                free: [],
                ringData: {
                    columns: ['数值1','数值2'],
                    rows: [
                        { '数值1': '已使用内存', '数值2': null },
                        { '数值1': '可用内存', '数值2': null }
                    ]
                },
                diskUseData: {
                    columns: ['数值1','数值2'],
                    rows: [
                        { '数值1': '已使用', '数值2': null },
                        { '数值1': '可使用', '数值2': null }
                    ]
                },
                networkData: {
                    columns: ['时间', '流量上传量','流量下载量'],
                    rows: [
                    ]
                },
                memoryLoading: false,
                diskLoading: false,
                IOLoading: false,
                // downloadData: {
                //     columns: ['时间', '流量下载量'],
                //     rows: [
                //         { '时间': "00:00:01", '流量下载量': 30000, "对应时间戳": null},
                //         { '时间': "00:00:02", '流量下载量': 20000, "对应时间戳": null},
                //         { '时间': "00:00:03", '流量下载量': 40000, "对应时间戳": null},
                //         { '时间': "00:00:04", '流量下载量': 60000, "对应时间戳": null},
                //         { '时间': "00:00:05", '流量下载量': 80000, "对应时间戳": null},
                //         { '时间': "00:00:06", '流量下载量': 50000, "对应时间戳": null},
                //     ]
                // }
            }
        },
        methods:{
            serverchange(){
                this.$forceUpdate();
                if(this.timer1) {
                    clearInterval(this.timer1);
                    this.timer1 = null;
                }
                if(this.timer3) {
                    clearInterval(this.timer3);
                    this.timer3 = null;
                }
                if(this.timer4) {
                    clearInterval(this.timer4);
                    this.timer4 = null;
                }
                if(this.timer5) {
                    clearInterval(this.timer5);
                    this.timer5 = null;
                }
                this.CPUUseData.rows = [];
                this.loadData.rows = [];
                this.networkData.rows = [];
                this.getSystemRun();
                this.getCpuCores();
                this.getMemory();
                this.getTCP();
                this.getIOData();
                //从本地获取流量上传和下载
                if(localStorage.getItem(('networkData') + this.searchData.server)) {
                    var getNetworkData = JSON.parse(localStorage.getItem(('networkData') + this.searchData.server));
                    if(getNetworkData.length < 6) {
                        for(let i = 0; i < getNetworkData.length; i++) {
                            var obj4 = {};
                            obj4.时间 = getNetworkData[i].时间;
                            obj4.流量上传量 = getNetworkData[i].流量上传量;
                            obj4.流量下载量 = getNetworkData[i].流量下载量;
                            this.networkData.rows.push(obj4)
                        }
                        this.$get('/prometheus/network/network/' + this.searchData.server).then(data => {
                            var obj = {};
                            obj.时间 = this.timeFormat2(data.transmit.data.result[0].value[0]);
                            obj.流量上传量 = (data.transmit.data.result[0].value[1]/1024).toFixed(2);
                            obj.流量下载量 = (data.receive.data.result[0].value[1]/1024).toFixed(2);
                            this.networkData.rows.push(obj)
                        })
                    } else {
                        for(let i = 0; i < 5; i++) {
                            var obj5 = {};
                            obj5.时间 = getNetworkData[i + 1].时间;
                            obj5.流量上传量 = getNetworkData[i + 1].流量上传量;
                            obj5.流量下载量 = getNetworkData[i + 1].流量下载量;
                            this.networkData.rows.push(obj5);
                        }
                        this.$get('/prometheus/network/network/' + this.searchData.server).then(data => {
                            if(this.timeFormat2(data.transmit.data.result[0].value[0]) != this.networkData.rows[4].时间) {
                                var obj = {};
                                obj.时间 = this.timeFormat2(data.transmit.data.result[0].value[0]);
                                obj.流量上传量 = (data.transmit.data.result[0].value[1]/1024).toFixed(2);
                                obj.流量下载量 = (data.receive.data.result[0].value[1]/1024).toFixed(2);
                                this.networkData.rows.push(obj)
                            }
                        })
                    }
                } else {
                    this.$get('/prometheus/network/network/' + this.searchData.server).then(data => {
                        var obj = {};
                        obj.时间 = this.timeFormat2(data.transmit.data.result[0].value[0]);
                        obj.流量上传量 = (data.transmit.data.result[0].value[1]/1024).toFixed(2);
                        obj.流量下载量 = (data.receive.data.result[0].value[1]/1024).toFixed(2);
                        this.networkData.rows.push(obj)
                    })
                }
                //从本地存储获取CPU使用
                if(localStorage.getItem('CPUUse' + this.searchData.server)) {
                    var getCPUUseData = JSON.parse(localStorage.getItem('CPUUse' + this.searchData.server));
                    if(getCPUUseData.length < 4) {
                        for(var i = 0; i < getCPUUseData.length; i++ ) {
                            var obj3 = {};
                            obj3.时间 = getCPUUseData[i].time;
                            obj3.系统态 = getCPUUseData[i].system;
                            obj3.用户态 = getCPUUseData[i].user;
                            obj3.IO等待 = getCPUUseData[i].iowait;
                            obj3.空闲 = getCPUUseData[i].idle;
                            this.CPUUseData.rows.push(obj3)
                        }
                        this.$get('/prometheus/cpu/usage/' + this.searchData.server).then(data => {
                            var obj = {};
                            obj.时间 = this.timeFormat2(data.system.data.result[0].value[0]);
                            obj.系统态 = data.system.data.result[0].value[1];
                            obj.用户态 = data.user.data.result[0].value[1];
                            obj.IO等待 = data.iowait.data.result[0].value[1];
                            obj.空闲 = data.idle.data.result[0].value[1];
                            this.CPUUseData.rows.push(obj)
                        })
                    } else {
                        for(var i = 0; i < 3; i++ ) {
                            let obj = {};
                            obj.时间 = getCPUUseData[i+1].time;
                            obj.系统态 = getCPUUseData[i+1].system;
                            obj.用户态 = getCPUUseData[i+1].user;
                            obj.IO等待 = getCPUUseData[i+1].iowait;
                            obj.空闲 = getCPUUseData[i+1].idle;
                            this.CPUUseData.rows.push(obj)
                        }
                        this.$get('/prometheus/cpu/usage/' + this.searchData.server).then(data => {
                            if(this.timeFormat2(data.system.data.result[0].value[0]) != this.CPUUseData.rows[2].时间) {
                                let obj = {};
                                obj.时间 = this.timeFormat2(data.system.data.result[0].value[0]);
                                obj.系统态 = data.system.data.result[0].value[1];
                                obj.用户态 = data.user.data.result[0].value[1];
                                obj.IO等待 = data.iowait.data.result[0].value[1];
                                obj.空闲 = data.idle.data.result[0].value[1];
                                this.CPUUseData.rows.push(obj)
                            }
                        })
                    }
                } else {
                    this.$get('/prometheus/cpu/usage/' + this.searchData.server).then(data => {
                        var obj = {};
                        obj.时间 = this.timeFormat2(data.system.data.result[0].value[0]);
                        obj.系统态 = data.system.data.result[0].value[1];
                        obj.用户态 = data.user.data.result[0].value[1];
                        obj.IO等待 = data.iowait.data.result[0].value[1];
                        obj.空闲 = data.idle.data.result[0].value[1];
                        this.CPUUseData.rows.push(obj)
                    })
                }
                //从本地获取负载
                if(localStorage.getItem('load' + this.searchData.server)) {
                    var getLoadData = JSON.parse(localStorage.getItem('load' + this.searchData.server));
                    if(getLoadData.length < 6) {
                        for(var i = 0; i < getLoadData.length; i++) {
                            var obj = {};
                            obj.日期 = getLoadData[i].time;
                            obj.负载 = getLoadData[i].value;
                            this.loadData.rows.push(obj)
                        }
                        this.$get('/prometheus/load/load1/' + this.searchData.server).then(data => {
                            var obj = {};
                            obj.日期 = this.timeFormat2(data.data.result[0].value[0]);
                            obj.负载 = data.data.result[0].value[1];
                            this.loadData.rows.push(obj);
                        })
                    } else {
                        for(var i = 0; i < 5; i++) {
                            let obj = {};
                            obj.日期 = getLoadData[i+1].time;
                            obj.负载 = getLoadData[i+1].value;
                            this.loadData.rows.push(obj)
                        }
                        this.$get('/prometheus/load/load1/' + this.searchData.server).then(data => {
                            if(this.timeFormat2(data.data.result[0].value[0]) != this.loadData.rows[4].日期) {
                                let obj = {};
                                obj.日期 = this.timeFormat2(data.data.result[0].value[0]);
                                obj.负载 = data.data.result[0].value[1];
                                this.loadData.rows.push(obj)
                            }
                        })
                    }
                } else {
                    this.$get('/prometheus/load/load1/' + this.searchData.server).then(data => {
                            var obj = {};
                            obj.日期 = this.timeFormat2(data.data.result[0].value[0]);
                            obj.负载 = data.data.result[0].value[1];
                            this.loadData.rows.push(obj)
                    })
                }
                //轮询网络流量上传和下载接口
                this.timer3 = window.setInterval(() => {
                    this.$get('/prometheus/network/network/' + this.searchData.server).then(data => {
                        let obj;
                        let obj2 = [];
                        let obj3;
                        let uploadValue = (data.transmit.data.result[0].value[1]/1024).toFixed(2);
                        let downloadValue = (data.receive.data.result[0].value[1]/1024).toFixed(2);
                        let time = this.timeFormat2(data.transmit.data.result[0].value[0]);
                        if(this.networkData.rows.length < 6) {
                            obj = {};
                            obj.时间 = time;
                            obj.流量上传量 = uploadValue;
                            obj.流量下载量 = downloadValue;
                            this.networkData.rows.push(obj);
                            for(let i = 0; i < this.networkData.rows.length; i++) {
                                obj3 = {};
                                obj3.时间 = this.networkData.rows[i].时间;
                                obj3.流量上传量 = this.networkData.rows[i].流量上传量;
                                obj3.流量下载量 = this.networkData.rows[i].流量下载量;
                                obj2.push(obj3)
                            }
                            localStorage.setItem("networkData" + this.searchData.server, JSON.stringify(obj2));
                        } else {
                            obj2 = [];
                            for(let i =0; i < 5; i++) {
                                obj = {};
                                this.networkData.rows[i].时间 = this.networkData.rows[i + 1].时间;
                                this.networkData.rows[i].流量上传量 = this.networkData.rows[i + 1].流量上传量;
                                this.networkData.rows[i].流量下载量 = this.networkData.rows[i + 1].流量下载量;
                                obj.时间 = this.networkData.rows[i].时间;
                                obj.流量上传量 = this.networkData.rows[i].流量上传量;
                                obj.流量下载量 = this.networkData.rows[i].流量下载量;
                                obj2.push(obj);
                            }
                            this.networkData.rows[5].时间 = time;
                            this.networkData.rows[5].流量上传量 = uploadValue;
                            this.networkData.rows[5].流量下载量 = downloadValue;
                            obj = {};
                            obj.时间 = time;
                            obj.流量上传量 = uploadValue;
                            obj.流量下载量 = downloadValue;
                            obj2.push(obj);
                            localStorage.setItem("networkData" + this.searchData.server, JSON.stringify(obj2));
                        }
                    })
                }, 1000 * 60);
                // 轮询CPU使用
                this.timer4 = window.setInterval(() => {
                    this.$get('/prometheus/cpu/usage/' + this.searchData.server).then(data => {
                        var obj;
                        var obj2 = [];
                        var obj3;
                        if(this.CPUUseData.rows.length < 4) {
                            obj = {};
                            obj.时间 = this.timeFormat2(data.system.data.result[0].value[0]);
                            obj.系统态 = data.system.data.result[0].value[1];
                            obj.用户态 = data.user.data.result[0].value[1];
                            obj.IO等待 = data.iowait.data.result[0].value[1];
                            obj.空闲 = data.idle.data.result[0].value[1];
                            this.CPUUseData.rows.push(obj);
                            for(var i = 0; i < this.CPUUseData.rows.length; i++) {
                                obj3 = {};
                                obj3.time = this.CPUUseData.rows[i].时间;
                                obj3.system = this.CPUUseData.rows[i].系统态;
                                obj3.user = this.CPUUseData.rows[i].用户态;
                                obj3.iowait = this.CPUUseData.rows[i].IO等待;
                                obj3.idle = this.CPUUseData.rows[i].空闲;
                                obj2.push(obj3);
                            }
                            localStorage.setItem('CPUUse' + this.searchData.server, JSON.stringify(obj2));
                        } else {
                            obj2 = [];
                            for(var i = 0; i < 3; i++) {
                                obj = {};
                                this.CPUUseData.rows[i].时间 = this.CPUUseData.rows[i+1].时间;
                                this.CPUUseData.rows[i].系统态 = this.CPUUseData.rows[i+1].系统态;
                                this.CPUUseData.rows[i].用户态 = this.CPUUseData.rows[i+1].用户态;
                                this.CPUUseData.rows[i].IO等待 = this.CPUUseData.rows[i+1].IO等待;
                                this.CPUUseData.rows[i].空闲 = this.CPUUseData.rows[i+1].空闲;
                                obj.time = this.CPUUseData.rows[i].时间;
                                obj.system = this.CPUUseData.rows[i].系统态;
                                obj.user = this.CPUUseData.rows[i].用户态;
                                obj.iowait = this.CPUUseData.rows[i].IO等待;
                                obj.idle = this.CPUUseData.rows[i].空闲;
                                obj2.push(obj)
                            }
                            this.CPUUseData.rows[3].时间 = this.timeFormat2(data.system.data.result[0].value[0]);
                            this.CPUUseData.rows[3].系统态 = data.system.data.result[0].value[1];
                            this.CPUUseData.rows[3].用户态 = data.user.data.result[0].value[1];
                            this.CPUUseData.rows[3].IO等待 = data.iowait.data.result[0].value[1];
                            this.CPUUseData.rows[3].空闲 = data.idle.data.result[0].value[1];
                            obj = {};
                            obj.time = this.timeFormat2(data.system.data.result[0].value[0]);
                            obj.system = data.system.data.result[0].value[1];
                            obj.user = data.user.data.result[0].value[1];
                            obj.iowait = data.iowait.data.result[0].value[1];
                            obj.idle = data.idle.data.result[0].value[1];
                            obj2.push(obj);
                            localStorage.setItem('CPUUse' + this.searchData.server, JSON.stringify(obj2));
                        }
                    })
                }, 1000 * 60)
                //轮询负载
                this.timer5 = window.setInterval(() => {
                    this.$get('/prometheus/load/load1/' + this.searchData.server).then(data => {
                        if (data.status == "success") {
                            var obj;
                            var obj2 = [];
                            var obj3;
                            if(this.loadData.rows.length < 6) {
                                obj = {};
                                obj.日期 = this.timeFormat2(data.data.result[0].value[0]);
                                obj.负载 = data.data.result[0].value[1];
                                this.loadData.rows.push(obj);
                                for(var i = 0; i < this.loadData.rows.length; i++) {
                                    obj3 = {}
                                    obj3.time = this.loadData.rows[i].日期;
                                    obj3.value = this.loadData.rows[i].负载;
                                    obj2.push(obj3)
                                }
                            }else{
                                obj2 = [];
                                for (var i = 0; i < 5; i++) {
                                    obj = {};
                                    this.loadData.rows[i].日期 = this.loadData.rows[i+1].日期;
                                    this.loadData.rows[i].负载 = this.loadData.rows[i+1].负载;
                                    obj.time = this.loadData.rows[i].日期;
                                    obj.value = this.loadData.rows[i].负载;
                                    obj2.push(obj)
                                }
                                this.loadData.rows[5].日期 = this.timeFormat2(data.data.result[0].value[0]);
                                this.loadData.rows[5].负载 = data.data.result[0].value[1];
                                obj = {};
                                obj.time = this.timeFormat2(data.data.result[0].value[0]);
                                obj.value = data.data.result[0].value[1];
                                obj2.push(obj);
                            }
                            localStorage.setItem('load' + this.searchData.server, JSON.stringify(obj2))
                        }
                    })
                }, 1000 * 60);
            },
            //局部刷新页面
            refresh() {
                this.reload();
            },
            getSystemRun(){
                this.$get('/prometheus/system/systemrun/' + this.searchData.server).then(data => {
                    if(data.status == "success"){
                        let value = data.data.result[0].value[1];
                        let day = Math.floor(value / 3600 / 24);
                        this.data.server_run = day;
                    }
                })
            },
            getCpuCores(){
                this.$get('/prometheus/cpu/total/' + this.searchData.server).then(data => {
                    if(data.status == "success"){
                        let value = data.data.result[0].value[1];
                        this.data.cpu_cores = value;
                    }
                })
            },
            getMemory(){
                this.memoryLoading = true;
                this.diskLoading = true;
                this.$get('/prometheus/memory/total/' + this.searchData.server).then(data => {
                    if(data.status == "success"){
                        let value = data.data.result[0].value[1];
                        value = (value/1024/1024/1024).toFixed(2);
                        this.ringTitle.text = value + 'G';
                    }
                })
                this.$get('/prometheus/memory/free/' + this.searchData.server).then(data => {
                    if(data.status == "success"){
                        let value = data.data.result[0].value[1];
                        value = (value/1024/1024/1024).toFixed(2);
                        this.data.memory.free = value + 'G';
                        this.ringData.rows[1].数值2 = value
                    }
                })
                this.$get('/prometheus/memory/use/' + this.searchData.server).then(data => {
                    if(data.status == "success"){
                        let value = data.data.result[0].value[1];
                        value = (value/1024/1024/1024).toFixed(2);
                        this.data.memory.use = value + 'G';
                        this.ringData.rows[0].数值2 = value;
                    }
                    this.memoryLoading = false;
                })
                //获取磁盘总容量
                this.$get('/prometheus/fs/total/' + this.searchData.server).then(data => {
                    if(data.status == "success") {
                        let value = data.data.result[0].value[1];
                        this.diskUseDataTitle.text = (value/1024/1024/1024).toFixed(2) + 'G';
                        this.diskSpace = (value/1024/1024/1024).toFixed(2) + 'G';
                        //获取磁盘占用量
                        this.$get('/prometheus/fs/free/' + this.searchData.server).then(data => {
                            if(data.status == "success") {
                                let value2 = data.data.result[0].value[1];
                                this.diskUseData.rows[0].数值2 = ((value - value2)/1024/1024/1024).toFixed(2);
                                this.diskUseData.rows[1].数值2 = (value2/1024/1024/1024).toFixed(2);
                            }
                            this.diskLoading = false;
                        }).catch(error => {
                            this.$message.error({ message: "获取磁盘占用信息失败!", type: "error"})
                            this.diskLoading = false;
                        })
                    }
                }).catch(error => {
                    this.$message.error({ message: "获取磁盘容量失败！", type: "error"})
                })
            },
            //获取TCP连接数
            getTCP() {
              this.$get('/prometheus/network/tcp/connects/' + this.searchData.server).then(data => {
                  if(data.status == "success") {
                      this.TCP = data.data.result[0].value[1];
                  }
              })
            },
            //获取IO信息
            getIOData() {
                var obj;
                this.IOLoading = true;
                this.IOData.rows = [];
                this.IOData.columns = ['名称'];
                this.IOSettings.legendName = {};
                this.$get('/prometheus/io/rate/' + this.searchData.server).then(data => {
                    if(data.read_bytes_total.status == "success") {
                        obj = {};
                        obj.名称 = "磁盘读取成功总字节数";
                        for(var i = 0; i < data.read_bytes_total.data.result.length; i++) {
                          obj[data.read_bytes_total.data.result[i].metric.device] = data.read_bytes_total.data.result[i].value[1];
                          this.IOData.columns.push(data.read_bytes_total.data.result[i].metric.device);
                        }
                        this.IOData.rows.push(obj);
                        if(data.read_bytes_total.data.result.length == 2){
                            this.IOSettings.legendName.sda = '磁盘a'
                            this.IOSettings.legendName.sdb = '磁盘b'
                        } else {
                            this.IOSettings.legendName.sda = '磁盘a'
                        }
                    }
                    if(data.written_bytes_total.status == "success") {
                        obj = {};
                        obj.名称 = "磁盘写入成功字节数";
                        for(var i = 0; i < data.written_bytes_total.data.result.length; i++) {
                            obj[data.written_bytes_total.data.result[i].metric.device] = data.written_bytes_total.data.result[i].value[1];
                        }
                        this.IOData.rows.push(obj)
                    }
                    if(data.io_time_seconds_total.status == "success") {
                        obj = {};
                        obj.名称 = "磁盘IO总耗时秒";
                        for(var i = 0; i < data.io_time_seconds_total.data.result.length; i++) {
                            obj[data.io_time_seconds_total.data.result[i].metric.device] = parseFloat(data.io_time_seconds_total.data.result[i].value[1]).toFixed(2);
                        }
                        this.IOData.rows.push(obj)
                    }
                    this.IOLoading = false;
                }).catch(error => {
                    this.$message.error({ message: "获取磁盘IO失败!", type: "error"});
                    this.IOLoading = false;
                })
            },
            list() {
                this.$get('/prometheus/node/list').then(data => {
                    this.searchData.server = data[0];
                    for(let i=0;i<data.length;i++) {
                        var obj = {};
                        obj.value = data[i];
                        obj.label = data[i];
                        this.servers.push(obj)
                    }
                    this.serverchange();
                })

            },
            timeFormat(nS) {
                let date = new Date(parseInt(nS) * 1000); // 时间戳为10位需乘1000，为13位则不用
                let Y = date.getFullYear(); // 年
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); // 月
                let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''; // 日

                let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 时
                let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 分
                let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 秒
                return h + ':' + m + ':' + s// yyyy/mm/dd hh:mm:ss
            },
            timeFormat2(nS) {
                let date = new Date(parseInt(nS) * 1000); // 时间戳为10位需乘1000，为13位则不用
                let Y = date.getFullYear(); // 年
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); // 月
                let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''; // 日

                let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 时
                let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 分
                let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 秒
                return h + ':' + m// yyyy/mm/dd hh:mm:ss
            },
            clear(){
            }
        },
        created() {
            this.list();
        },
        load() {
        },
        mounted() {
        },
        beforeDestroy() {
                clearInterval(this.timer1);
                this.timer1 = null;
                clearInterval(this.timer3);
                this.timer3 = null;
                clearInterval(this.timer4);
                this.timer4 = null;
                clearInterval(this.timer5);
                this.timer5 = null;
        }
    };
</script>
<style>
  .assets_status {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color: #606266
  }
  .assets_status .assets_status_box {
    background: #fff;
    padding: 15px;
    overflow: hidden;
  }
  .assets_status .assets_status_box .server_basic_message {
    margin-top: 15px;
    width: 100%;
  }
  .assets_status .assets_status_box .server_basic_message .card_box1 .p_name {
    font-weight: 900;
    color: #606266;
  }
  .assets_status .assets_status_box .server_basic_message .card_box1 .p_value {
    color: #000000;
  }
  .assets_status .assets_status_box .server_basic_message .card_box1 .el-card__body {
    padding: 0px;
  }
  .assets_status .assets_status_box .server_basic_message .card_box1 .div1 {
    padding: 15px;
    float: left;
    height: 150px;
    width:175px;
  }
  .assets_status .assets_status_box .server_basic_message .card_box1 .div1 p {
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 15px;
  }
  .assets_status .assets_status_box .server_basic_message .card_box2 .el-card__body {
    padding: 0px;
  }
  .assets_status .assets_status_box .server_basic_message .card_box2 {
    height: 150px;
    padding: 0 4px 0 4px;
  }
  .assets_status .assets_status_box .server_basic_message .card_box2 img{
    margin-top: 40px;
    margin-left: 30px;
    float: left;
  }
  .assets_status .assets_status_box .server_basic_message .card_box2 p {
    float: left;
  }
  .assets_status .assets_status_box .server_basic_message .card_box2 .p_name {
    color: #606266;
    margin-left: 10px;
    margin-top: 50px;
  }
  .assets_status .assets_status_box .server_basic_message .card_box2 .p_value {
    position: absolute;
    color: #000000;
    margin-left: 105px;
    font-size: 20px;
    margin-top: 75px;
  }
  .assets_status .assets_status_box .server_basic_message .card_box2 .div1{
    float: left;
    height: 150px;
    width: 16.6%;
  }
  .assets_status .assets_status_box .server_basic_message .card_box3 {
    height: 300px;
    margin-top: 15px;
  }
  .assets_status .assets_status_box .server_basic_message .CPU_use p{
    float: left;
    margin-left: 5px;
    margin-top: 15px;
    font-size: 18px;
    color:#000000;
  }
  .assets_status .assets_status_box .server_basic_message .load p {
    float: left;
    margin-left: 5px;
    margin-top: 15px;
    font-size: 18px;
    color: #000000;
  }
  .assets_status .assets_status_box .server_basic_message .memory_use p {
    float: left;
    margin-left: 5px;
    margin-top: 15px;
    font-size: 18px;
    color: #000000;
  }
  .assets_status .assets_status_box .server_basic_message .card_box4 {
    height: 300px;
    margin-top: 15px;
  }
  .assets_status .assets_status_box .server_basic_message .disk_use p {
    float: left;
    margin-left: 5px;
    margin-top: 15px;
    font-size: 18px;
    color: #000000;
  }
  .assets_status .assets_status_box .server_basic_message .update_flow p {
    float: left;
    margin-left: 5px;
    margin-top: 15px;
    font-size: 18px;
    color: #000000;
  }
  .assets_status .assets_status_box .server_basic_message .download_flow p {
    float: left;
    margin-left: 5px;
    margin-top: 15px;
    font-size: 18px;
    color: #000000;
  }
  .assets_status_box .assets_status_chart {
    margin-top: 35px;
    display: flex;
    margin-bottom: 16px;
    width: 100%;
  }
  .assets_status_box .assets_status_chart > div > div {
    min-height: 200px;
    border: 1px solid #ccc;
    /*padding: 10px;*/
  }
  .assets_status_box .title {
    height: 40px;
    line-height: 20px;
    text-align: left;
    color: rgb(123, 124, 125);
    font-size: 20px;
    padding: 16px 0 0 16px;
    /*background: -moz-linear-gradient(left, #0068B5 0%, #7CAFE1 100%);*/
    /*background: -webkit-gradient(linear, left, right, color-stop(0%, #0068B5), color-stop(100%, #7CAFE1));*/
    /*background: -webkit-linear-gradient(left, #0068B5 0%, #7CAFE1 100%);*/
    /*background: -o-linear-gradient(left, #0068B5 0%, #7CAFE1 100%);*/
    /*background: -ms-linear-gradient(left, #0068B5 0%, #7CAFE1 100%);*/
    /*background: linear-gradient(to right, #0068B5 0%, #7CAFE1 100%);!*用线性渐变创建图像*!*/
  }
  .assets_status_box .title1 {
    height: 40px;
    line-height: 20px;
    text-align: left;
    color: rgb(123, 124, 125);
    font-size: 14px;
    padding: 16px 0 0 16px;
    display: inline;
  }
  .assets_status_box .title2 {
    height: 40px;
    line-height: 20px;
    text-align: left;
    color: rgb(123, 124, 125);
    font-size: 14px;
  }
  .assets_status_box #myChart {
    margin: auto;
    width: 300px;
    height: 300px;
  }
  .assets_status_box .title i {
    font-size: 14px;
    margin-right: 5px;
  }
  .assets_status .assets_status_box .chart_a {
    margin: 0 8px;
  }
  .assets_status .assets_status_box .chart_a .fault_type {
    position: relative;
  }
  .assets_status .assets_status_box .chart_a .fault_type .node_image {
    position: absolute;
    margin-top: 5px;
  }
  .assets_status .assets_status_box .chart_a .fault_type .node_value {
    display: inline;
    margin: 8px 5px 0 28px;
  }
  .assets_status .assets_status_box .chart_a .fault_type .node_select {
    display: inline;
  }
  .assets_status_box .assets_status_chart .chart_a {
    width: 100%;
    display: flex;
    margin: 0 8px;
  }
  .assets_status_box .assets_status_chart .chart_a .chart_a_1 {
    width: 50%;
    position: relative;
    /*background: #1b5b9e;*/
    border-radius: 20px;
    margin: 10px 10px 0 0;
    height: 340px;
  }
  .assets_status_box .assets_status_chart .chart_a .chart_a_3 {
    width: 50%;
    border-radius: 20px;
    position: relative;
    margin-top: 10px;
  }
  .assets_status_box
  .assets_status_chart
  .chart_a
  .inner_text {
    /*color: rgb(251, 197, 30);*/
    color: #3eacf9;
    font-size: 40px;
    line-height: 100px;
    text-align: center;
  }
  .assets_status_box
  .assets_status_chart
  .chart_a
  .inner_text
  span {
    font-size: 50px;
    /*color: rgb(251, 197, 30);*/
    color: #3eacf9;
  }
  .assets_status_chart_tow .assets_status_chart_tow_1 {
    border-radius: 20px;

  }
  .assets_status_chart_tow .assets_status_chart_tow_2 {
    border-radius: 20px;
  }
  .assets_status_chart_tow .assets_status_chart_tow_3 {
    border-radius: 20px;
  }
  .assets_status_box
  .assets_status_chart
  .chart_a
  .chart_a_1
  .bottom_box {
    height: 50px;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  /*.assets_status_box*/
  /*.assets_status_chart*/
  /*.chart_a*/
  /*.chart_a_1*/
  /*.bottom_box_a {*/
  /*  border-top: 2px solid rgb(220, 169, 27);*/
  /*  background-color: rgba(220, 169, 27, 0.4);*/
  /*}*/
  .assets_status_box
  .assets_status_chart
  .chart_a
  .chart_a_1
  .bottom_box_b {
    border-top: 2px solid rgb(0, 196, 40);
    background-color: rgba(0, 196, 40, 0.4);
  }
  .assets_status_box .assets_status_chart .chart_b {
    width: 50%;
    display: flex;
  }
  .assets_status_box .assets_status_chart .chart_b .chart_b_1 {
    width: 50%;
  }
  .assets_status_box .assets_status_chart_tow {
    display: flex;
  }
  .assets_status_box .assets_status_chart_tow > div {
    width: 50%;
    margin: 0 8px;
    min-height: 400px;
    border: 1px solid #ccc;
    padding: 16px;
  }
</style>
