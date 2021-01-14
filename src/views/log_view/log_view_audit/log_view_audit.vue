<template>
  <div class="page-log_view_audit">
    <div class="page-log_view_audit_box">
        <div class="search_form">
          <p style="font-size: 20px"><i class="el-icon-search "style="font-size: 16px"></i>数据查询</p>
          <div class="inner">
<!--            普通搜索div-->
            <el-input v-model="searchFormsearch" ref="input" @keyup.enter.native="searchlist" multiple filterable remote reserve-keyword placeholder="请输入关键词"  :loading="loading"style="width: auto"></el-input>
            <el-button ref="button" type="primary" @click="searchinfo" plain style="margin-left: 10px">搜索</el-button>
<!--           按钮切换 高级搜索-普通搜索-->
            <el-button type="primary" @click="cutSearch">{{message}}</el-button>
          </div>
        </div>
<!--    高级搜索div-->
    <div v-show="basicSearch">
      <div class="researchsmart">
        <!--    选择引擎-->
        <div class="select_statistics_type">
          <span>选择引擎</span>
          <el-select style="margin-left: 15px" v-model="searchData.engine" class="fault_type" placeholder="请选择采集引擎" @change="engineChange">
            <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value"></el-option>
          </el-select>
          <el-select v-model="searchData.engineDataType" class="fault_type" placeholder="请选择数据类型">
            <el-option v-for="dataType in engineDataType" :key="dataType.value" :label="dataType.label" :value="dataType.value"></el-option>
          </el-select>
        </div>
        <div class="timeDiv">
                <span style="padding: 10px;position: absolute;right:450px;top:122px">采集数据时间</span>
                <el-date-picker style="position: absolute;right:90px;top:147px" ref="getSmmartPicker"
                                v-model="time"
                                type="daterange"
                                unlink-panels
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions">
                </el-date-picker></div>
      </div>
    </div></div>
        <div class="listDiv" v-loading="loading">
          <div class="app-table">
            <p class="label_p" style="font-size: 20px;padding: 10px;line-height: 35px;margin-left: 22px">搜索结果</p>
            <el-table class="listDiv_table" border style="width: 95%"  v-loading="professionDataLoading" :data="professionData"
                      @expand-change="selectCurrentRow"
                      row-key="id"
                      :expand-row-keys="openRow">
                <el-table-column type="expand"  >
                  <template slot-scope="props" >
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="详细信息">
<!--                        点击之后展示-->
                      <json-viewer  class="jsonViewStyle"
                          :value="JSON.parse(props.row.data)"
                          copyable
                          boxed
                          sort :expand-depth=5>
                        </json-viewer>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column align="center"
                  label="引擎名称"
                  prop="engineName"
                  width="200">
                </el-table-column>
                <el-table-column align="center"
                  label="引擎类型"
                  prop="engineDataTypeName" width="200">
                </el-table-column>
                <el-table-column align="center"
                  label="采集时间"
                  prop="time"  width="200">
                  <template slot-scope="scope">
                  {{ $format("YYYY-MM-DD HH:mm:ss", new Date(scope.row.time))}}
                  </template>
                </el-table-column>
              <el-table-column align="center"
                label="信息简介"
                prop="data" ref="more" :show-overflow-tooltip="true"  ></el-table-column>
            </el-table>
            <div class="listPage">
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             :current-page="Page"
                             :page-sizes="pageSizes"
                             :page-size="PageSize"
                             :total="total"
                             layout="total, sizes, prev, pager, next, jumper"/>
            </div>
          </div>
        </div>
      </div>
</template>
<script>
import permission from "@/components/mixin/permission";
import config from "@/components/chart/config";
import { publicMethod } from "@/plugin/timeformat.js";
import moment from 'moment'
import JsonViewer from 'vue-json-viewer';

