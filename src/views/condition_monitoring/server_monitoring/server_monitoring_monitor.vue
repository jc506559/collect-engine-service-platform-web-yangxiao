<template>
    <div class="server_monitoring_monitor">
        <!-- 第一数据 -->
    	<div class="chart_a">
        <el-select v-model="searchData.server" @change="serverchange()" class="fault_type" placeholder="请选择">
          <el-option v-for="item in servers" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
    	</div>

        <div class="server_monitoring_chart">
            <div class="chart_a">
                <div class="chart_a_1">
                    <div class="title"><i class="icon iconfont icon-shijian1"></i>正常运行时间</div>
                    <div class="inner_text"><span>{{data.server_run}}</span> 天</div>
                </div>
                <div class="chart_a_1">
                    <div class="title"><i class="icon iconfont icon-link"></i>CPU核数</div>
                    <div class="inner_text"><span>{{data.cpu_cores}}</span></div>
                    <div class="bottom_box bottom_box_a"></div>
                </div>
                <div class="chart_a_1">
                    <div class="title"><i class="icon iconfont icon-neicun"></i>内存使用</div>
                    <div>总内存：{{data.memory.total}}</div>
                    <div>已用内存：{{data.memory.use}}</div>
                    <div>可用内存：{{data.memory.free}}</div>
                </div>
            </div>
        </div>
        <!-- 第二数据 -->
        <div class="server_monitoring_chart_tow">
            <div>
                <div class="title"><i class="icon iconfont icon-gailan-mingzhongshuai"></i>总内存使用量</div>
                <ve-line :data="lineData" :settings="lineSettings" width="auto"></ve-line>
            </div>
            <div>
                <div class="title"><i class="icon iconfont icon-gailan-mingzhongshuai"></i>网络</div>
<!--                <app-line-chart style="height:130px; width:100%;display:inline-block;" :data="lineData"></app-line-chart>-->
            </div>
        </div>
    </div>
