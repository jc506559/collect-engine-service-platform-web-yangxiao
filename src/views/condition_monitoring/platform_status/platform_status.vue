<!-- 平台状态：使用平台推送给总线的内容进行展示 -->
<template>
  <div id="printMe">
  <div class="page-platform_status">
    <div class="page-platform_status_box">
      <div class="title"><i class="icon iconfont icon-jiankong title_i" ></i>平台状态
        <el-button style="float: right;" @click="refresh" icon="el-icon-refresh"></el-button>
      </div>
      <div class="list">
        <el-row :gutter="4">
          <el-col :span="6">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <p class="title2">平台基本运行状态</p>
              <div class="statusInfo">
                <el-button style="float:right;margin-top: 38px" type="text" @click="downloadExcel">下载报表</el-button>
                <img src="../../../assets/images/dot.png" width="40" height="40" class="platform_run">
                <p class="status_value">正常</p>
              </div>
              </div>
              <div>
<!--                <p class="turn_on_time"><span class="span_name">平台运行时间:</span><span class="span_value">{{ platformRunningTime }}</span></p>-->
              </div>
              <div class="text item" v-loading="platformBasisLoading">
                <p><span class="span_name">平台最新启动时间:</span><span class="span_value">{{ platformNoFaultRunTime }}</span></p>
                <p><span class="span_name">平台在线运行时间:</span><span class="span_value">{{ platformRunningTime }}</span></p>
                <p><span class="span_name">平台已注册引擎数量:</span><span class="span_value">{{ joinEngineCount }}</span></p>
                <p><span class="span_name">平台运行中引擎数量:</span><span class="span_value">{{ runningEngineCount }}</span></p>
                <p><span class="span_name">平台已接入数据类型数量:</span>
                  <el-button class="basisStatusButton" type="text" @click="openDataTypeInfoDialog">{{ dataTypeCount }}</el-button></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card v-if="!platformMonitorLoading" class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span class="title2">平台数据量统计(当日)</span>
                <div class="itemTitle">
                  <span><span class="title3">{{ itemTitleText}}</span></span>
                  <span><span class="title3">{{ itemTitle }}</span></span>
                </div>
<!--                新增下载数据量按钮及条件弹框-->
                <el-button style="float: right; padding: 3px 0;margin-top: 10px" type="text" @click="dialogFormVisible = true">下载数据量</el-button>
                <el-dialog title="数据量统计条件" :visible.sync="dialogFormVisible" :append-to-body="true">
                  <div>
                    <el-form :model="downloadForm" :rules="rules" ref="downloadForm" >
                      <el-form-item label="请选择引擎" prop="selectEngine">
                        <el-select v-model="downloadForm.selectEngine" class="fault_type" placeholder="请选择" >
                          <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="数据量统计时间" prop="time">
<!--                        default-time需要确认-->
                          <el-date-picker  ref="getSmmartPicker"
                                          v-model="downloadForm.time"
                                          type="daterange"
                                          start-placeholder="开始时间"
                                          end-placeholder="结束时间"
                                          format="yyyy-MM-dd"
                                          value-format="yyyy-MM-dd "
                                          :picker-options="pickerOptions">
                          </el-date-picker>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div slot="footer" class="dialog-footer" >
                    <el-button @click="cancel('downloadForm')">取 消</el-button>
                    <el-button type="primary" @click="saveForm">
                      下载数据量
                    </el-button>
                  </div>
                </el-dialog>
              </div>
            <el-carousel indicator-position="none" height="148px" @change="changeCarousel">
              <el-carousel-item v-for="item in items" :key="item.title">
                  <div class="monitor_box">
                    <p><span class="span_name">累计接收数据量:</span><span class="span_value">{{ item.platformDataCount.累计接收数据量 }}</span></p>
                    <p><span class="span_name">累计过滤数据量:</span><span class="span_value">{{ item.platformDataCount.累计过滤数据量 }}</span></p>
                    <p><span class="span_name">累计发送成功数据量:</span><span class="span_value">{{ item.platformDataCount.累计发送成功数据量 }}</span></p>
                    <p><span class="span_name">累计发送失败数据量:</span><span class="span_value">{{ item.platformDataCount.累计发送失败数据量 }}</span>
                    <p><span class="span_name">累计等待发送数据量:</span><span class="span_value">{{ item.platformDataCount.累计等待发送数据量 }}</span></p>
                  </div>
              </el-carousel-item>
            </el-carousel>
            </el-card>
            <el-card v-if="platformMonitorLoading" class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span class="title2">平台数据量统计(当日)</span>
              </div>
              <div class="monitor_box" v-loading="true">
                <p><span class="span_name">累计接收数据量:</span></p>
                <p><span class="span_name">累计过滤数据量:</span></p>
                <p><span class="span_name">累计发送成功数据量:</span></p>
                <p><span class="span_name">累计发送失败数据量:</span></p>
                <p><span class="span_name">累计等待发送数据量:</span></p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="2">
            <div class="platform_status_hover" @click="selectPlatformAlarms">
              <el-card class="platform_status_box-card" shadow="never">
                <div v-if="!platformStatisticsLoading">
                <div v-if="PlatformAlarmsTotal == 0">
                  <img src="../../../assets/images/status_normal.png" class="platform_status_image">
                  <div class="platform_status_value_normal">
                    暂无异常
                  </div>
                </div>
                <div v-else>
                  <img src="../../../assets/images/status_warn.png" class="platform_status_image">
                  <div class="platform_status_value_warn">
                    异常统计
                  </div>
                  <p class="platform_status_value_count">({{ PlatformAlarmsTotal }})</p>
                </div>
                </div>
                <div v-else>
                  <div class="platform_status_value_loading">
                    正在加载
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="4">
          <el-col :span="24">
            <el-card class="box-card2" v-loading="platformStatisticsEchartLoading" shadow="never">