export default {
  // mixins: [permission],
  name: "page-log_view_audit",
  components: {
    JsonViewer
  },

  data() {
    return {
      // 数据表单
      openRow: [1],
      jsonData:{
        data:[]
      },

      object: {
        "keywords": "论",
        "engineid": "d4432b1a0cc1417c92194fc92eeec88e",
        "enginedatatypeid": "340e5bfe35aa4614a921131558cc77fb",
        "starttime": "1603164363374",
        "endtime": "1703164363374",
        "page": 0,
        "size": 10,
      },
      // data: '',
      //增加引擎标签相关
      inputVisible: {},
      inputValue: {},
      //高级搜索输入obj
      input: '',
      //搜索
      isShow: false,
      message: '高级搜索',
      options: [],
      value: [],
      list: [],
      loading: false,
      states: ["Alabama"],
      button: '',
      searchFormsearch: '',
      // 时间
      time: '',
      // starttime: '',
      // endtime: '',
      //基础搜索页面内容
      searchData: {
        engineDataType: [],
        engine: [],
      },
      engines: [],
      engineDataType: [],
      // search: '',
      professionSearchData: {
        // time: null,
        source: null,
        tag: null,
      },
      //table-页
      dataTypeData: '',
      Page: 1,
      PageSize: 10,
      total: 0,
      pageSizes: [10, 20, 50, 100],
      professionData: [],
      basicDataLoading: false,
      dataTypeExtend: {
        legend: {
          top: '20'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%'
        }
      },
      //业务搜索页面内容
      professionDataLoading: false,
      //用于切换基本搜索也业务搜索
      basicSearch: false,
      professionSearch: true,
      //日期选择器只能选择今天之前的时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 *3);
              picker.$emit('pick', [start,end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
        ],
      }
    };
  },
  methods:{

    //data
    handleNodeClick(data) {
      console.log(data);
    },
    //日期转化成时间戳
    getEditorSave() {
      publicMethod.getTimestamp('')
    },
    // 高级搜索-普通搜索
    cutSearch() {
      this.basicSearch = !this.basicSearch;
      if (this.basicSearch) {
        this.message = '普通搜索';
      } else {
        this.message = '高级搜索';
      }
    },
    search(event) {
      console.log(event.currentTarget.value)
    },
    searchinfo() {
      // this.Page = 1;
      //判断当没有给出条件时
      if (this.searchFormsearch.length != 0) {
        this.object.keywords = this.searchFormsearch
      }else {
        this.$alert('没有输入搜索条件')
        this.object.keywords =[]
      }
        // console.log(this.object.keywords)
        //需要将时间转化成时间戳
        this.object.starttime = Date.parse(new Date(this.time[0]))
        this.object.endtime = Date.parse(new Date(this.time[1]))
      // this.object.page = this.Page
        // console.log(this.object.starttime)
        // console.log(this.object.endtime)
        //engineid
        if (this.searchData.engine != '全部') {
          this.object.engineid = this.searchData.engine
        } else if (this.searchData.engineDataType != '全部') {
          this.object.enginedatatypeid = this.searchData.engineDataType
        } else {
          this.object.engineid = '';
          this.object.enginedatatypeid = '';
        }

      this.loading = true;

      this.$post('/data/findPageInES', {
        data: this.object

      }).then(res => {
          // this.$message.success({message: "ok", type: "success"});
          this.professionData = res.enginetime_result.content
          this.loading = false;
          //页数
          this.total = res.enginetime_result.totalElements;
          // console.log(JSON.stringify(this.object))
          // console.log(this.data)
         if(this.total == 0 && this.searchFormsearch.length != 0){
           this.$alert('没有匹配到数据')
         }
      })
    },
  //引擎变化
    engineChange() {
      this.engineDataType = [];
      if (this.searchData.engine != '全部') {
        this.searchData.engineDataType = ''
        this.$post('/action', {
          data: {
            "select": "crawl_engine_data_type",
            "where": ["engine_id=" + this.searchData.engine, "enabled=1", "is_engine=1"]
          }
        }).then(data => {
          if (data.length != 0) {
            // this.engineDataType.push({value: '全部', label: '全部'});
            data.forEach(val => {
              let obj = {};
              obj.value = val.id;
              obj.label = val.name;
              this.engineDataType.push(obj)
            });
          }
        });
      } else {
        this.searchData.engineDataType = '全部'
      }
    },
  // 获取引擎类型
  getEngines() {
    this.$post('/action', {
      data: {
        "select": "crawl_engine",
        // "where": ["enabled=1"]
      }
    }).then(data => {
      if (data.length != 0) {
        data.forEach(val => {
          let obj = {};
          obj.value = val.id;
          obj.label = val.engine_name;
          this.engines.push(obj);
        })}
        let obj1 = {};
        obj1.value = '全部';
        obj1.label = '全部';
        this.engines.push(obj1)})
   this.searchData.engine = '全部'
  },
//分页
// 修改分页数量
  handleSizeChange(val) {
    this.PageSize = val;
    // this.searchinfo();
    this.object.size = this.PageSize
  },
// 切换分页
  handleCurrentChange(val) {
    this.object.page = val;
    // this.searchinfo();

  },

//控制每次只显示一行
    selectCurrentRow(val) {
      this.$store.commit('engineRowDetail', null);
      this.$nextTick(() => {
        let openRow = JSON.parse(JSON.stringify(this.openRow));
        if (openRow == val.id) {
          this.openRow = null;
          this.$store.commit('engineRowDetail', null)
        } else {
          this.openRow = [val.id];
          this.$store.commit('engineRowDetail', val)
        }
      });
      this.currentRow = val;
    },
  },
  mounted() {
    this.getEngines();
    this.engineChange()
    // this.time.push(new Date());
    // this.time.push(new Date());
    // this.handleSizeChange();
    // this.handleCurrentChange();

  }
}
</script>
<style>
.page-log_view_audit {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  font-size: 14px;
  color:#606266;
}
.page-log_view_audit .page-log_view_audit_box {

}
.page-log_view_audit .page-log_view_audit_box .cutSearch {
  margin-right: 10px;
  float: right;
}
.page-log_view_audit .page-log_view_audit_box .line_charts {
  padding: 15px;background: #fff;margin:15px 0;
}
.page-log_view_audit .page-log_view_audit_box .line_charts .line_charts_title {
  float: left;
  color: #000000;
  font-size: 18px;
  height: 35px;
  line-height: 35px;
  text-align: left;
}
.page-log_view_audit .page-log_view_audit_box .search_form {
  background: #fff;
  padding: 20px;
  /*overflow: hidden;*/
}
.page-log_view_audit .page-log_view_audit_box .search_form .title {
  height: 35px;
  line-height: 35px;
  font-size: 20px;
}
.page-log_view_audit .page-log_view_audit_box .search_form .title i {
  margin-right: 5px;
}
.page-log_view_audit .page-log_view_audit_box .search_form .inner {
  margin-top: 10px;
}
.page-log_view_audit
.page-log_view_audit_box
.search_form
.inner
.fault_type
.page-log_view_audit
.page-log_view_audit_box
.search_form
.inner > span {
  margin-right: 5px;
}
.page-log_view_audit .page-log_view_audit_box .line_charts {
  padding: 15px;background: #fff;margin:15px 0;
}
.page-log_view_audit .page-log_view_audit_box .list {
  background: #fff;
  text-align: center;
  margin-top: 15px;
  border-right: 1px solid #ebeef5;
  padding: 0 15px;
}
.page-log_view_audit .page-log_view_audit_box .list:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.page-log_view_audit
.page-log_view_audit_box
.list
.table_edit
.warning {
  color: #e6a23c;
}