</template>
<script>
    import permission from '@/components/mixin/permission';
  export default {
    mixins: [permission],
    name: 'server_monitoring_monitor',
    data() {
        this.lineSettings = {
            axisSite: { right: ['内存占用率'] },
            yAxisType: ['KMB', 'percent'],
        }
        return {
        	servers:[],
        	searchData:{
        		server:""
        	},
        	data:{
        		server_run: "N/A",
        		cpu_cores: "N/A",
        		memory:{
        			total: "N/A",
        			free: "N/A",
        			use: "N/A"
        		}
        	},
          free: [],
          // lineData:[
          //     {
          //         name: "aaa",
          //         data: [
          //             {
          //                 name: "2012-01",
          //                 value: 100,
          //             },
          //             {
          //                 name: "2012-02",
          //                 value: 341
          //             },
          //             {
          //                 name: "2012-03",
          //                 value: 121
          //             }
          //         ]
          //     }
          // ]
          lineData: {
                columns: ['时间', '总内存使用量', '内存占用率'],
                rows: [
                    { '时间': null, '总内存使用量': null, '内存占用率': null, '对应时间戳': null},
                    { '时间': null, '总内存使用量': null, '内存占用率': null, '对应时间戳': null},
                    { '时间': null, '总内存使用量': null, '内存占用率': null, '对应时间戳': null},
                    { '时间': null, '总内存使用量': null, '内存占用率': null, '对应时间戳': null},
                    { '时间': null, '总内存使用量': null, '内存占用率': null, '对应时间戳': null},
                    { '时间': null, '总内存使用量': null, '内存占用率': null, '对应时间戳': null},
                ]
            }
        }
    },
    methods:{
    	serverchange(){
    	  if(this.timer) {
    	      clearInterval(this.timer)
        }
    		this.getSystemRun();
    		this.getCpuCores();
    		this.getMemory();
    		this.getNetwork();
        if(localStorage.getItem('lineData' + this.searchData.server)) {
            var getLocalData = JSON.parse(localStorage.getItem('lineData' + this.searchData.server));
            if(localStorage.getItem('lineData' + this.searchData.server) != null) {
                for (var i = 0; i < 6; i++) {
                    this.lineData.rows[i]["时间"] = getLocalData[i].key;
                    this.lineData.rows[i]["总内存使用量"] = getLocalData[i].value;
                    this.lineData.rows[i]['对应时间戳'] = getLocalData[i].time;
                }
                for(let a=0; a<6 ;a++) {
                    // if(getLocalData[a].time != null) {
                        this.$get('/prometheus/memory/usage/' + this.searchData.server + '/' + getLocalData[a].time + '/' + (parseInt(getLocalData[a].time) + 60)).then(data => {
                            if(data.status == "success") {
                                let time = data.data.result[0].value[1];
                                time = (time/100).toFixed(2);
                                this.lineData.rows[a]['内存占用率'] = time
                            }
                        })
                    // }else {
                    //     this.lineData.rows[a]['内存占用率'] = null
                    // }
                }
            }
        }
          //轮询
        this.timer = window.setInterval(() => {
              this.$get('/prometheus/memory/use/' + this.searchData.server).then(data => {
                  if(data.status == "success"){
                      var obj;
                      var obj2 = [];
                      let value = data.data.result[0].value[1];
                      value = (value/1024/1024/1024).toFixed(2);
                      for(var i=0;i<5;i++) {
                          obj = {};
                          this.lineData.rows[i]['时间'] = this.lineData.rows[i+1]['时间'];
                          this.lineData.rows[i]['总内存使用量'] = this.lineData.rows[i+1]['总内存使用量'];
                          this.lineData.rows[i]['对应时间戳'] = this.lineData.rows[i+1]['对应时间戳'];
                          this.lineData.rows[i]['内存占用率'] = this.lineData.rows[i+1]['内存占用率'];
                          obj.key = this.lineData.rows[i]['时间'];
                          obj.value = this.lineData.rows[i]['总内存使用量'];
                          obj.time = this.lineData.rows[i]['对应时间戳'];
                          obj2.push(obj);
                      }
                      this.lineData.rows[5]['时间'] = this.timeFormat(data.data.result[0].value[0]);
                      this.lineData.rows[5]['总内存使用量'] = value;
                      this.lineData.rows[5]['对应时间戳'] = data.data.result[0].value[0];
                      if(this.lineData.rows[5]['对应时间戳'] != null) {
                          this.$get('/prometheus/memory/usage/' + this.searchData.server + '/' + this.lineData.rows[5]['对应时间戳'] + '/' + (parseInt(this.lineData.rows[5]['对应时间戳']) + 60)).then(data => {
                              if(data.status == "success") {
                                  let time = data.data.result[0].value[1];
                                  time = (time/100).toFixed(2);
                                  this.lineData.rows[5]['内存占用率'] = time
                              }
                          })
                      }
                      obj = {};
                      obj.key = this.timeFormat(data.data.result[0].value[0]);
                      obj.value = value;
                      obj.time = data.data.result[0].value[0];
                      obj2.push(obj);
                      localStorage.setItem("lineData" + this.searchData.server, JSON.stringify(obj2));

                      }
              })
          },1000*60)
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
    	getNetwork(){
    		let end = Math.floor(new Date().getTime() / 1000);
    		let start = end - 5;
    		// this.$get('/prometheus/network/network/' + this.searchData.server + '/' + start + '/' + end).then(data => {
        this.$post('/prometheus/network/network/' + this.searchData.server, {
            params: {
                start: start,
                end: end
            },
          }).then(data => {
				if(data.status == "success"){
				}
			})
    	},
    	getMemory(){
    		this.$get('/prometheus/memory/total/' + this.searchData.server).then(data => {
				if(data.status == "success"){
					let value = data.data.result[0].value[1];
					value = (value/1024/1024/1024).toFixed(2);
					this.data.memory.total = value + 'G';
				}
			})
    		this.$get('/prometheus/memory/free/' + this.searchData.server).then(data => {
				if(data.status == "success"){
					let value = data.data.result[0].value[1];
					value = (value/1024/1024/1024).toFixed(2);
					this.data.memory.free = value + 'G';
				}
			})
    		this.$get('/prometheus/memory/use/' + this.searchData.server).then(data => {
				if(data.status == "success"){
					let value = data.data.result[0].value[1];
					value = (value/1024/1024/1024).toFixed(2);
					this.data.memory.use = value + 'G';
				}
			})
    	},
      list() {
    	    this.$get('/prometheus/node/list').then(data => {
    	        for(let i=0;i<data.length;i++) {
    	            var obj = {};
    	            obj.value = data[i];
    	            obj.label = data[i];
    	            this.servers.push(obj)
              }
          })
      },
      timeFormat(nS) {
          let date = new Date(parseInt(nS) * 1000) // 时间戳为10位需乘1000，为13位则不用
          let Y = date.getFullYear() // 年
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) // 月
          let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + '' // 日

          let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() // 时
          let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() // 分
          let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() // 秒
          return h + ':' + m// yyyy/mm/dd hh:mm:ss
      },
      clear(){}
    },
      created() {
        this.list();
      },
      load() {
      },
      mounted() {
      },
      watch: {
      },
      beforeDestroy() {
        this.clear();
      }
  };