<!--              <p class="label_p">统计信息</p>-->
              <div class="select_statistics_type">
                <span>选择引擎</span>
                <el-select v-model="searchData.engine" class="fault_type" placeholder="请选择采集引擎" @change="engineChange">
                  <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value"></el-option>
                </el-select>
                <el-select v-model="searchData.engineDataType" class="fault_type" placeholder="请选择数据类型" @change="engineDataTypeChange">
                  <el-option v-for="dataType in engineDataType" :key="dataType.value" :label="dataType.label" :value="dataType.value"></el-option>
                </el-select>
                <el-radio-group v-model="selectStatisticsType" @change="getChartStatistics">
                  <el-radio :label="1">近12小时</el-radio>
                  <el-radio :label="2">近三天</el-radio>
                  <el-radio :label="3">近一个月</el-radio>
                </el-radio-group>
              </div>
              <el-col :span="24">
                <el-row :gutter="4">
                  <el-col :span="18">
                    <div class="statistics_echart">
                      <ve-line :data="statisticsData" :extend="statisticsExtend" :data-empty="statisticsEmpty"></ve-line>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="conclusion">
                      <p class="conclusion_label_p">累计数据量</p>
                      <ve-histogram :data="statisticsData2" :extend="statisticsExtend2" :data-empty="statisticsEmpty2"></ve-histogram>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card2" shadow="never">
              <div v-loading="histogramLoading">
                <ve-histogram :data="dataCount" :series="receiveCountSeries" :extend="extend" :data-empty="dataEmpty">
                </ve-histogram>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card2" shadow="never">
              <div v-loading="histogramLoading">
                <ve-histogram :data="dataCount" :series="sendBusCountSeries" :extend="extend" :data-empty="dataEmpty"></ve-histogram>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!--平台告警 -->
        <el-card class="box-card2" shadow="never">
          <p class="label_p">异常统计
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              content="平台监控到的引擎的异常信息">
              <img src="../../../assets/images/hint.png" slot="reference" height="20" width="20">
            </el-popover>
          </p>
          <div class="app-table">
            <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="newPlatformAlarmsData" v-loading="platformStatisticsLoading" id="platformAlarms">
              <el-table-column label="异常等级" prop="level" align="center" width="200">
              </el-table-column>
              <el-table-column label="异常类型" prop="type" align="center" width="200">
              </el-table-column>
              <el-table-column label="异常内容" prop="detail" align="center">
              </el-table-column>
              <el-table-column label="是否提交至总线" prop="submit_status" align="center" width="250">
                <template slot-scope="scope">
                  <div v-if="scope.row.submit_status == 1">是</div>
                  <div v-if="scope.row.submit_status == 0">否</div>
                </template>
              </el-table-column>
              <el-table-column label="记录时间" prop="time" align="center" width="250" sortable>
              </el-table-column>
              <template slot="empty">
                暂无异常统计数据
              </template>
            </el-table>
            <div class="app-pagination">
              <el-pagination
                :total="PlatformAlarmsTotal"
                :page-size="platformAlarmsPageSize"
                :page-sizes="platformAlarmsPageSizes"
                :current-page="platformAlarmsCurrentPage"
                @size-change="platformAlarmsHandleSizeChange"
                @current-change="platformAlarmsHandleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
          </div>
        </el-card>
        <!-- 查看数据类型信息的弹窗 -->
        <el-dialog width="700px" class="quota_type-edit-dialog" :append-to-body="true"
                   :before-close="closeDialog" title="数据类型详细信息" :visible.sync="dataTypeInfoVisible">
          <el-table :data="dataTypeInfoData">
            <el-table-column label="数据类型" prop="data_type">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.data_type == 1">网页</el-tag>
                <el-tag v-if="scope.row.data_type == 2">文件</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="类型名称" prop="name">
            </el-table-column>
            <el-table-column label="创建时间" prop="storage_time">
              <template slot-scope="scope">
                {{ scope.row.storage_time.substring(0, 19) }}
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dataTypeInfoVisible = false">关闭</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import CsvExportor from 'csv-exportor';
  import permission from '@/components/mixin/permission';
  import axios from 'axios';
  import XLSX, {utils} from 'xlsx';
  import XLXSStyle from 'xlsx-style';
  import engine_manage_engine_info from "@/views/engine_manage/engine_manage_engine_info/engine_manage_engine_info";
  export default {
      mixins: [permission],
      name: 'platform_status',
      inject: ['reload'],
      data() {
          return {
            //必填项
            rules: {
              selectEngine: [{required: true, message: '请选择引擎', trigger: 'change' }],
              time: [{required: true, message: '请选择时间范围', trigger: 'change'}],
            },
            min:'', // 选中时间段后，靠前的时间
          pickerOptions: {
              onPick: ({maxDate, minDate}) => {
                  this.min = minDate && minDate.getTime() // 将第一个选中的日期赋值给 this.min
                  if (maxDate) {
                  this.min = '';
                }
              },
              disabledDate: time => {
                  let thirty = 30 * 24 * 60 * 60 * 1000 // 30天的时间戳
                  // 如果开始日期已选中，则返回需求中需要禁用的时间
                  if (this.min !== '') {
                  // 大于选中时间后30天 || 小于选中时间后30天 || 大于今天 的所有日期都禁用
                     return time.getTime() > (this.min + thirty) || time.getTime() < (this.min - thirty) || time.getTime() > Date.now()- 8.64e7
                  } else {
                  // 什么都没选，只禁用大于今天的所有日期
                      return time.getTime() > Date.now()- 8.64e7
                  }
              },
              shortcuts: [
                {
                  text: '今天',
                  onClick(picker) {
                    picker.$emit('pick', new Date());
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
              }, {
                  text: '最近一个月',
                  onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                  }
              }],
          },
                //新增下载数据量弹框 form表单
              downloadForm:{
                //新增下载数据量弹框 搜索引擎
                selectEngine:'',
                //新增下载数据量弹框 时间
                time:'',
                // start:time[0],
                // end:time[1],
                Engines:[],
              },
            //新增 显示隐藏控制弹框
              dialogFormVisible:false,
              htmlTitle: '页面',
              statisticsExtend: {
                  xAxis: {
                    axisLabel: {
                        showMaxLabel: true,
                    }
                  },
                  grid: {
                      x: "5%",
                      x2: "5%",
                      y2: "5%"
                  },
                  legend: {
                      padding: [30, 0, 0, 0]
                  }
              },
              statisticsExtend2: {
                  legend: {
                      show: false
                  },
                  xAxis: {
                      axisLabel: {
                          interval: 0,
                          rotate: 20,
                          show: true,
                      },
                      //控制x轴文字的偏移量
                      offset: 5,
                  },
                  grid: {
                      x: "5%"
                  },
                  tooltip: {
                      trigger: 'item',
                      formatter: "{b} : {c}"
                  },
                  series: {
                      barWidth: '30%',
                      label: {
                          normal: {
                              show: true,
                              position: 'top',       //  位置设为top
                          }
                      },
                  }
              },
              extend: {
                  legend: {
                      textStyle: {
                          fontSize: 12
                      }
                  },
                  dataZoom: [{
                      type: 'slider',
                      show: true,
                      realtime: true,
                      start: 0,
                      end: 100,
                  }],
                  xAxis: {
                      //控制x轴文字的偏移量
                      offset: 5,
                      grid: {}
                  },
                  grid: {},
                  yAxis: {
                      minInterval: 1,
                  }
              },
              receiveCountSeries: [
                  {
                      name: "平台当日接收数据量",
                      type: "bar",
                      barWidth: "10%",
                      data: [],
                      label: {show: true, position: "top"}
                  },
              ],
              sendBusCountSeries: [
                  {
                      name: "平台当日发送成功数据量",
                      type: "bar",
                      barWidth: "10%",
                      data: [],
                      stack: 'one',
                  },
                  {
                      name: "平台当日发送失败数据量",
                      type: "bar",
                      barWidth: "10%",
                      data: [],
                      stack: 'one',
                  },
                  {
                      name: "平台当日等待发送数据量",
                      type: "bar",
                      barWidth: "10%",
                      data: [],
                      stack: 'one',
                  },
                  {
                      name: "平台当日过滤数据量",
                      type: "bar",
                      barWidth: "10%",
                      data: [],
                      stack: 'one',
                  },
                  {
                      name: '总数',
                      type: 'bar',
                      barGap: '-100%',         // 左移100%，stack不再与上面两个在一列
                      barWidth: '10%',
                      label: {
                          normal: {
                              show: true,
                              position: 'top',       //  位置设为top
                              formatter: '{c}',
                              textStyle: {color: '#19d4ae'}
                          }
                      },
                      itemStyle: {
                          normal: {
                              color: 'rgba(128, 128, 128, 0)'    // 仍为透明
                          }
                      },
                      data: []
                  }
              ],
              //当日累计接收图表数据
              dataCount: {
                  columns: ['引擎名称', '平台当日接收数据量', '平台当日过滤数据量', '平台当日发送成功数据量', '平台当日发送失败数据量', '平台当日等待发送数据量',],
                  rows: [
                      // { '引擎名称': '境外网站采集引擎-xxxx' },
                  ]
              },
              //统计图表数据
              statisticsData: {
                  columns: ['日期', '平台接收数据量', '平台过滤数据量', '平台发送成功数据量', '平台等待发送数据量', '平台发送失败数据量'],
                  rows: [
                      // { '引擎名称': '境外网站采集引擎-xxxx', '平台累计接收引擎回传数据量': 300, '平台累计发送至总线量': 200, '发送失败量': 50, '待发送量': 50},
                      // { '引擎名称': '境外网站采集引擎-xxxx1', '平台累计接收引擎回传数据量': 400, '平台累计发送至总线量': 100, '发送失败量': 300, '待发送量': 0},
                  ]
              },
              statisticsData2: {
                  columns: ['字段名', '数量'],
                  rows: []
              },
              dataEmpty: false,
              histogramLoading: true,
              platformBasisLoading: true,
              platformMonitorLoading: true,
              //用于判断图表的Loading样式
              nowDataTypeCount: 0,
              //用于临时存储引擎名称和ID
              nowEngineName: '',
              nowEngineId: '',
              //接入引擎数量
              joinEngineCount: '',
              //运行引擎数量
              runningEngineCount: '',
              //接入数据类型数量
              dataTypeCount: null,
              //平台运行时间
              platformRunningTime: '',
              //平台最新接入时间
              platformNoFaultRunTime: '',
              //当日平台累计数据
              platformDataCount: {},
              //平台异常统计
              platformAlarms: [],
              time: [],
              //列表相关
              loading: false,
              currentPage: 1,
              pageSize: 20,
              total: 0,
              pageSizes: [20, 50, 100, 200],
              platformData: [],
              //用于提供打印报表所需数据信息
              reportFormData: {
                  engineStatus: [
                      // {
                      //     engine_name: 'xxx', engine_id: 'xxx', engine_provider: 'xxx',engine_data_total: 'xxx' ,engine_type: 'xxx',
                      //     engine_last_verify_time: 'xxx', engine_status: 'xxx', engine_last_update_time: 'xxx',
                      //     engine_accumulative_online_time: 'xxx', 累计发送成功量: 'xxx', 累计采集数据量: 'xxx', 待发送数据量: 'xxx',
                      //     当前运行任务量: 'xxx', 历史采集失败次数: 'xxx'
                      // }
                  ],
              },
              reportFormDialog: false,
              reportFormName: "",
              //平台异常统计相关
              newPlatformAlarmsData: [],
              platformStatisticsLoading: true,
              PlatformAlarmsTotal: 0,
              platformAlarmsPageSize: 10,
              platformAlarmsPageSizes: [10, 20, 50, 100],
              platformAlarmsCurrentPage: 1,
              //多选按钮组
              selectStatisticsType: 2,
              //数据量变化统计图表相关
              where: [],
              limit: [],
              platformStatisticsEchartLoading: false,
              searchData: {
                  engine: '',
                  engineDataType: ''
              },
              engines: [],
              engineDataType: [],
              statisticsEmpty: false,
              statisticsEmpty2: false,
              //查看数据类型弹窗相关
              dataTypeInfoVisible: false,
              dataTypeInfoData: [],
              openDataTypeInfoDialogLoading: false,
              //走马灯
              items: [
                  // {
                  //     title: "123",
                  //     platformDataCount: {
                  //         累计接收数据量: 10,
                  //         累计过滤数据量: 20,
                  //         累计发送成功数据量: 30,
                  //         累计发送失败数据量: 40,
                  //         累计等待发送数据量: 50
                  //     }
                  // },
              ],
              itemTitle: '',
              itemTitleText: '',
              dayTime:[],
          }
      },
      methods: {
        //局部刷新页面
        refresh() {
          this.reload();
        },
        // 导出报表为Excel表格
        downloadExcel() {
          var date = new Date();
          let aoa = [
            ['引擎状态信息', null],
          ];
          let list = [];
          for (let i = 0; i < this.reportFormData.engineStatus.length; i++) {
            let aob = [
              ['引擎名称', this.reportFormData.engineStatus[i].engine_name],
              ['引擎ID', this.reportFormData.engineStatus[i].engine_id],
              ['供应商', this.reportFormData.engineStatus[i].engine_provider],
              ['引擎类型', this.reportFormData.engineStatus[i].engine_type],
              ['数据类型个数', this.reportFormData.engineStatus[i].engine_data_total],
              ['最新认证时间', this.reportFormData.engineStatus[i].engine_last_verify_time],
              ['是否启动', this.reportFormData.engineStatus[i].engine_status],
              ['最近接入时间', this.reportFormData.engineStatus[i].engine_last_update_time],
              ['累计在线时长', this.reportFormData.engineStatus[i].engine_accumulative_online_time],
              ['累计发送成功量', this.reportFormData.engineStatus[i].累计发送成功量],
              ['累计采集数据量', this.reportFormData.engineStatus[i].累计采集数据量],
              ['待发送数据量', this.reportFormData.engineStatus[i].待发送数据量],
              ['当前运行任务量', this.reportFormData.engineStatus[i].当前运行任务量],
              ['历史采集失败次数', this.reportFormData.engineStatus[i].历史采集失败次数],
              [null, null]
            ];
            aoa.push.apply(aoa, aob);
          }
          let aoc = [
            ['平台状态信息', null],
            ['平台最新启动时间', this.platformNoFaultRunTime]
              ['平台运行时间', this.platformRunningTime],
            ['平台已注册引擎数量', this.joinEngineCount],
            ['平台正在运行引擎数量', this.runningEngineCount],
            ['平台已接入数据类型数量', this.dataTypeCount],
          ];
          aoa.push.apply(aoa, aoc);
          this.items.forEach(item => {
            let aod = [
              ["平台当日数据量统计" + " " + item.title, null],
              ["当日累计接收数据量", item.platformDataCount.累计接收数据量],
              ['当日累计过滤数据量', item.platformDataCount.累计过滤数据量],
              ['当日累计发送成功数据量', item.platformDataCount.累计发送成功数据量],
              ['当日累计发送失败数据量', item.platformDataCount.累计发送失败数据量],
              ['当日累计等待发送数据量', item.platformDataCount.累计等待发送数据量],
            ];
            aoa.push.apply(aoa, aod)
          });
          let aoe = [
            ["日期", date]
          ];
          aoa.push.apply(aoa, aoe);
          let sheet = utils.aoa_to_sheet(aoa);
          sheet['!merges'] = [
            {s: {r: 0, c: 0}, e: {r: 0, c: 1}},
          ];
          sheet['!cols'] = [
            {wch: 40},
            {wch: 40},
          ];
          //单元格修改格式测试 无效
          // sheet["A1"].s = {
          //     alignment: {horizontal: "left", vertical: "left", wrap_text: true},
          // };
          // sheet["A5"].s = {
          //     font: {sz: 13, bold: true,},
          //     alignment: {
          //         horizontal: "center", vertical: "center", wrap_text: true
          //     }
          // };
          // sheet["B7"].s = {
          //     alignment: {horizontal: "left", vertical: "left", wrap_text: true},
          // };
          let time = this.$nowYearMonthDay();
          this.openDownloadDialog(this.sheet2blob(sheet), `互联网信息采集平台-${time}.xlsx`);
          //被注解的代码用于设置自定义表名
          // this.reportFormDialog = false;
          // this.reportFormName = "";
        },
        sheet2blob(sheet, sheetName) {
          sheetName = sheetName || 'sheet1';
          var workbook = {
            SheetNames: [sheetName],
            Sheets: {}
          };
          workbook.Sheets[sheetName] = sheet;
          // 生成excel的配置项
          var wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
          };
          var wbout = XLSX.write(workbook, wopts);
          var blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});

          // 字符串转ArrayBuffer
          function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
          }

          return blob;
        },
        openDownloadDialog(url, saveName) {
          if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
          }
          var aLink = document.createElement('a');
          aLink.href = url;
          aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
          var event;
          if (window.MouseEvent) event = new MouseEvent('click');
          else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          }
          aLink.dispatchEvent(event);
        },
        //可自定义名称的报表
        // openReportFormDialog() {
        //   this.reportFormDialog = true;
        // },
        // closeReportFormDialog() {
        //   this.reportFormDialog = false;
        //   this.reportFormName = "";
        // },
        timeFormat() {
          var timestamp = Date.parse(new Date());
          let date = new Date(parseInt(timestamp)); // 时间戳为10位需乘1000，为13位则不用
          let Y = date.getFullYear(); // 年
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); // 月
          let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''; // 日
          let D1 = D - 1;
          let D2 = D - 2;
          let D3 = D - 3;
          let D4 = D - 4;
          let D5 = D - 5;
          let D6 = D - 6;
          let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 时
          let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 分
          let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 秒
          this.time.push(Y + '-' + M + '-' + D6);
          this.time.push(Y + '-' + M + '-' + D5);
          this.time.push(Y + '-' + M + '-' + D4);
          this.time.push(Y + '-' + M + '-' + D3);
          this.time.push(Y + '-' + M + '-' + D2);
          this.time.push(Y + '-' + M + '-' + D1);
          this.time.push(Y + '-' + M + '-' + D);
          this.joinEngine();
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
          var hours = my_time / 1000 / 60 / 60;
          var hoursRound = Math.floor(hours);
          var minutes = my_time / 1000 / 60 - (60 * hoursRound);
          var minutesRound = Math.floor(minutes);
          this.platformRunningTime = hoursRound + '小时' + minutesRound + '分';
        },
        //平台告警修改分页数量
        platformAlarmsHandleSizeChange(val) {
          this.platformAlarmsPageSize = val;
          this.newPlatformAlarmsData = this.platformAlarms.slice((this.platformAlarmsCurrentPage - 1) * this.platformAlarmsPageSize, this.platformAlarmsCurrentPage * this.platformAlarmsPageSize)
        },
        //平台告警修改分页
        platformAlarmsHandleCurrentChange(val) {
          this.platformAlarmsCurrentPage = val;
          this.newPlatformAlarmsData = this.platformAlarms.slice((this.platformAlarmsCurrentPage - 1) * this.platformAlarmsPageSize, this.platformAlarmsCurrentPage * this.platformAlarmsPageSize);
        },
        //打开数据类型详细信息弹窗
        openDataTypeInfoDialog() {
          this.openDataTypeInfoDialogLoading = true;
          this.$post('/action', {
            data: {
              "select": "crawl_engine_data_type",
              "where": ["enabled=1", "is_engine=1"]
            }
          }).then(data => {
            this.dataTypeInfoData = data;
            for (let i = 0; i < this.dataTypeInfoData.length; i++) {
              this.$post(`/unifiedQuery/DataType?code=${this.dataTypeInfoData[i].data_subtype}`).then(data => {
                this.dataTypeInfoData[i].name = data.name ? data.name : this.dataTypeInfoData[i].name;
                if (i = this.dataTypeInfoData.length - 1) {
                  this.dataTypeInfoVisible = true;
                  this.openDataTypeInfoDialogLoading = false;
                }
              }).catch(err => {
                try {
                  this.dataTypeInfoVisible = true;
                  this.openDataTypeInfoDialogLoading = false;
                } catch (e) {
                  this.$message.error({message: "获取数据类型详细信息失败！", type: "error"});
                }
              })
            }
          }).catch(data => {
            this.$message.error({message: "获取数据类型详细信息失败！", type: "error"})
          })
        },
        //切换跑马灯
        changeCarousel(index) {
          this.itemTitle = this.items[index].title;
          this.itemTitleText = this.items[index].titleText ? this.items[index].titleText : '';
        },
        //弹窗关闭
        closeDialog() {
          this.dataTypeInfoVisible = false;
        },
        // 获取接入引擎数量和正在运行引擎数量以及数据类型数量
        joinEngine() {
          this.$post('/action', {
            data: {
              sql: "select (select count(*) from crawl_engine where enabled=1) as joinEngineCount, (select count(*) from crawl_engine where status=1) as runningEngineCount, (select count(*) from crawl_engine_data_type where enabled=1) as dataTypeCount"
            }
          }).then(data => {
            if (typeof data != 'undefined') {
              this.dataTypeCount = data[0].dataTypeCount;
              this.joinEngineCount = data[0].joinEngineCount;
              this.runningEngineCount = data[0].runningEngineCount;
            }
          })
        },
        // 平台运行时间
        getPlatformRunningTime() {
          this.$post('/engine/platformElapsedTime'
          ).then(data => {
            if (typeof data != 'undefined') {
              this.platformBasisLoading = false;
              this.platformNoFaultRunTime = data.platformNoFaultRunTime == 0 ? '系统未启动' : this.$format("YYYY/MM/DD HH:mm:ss", new Date(data.platformNoFaultRunTime));
              this.formatDuring(data.platformElapsedTime);
            }
          })
        },
        platformStatistics(where) {
          let this_ = this;
          return new Promise((resolve, reject) => {
            this_.$post('/action', {
              data: {
                "select": "crawl_platform_data_statistics",
                "where": where,
                "order": ["time desc"]
              }
            }).then(data => {
              resolve(data);
            }).catch(error => {
              reject();
            })
          })
        },
        engineChange() {
          this.engineDataType = [];
          if (this.searchData.engine && this.searchData.engine != '全部') {
            this.$post('/action', {
              data: {
                "select": "crawl_engine_data_type",
                "where": ["engine_id=" + this.searchData.engine, "enabled=1", "is_engine=1"]
              }
            }).then(data => {
              if (data.length != 0) {
                this.engineDataType.push({value: '全部', label: '全部'});
                data.forEach(val => {
                  let obj = {};
                  obj.value = val.id;
                  obj.label = val.name;
                  this.engineDataType.push(obj)
                });
                this.searchData.engineDataType = '全部';
              }
            });
          } else {
            this.searchData.engineDataType = ''
          }
          this.getChartStatistics();
        },
        engineDataTypeChange() {
          this.getChartStatistics();
        },
        //获取统计图表信息
        getChartStatistics() {
          this.platformStatisticsEchartLoading = true;
          this.statisticsData.rows = [];
          this.statisticsData2.rows = [];
          this.where = [];
          let date = [];
          date.push(new Date());
          //查询条件
          let and = '';
          if (this.searchData.engine && this.searchData.engine != '全部') {
            this.where.push("engine_id=" + this.searchData.engine);
            and += `and engine_id='${this.searchData.engine}'`;
          }
          if (this.searchData.engineDataType && this.searchData.engineDataType != '全部') {
            this.where.push("data_type_id=" + this.searchData.engineDataType);
            and += `and data_type_id='${this.searchData.engineDataType}'`;
          }
          if (this.selectStatisticsType == 1) {
            this.where.push("type=1");
            date.push(new Date(new Date().getTime() - 3600 * 12 * 1000));
            this.where.push(`time=${date[1]}~${date[0]}`);
            and += `and time>'${this.$format("YYYY-MM-DD HH:mm:ss", date[1])}' and time < '${this.$format("YYYY-MM-DD HH:mm:ss", date[0])}'`
          } else if (this.selectStatisticsType == 2) {
            this.where.push("type=2");
            date.push(new Date(new Date().getTime() - 3600 * 3 * 24 * 1000));
            this.where.push(`time=${date[1]}~${date[0]}`);
            and += `and time>'${this.$format("YYYY-MM-DD HH:mm:ss", date[1])}' and time < '${this.$format("YYYY-MM-DD HH:mm:ss", date[0])}'`
          } else if (this.selectStatisticsType == 3) {
            this.where.push("type=3");
            date.push(new Date(new Date().getTime() - 3600 * 30 * 24 * 1000));
            this.where.push(`time=${date[1]}~${date[0]}`);
            and += `and time>'${this.$format("YYYY-MM-DD HH:mm:ss", date[1])}' and time < '${this.$format("YYYY-MM-DD HH:mm:ss", date[0])}'`
          }
          let ptbglWhere = this.where.concat();
          let ptdfsWhere = this.where.concat();
          let ptljfsWhere = this.where.concat();
          let fssbWhere = this.where.concat();
          let sbdcfWhere = this.where.concat();
          ptbglWhere.push("send_status=-1");
          ptdfsWhere.push("send_status=0");
          ptljfsWhere.push("send_status=1");
          fssbWhere.push("send_status=2");
          sbdcfWhere.push("send_status=3");
          this.$post('/action', {
            data: {
              sql: `select IFNULL((select SUM(count) from crawl_platform_data_statistics where send_status = -1 and type = ${this.selectStatisticsType} ${and} order by time desc), 0)as '平台过滤数据量', IFNULL((select SUM(count) from crawl_platform_data_statistics where send_status = 0 and type = ${this.selectStatisticsType} ${and} order by time desc), 0) as '平台等待发送数据量', IFNULL((select SUM(count) from crawl_platform_data_statistics where send_status = 1 and type = ${this.selectStatisticsType} ${and} order by time desc), 0) as '平台发送成功数据量', IFNULL((select SUM(count) from crawl_platform_data_statistics where (send_status = 2  or send_status = 3) and type = ${this.selectStatisticsType} ${and} order by time desc), 0) as '平台发送失败数据量'`
            }
          }).then(data => {
            let ptgl = data[0].平台过滤数据量;
            let ptfscg = data[0].平台发送成功数据量;
            let ptddfs = data[0].平台等待发送数据量;
            let ptfssb = data[0].平台发送失败数据量;
            let ptjs = ptgl + ptfscg + ptddfs + ptfssb;
            this.statisticsData2.rows.push({'字段名': '平台接收数据量', '数量': ptjs});
            this.statisticsData2.rows.push({'字段名': '平台过滤数据量', '数量': ptgl});
            this.statisticsData2.rows.push({'字段名': '平台发送成功数据量', '数量': ptfscg});
            this.statisticsData2.rows.push({'字段名': '平台等待发送数据量', '数量': ptddfs});
            this.statisticsData2.rows.push({'字段名': '平台发送失败数据量', '数量': ptfssb});
            this.statisticsEmpty2 = false;
          }).catch(error => {
            this.statisticsEmpty2 = true;
          });
          Promise.all([this.platformStatistics(ptbglWhere), this.platformStatistics(ptdfsWhere), this.platformStatistics(ptljfsWhere), this.platformStatistics(fssbWhere), this.platformStatistics(sbdcfWhere)]).then(result => {
            //根据时间分类
            let data = [];
            //遍历整个result获得所有类型的数组
            result.map(mapArray => {
              //遍历每个类型的数组
              mapArray.map(mapItem => {
                if (data.length == 0) {
                  //根据send_status分类
                  if (mapItem.send_status == -1) {
                    data.push({
                      time: mapItem.time,
                      ptbgl: [mapItem],
                      ptdfs: [],
                      ptljfs: [],
                      fssb: [],
                      sbdfs: []
                    })
                  }
                  if (mapItem.send_status == 0) {
                    data.push({
                      time: mapItem.time,
                      ptbgl: [],
                      ptdfs: [mapItem],
                      ptljfs: [],
                      fssb: [],
                      sbdfs: []
                    })
                  }
                  if (mapItem.send_status == 1) {
                    data.push({
                      time: mapItem.time,
                      ptbgl: [],
                      ptdfs: [],
                      ptljfs: [mapItem],
                      fssb: [],
                      sbdfs: []
                    })
                  }
                  if (mapItem.send_status == 2) {
                    data.push({
                      time: mapItem.time,
                      ptbgl: [],
                      ptdfs: [],
                      ptljfs: [],
                      fssb: [mapItem],
                      sbdfs: []
                    })
                  }
                  if (mapItem.send_status == 3) {
                    data.push({
                      time: mapItem.time,
                      ptbgl: [],
                      ptdfs: [],
                      ptljfs: [],
                      fssb: [],
                      sbdfs: [mapItem]
                    })
                  }
                } else {
                  let res = data.some(item => {//判断相同日期，有就添加到当前项
                    if (item.time == mapItem.time) {
                      if (mapItem.send_status == -1) {
                        item.ptbgl.push(mapItem);
                      }
                      if (mapItem.send_status == 0) {
                        item.ptdfs.push(mapItem);
                      }
                      if (mapItem.send_status == 1) {
                        item.ptljfs.push(mapItem);
                      }
                      if (mapItem.send_status == 2) {
                        item.fssb.push(mapItem);
                      }
                      if (mapItem.send_status == 3) {
                        item.sbdfs.push(mapItem);
                      }
                      return true
                    }
                  });
                  if (!res) {//如果没找相同日期添加一个新对象
                    if (mapItem.send_status == -1) {
                      data.push({
                        time: mapItem.time,
                        ptbgl: [mapItem],
                        ptdfs: [],
                        ptljfs: [],
                        fssb: [],
                        sbdfs: []
                      })
                    }
                    if (mapItem.send_status == 0) {
                      data.push({
                        time: mapItem.time,
                        ptbgl: [],
                        ptdfs: [mapItem],
                        ptljfs: [],
                        fssb: [],
                        sbdfs: []
                      })
                    }
                    if (mapItem.send_status == 1) {
                      data.push({
                        time: mapItem.time,
                        ptbgl: [],
                        ptdfs: [],
                        ptljfs: [mapItem],
                        fssb: [],
                        sbdfs: []
                      })
                    }
                    if (mapItem.send_status == 2) {
                      data.push({
                        time: mapItem.time,
                        ptbgl: [],
                        ptdfs: [],
                        ptljfs: [],
                        fssb: [mapItem],
                        sbdfs: []
                      })
                    }
                    if (mapItem.send_status == 3) {
                      data.push({
                        time: mapItem.time,
                        ptbgl: [],
                        ptdfs: [],
                        ptljfs: [],
                        fssb: [],
                        sbdfs: [mapItem]
                      })
                    }
                  }
                }
              })
            });
            if (data.length == 0) {
              this.statisticsEmpty = true;
            } else {
              for (let i = data.length - 1; i >= 0; i--) {
                let obj = {};
                obj.日期 = data[i].time.substring(0, 19);
                obj.平台过滤数据量 = 0;
                obj.平台接收数据量 = 0;
                obj.平台发送成功数据量 = 0;
                obj.平台等待发送数据量 = 0;
                obj.平台发送失败数据量 = 0;
                data[i].ptbgl.forEach(val => {
                  obj.平台过滤数据量 += val.count;
                });
                data[i].ptljfs.forEach(val => {
                  obj.平台发送成功数据量 += val.count;
                });
                data[i].ptdfs.forEach(val => {
                  obj.平台等待发送数据量 += val.count;
                });
                data[i].fssb.forEach(val => {
                  obj.平台发送失败数据量 += val.count;
                });
                data[i].sbdfs.forEach(val => {
                  obj.平台发送失败数据量 += val.count;
                });
                obj.平台接收数据量 = obj.平台过滤数据量 + obj.平台等待发送数据量 + obj.平台发送成功数据量 + obj.平台发送失败数据量;
                this.statisticsData.rows.push(obj)
              }
              this.statisticsEmpty = false;
            }
            this.platformStatisticsEchartLoading = false;
          }).catch(err => {
            this.platformStatisticsEchartLoading = false;
            this.statisticsEmpty = true;
          })
        },
        // 获取引擎信息
        newTest() {
          this.$post('/action', {
            data: {
              "select": "crawl_engine_data_type",
              "join": "crawl_engine",
              "where": ["crawl_engine.enabled=1", "crawl_engine_data_type.enabled=1"]
            }
          }).then(engineData => {
            if (Array.isArray(engineData) && engineData.length != 0) {
              for (let i = 0; i < engineData.length; i++) {
                this.$post(`/unifiedQuery/DataType?code=${engineData[i].data_subtype}`).then(data => {
                  let obj = {};
                  obj.引擎名称 = data.name ? engineData[i].engine_id__crawl_engine.engine_name + "\n" + data.name : engineData[i].engine_id__crawl_engine.engine_name + "\n" + engineData[i].name;
                  this.dataCount.rows.push(obj);
                  this.getEngineStatusData(engineData[i].engine_id__crawl_engine.id, engineData[i].id, i, engineData.length, data.name, engineData[i].engine_id__crawl_engine.engine_name)
                }).catch(err => {
                  try {
                    let obj = {};
                    obj.引擎名称 = engineData[i].engine_id__crawl_engine.engine_name + "\n" + engineData[i].name;
                    this.dataCount.rows.push(obj);
                    this.getEngineStatusData(engineData[i].engine_id__crawl_engine.id, engineData[i].id, i, engineData.length, engineData[i].name, engineData[i].engine_id__crawl_engine.engine_name)
                  } catch (e) {
                    this.$message.error({message: "获取当日统计信息失败！", type: "error"})
                  }

                })
              }
            } else {
              this.histogramLoading = false;
              this.dataEmpty = true;
            }
          })
        },
        //获取某个引擎的发送接收数据信息
        getEngineStatusData(engineId, engineTypeId, i, count, engineDataTypeName, engineName) {
          let today = this.getDay(0);
          this.$post('/action', {
            data: {
              sql: `select (select count(*) from crawl_task_result_text_meta where send_status=-1 and storage_time>'${today}' and data_type_id='${engineTypeId}') as '平台当日过滤数据量', (select count(*) from crawl_task_result_text_meta where (send_status=0 or send_status=3) and storage_time>'${today}' and data_type_id='${engineTypeId}') as '平台当日等待发送数据量', (select count(*) from crawl_task_result_text_meta where send_status=1 and storage_time>'${today}' and data_type_id='${engineTypeId}') as '平台当日发送成功数据量', (select count(*) from crawl_task_result_text_meta where send_status=2 and storage_time>'${today}' and data_type_id='${engineTypeId}') as '平台当日发送失败数据量', (select count(*) from crawl_task_result_text_meta where storage_time>'${today}' and data_type_id='${engineTypeId}') as '平台当日接收数据量'`
            }
          }).then(data => {
            if (Array.isArray(data) && data.length != 0) {
              this.receiveCountSeries[0].data.splice(i, 0, data[0].平台当日接收数据量);
              this.sendBusCountSeries[0].data.splice(i, 0, data[0].平台当日发送成功数据量);
              this.sendBusCountSeries[1].data.splice(i, 0, data[0].平台当日发送失败数据量);
              this.sendBusCountSeries[2].data.splice(i, 0, data[0].平台当日等待发送数据量);
              this.sendBusCountSeries[3].data.splice(i, 0, data[0].平台当日过滤数据量);
              //跑马灯
              let obj = {};
              obj.title = engineDataTypeName;
              obj.titleText = engineName;
              obj.platformDataCount = {};
              obj.platformDataCount.累计接收数据量 = data[0].平台当日接收数据量;
              obj.platformDataCount.累计过滤数据量 = data[0].平台当日过滤数据量;
              obj.platformDataCount.累计发送成功数据量 = data[0].平台当日发送成功数据量;
              obj.platformDataCount.累计发送失败数据量 = data[0].平台当日发送失败数据量;
              obj.platformDataCount.累计等待发送数据量 = data[0].平台当日等待发送数据量;
              this.items.push(obj)
            }
            this.nowDataTypeCount += 1;
            if (this.nowDataTypeCount == count) {
              for (let i = 0; i < count; i++) {
                this.sendBusCountSeries[4].data.push(this.sendBusCountSeries[0].data[i] + this.sendBusCountSeries[1].data[i] + this.sendBusCountSeries[2].data[i] + this.sendBusCountSeries[3].data[i])
              }
              this.histogramLoading = false;
            }
          }).catch(err => {
            this.$message.error({message: "获取数据类型统计信息失败", type: "error"});
            this.nowDataTypeCount += 1;
            if (this.nowDataTypeCount == count) {
              this.histogramLoading = false;
            }
          })
        },
        //获取发送总量
        getEngineTotal() {
          let today = this.getDay(0);
          this.$post('/action', {
            data: {
              sql: `select (select count(*) from crawl_task_result_text_meta where (send_status=0 or send_status=3) and storage_time>'${today}' ) as '累计等待发送数据量', (select count(*) from crawl_task_result_text_meta where send_status=1 and storage_time>'${today}') as '累计发送成功数据量', (select count(*) from crawl_task_result_text_meta where send_status=2 and storage_time>'${today}') as '累计发送失败数据量', (select count(*) from crawl_task_result_text_meta where storage_time>'${today}') as '累计接收数据量', (select count(*) from crawl_task_result_text_meta where send_status=-1 and storage_time>'${today}') as '累计过滤数据量'`
            }
          }).then(data => {
            // this.platformDataCount.累计接收数据量 = data[0].累计接收数据量;
            // this.platformDataCount.累计过滤数据量 = data[0].累计过滤数据量;
            // this.platformDataCount.累计发送成功数据量 = data[0].累计发送成功数据量;
            // this.platformDataCount.累计发送失败数据量 = data[0].累计发送失败数据量;
            // this.platformDataCount.累计等待发送数据量 = data[0].累计等待发送数据量;
            //跑马灯
            let obj = {};
            obj.title = '全部';
            obj.platformDataCount = {};
            obj.platformDataCount.累计接收数据量 = data[0].累计接收数据量;
            obj.platformDataCount.累计过滤数据量 = data[0].累计过滤数据量;
            obj.platformDataCount.累计发送成功数据量 = data[0].累计发送成功数据量;
            obj.platformDataCount.累计发送失败数据量 = data[0].累计发送失败数据量;
            obj.platformDataCount.累计等待发送数据量 = data[0].累计等待发送数据量;
            this.items.push(obj);
            this.itemTitle = obj.title;
            this.platformMonitorLoading = false;
            this.newTest();
          }).catch(error => {
            this.platformMonitorLoading = true;
            this.$message.error({message: "获取平台当日监控数据失败!", type: "error"})
          })
        },
        formatDuring2(my_time) {
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
          var hours = my_time / 1000 / 60 / 60;
          var hoursRound = Math.floor(hours);
          var minutes = my_time / 1000 / 60 - (60 * hoursRound);
          var minutesRound = Math.floor(minutes);
          var time = hoursRound + '小时' + minutesRound + '分';
          return time;
        },
        //时间戳转换为时间
        thisTimeFormat2(val) {
          let date = new Date(val);
          let Y = date.getFullYear(); // 年
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); // 月
          let D = date.getDate() < 10 ? '0' + date.getDate() + '' : date.getDate() + ''; // 日
          let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(); // 时
          let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(); // 分
          let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 秒
          date = Y + '-' + M + '-' + D + " " + h + ":" + m + ':' + s;
          return date;
        },
        // 用于获取相对于当天日期的日期
        getDay(day) {
          var today = new Date();
          var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
          today.setTime(targetday_milliseconds); //注意，这行是关键代码
          var tYear = today.getFullYear();
          var tMonth = today.getMonth();
          var tDate = today.getDate();
          tMonth = this.doHandleMonth(tMonth + 1);
          tDate = this.doHandleMonth(tDate);
          return tYear + "-" + tMonth + "-" + tDate;
        },
        doHandleMonth(month) {
          var m = month;
          if (month.toString().length == 1) {
            m = "0" + month;
          }
          return m;
        },
        //获取打印报表所需要的引擎信息
        getReportFormAsEngine() {
          //首先获取引擎列表
          this.$post('/action', {
            data: {
              "select": "crawl_engine",
              "where": ["enabled=1"]
            }
          }).then(data => {
            //将引擎列表遍历后把引擎名称和ID添加至报表信息中
            for (let i = 0; i < data.length; i++) {
              var obj = {};
              //引擎名称
              obj.engine_name = data[i].engine_name;
              //引擎ID
              obj.engine_id = data[i].id;
              //引擎最新认证时间
              if (data[i].last_verify_time) {
                obj.engine_last_verify_time = data[i].last_verify_time.substring(0, 19);
              } else {
                obj.engine_last_verify_time = "未认证"
              }
              //引擎供应商编号，用于回去引擎供应商信息
              obj.user_id = data[i].user_id;
              //判断印类型编号获取引擎数据类型
              if (data[i].engine_type == 0) {
                obj.engine_type = "普通引擎"
              } else {
                obj.engine_type = "基线引擎"
              }
              this.reportFormData.engineStatus.push(obj)
            }
            //根据报表中存放的遍历信息，查找引擎的相应数据
            for (let i = 0; i < this.reportFormData.engineStatus.length; i++) {
              //获取引擎供应商信息
              this.$post('/action', {
                data: {
                  "select": "sys_user",
                  "where": "id=" + this.reportFormData.engineStatus[i].user_id
                }
              }).then(data => {
                var obj = {};
                obj.engine_provider = data[0].name;
                this.reportFormData.engineStatus[i] = Object.assign(this.reportFormData.engineStatus[i], obj)
              });
              //获取引擎数据类型个数
              this.$post('/action', {
                data: {
                  "select": "crawl_engine_data_type",
                  "where": ["engine_id=" + this.reportFormData.engineStatus[i].engine_id, "enabled=1"]
                }
              }).then(data2 => {
                var obj = {};
                obj.engine_data_total = data2.length;
                this.reportFormData.engineStatus[i] = Object.assign(this.reportFormData.engineStatus[i], obj)
              });
              //获取是否启动，最近接入时间,累计在线时长
              this.$post(`/engine/heartbeat/${this.reportFormData.engineStatus[i].engine_id}`
              ).then(data3 => {
                var obj = {};
                if (data3.status == 0) {
                  obj.engine_status = "未启动"
                } else {
                  obj.engine_status = "已启动"
                }
                if (data3.last_update_time == 0) {
                  obj.engine_last_update_time = '从未接入';
                  if (data3.accumulative_online_time == 0) {
                    obj.engine_accumulative_online_time = '0'
                  }
                } else {
                  obj.engine_last_update_time = this.thisTimeFormat2(data3.last_update_time);
                  obj.engine_accumulative_online_time = this.formatDuring2(data3.accumulative_online_time);
                }
                this.reportFormData.engineStatus[i] = Object.assign(this.reportFormData.engineStatus[i], obj)
              });
              //查找引擎的累计发送，累计采集，当前任务，待发送，采集失败次数信息
              this.$post('/action', {
                data: {
                  "select": "crawl_engine_status",
                  "where": ["engine_id=" + this.reportFormData.engineStatus[i].engine_id],
                  "order": ["time desc"],
                  "limit": [0, 1]
                }
              }).then(data => {
                if (Array.isArray(data.data) && data.data.length != 0) {
                  let value = JSON.parse(data.data[0].stats);
                  let obj = {};
                  obj.累计发送成功量 = value[0].content[0].value;
                  obj.累计采集数据量 = value[0].content[1].value;
                  obj.待发送数据量 = value[0].content[2].value;
                  obj.当前运行任务量 = value[1].content[0].value;
                  obj.历史采集失败次数 = value[2].content[0].value;
                  this.reportFormData.engineStatus[i] = Object.assign(this.reportFormData.engineStatus[i], obj);
                }
              });
            }
          });
        },
        //获得平台监控的最新异常消息
        getPlatformAlarmDetail() {
          this.$post('/action', {
            data: {
              sql: "select * from (select * from crawl_platform_alarms) as b group by b.detail order by b.id desc"
            }
          }).then(data => {
            if (Array.isArray(data)) {
              this.platformAlarms = data;
              this.newPlatformAlarmsData = this.platformAlarms.slice(0, 10);
              this.PlatformAlarmsTotal = data.length;
              this.platformStatisticsLoading = false;
            }
          }).catch(error => {
            this.$message.error({message: "获取平台异常统计失败！", type: "error"})
          })
        },
        //获取还存活的引擎信息
        getEngines() {
          this.$post('/action', {
            data: {
              "select": "crawl_engine",
              "where": ["enabled=1"]
            }
          }).then(data => {
            if (data.length != 0) {
              this.engines.push({value: "全部", label: "全部"});
              data.forEach(val => {
                let obj = {};
                obj.value = val.id;
                obj.label = val.engine_name;
                this.engines.push(obj)
              });
              this.searchData.engine = '全部';
            }
          })
        },
        //锚点跳转
        selectPlatformAlarms() {
          document.querySelector("#platformAlarms").scrollIntoView();
        },
        load() {
          this.getEngines();
          this.getChartStatistics();
          this.getEngineTotal();
          this.getPlatformRunningTime();
          this.getPlatformAlarmDetail();
          this.joinEngine();
          this.getReportFormAsEngine();
        },
        //将时间拆分成区间

        formatEveryDay(start, end) {
          let dateList = [];
          var lastDateList = [];
          var startTime = this.getDate(start);
          var endTime = this.getDate(end);
          while ((endTime.getTime()+1000*60*60*24 - startTime.getTime()) >= 0) {
            var year = startTime.getFullYear();
            var month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
            var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
            dateList.push(year + "-" + month + "-" + day);
            startTime.setDate(startTime.getDate() + 1);
          }
          //处理拆分时间
          lastDateList = dateList
          this.dayTime = [];
          for(let i=0; i< lastDateList.length; i++)  {
            this.dayTime.push(lastDateList[i]);
            console.log('拆分时间'+ this.dayTime)
          }
          return dateList;
        },
        getDate(datestr) {
          var temp = datestr.split("-");
          var date = new Date(temp[0], temp[1] - 1, temp[2]);
          return date;
        },
  //新加下载数据量-下载弹框
         saveForm() {
          var start = this.downloadForm.time[0];
          var end = this.downloadForm.time[1];
          this.formatEveryDay(start,end)

          this.$refs.downloadForm.validate(async(valid) => {
            if (valid) {
              for (var i = 0; i < this.dayTime.length - 1; i++) {
                let arrNew = [];
                console.log('前一天' + this.dayTime[i])
                console.log('后一天' + this.dayTime[i + 1])
              let sql = `select c.engine_name, a.engine_id, b.name, a.send_status, count as zz from (crawl_platform_data_statistics as a right join crawl_engine_data_type as b on a.data_type_id = b.id) right join crawl_engine as c on a.engine_id = c.id where a.type=3 and a.time > '${this.dayTime[i]}'and a.time < '${this.dayTime[i + 1]}'`
                if (this.downloadForm.selectEngine != '全部') {
                  let engine_IdInfo = this.downloadForm.selectEngine;
                  console.log(engine_IdInfo)
                  sql = `select c.engine_name, a.engine_id, b.name, a.send_status, count as zz from (crawl_platform_data_statistics as a right join crawl_engine_data_type as b on a.data_type_id = b.id) right join crawl_engine as c on a.engine_id = c.id where a.type=3 and a.time > '${this.dayTime[i]}'and a.time < '${this.dayTime[i + 1]}' and a.engine_id = '${engine_IdInfo}'`
              }

                await this.$post('/action', {
                  data: {
                    sql: sql
                  }
                }).then(res => {
                  if (res.length > 0) {
                    let engine_names = [];
                    res.forEach(row => {
                      //对name 进行去重
                      if (engine_names.indexOf(row.engine_name) == -1) {
                        engine_names.push(row.engine_name)
                      }
                    });
                    //对engine_names去重
                    engine_names.forEach(engine => {
                      let data_type = [];
                      res.forEach(row => {
                        if (engine == row.engine_name) {
                          if (data_type.indexOf(row.name) == -1) {
                            data_type.push(row.name)
                          }
                        }
                      });
                      data_type.forEach(dt => {
                        let list = [];
                        list.push(engine, dt)
                        res.forEach(row => {
                          if (row.name == dt) {
                            if (row.send_status == -1) {
                              list.splice(5, 0, row.zz)
                            }
                            if (row.send_status == 0) {
                              list.splice(4, 0, row.zz)
                            }
                            if (row.send_status == 1) {
                              list.splice(3, 0, row.zz)
                            }
                            if (row.send_status == 2) {
                              list.splice(7, 0, row.zz)
                            }
                            if (row.send_status == 3) {
                              list.splice(6, 0, row.zz)
                            }
                          }
                        })
                        list.splice(2, 0, list[2] + list[3] + list[4] + list[5] + list[6])
                        arrNew.push(list)
                        console.log('我是已经处理好的列表' + arrNew)
                      })
                    })
                    //创建下载数据量csv格式'
                    let heads = ['引擎', '数据类型', "昨日接收量", "昨日发送总线成功量", "昨日待发送至总线量", "昨日过滤量", "昨日发送失败待重发量", "昨日完全发送失败量"]  // csv表格的头部
                    let csvData = []
                    for (let i = 0; i < arrNew.length; i++) {
                      let obj = arrNew[i];
                      obj["引擎"] = arrNew[0];
                      obj["数据类型"] = arrNew[1];
                      obj["昨日接收量"] = arrNew[2];
                      obj["昨日发送总线成功量"] = arrNew[3];
                      obj["昨日待发送至总线量"] = arrNew[4];
                      obj["昨日过滤量"] = arrNew[5];
                      obj["昨日发送失败待重发量"] = arrNew[6];
                      obj["昨日完全发送失败量"] = arrNew[7];
                      csvData.push(obj)
                    }
                    // 导出csv文件:
                    CsvExportor.downloadCsv(
                      csvData,
                      {header: heads},
                      '文件.csv'
                    )
                  }
                  else {
                  this.$message.error({message: "没有查询到数据量", type: "error"});
                  this.resetForm('downloadForm')
                }
                })


                this.resetForm('downloadForm')
                this.dialogFormVisible = false;
              }
            }
         })
        },
        cancel() {
          this.resetForm ('downloadForm')
          // this.downloadForm.selectEngine=null;
          // this.downloadForm.time= null ;
          this.dialogFormVisible = false;
        },
        //重置下载数据量弹框
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      },
      created() {

      },
      mounted() {
          this.$user = JSON.parse(localStorage.user);
          this.load();
      },
      beforeDestroy() {
          clearInterval(this.timerPlatformTest);
          this.timerPlatformTest = null;
      }

  }