/*.page-log_view_audit*/
/*.page-log_view_audit_box*/
/*.list*/
/*.el-table--small*/
/*th,*/
/*.page-log_view_audit*/
/*.page-log_view_audit_box*/
/*.list*/
/*.el-table--small*/
/*td {*/
/*  background: #fff;*/
/*  !*text-align: center;*!*/
/*}*/

.page-log_view_audit .page-log_view_audit_box .list .list_pagination {
  margin: 20px;
}
.page-log_view_audit .page-log_view_audit_box .list .app-table .label_p {
  margin-top: 15px;
  float: left;
  font-size: 18px;
  height: 35px;
  line-height: 35px;
  text-align: left;
}
.researchsmart{
  margin-top: 10px;
  background-color: white;
  /*height: 200px;*/
  line-height:60px;
  padding: 10px;
}
.select_statistics_type {
  padding: 10px 0px 10px 9px;
    /*width: 480px;*/
}
.fault_type{
  margin-right: 15px;
}
.listPage{
  text-align: center;
  margin-top: 15px;
  margin-bottom: 20px;
}
.listDiv{
  background-color: white;
  margin-top: 10px;

}
.listDiv_table{

  margin:auto;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.jsonViewStyle{
width: 1000px;
}

/*需要给显示的tips设置一个宽度*/
.el-tooltip__popper {
  max-width:78%;
  overflow: scroll;
  max-height: 100px;
}

</style>