</script>
<style>
.server_monitoring_monitor {
    padding: 16px;
}
.server_monitoring_monitor .server_monitoring_chart {
    display: flex;
    margin-bottom: 16px;
}
.server_monitoring_monitor .server_monitoring_chart > div > div {
    min-height: 200px;
    border: 1px solid #ccc;
    padding: 10px;
}
.server_monitoring_monitor .title {
    height: 20px;
    line-height: 20px;
    text-align: left;
    color: rgb(123, 124, 125);
    font-size: 14px;
}
.server_monitoring_monitor .title i {
    font-size: 14px;
    margin-right: 5px;
}
.server_monitoring_monitor .server_monitoring_chart .chart_a {
    width: 50%;
    display: flex;
}
.server_monitoring_monitor .server_monitoring_chart .chart_a .chart_a_1 {
    width: 33.3%;
    position: relative;
}
.server_monitoring_monitor
    .server_monitoring_chart
    .chart_a
    .chart_a_1
    .inner_text {
    color: #ccc;
    font-size: 20px;
    line-height: 140px;
    text-align: center;
}
.server_monitoring_monitor
    .server_monitoring_chart
    .chart_a
    .chart_a_1
    .inner_text
    span {
    font-size: 50px;
    color: rgb(251, 197, 30);
}
.server_monitoring_monitor
    .server_monitoring_chart
    .chart_a
    .chart_a_1
    .bottom_box {
    height: 50px;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
}
.server_monitoring_monitor
    .server_monitoring_chart
    .chart_a
    .chart_a_1
    .bottom_box_a {
    border-top: 2px solid rgb(220, 169, 27);
    background-color: rgba(220, 169, 27, 0.4);
}
.server_monitoring_monitor
    .server_monitoring_chart
    .chart_a
    .chart_a_1
    .bottom_box_b {
    border-top: 2px solid rgb(0, 196, 40);
    background-color: rgba(0, 196, 40, 0.4);
}
.server_monitoring_monitor .server_monitoring_chart .chart_b {
    width: 50%;
    display: flex;
}
.server_monitoring_monitor .server_monitoring_chart .chart_b .chart_b_1 {
    width: 50%;
}
.server_monitoring_monitor .server_monitoring_chart_tow {
    display: flex;
}
.server_monitoring_monitor .server_monitoring_chart_tow > div {
    width: 50%;
    margin: 0 8px;
    min-height: 400px;
    border: 1px solid #ccc;
    padding: 16px;
}
</style>