</script>

<style>
  .page-platform_status {
    width: 100%;
    height: 100%;
    font-size: 14px;
    padding: 0 15px;
    color: #606266
  }
  .page-platform_status .page-platform_status_box{
    height: 100%;
    width: 100%;
    background: #fff;
  }
  .page-platform_status .page-platform_status_box .list {
    padding: 0 15px 15px 15px;
    background: #fff;
  }
  .page-platform_status .page-platform_status_box .basisStatusButton {
    margin-right: 20px;
    float: right;
    padding: 0;
  }
  .page-platform_status .page-platform_status_box .title2 {
    float: left;
    background: #fff;
    padding-left: 15px;
    font-size: 20px;
    line-height: 35px;
  }
  .page-platform_status .page-platform_status_box .itemTitle {
    position: absolute;
    top: 78%;
    transform: translateY(-50%);
    width: 90%;
    line-height: 12px;
    text-align:left;
  }
  .page-platform_status .page-platform_status_box .title3 {
    font-size: 12px;
  }
  .page-platform_status .page-platform_status_box .title {
    background: #fff;
    padding: 15px;
    font-size: 20px;
    line-height: 35px;
  }
  .page-platform_status .page-platform_status_box .title .title_i {
    margin-right: 5px;
  }
  .page-platform_status .page-platform_status_box .el-card__header {
    position: relative;
    height: 90px;
  }
  .page-platform_status .page-platform_status_box .box-card {
    position: relative;
    height: 250px;
  }
  .page-platform_status .page-platform_status_box .box-card2 {
    position: relative;
    margin-top: 10px;
  }
  .page-platform_status .page-platform_status_box .box-card2 .conclusion .conclusion_label_p{
    margin-bottom: 10px;
    font-size: 18px;
    text-align: center;
  }

  .page-platform_status .page-platform_status_box .box-card2 .statistics_echart {
  }
  .page-platform_status .page-platform_status_box .box-card2 .statistics_value {
  }
  .page-platform_status .page-platform_status_box .box-card2 .select_statistics_type {
    padding: 10px 15px 15px 15px;
  }
  .page-platform_status .page-platform_status_box .box-card2 .select_statistics_type .fault_type{
    margin-right: 15px;
  }
  .page-platform_status .page-platform_status_box .box-card2 .select_statistics_type span {
    margin-right: 5px;
  }
  .page-platform_status .page-platform_status_box .platform_status_box-card {
    height: 120px;
    width: 120px;
  }
  .page-platform_status .page-platform_status_box .platform_status_box-card .platform_status_image {
    margin-top: 5px;
    margin-left: 19px;
    width: 60px;
    height: 60px;
  }
  .page-platform_status .page-platform_status_box .platform_status_box-card .platform_status_value_warn {
    text-align: center;
    font-size: 14px;
    color: rgb(224,64,6);
  }
  .page-platform_status .page-platform_status_box .platform_status_box-card .platform_status_value_normal {
    text-align: center;
    font-size: 14px;
    color: rgb(26,250,41);
  }
  .page-platform_status .page-platform_status_box .platform_status_box-card .platform_status_value_count {
    text-align: center;
    font-size: 14px;
    color: rgb(224,64,6);
  }
  .page-platform_status .page-platform_status_box .platform_status_box-card .platform_status_value_loading {
    text-align: center;
    font-size: 14px;
    margin-top: 40px;
  }
  .page-platform_status .page-platform_status_box .platform_status_hover:hover {
    cursor: pointer;
  }
  .page-platform_status .page-platform_status_box .platform_status_hover .el-card__body {
    padding: 10px;
  }
  .page-platform_status .page-platform_status_box .box-card .platform_run {
    position: absolute;
    top: 32px;
    left:-19px;
    /*float: left;*/
  }
  .page-platform_status .page-platform_status_box .box-card .text {
    font-size: 14px;
    text-align: left;
    margin:5px auto;
    margin-bottom: 18px;
  }
  .page-platform_status .page-platform_status_box .box-card .text p {
    margin-bottom: 15px;
  }
  .page-platform_status .page-platform_status_box .box-card .monitor_box {
    font-size: 14px;
    text-align: left;
    margin:5px auto;
    margin-bottom: 18px;
  }
  .page-platform_status .page-platform_status_box .box-card .monitor_box p {
    margin-bottom: 15px;
  }
  .page-platform_status .page-platform_status_box .box-card .monitor_box .span_value {
    color: #000000;
    margin-right: 20px;
    float: right;
  }
  .page-platform_status .page-platform_status_box .box-card .status_value {
    position: absolute;
    /*float: left;*/
    top: 45px;
    left: 20px;
    font-size: 14px;
    color: #4eaf08;
  }
  .page-platform_status .page-platform_status_box .box-card .statusInfo{
    width: 100%;
    height:100%;
    position: absolute;


  }
  .page-platform_status .page-platform_status_box .box-card .turn_on_time {
    position: absolute;
    float: left;
    margin-left: 110px;
    margin-top: 20px;
    font-size: 14px;
    color: #606266;
  }
  .page-platform_status .page-platform_status_box .box-card .turn_on_time .span_value {
    margin-left: 10px;
  }
  .page-platform_status .page-platform_status_box .text p {
    margin-bottom: 10px;
  }
  .page-platform_status .page-platform_status_box .box-card .span_name {
    color: #606266;
    margin-right: 10px;
    font-weight: 900;
  }
  .page-platform_status .page-platform_status_box .box-card .span_value {
    color: #000000;
    margin-right: 20px;
    float: right;
  }
  .page-platform_status
  .page-platform_status_box
  .app-table {
    padding: 15px;
    background: #fff;
    overflow: hidden;
  }
  .page-platform_status
  .page-platform_status_box
  p.label_p{
    position: relative;
    margin-bottom: 10px;
    font-size: 20px;
  }
  .page-platform_status
  .page-platform_status_box
  p.label_p img{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .page-platform_status
  .page-platform_status_box
  .app-table
  img {
    position: absolute;
    top: 50%;
    margin-top: -12px;
    margin-left: 5px;
  }
  .page-platform_status
  .page-platform_status_box
  .line_charts
  p {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .el-card__body {
    padding: 18px 18px 18px 10px;
  }
  .page-platform_status
  .page-platform_status_box
  .line_charts2
  p {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .page-platform_status
  .page-platform_status_box
  .demo-table-expand
  label {
    width: 90px;
    color: #99a9bf;
  }
  .page-platform_status
  .page-platform_status_box
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
