<<!-- 引擎状态: 包括每个引擎的运行状态（正常、异常、离线等），每个引擎上传的异常列表以及统计信息 -->
<template>
  <div class="page-engine_status">
    <div class="page-engine_status_box">
      <div class="search_form">
        <div class="title"><i class="icon iconfont icon-jiankong title_i"></i>引擎状态
          <el-button style="float: right;" @click="refresh" icon="el-icon-refresh"></el-button>
        </div>
        <div class="inner">
          <el-select v-model="searchData.engine" @change="serverChange()" v-loading="selectLoading">
            <el-option v-for="engine in engines" :key="engine.value" :label="engine.label" :value="engine.value">
            </el-option>
          </el-select>
          <!--          <el-input v-model="searchForm.engine_name" placeholder="根据引擎名称搜索"></el-input>-->
          <!--          <el-input v-model="searchForm.engine_id" placeholder="根据引擎id搜索"></el-input>-->
        </div>
      </div>
      <div class="list">
        <!--        <p class="label_p">引擎信息</p>-->
        <el-row :gutter="4">
          <el-col :span="6">
            <div v-if="engines.length == 0">
              <el-card class="noEngines">
                <span>暂无数据</span>
              </el-card>
            </div>
            <div v-else>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="title">引擎基本信息</span>
                  <el-button style="float: right; padding: 3px 0" type="text"
                             @click="openEditOrderDialog(searchData.engine)">指令下发
                  </el-button>
                  <el-button style="float: right; padding: 3px 0; margin-right: 10px" type="text"
                             @click="exportFaultReport">故障校验报告导出
                  </el-button>
                </div>
                <div class="text item" v-loading="basisLoading">
                  <p><span class="span_name">ID:</span><span class="span_value">{{ searchData.engine }}</span></p>
                  <p><span class="span_name">供应商:</span>
                    <el-button class="basisStatusButton" type="text" @click="openCreatorDialog">{{ creator }}</el-button>
                  </p>
                  <p v-if="!show"><span class="span_name">引擎类型</span>
                    <el-popover
                      placement="top-start"
                      width="200"
                      trigger="hover"
                      content="基线引擎针对采集目标验证目标网址可采集，并不进行完整数据采集">
                      <span :class="{span_value: true,span_value_cursor: show}" slot="reference" style="color: #409EFF">{{ engine_type }}</span>
                    </el-popover>
                  </p>
                  <p v-if="show"><span class="span_name">引擎类型</span><span class="span_value">{{ engine_type }}</span></p>
                  <p><span class="span_name">数据类型个数:</span>
                    <el-button class="basisStatusButton" type="text" @click="openDataTypeInfoDialog">{{ dataTotal }}</el-button>
                  </p>
                  <p><span class="span_name">引擎注册时间:</span><span class="span_value">{{ create_time }}</span></p>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div v-if="engines.length == 0">
              <el-card class="noEngines" :body-style="{ padding: '0px' }" v-loading="loading">
                <span>暂无数据</span>
              </el-card>
            </div>
            <div v-else>
              <div v-if="engineStatus == 1">
                <el-card class="box-card" :body-style="{ padding: '0px' }" v-loading="loading">
                  <div class="basisStatus">
                    <img src="../../../assets/images/start.png" width="40" height="40" class="engine_run">
                    <p class="status_value">已启动</p>
                    <div class="turn_on_time">最新心跳时间:</div>
                    <div class="turn_on_time_value">{{ last_update_time }}</div>
                    <div class="online_time">持续在线时长:</div>
                    <div class="online_time_value">{{ accumulative_online_time }}</div>
                  </div>
                  <div v-if="show">
                    <div
                      v-if="this.tableData.filter(data => (!this.searchData.engine  || data.engine_id.includes(this.searchData.engine))).length != 0"
                      class="engine_info">
                      <p v-for="item in countData">
                        <span class="name">{{ item.name }}:</span>
                        <span class="value">{{ item.value }}</span>
                      </p>
                    </div>
                    <div v-else class="engine_info">
                      <p><span class="name">累计发送成功量:</span><span class="value">0</span></p>
                      <p><span class="name">累计采集数据量:</span><span class="value">0</span></p>
                      <p><span class="name">待发送数据量:</span><span class="value">0</span></p>
                      <p><span class="name">当前运行规则数:</span><span class="value">0</span></p>
                      <p><span class="name">历史累计采集失败次数:</span><span class="value">0</span></p>
                    </div>
                  </div>
                  <div v-else class="engine_info">
                    <p v-for="item in baseEngineInfo">
                      <span class="name">{{ item.name }}:</span>
                      <span class="value">{{ item.value }}</span>
                    </p>
                  </div>
                </el-card>
              </div>
              <div v-else>
                <el-card class="box-card" :body-style="{ padding: '0px' }" v-loading="loading">
                  <div class="basisStatus">
                    <img src="../../../assets/images/stop.png" width="40" height="40" class="engine_run">
                    <p class="status_value_warn">未启动</p>
                    <div class="turn_on_time">最新心跳时间:</div>
                    <div class="turn_on_time_value">{{ last_update_time }}</div>
                    <div class="online_time">持续在线时长:</div>
                    <div class="online_time_value">{{ accumulative_online_time }}</div>
                  </div>
                  <div v-if="show">
                    <div
                      v-if="this.tableData.filter(data => (!this.searchData.engine  || data.engine_id.includes(this.searchData.engine))).length != 0"
                      class="engine_info">
                      <p v-for="item in countData">
                        <span class="name">{{ item.name }}:</span>
                        <span class="value">{{ item.value }}</span>
                      </p>
                    </div>
                    <div v-else class="engine_info">
                      <p><span class="name">累计发送成功量:</span><span class="value">0</span></p>
                      <p><span class="name">累计采集数据量:</span><span class="value">0</span></p>
                      <p><span class="name">待发送数据量:</span><span class="value">0</span></p>
                      <p><span class="name">当前运行任务量:</span><span class="value">0</span></p>
                      <p><span class="name">历史累计采集失败次数:</span><span class="value">0</span></p>
                    </div>
                  </div>
                  <div v-else class="engine_info">
                    <p v-for="item in baseEngineInfo">
                      <span class="name">{{ item.name }}:</span>
                      <span class="value">{{ item.value }}</span>
                    </p>
                  </div>
                </el-card>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <el-card v-if="show" class="pie_card" v-loading="delayLoading">
              <p>最新100条数据平均延时</p>

              <!--              <ve-pie :data="pieData" :settings="pieSettings" style="margin-top: -90px;" :extend="pieExtend" v-loading="delayLoading" :data-empty="pieDataEmpty"></ve-pie>-->
              <ve-histogram v-show="!pieDataEmpty" :data="delayData" class="delay_box" height="240px"
                            style="margin-top: 7px" :extend="delayExtend" :series="delaySeries"></ve-histogram>
              <span v-show="pieDataEmpty">暂无数据</span>
            </el-card>
          </el-col>
          <el-col :span="2">
            <div v-if="show" class="small-box-card" @click="selectScrolls1">
              <div v-if="!alarmsLoading">
                <el-card class="box-card2">
                  <div v-if="engineStatus == 0">
                    <div class="engine_status_value_none">暂无数据</div>
                  </div>
                  <div v-else>
                    <div v-if="status == '异常'">
                      <img src="../../../assets/images/status_warn.png" width="50" height="50"
                           class="engine_status_image">
                      <div class="engine_status_value_warn">
                        状态异常({{errorDataTotal}})
                      </div>
                    </div>
                    <div v-if="status == '正常'">
                      <img src="../../../assets/images/status_normal.png" width="50" height="50"
                           class="engine_status_image">
                      <div class="engine_status_value_normal">
                        状态正常
                      </div>
                    </div>
                    <div v-else>
                      <div class="engine_status_value_none">暂无数据</div>
                    </div>
                  </div>
                </el-card>
              </div>
              <div v-else>
                <el-card class="box-card2">
                  <div class="engine_status_value_none">正在加载</div>
                </el-card>
              </div>
            </div>
            <div v-if="show" class="small-box-card" @click="selectScrolls2">
              <el-card class="box-card3">
                <img src="../../../assets/images/statistics2.png" width="40" height="40" class="engine_status_receive">
                <div class="history_value">
                  历史统计
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <div v-if="show" v-loading="chartLoading" class="statistics_box">
          <el-card>
            <el-row>
              <el-col :span="24">
                <p class="label_p">数据量统计</p>
                <el-date-picker
                  v-model="searchData.time"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  @change="serverTimeChange()"
                  :picker-options="pickerOptions">
                </el-date-picker>
<!--                <el-input style="width: 15%;margin-left: 15px" v-model="limit" placeholder="请输入整数时间间隔（单位：分）" @change="newTest"></el-input>-->
<!--                <el-popover-->
<!--                  placement="top-start"-->
<!--                  width="200"-->
<!--                  trigger="hover"-->
<!--                  content="请输入整数">-->
<!--                  <img src="../../../assets/images/help_hint.png" slot="reference" height="26" width="26" style="margin-bottom: -8px">-->
<!--                </el-popover>-->
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="24">
              <el-row :gutter="4">
                <el-col :span="12">
<!--                    <p class="label_p">采集数据统计</p>-->
                    <ve-line :data="statusData" :settings="statusSettings" :data-empty="dataEmpty" id="scrolls2" :extend="crawlExtend"></ve-line>
                </el-col>
                <el-col :span="12">
<!--                    <p class="label_p">发送数据统计</p>-->
                    <ve-line :data="statusData" :settings="statusTaskSettings" :data-empty="dataEmpty" :extend="crawlExtend"></ve-line>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          </el-card>
        </div>
        <el-card v-show="show" class="box-card4">
          <div class="app-table">
            <p class="label_p">引擎异常</p>
            <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="platformData"
                      v-loading="alarmsLoading" id="scrolls1">
              <el-table-column prop="type" label="类型" align="center" width="200">
              </el-table-column>
              <el-table-column prop="level" label="级别" align="center" width="200">
              </el-table-column>
              <el-table-column prop="time" label="时间" align="center" width="400">
              </el-table-column>
              <el-table-column prop="detail" label="详情" align="center">
              </el-table-column>
              <template slot="empty">
                暂无异常
              </template>
            </el-table>
            <div class="app-pagination">
              <el-pagination
                :total="errorDataTotal"
                :page-size="errorDataPageSize"
                :page-sizes="pageSizes"
                :current-page="errorDataCurrentPage"
                @size-change="errorDataHandleSizeChange"
                @current-change="errorDataHandleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
          </div>
        </el-card>
        <el-card v-show="!show" class="box-card4">
          <div class="app-table">
            <div>
              <p class="label_p" >基线引擎任务配置信息</p>
            </div>
            <el-table stripe border tooltip-effect="dark" :data="configurationData" v-loading="baseConfigurationLoading">
              <el-table-column type="expand" width="40">
                <template slot-scope="scope">
                  <div v-if="scope.row.baseline_engine_result">
                    <el-form label-position="left" inline class="demo-table-expand" >
                      <div v-if="scope.row.baseline_engine_result.res">
                        <div v-for="(log,index) in scope.row.baseline_engine_result.res[0].data.result.log" :key="log.content" >
                          <el-form-item :label="(index + 1).toString()" :class="log.level">
                            <div v-if="log.level == 'info'">
                              <span style="color: #45c130">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                            </div>
                            <div v-if="log.lever == 'warning'">
                              <span style="color: #df5000">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                            </div>
                            <div v-if="log.level == 'error'">
                              <span style="color: #c9302c">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                      <div v-else>
                        <div v-for="(log,index) in scope.row.baseline_engine_result.result.log" :key="log.content" >
                          <el-form-item :label="(index + 1).toString()" :class="log.level">
                            <div v-if="log.level == 'info'">
                              <span style="color: #45c130">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                            </div>
                            <div v-if="log.lever == 'warning'">
                              <span style="color: #df5000">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                            </div>
                            <div v-if="log.level == 'error'">
                              <span style="color: #c9302c">{{ log.time }} : {{ log.level.toLocaleUpperCase() }} : {{ log.content }}</span>
                            </div>
                          </el-form-item>
                        </div>
                      </div>
                    </el-form>
<!--                    <div style="margin-top: 20px; float: left">-->
<!--                      <el-button @click="exportBaselineEngineResult(scope.row)">下载全部结果</el-button>-->
<!--                    </div>-->
                  </div>
                  <div v-else style="text-align: center">
                    <span style="color: #888888;">尚未反馈结果</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="任务配置ID" align="center" width="100"></el-table-column>
              <el-table-column prop="engine_id" label="引擎ID" align="center" width="250">
              </el-table-column>
              <el-table-column prop="task_setting_rules_attrs" label="配置附加" align="center">
                <template slot-scope="scope">
                  <div style="text-align: left">
                    <el-tag  v-for="item in scope.row.task_setting_rules_attrs" :key="item">{{ item }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="task_setting_rules_value" label="规则内容" align="center"width="500">
                <template slot-scope="scope">
                  <div style="text-align: left">
                    <el-popover
                      placement="bottom"
                      trigger="hover"
                      :content="scope.row.task_setting_rules_value"
                      width="300">
                      <el-button slot="reference" type="text"><div v-if="scope.row.task_setting_rules_value.length < 100">{{scope.row.task_setting_rules_value}}</div><div v-else>{{ scope.row.task_setting_rules_value.substring(0,100) }}...</div></el-button>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="storage_time" label="入库时间" align="center">
                <template slot-scope="scope">
                  {{ scope.row.storage_time.substring(0, 19) }}
                </template>
              </el-table-column>
              <el-table-column prop="dispatched" label="是否下发至引擎" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.dispatched == 1">是</div>
                  <div v-if="scope.row.dispatched == 0">否</div>
                </template>
              </el-table-column>
              <el-table-column prop="ping" label="下发延时" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.ping">{{ scope.row.ping }}</div>
                </template>
              </el-table-column>
              <template slot="empty">
                暂无数据
              </template>
            </el-table>
            <div class="app-pagination">
              <el-pagination
                :total="baseDataTotal"
                :page-size="dataPageSize"
                :page-sizes="basePageSizes"
                :current-page="dataCurrentPage"
                @size-change="dataHandleSizeChange"
                @current-change="dataHandleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
          </div>
        </el-card>
        <el-card v-show="show" class="box-card5">
          <div class="app-table">
            <p class="label_p">引擎采集错误日志</p>
            <el-table stripe border tooltip-effect="dark" ref="tableElement" :data="engineErrorLogData"
                      v-loading="alarmsLoading">
              <el-table-column label="序号" type="index">
              </el-table-column>
              <el-table-column prop="level" label="级别" align="center" width="100">
              </el-table-column>
              <el-table-column prop="time" label="时间" align="center" width="200">
              </el-table-column>
              <el-table-column prop="type" label="类型" align="center" width="150">
              </el-table-column>
              <el-table-column prop="detail" label="详情" align="center">
              </el-table-column>
              <el-table-column prop="submit_status" label="是否提交至总线" align="center" width="150">
                <template slot-scope="scope">
                  <div v-if="scope.row.submit_status == 0">否</div>
                  <div v-if="scope.row.submit_status == 1">是</div>
                </template>
              </el-table-column>
              <template slot="empty">
                暂无错误日志
              </template>
            </el-table>
            <div class="app-pagination">
              <el-pagination
                :total="errorLogDataTotal"
                :page-size="errorLogDataPageSize"
                :page-sizes="errorLogDataPageSizes"
                :current-page="errorLogDataCurrentPage"
                @size-change="errorLogDataHandleSizeChange"
                @current-change="errorLogDataHandleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
          </div>
        </el-card>
        <!-- 查看管理员信息的弹窗 -->
        <el-dialog width="700px" class="quota_type-edit-dialog" :append-to-body="true"
                   :before-close="closeDialog" title="供应商信息" :visible.sync="creatorDialogVisible">
          <el-table :data="creatorData">
            <el-table-column label="供应商名称" prop="name">
            </el-table-column>
            <el-table-column label="电话" prop="phone">
              <template slot-scope="scope">
                <div v-if="!scope.row.phone">用户未留电话</div>
                <div v-else>{{ scope.row.phone }}</div>
              </template>
            </el-table-column>
            <el-table-column label="邮箱" prop="email">
            </el-table-column>
            <el-table-column label="公司名" prop="company_name">
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="creatorDialogVisible = false">关闭</el-button>
          </div>
        </el-dialog>
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
        <!-- 新弹窗 -->
        <el-dialog width="700px" class="quota_type-edit-dialog" :append-to-body="true"
                   :before-close="closeEditOrderDialog" title="新建指令" :visible.sync="editOrderDialogVisible">
          <el-form :model="editOrderForm" label-width="100px" :rules="editOrderRules" ref="engineCommandForm">
            <el-form-item label="指令描述" prop="command">
              <el-select v-model="editOrderForm.command" @change="commandChange">
                <el-option v-for="command in commands" :key="command.value" :label="command.label"
                           :value="command.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指令参数" prop="arg">
              <el-input v-model="editOrderForm.arg" clearable :placeholder="addInstructionHint"
                        type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeEditOrderDialog">取消</el-button>
            <el-button type="primary" :loading="editOrderLoading"
                       @click="saveEditOrderForm('engineCommandForm')">保存</el-button>
			    </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
    import permission from '@/components/mixin/permission';
    import fileSaver from 'file-saver';
    import 'v-charts/lib/style.css'
    import axios from 'axios'
    import timeformat from "../../../plugin/timeformat";

    export default {
        mixins: [permission],
        name: 'engine_status',
        inject: ['reload'],
        data() {
            this.statusTaskSettings = {
                metrics: ['待发送数据量'],
                dimension: ['日期']
            }
            this.statusSettings = {
                metrics: ['累计发送成功量', '累计采集数据量',],
                dimension: ['日期']
            }
            this.pieSettings = {
                radius: 100,
            }
            return {
                //图表
                statusData: {
                    columns: ['日期', '累计发送成功量', '累计采集数据量', '待发送数据量', '当前运行任务量', '当前累计采集失败次数'],
                    rows: [
                        // { '日期': null, '累计发送成功量': null, '累计采集数据量': null, '待发送数据量': null, '当前运行任务量': null, '当前累计采集失败次数': null },
                    ]
                },
                //图表时间间隔设置
                limit: null,
                //↓延时验证的饼状图 已弃用
                pieData: {
                    columns: ['所属阶段', '占用时间'],
                    rows: [
                        // {'所属阶段': '阶段1', '占用时间': '20'},
                    ]
                },
                //延时信息的柱状图
                delayData: {
                    columns: ['所属阶段',],
                    rows: [
                        {'所属阶段': '数据采集'},
                        {'所属阶段': '数据回传'}
                    ]
                },
                pieExtend: {
                    legend: {
                        left: 10,
                        top: 200,
                        // show: false,
                        orient: 'vertical'
                    },
                    series: {
                        center: ["65%", "45%"],
                        label: {
                            show: false,
                            formatter: "{b} : \n {c}" + "秒 \n" + "({d}%)",
                            position: "center"
                        },
                        // roseType: 'radius'
                        radius: ["70", "100"],
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c}" + "秒 " + "({d}%)"
                    }
                },
                delayExtend: {
                    tooltip: {
                        formatter(params) {
                            let valTitle = '';
                            let val = '';
                            params.forEach(param => {
                                valTitle = param.name + ':' + '</br>';
                                val += param.seriesName + ': ' + param.value + '秒' + '</br>'
                            });
                            return valTitle + val
                        },
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        top: 20
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} 秒'
                        }
                    },
                },
                delaySeries: [
                    // {
                    //     name: '数据类型1',
                    //     type: 'bar',
                    //     barWidth:20,
                    //     data: [10,20]
                    // },
                    // {
                    //     name: '数据类型2',
                    //     type: 'bar',
                    //     barWidth: 20,
                    //     data: [20,20]
                    // }
                ],
                crawlExtend: {
                    yAxis: {
                        // splitNumber: 5,
                        // min: 1,
                        // type: "log"
                    },
                    xAxis: {
                      axisLabel: {
                          showMaxLabel: true,
                          showMinLabel: true,
                      }
                    },
                    series: {
                        showSymbol: false
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 100,
                        },
                    ],
                    grid: {
                        x: "6%",
                        x2: "8%"
                    }
                },
                chartLoading: true,
                dataEmpty: false,
                pieDataEmpty: false,
                //引擎基本信息
                engine_type: '',
                create_time: '',
                creator: '',
                dataTotal: '',
                //用来判断引擎是否异常
                status: '',
                //用于显示异常个数
                alarmCount: null,
                //作为判断图表可否显示的条件
                j: 0,
                //用于存放图表信息
                obj: {},
                //用来判断引擎是否正在运行
                engineStatus: null,
                //最近接入时间
                last_update_time: '',
                //累计在线时长
                accumulative_online_time: '',
                //供应商信息弹窗管理
                creatorDialogVisible: false,
                creatorData: [],
                //数据类型详细信息弹窗相关
                dataTypeInfoData: [],
                dataTypeInfoVisible: false,
                openDataTypeInfoDialogLoading: false,
                //查询
                time: [],
                searchData: {
                    time: '',
                },
                engines: [],
                searchForm: {},
                errorWhere: [],
                infoWhere: [],
                //列表相关
                loading: false,
                alarmsLoading: true,
                tableData: [],
                total: 0,
                pageSizes: [10, 50, 100, 200],
                errorDataPageSize: 10,
                errorDataTotal: 0,
                errorDataCurrentPage: 1,
                countDataPageSize: 20,
                countDataCurrentPage: 1,
                platformData: [],
                countData: [],
                baseEngineInfo: [],
                //基线引擎列表相关
                baseDataTotal: 0,
                baseConfigurationLoading: false,
                basePageSizes: [10, 20, 50, 100],
                dataPageSize: 10,
                dataCurrentPage: 1,
                //弹窗相关
                errorCurrentPage: 1,
                infoCurrentPage: 1,
                errorTotal: 0,
                infoTotal: 0,
                errorPageSize: 20,
                infoPageSize: 20,
                errorData: [],
                infoData: [],
                //新增修改表单
                editOrderDialogVisible: false,
                editOrderLoading: false,
                editOrderForm: {
                    command: null,
                    sid: null,
                    name: null,
                    type: null,
                    args: null,
                    engine_id: null,
                    storage_time: null,
                    description: null,
                    dispatched: 0,
                    arg: null,
                },
                addInstructionHint: '',
                hintData: {
                    重置配置数据: "无参数",
                    更新接口通信频率: "{'api_id': 接口编号,number类型, 'frequency': 接口调用频率，默认30秒,number类型}",
                    重新采集: "{'rule': 规则id,string类型}",
                    历史数据清理: "{'day': 历史天数,number类型}",
                    重启: "无参数"
                },
                configurationData: [],
                editOrderRules: {
                    command: [
                        {required: true, message: '请选择指令描述', trigger: 'blur'},
                    ],
                },
                commands: [],
                commandTypes: [
                    {label: '重采', value: 1},
                    {label: '配置更新', value: 2}
                ],
                delayLoading: true,
                basisLoading: false,
                //用于判断delayLoading显示与否
                delayCount: 0,
                selectLoading: false,
                //用于判断延时图表是否显示暂无数据
                emptyCount: 0,
                //用于存放当前选定引擎下的数据类型，方便查询延时
                dataTypes: [],
                //引擎采集错误日志表格相关
                engineErrorLogDataLocal: [],
                engineErrorLogData: [],
                errorLogDataTotal: 0,
                errorLogDataPageSize: 10,
                errorLogDataPageSizes: [10, 20, 50, 100],
                errorLogDataCurrentPage: 1,
                errorLogLoading: false,
                //用于取消请求
                source: null,
                source2: null,
                //用于控制普通引擎和基线引擎不同页面的显示
                show: null,
                //日期选择器快捷选项
                pickerOptions: {
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
                    //结束时间不超过当天
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                }
            }
        },
        methods: {
            //刷新页面
            refresh() {
                this.reload();
            },
            //特殊处理，获取最近七天的日期
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
                var time = hoursRound + '小时' + minutesRound + '分';
                return time;
            },
            //时间戳转换为时间
            thisTimeFormat(val) {
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
            // 修改分页数量
            errorDataHandleSizeChange(val) {
                this.errorDataPageSize = val;
                this.errorList()
            },
            errorLogDataHandleSizeChange(val) {
                this.errorLogDataPageSize = val;
                this.engineErrorLogData = this.engineErrorLogDataLocal.slice((this.errorLogDataCurrentPage - 1) * this.errorLogDataPageSize, this.errorLogDataCurrentPage * this.errorLogDataPageSize);
            },
            // 切换分页
            errorDataHandleCurrentChange(val) {
                this.errorDataCurrentPage = val;
                this.errorList();
            },
            errorLogDataHandleCurrentChange(val) {
                this.errorLogDataCurrentPage = val;
                this.engineErrorLogData = this.engineErrorLogDataLocal.slice((this.errorLogDataCurrentPage - 1) * this.errorLogDataPageSize, this.errorLogDataCurrentPage * this.errorLogDataPageSize);
            },
            //锚点跳转
            selectScrolls1() {
                document.querySelector("#scrolls1").scrollIntoView();
            },
            selectScrolls2() {
                document.querySelector("#scrolls2").scrollIntoView();
            },
            //打开供应商信息弹窗
            openCreatorDialog() {
                this.$post('/action', {
                    data: {
                        "select": "sys_user",
                        "where": "name=" + this.creator
                    }
                }).then(data => {
                    this.creatorData = data;
                    this.creatorDialogVisible = true;
                })
            },
            //打开数据类型详细信息弹窗
            openDataTypeInfoDialog() {
                this.openDataTypeInfoDialogLoading = true;
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine_data_type",
                        "where": ["engine_id=" + this.searchData.engine, "enabled=1", "is_engine=1"]
                    }
                }).then(data => {
                    this.dataTypeInfoData = data;
                    for(let i = 0; i < this.dataTypeInfoData.length; i++) {
                        this.$post(`/unifiedQuery/DataType?code=${this.dataTypeInfoData[i].data_subtype}`).then(data => {
                            this.dataTypeInfoData[i].name = data.name ? data.name : this.dataTypeInfoData[i].name;
                            if(i = this.dataTypeInfoData.length -1 ) {
                                this.dataTypeInfoVisible = true;
                                this.openDataTypeInfoDialogLoading = false;
                            }
                        }).catch(err => {
                            try {
                                this.dataTypeInfoVisible = true;
                                this.openDataTypeInfoDialogLoading = false;
                            } catch (e) {
                                this.$message.error({ message: "获取数据类型详细信息失败！", type: "error"});
                            }
                        })
                    }
                }).catch(err => {
                    this.$message.error({ message: "获取数据类型详细信息失败！", type: "error"});
                })
            },
            dataReset() {
                this.show = this.engines.filter(data => (!this.searchData.engine  || data.value.includes(this.searchData.engine)))[0].engine_type == 0?true:false;
                this.last_verify_time = '';
                this.creator = '';
                this.dataTotal = '';
                this.time = [];
                this.obj = {};
                this.statusData.rows = [];
                this.engine_type = '';
                this.status = '';
                this.engineStatus = '';
                this.countData = [];
                this.platformData = [];
                this.tableData = [];
                this.delaySeries = [];
                this.last_update_time = '';
                this.accumulative_online_time = '';
                this.delayCount = 0;
                this.alarmsLoading = true;
                this.chartLoading = true;
                this.delayLoading = true;
                this.pieDataEmpty = false;
                this.dataEmpty = false;
                this.baseConfigurationLoading = true;
                this.engineErrorLogData = [];
                this.engineErrorLogDataLocal = [];
                this.searchData.time = null;
                this.baseEngineInfo = [];
                this.configurationData = [];
            },
            //更改下拉框
            async serverChange() {
                this.$forceUpdate();
                await this.dataReset();
                //如果是基线引擎，获取基线引擎相关内容
                this.list();
            },
            //获得基线引擎基本信息
            getBaseEngineInfo() {
                let this_ = this;
                let post1 = function() {
                    return new Promise((resolve, reject) => {
                        this_.$post('/action', {
                            data: {
                                sql: `select * from crawl_engine_base_relation as a LEFT JOIN crawl_engine as b on a.engine_id=b.id where a.basis_engine_id='${this_.searchData.engine}'`
                            }
                        }).then(data => {
                            resolve(data)
                        }).catch(err => {
                            reject("请求出错")
                        })
                    })
                };
                let post2 = function() {
                    return new Promise((resolve, reject) => {
                        this_.$post('/action', {
                            data: {
                                "select": "crawl_task_setting",
                                "where": ["engine_id=" + this_.searchData.engine]
                            }
                        }).then(data => {
                            resolve(data)
                        }).catch(err => {
                            reject("请求出错")
                        })
                    })
                };
                Promise.all([post1(), post2()]).then(result => {
                    this.baseEngineInfo.push({ name: "所属引擎名称", value: result[0][0].engine_name });
                    this.baseEngineInfo.push({ name: "所属引擎ID", value: result[0][0].engine_id });
                    this.baseEngineInfo.push({ name: "下发任务配置数量", value: result[1].length });
                    let count = result[1].filter(data => (data.baseline_engine_result != null)).length;
                    this.baseEngineInfo.push({ name: "完成任务配置数量", value: count });
                }).catch(err => {
                    this.$message.error({ message: "获取基线引擎基础信息失败！", type: "error"})
                })
            },
            //获得引擎列表
            engineList() {
                this.selectLoading = true;
                this.baseConfigurationLoading = true;
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine",
                        "fields": ["engine_name", "id", "create_time","engine_type"],
                        "where": ["enabled=1",],
                        "order": ["create_time asc"]
                    }
                }).then(data => {
                    if (Array.isArray(data) && data.length != 0) {
                        this.searchData.engine = data[0].id;
                        for (let i = 0; i < data.length; i++) {
                            var obj = {};
                            obj.value = data[i].id;
                            obj.label = data[i].engine_name;
                            obj.engine_type = data[i].engine_type;
                            this.engines.push(obj);
                        }
                        this.show = this.engines.filter(data => (!this.searchData.engine || data.value.includes(this.searchData.engine)))[0].engine_type == 0 ? true : false;
                        this.selectLoading = false;
                        this.load();
                    } else {
                        this.selectLoading = false;
                        this.baseConfigurationLoading = false;
                    }
                }).catch(error => {
                    this.$message.error({message: "获取引擎列表失败!", type: "error"});
                    this.selectLoading = false;
                })
            },
            findEngineStatusList() {
                return new Promise((resolve, reject) => {
                    this.$post('/engine/findEngineStatusList', {}).then(data => {
                        if (typeof data != 'undefined') {
                            this.tableData = data;
                            this.total = data.length;
                        }
                        resolve();
                    }).catch(err => {
                        reject();
                    });
                })
            },
            //获得引擎状态基础信息表
            async list() {
                this.basisLoading = true;
                this.loading = true;
                await this.findEngineStatusList();
                if(!this.show) {
                    this.getBaseEngineInfo();
                    this.configurationList();
                }
                Promise.all([this.infoList(), this.getEngineOnlineStatus()]).then(result => {
                    if(this.show) {
                        this.errorList();
                    }
                    this.countData = [];
                    if(typeof result[0] != 'undefined') {
                        let data = JSON.parse(result[0].data[0].stats);
                        this.countData.push({ "name": "累计发送成功量", "value": data[0].content[0].value });
                        this.countData.push({ "name": "累计采集数据量", "value": data[0].content[1].value });
                        this.countData.push({ "name": "待发送数据量", "value": data[0].content[2].value });
                        this.countData.push({ "name": "当前运行规则数", "value": data[1].content[0].value });
                        this.countData.push({ "name": "历史累计采集失败次数", "value": data[2].content[0].value });
                    }
                    this.engineStatus = result[1].status;
                    this.last_update_time = result[1].last_update_time == 0 ? '从未接入' : this.thisTimeFormat(result[1].last_update_time);
                    this.accumulative_online_time = result[1].last_update_time == 0 ? '0' : this.formatDuring(result[1].accumulative_online_time);
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                    this.$message.error({ message: "获取引擎基本信息失败！", type: "error"})
                });
                this.newTest();
                this.basicList();
            },
            //获得引擎异常详细信息表
            errorList() {
                if (this.tableData.filter(data => (!this.searchData.engine || data.engine_id.includes(this.searchData.engine))).length != 0) {
                    this.errorWhere = 'id=' + this.tableData.filter(data => (!this.searchData.engine || data.engine_id.includes(this.searchData.engine)))[0].id;
                    this.$post('/action', {
                        data: {
                            "select": "crawl_engine_status",
                            "limit": [(this.errorCurrentPage - 1) * this.errorPageSize, this.errorCurrentPage * this.errorPageSize],
                            "where": this.errorWhere,
                            "order": ['time desc']
                        }
                    }).then(data => {
                        if (JSON.parse(data.data[0].alarms).length != 0) {
                            let platformData = JSON.parse(data.data[0].alarms);
                            this.platformData = platformData;
                            this.errorDataTotal = platformData.length;
                            this.status = '异常';
                            this.platformData.forEach(val => {
                                val.time = data.data[0].time;
                            })
                        } else {
                            this.status = '正常'
                        }
                        if (JSON.parse(data.data[0].error_log).length != 0) {
                            let engineErrorLogData = JSON.parse(data.data[0].err_log);
                            this.engineErrorLogDataLocal = engineErrorLogData;
                            this.errorLogDataTotal = this.engineErrorLogDataLocal.length;
                            this.engineErrorLogData = this.engineErrorLogDataLocal.splice(0, 10);
                        }
                        this.errorLogLoading = false;
                        this.alarmsLoading = false;
                    }).catch(error => {
                        this.errorLogLoading = false;
                        this.alarmsLoading = false;
                        this.$message.error({message: "获取异常信息失败!!!", type: "error"})
                    })
                } else {
                    this.alarmsLoading = false
                }
            },
            //获得引擎统计信息表
            infoList() {
                return new Promise((resolve, reject) => {
                    if (this.tableData.filter(data => (!this.searchData.engine || data.engine_id.includes(this.searchData.engine))).length != 0) {
                        this.$post('/action', {
                            data: {
                                "select": "crawl_engine_status",
                                "where": ["engine_id=" + this.tableData.filter(data => (!this.searchData.engine || data.engine_id.includes(this.searchData.engine)))[0].engine_id],
                                "limit": [0, 1],
                                "order": ["time desc"]
                            }
                        }).then(data => {
                            resolve(data)
                        }).catch(err => {
                            reject()
                        })
                    } else {
                        resolve()
                    }
                })
            },
            //引擎基本信息
            basicList() {
                if (this.source) {
                    this.source.cancel()
                }
                var this_ = this;
                this.source = axios.CancelToken.source();
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine",
                        "where": "id=" + this.searchData.engine
                    },
                    cancelToken: this_.source.token
                }).then(data => {
                    this.engine_type = data[0].engine_type == 0 ? '普通引擎' : '基线引擎';
                    this.create_time = data[0].create_time.substring(0, 19);
                    //设置统计图表的时间选择器时间范围
                    let createTime = new Date(this.create_time).getTime();
                    createTime -= (3600 * 24 * 1000);
                    let day = this.getDay(0) + " 23:59:59";
                    day = new Date(Date.parse(day.replace(/-/g, "/"))).getTime();
                    this.pickerOptions.disabledDate = function(time) {
                        return time.getTime() > day || time.getTime() < createTime
                    };
                    this.$post('/action', {
                        data: {
                            "select": "sys_user",
                            "where": "id=" + data[0].user_id
                        }
                    }).then(data2 => {
                        this.creator = data2[0].name;
                    });
                    this.$post('/action', {
                        data: {
                            "select": "crawl_engine_data_type",
                            "where": ["engine_id=" + this.searchData.engine, "enabled=1"]
                        }
                    }).then(data3 => {
                        if (data3.length == 0) {
                            this.dataTotal = 0;
                            this.pieDataEmpty = true;
                            this.delayLoading = false;
                            this.basisLoading = false;
                        } else {
                            this.dataTotal = data3.length;
                            this.dataTypes = [];
                            //将当前选中的引擎的数据类型存放
                            for (let i = 0; i < data3.length; i++) {
                                let obj = {};
                                obj.subtype = data3[i].data_subtype;
                                obj.id = data3[i].id;
                                obj.name = data3[i].name;
                                obj.engine_id = data3[i].engine_id;
                                this.dataTypes.push(obj)
                            }
                            this.basisLoading = false;
                            this.getDelayByDataType();
                        }
                    })
                }).catch(error => {
                    this.dataTypes = [];
                })
            },
            dataHandleSizeChange() {
                this.dataPageSize = val;
                this.configurationList()
            },
            dataHandleCurrentChange(val) {
                this.dataCurrentPage = val;
                this.configurationList();
            },
            //获取引擎配置信息
            configurationList() {
                this.$post('/action', {
                    data: {
                        "select": "crawl_task_setting",
                        "where": "engine_id=" + this.searchData.engine,
                        "limit": [(this.dataCurrentPage - 1) * this.dataPageSize, this.dataCurrentPage * this.dataPageSize],
                    }
                }).then(data => {
                    if(typeof data != 'undefined') {
                        this.configurationData = data.data;
                        this.baseDataTotal = data.total;
                        for(var i = 0; i < this.configurationData.length; i++) {
                            if(this.configurationData[i].task_setting_rules_attrs) {
                                // this.configurationData[i].task_setting_rules_attrs = this.configurationData[i].task_setting_rules_attrs.replace(/"/g,'');
                                // this.configurationData[i].task_setting_rules_attrs = (this.configurationData[i].task_setting_rules_attrs.substring(1,this.configurationData[i].task_setting_rules_attrs.length - 1)).split(",");
                                this.configurationData[i].task_setting_rules_attrs = this.configurationData[i].task_setting_rules_attrs.split(",")
                            }
                            if(this.configurationData[i].baseline_engine_result) {
                                this.configurationData[i].baseline_engine_result = JSON.parse(this.configurationData[i].baseline_engine_result);
                            }
                            if(this.configurationData[i].dispatched == 1) {
                                if(!(Date.parse(this.configurationData[i].dispatch_time) - Date.parse(this.configurationData[i].storage_time))) {
                                    this.configurationData[i].ping = "无延时";
                                } else {
                                    this.configurationData[i].ping = this.formatDuring(Date.parse(this.configurationData[i].dispatch_time) - Date.parse(this.configurationData[i].storage_time))
                                }
                            } else {
                                this.configurationData[i].ping = "未下发"
                            }
                        }
                        this.baseConfigurationLoading = false;
                    }
                }).catch(error => {
                    this.$message.error({ message: "获取配置信息失败！", type: "error" });
                    this.baseConfigurationLoading = false;
                })
            },
            //获取引擎在线时间等状态
            getEngineOnlineStatus() {
                return new Promise((resolve, reject) => {
                    this.$post(`/engine/heartbeat/${this.searchData.engine}`
                    ).then(data => {
                        resolve(data)
                    }).catch(error => {
                        reject()
                    })
                })
            },
            //统计数据
            newTest() {
                if(this.source2) {
                    this.source2.cancel("请求被取消");
                }
                this.source2 = axios.CancelToken.source();
                this.chartLoading = true;
                let obj = {};
                this.statusData.rows = [];
                let time = this.getDay(0);
                obj.range = [`${time} 00:00:00`, `${time} 23:59:59`];
                obj.engineId = this.searchData.engine;
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine_status",
                        "where": ["engine_id=" + obj.engineId, `time=${obj.range[0]}~${obj.range[1]}`],
                        "fields": ["time", "stats"]
                    }
                }).then(data => {
                    let this_ = this;
                    if (data.length != 0) {
                        let limit = data.length > 100 ? Math.floor(data.length / 100) : 1;
                        let statusData = [];
                        for (let i = data.length - 1; i >= limit; i -= limit) {
                            let result = JSON.parse(data[i].stats);
                            result.time = data[i].time;
                            let obj = {};
                            obj.日期 = result.time;
                            obj.当前运行任务量 = result[1].content[0].value;
                            obj.待发送数据量 = result[0].content[2].value;
                            obj.累计采集数据量 = result[0].content[1].value;
                            obj.累计发送成功量 = result[0].content[0].value;
                            statusData.push(obj)
                        }
                        this_.statusData.rows = statusData.reverse();
                        this.dataEmpty = false;
                        this.chartLoading = false;
                    } else {
                        this.dataEmpty = true;
                        this.chartLoading = false;
                    }
                }).catch(error => {
                    if(error.message != '请求被取消') {
                        this.chartLoading = false;
                        this.dataEmpty = true;
                        this.$message.error({ message: "获取引擎采集数据统计失败！", type: "error" })
                    }
                })
            },
            closeEditOrderDialog() {
                this.resetForm('engineCommandForm');
                this.editOrderDialogVisible = false;
                this.editOrderForm = {
                    command: null,
                    sid: null,
                    name: null,
                    type: null,
                    args: null,
                    engine_id: null,
                    storage_time: null,
                    description: null,
                    dispatched: 0,
                    arg: null,
                };
                this.commands = [];
            },
            commandChange() {
                this.addInstructionHint = this.hintData[this.editOrderForm.command]
            },
            saveEditOrderForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let engineId = this.searchData.engine;
                        this.editOrderLoading = true;
                        var date = new Date();
                        for (let i = 0; i < this.commands.length; i++) {
                            if (this.editOrderForm.command == this.commands[i].label) {
                                this.editOrderForm.engine_id = this.commands[i].engine_id;
                                this.editOrderForm.sid = this.commands[i].sid;
                                this.editOrderForm.description = this.commands[i].description;
                            }
                        }
                        this.$post('/action', {
                            data: {
                                "insert": "crawl_engine_instruction",
                                "values": {
                                    "engine_id": this.editOrderForm.engine_id,
                                    "name": this.editOrderForm.command,
                                    "description": this.editOrderForm.description,
                                    "storage_time": this.format(date, "yyyy-MM-dd HH:mm:ss"),
                                    "dispatched": this.editOrderForm.dispatched,
                                    "sid": this.editOrderForm.sid,
                                    "args": this.editOrderForm.arg,
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
                                        "detail": "下发指令成功，指令对应引擎Id为" + this.editOrderForm.engine_id + "指令描述名称为" + this.editOrderForm.command,
                                        "is_submitted": 0
                                    }
                                }
                            });
                            this.resetForm(formName);
                            this.editOrderLoading = false;
                            this.editOrderDialogVisible = false;
                            this.$message.success({message: '下发指令成功', type: 'success'});
                            this.editOrderForm = {
                                command: null,
                                sid: null,
                                name: null,
                                type: null,
                                args: null,
                                engine_id: null,
                                storage_time: null,
                                description: null,
                                dispatched: 0,
                                arg: null,
                            };
                            this.commands = [];
                            //弹出操作
                            this.$confirm('是否跳转查看引擎指令列表', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$message.success({message: "将在一秒后跳转", type: "success"});
                                let router = this.$router;
                                setTimeout(function () {
                                    router.push({
                                        name: 'log_view_configuration',
                                        params: {
                                            engineId: engineId
                                        }
                                    })
                                }, 1000);
                            })
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
                                        "detail": "下发指令失败",
                                        "is_submitted": 0
                                    }
                                }
                            });
                            this.resetForm(formName);
                            this.editOrderLoading = false;
                            this.editOrderDialogVisible = false;
                            this.$message.error({message: '下发指令失败', type: 'error'});
                            this.editOrderForm = {
                                command: null,
                                sid: null,
                                name: null,
                                type: null,
                                args: null,
                                engine_id: null,
                                storage_time: null,
                                description: null,
                                dispatched: 0,
                                arg: null,
                            };
                            this.commands = [];
                        })
                    } else {
                        this.editOrderLoading = false;
                        return false
                    }
                })

            },
            openEditOrderDialog(val) {
                if (!this.searchData.engine) {
                    this.$message.error({message: "正在加载引擎ID！请稍后点击！", type: "error"})
                } else {
                    this.commands = [];
                    this.editOrderDialogVisible = true;
                    //获取指令信息
                    this.$post('/action', {
                        data: {
                            "select": "crawl_engine_instruction_contrast",
                            "where": ["is_local=1"]
                        }
                    }).then(data => {
                        for (var i = 0; i < data.length; i++) {
                            let obj = {};
                            obj.label = data[i].show_name;
                            obj.sid = data[i].cmd;
                            obj.engine_id = val;
                            obj.description = data[i].description;
                            this.commands.push(obj)
                        }
                    })
                }
            },
            //utc标准时间转换为后端使用的时间
            format(time, format) {
                var t = new Date(time);
                var tf = function (i) {
                    return (i < 10 ? '0' : '') + i
                };
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //统计数据时间选择器
            serverTimeChange() {
                if(this.source2) {
                    this.source2.cancel("请求被取消");
                }
                this.source2 = axios.CancelToken.source();
                this.chartLoading = true;
                let obj = {};
                this.statusData.rows = [];
                obj.range = [this.searchData.time[0], this.searchData.time[1]];
                obj.engineId = this.searchData.engine;
                this.$post('/action', {
                    data: {
                        "select": "crawl_engine_status",
                        "where": ["engine_id=" + obj.engineId, `time=${obj.range[0]}~${obj.range[1]}`]
                    }
                }).then(data => {
                    let this_ = this;
                    if (data.length != 0) {
                        let limit = data.length > 100 ? Math.floor(data.length / 100) : 1;
                        let statusData = [];
                        for (let i = data.length - 1; i >= limit; i -= limit) {
                            let result = JSON.parse(data[i].stats);
                            result.time = data[i].time;
                            let obj = {};
                            obj.日期 = result.time;
                            obj.当前运行任务量 = result[1].content[0].value;
                            obj.待发送数据量 = result[0].content[2].value;
                            obj.累计采集数据量 = result[0].content[1].value;
                            obj.累计发送成功量 = result[0].content[0].value;
                            statusData.push(obj)
                        }
                        this_.statusData.rows = statusData.reverse();
                        this.dataEmpty = false;
                        this.chartLoading = false;
                    } else {
                        this.dataEmpty = true;
                        this.chartLoading = false;
                    }
                }).catch(error => {
                    if(error.message != '请求被取消') {
                        this.dataEmpty = true;
                        this.$message.error({ message: "获取引擎采集数据统计失败！", type: "error" })
                    }
                })
            },
            //获取引擎下数据类型的延时信息
            async getDelayByDataType() {
                this.delaySeries = [];
                let this_ = this;
                let getDataTypeName = function(subtype) {
                    return new Promise((resolve, reject) => {
                        this_.$post(`/unifiedQuery/DataType?code=${subtype}`).then(result => {
                            resolve(result.name)
                        }).catch(err => {
                            resolve(null)
                        });
                    })
                };
                let getDelay = function(i) {
                    return new Promise((resolve, reject) => {
                        this_.$post('/action', {
                                data: {
                                    "select": "crawl_task_result_text_meta",
                                    "where": ["data_type_id=" + this_.dataTypes[i].id],
                                    "order": ["storage_time desc"],
                                    "limit": [0, 100]
                                },
                            },
                        ).then(data => {
                            if (data.data.length != 0) {
                                let obj = {};
                                //采集延时
                                let crawlTime = 0;
                                //发布延时
                                let storageTime = 0;
                                //生成图表
                                this_.delayData.columns.push(dataTypeName);
                                for (let j = 0; j < data.data.length; j++) {
                                    crawlTime += (data.data[j].crawl_time == null || data.data[j].publish_time == null) ? 0 : this_.formatDuring2(Date.parse(data.data[j].crawl_time) - Date.parse(data.data[j].publish_time));
                                    storageTime += (data.data[j].storage_time == null || data.data[j].crawl_time == null) ? 0 : this_.formatDuring2(Date.parse(data.data[j].storage_time) - Date.parse(data.data[j].crawl_time));
                                }
                                crawlTime = Math.ceil(crawlTime / data.data.length);
                                storageTime = Math.ceil(storageTime / data.data.length);
                                obj.name = dataTypeName;
                                obj.type = 'bar';
                                obj.barWidth = 20;
                                obj.data = [];
                                obj.data.splice(0, 0, crawlTime);
                                obj.data.splice(1, 0, storageTime);
                                this_.delaySeries.push(obj);
                                // 如果采集延时大于2小时
                                if (crawlTime >= 7200) {
                                    this_.$post('/action', {
                                        data: {
                                            "select": "crawl_engine",
                                            "where": ["id=" + this_.searchData.engine],
                                            "fields": ["engine_name"]
                                        }
                                    }).then(data2 => {
                                        this_.$post('/action', {
                                            data: {
                                                "insert": "crawl_platform_alarms",
                                                "values": {
                                                    "level": "严重",
                                                    "time": this_.getTime(),
                                                    "type": "采集延时过长",
                                                    "detail": "引擎" + data2[0].engine_name + '，对应data_type_id:' + this_.dataTypes[i].id + '的采集延时过长'
                                                }
                                            }
                                        }).then(data => {
                                            this.$message.success({message: "已对采集延时过长的问题进行报警，可至平台状态页面或点击页面右上角查看", type: "success"})
                                        }).catch(err => {
                                            this.$message.error({message: "对采集延时过长的问题报警失败！", type: "error"})
                                        })
                                    })
                                }
                                if (storageTime >= 1200) {
                                    this_.$post('/action', {
                                        data: {
                                            "select": "crawl_engine",
                                            "where": ["id=" + this_.searchData.engine],
                                            "fields": ["engine_name"]
                                        }
                                    }).then(data3 => {
                                        this_.$post('/action', {
                                            data: {
                                                "insert": "crawl_platform_alarms",
                                                "values": {
                                                    "level": "严重",
                                                    "time": this_.getTime(),
                                                    "type": "数据回传延时过长",
                                                    "detail": "引擎" + data3[0].engine_name + '，对应data_type_id:' + this_.dataTypes[i].id + '的数据回传延时过长'
                                                }
                                            }
                                        }).then(data => {
                                            this_.$message({
                                                message: "已对数据回传延时过长的问题进行报警，可至平台状态页面或点击页面右上角查看",
                                                type: "success"
                                            })
                                        }).catch(err => {
                                            this_.$message({message: "对数据回传延时过长的问题报警失败！", type: "error"})
                                        })
                                    })
                                }
                                resolve();
                            } else {
                                let obj = {};
                                this_.delayData.columns.push(dataTypeName);
                                obj.name = dataTypeName;
                                obj.type = 'bar';
                                obj.barWidth = 20;
                                obj.data = [];
                                obj.data.splice(0, 0, 0);
                                obj.data.splice(1, 0, 0);
                                this_.delaySeries.push(obj);
                                errCount += 1;
                                if (errCount == this_.dataTypes.length) {
                                    this_.pieDataEmpty = true;
                                }
                            }
                            resolve();
                        }).catch(err => {
                            errCount += 1;
                            if (errCount == this_.dataTypes.length) {
                                this_.pieDataEmpty = true;
                            }
                        })
                    })
                };
                //判断是否显示暂无数据
                let errCount = 0;
                for (let i = 0; i < this.dataTypes.length; i++) {
                    //调用总线统一查询接口获取数据类型名称
                    var dataTypeName = await getDataTypeName(this.dataTypes[i].subtype);
                    dataTypeName = dataTypeName == null ? this.dataTypes[i].name : dataTypeName;
                    await getDelay(i);
                }
                this.delayLoading = false;
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
            //获取当前时间
            getTime() {
                var date = new Date();
                var year = date.getFullYear();
                //月份会莫名其妙少一个月
                var month = date.getMonth() + 1;
                var day = date.getDate();

                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                //这样写显示时间在1~9会挤占空间；所以要在1~9的数字前补零;
                if (month < 10) {
                    month = '0' + month
                }
                if (day < 10) {
                    day = '0' + day
                }
                if (hour < 10) {
                    hour = '0' + hour;
                }
                if (minute < 10) {
                    minute = '0' + minute;
                }
                if (second < 10) {
                    second = '0' + second;
                }
                var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                return time;
            },
            //毫秒转时间2 用于计算延时
            formatDuring2(my_time) {
                var seconds = my_time / 1000;
                var time = Math.floor(seconds);
                return time;
            },
            getBaseEngine() {
                return new Promise((resolve, reject) => {
                    this.$post('/action', {
                        data: {
                            "select": "crawl_engine_base_relation",
                            "where": ["engine_id=" + this.searchData.engine]
                        }
                    }).then(data => {
                        resolve(data);
                    }).catch(err => {
                        let message = this.$message.error({message: "获取基线引擎失败！", type: "error"});
                        reject(message)
                    })
                });
            },
            getBaseEngineMessage(data) {
                return new Promise((resolve, reject) => {
                    let list = [];
                    let i = 0;
                    data.forEach(val => {
                        this.$post('/action', {
                            data: {
                                "select": "crawl_task_setting",
                                "where": ["engine_id=" + val.basis_engine_id]
                            }
                        }).then(data2 => {
                            data2.forEach(val => {
                                list.push(val)
                            });
                            i++;
                            if (i == data.length) {
                                resolve(list)
                            }
                        })
                    });
                })
            },
            getBaseEngineMessageObj(data) {
                return new Promise((resolve, reject) => {
                    let dataResult = [];
                    data.forEach(taskSettingVal => {
                        if (typeof taskSettingVal.baseline_engine_result == 'string') {
                            let obj2 = {};
                            obj2[`附属基线引擎${taskSettingVal.engine_id}的运行结果`] = JSON.parse(taskSettingVal.baseline_engine_result);
                            dataResult.push(obj2);
                        }
                    });
                    resolve(dataResult)
                })
            },
            //获取引擎下所属基线引擎的返回结果
            //导出故障校验报告
            async exportFaultReport() {
                let obj = {};
                let date = this.$nowYearMonthDay();
                //获取引擎所有的基线引擎
                let data = await this.getBaseEngine();
                if(data.length != 0) {
                    let list = await this.getBaseEngineMessage(data);
                    let dataResult = await this.getBaseEngineMessageObj(list);
                    obj["附属基线引擎校验报告"] = dataResult;
                }
                obj["引擎异常"] = this.platformData;
                obj["引擎错误日志"] = this.engineErrorLogDataLocal;
                let blob = new Blob([JSON.stringify(obj)], {type: ""});
                fileSaver.saveAs(blob, `引擎${this.searchData.engine}的故障校验报告-${date}.json`)
            },
            //弹窗关闭
            closeDialog() {
                this.creatorDialogVisible = false;
                this.dataTypeInfoVisible = false;
            },
            load() {
                this.list();
            },
        },
        created() {
            this.engineList();
        },
        mounted() {
            this.$user = JSON.parse(localStorage.user);

        },
    }
</script>

<style>
  .page-engine_status {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color: #606266
  }

  .page-engine_status .page-engine_status_box {
    height: 100%;
    background: #fff;
  }

  .page-engine_status .page-engine_status_box .basisStatusButton {
    margin-right: 20px;
    float: right;
    padding: 0;
  }

  .el-card__header {
    padding: 18px 10px 18px 10px;
  }

  .el-card__body {
    padding: 18px 18px 18px 10px;
  }

  .small-box-card .el-card__body {
    padding: 5px;
  }

  .clearfix .title {
    float: left;
    font-size: 22px;
  }

  .page-engine_status .page-engine_status_box .box-card {
    position: relative;
    height: 220px;
  }

  .page-engine_status .page-engine_status_box .box-card2 {
    width: 105px;
    height: 105px;
    padding: 10px;
  }

  /*.page-engine_status .page-engine_status_box .small-box-card {*/
  /*  width: 105px;*/
  /*}*/
  .page-engine_status .page-engine_status_box .small-box-card:hover {
    cursor: pointer;
  }


  .page-engine_status .page-engine_status_box .box-card3 {
    padding: 10px;
    margin-top: 10px;
    width: 105px;
    height: 105px;
  }

  .page-engine_status .page-engine_status_box .pie_card {
    position: relative;
    height: 220px;
  }
  .page-engine_status .page-engine_status_box .pie_card p {
    margin-top: 5px;
    margin-left: 10px;
    float: left;
    font-size: 18px;
    color: #000000;
  }
  .page-engine_status .page-engine_status_box .pie_card span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #888;
  }

  .page-engine_status .page-engine_status_box .noEngines {
    position: relative;
    height: 220px;
  }
  .page-engine_status .page-engine_status_box .noEngines span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #888;
  }
  .page-engine_status .page-engine_status_box .box-card4 {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .page-engine_status .page-engine_status_box .box-card5 {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .page-engine_status .page-engine_status_box .statistics_box {
    margin-top: 10px;
  }

  .page-engine_status .page-engine_status_box .text {
    font-size: 14px;
    text-align: left;
    margin-top: 15px;
  }

  .page-engine_status .page-engine_status_box .item {
    margin-bottom: 18px;
  }

  .page-engine_status .page-engine_status_box .text p {
    margin-bottom: 10px;
  }

  .page-engine_status .page-engine_status_box .text .span_name {
    color: #606266;
    margin-right: 10px;
    font-weight: 900;
  }

  .page-engine_status .page-engine_status_box .text .span_value {
    margin-right: 20px;
    float: right;
  }
  .page-engine_status .page-engine_status_box .text .span_value_cursor {
    cursor: pointer;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .page-engine_status .page-engine_status_box .box-card .basisStatus {
    position: relative;
    height: 70px;
    width: 100%;
  }

  .page-engine_status .page-engine_status_box .box-card .engine_run {
    position: absolute;
    float: left;
    left: 30px;
    top: 5px;
  }

  .page-engine_status .page-engine_status_box .box-card .status_value {
    position: absolute;
    float: left;
    left: 30px;
    top: 53px;
    font-size: 14px;
    color: #4eaf08;
  }

  .page-engine_status .page-engine_status_box .box-card .status_value_warn {
    position: absolute;
    float: left;
    left: 30px;
    top: 53px;
    font-size: 14px;
    color: #e04006;
  }

  .page-engine_status .page-engine_status_box .box-card .turn_on_time {
    position: absolute;
    font-weight: 900;
    top: 20px;
    left: 110px;
    height: 20px;
    color: #606266;
    display: inline;
  }

  .page-engine_status .page-engine_status_box .box-card .turn_on_time_value {
    position: absolute;
    white-space: nowrap;
    top: 20px;
    left: 210px;
    height: 20px;
    display: inline;
  }

  .page-engine_status .page-engine_status_box .box-card .online_time {
    position: absolute;
    font-weight: 900;
    top: 50px;
    left: 110px;
    height: 20px;
    color: #606266;
    display: inline;
  }

  .page-engine_status .page-engine_status_box .box-card .online_time_value {
    position: absolute;
    white-space: nowrap;
    display: inline;
    top: 50px;
    left: 210px;
    height: 20px;
  }

  .page-engine_status .page-engine_status_box .box-card .engine_info {
    position: relative;
    width: 100%;
    height: 120px;
    top: 20px;
    text-align: left;
    font-size: 14px;
  }

  .page-engine_status .page-engine_status_box .box-card .engine_info p {
    margin-bottom: 10px;
  }

  .page-engine_status .page-engine_status_box .box-card .engine_info .name {
    font-weight: 900;
    color: #606266;
    margin-left: 10px;
  }

  .page-engine_status .page-engine_status_box .box-card .engine_info .value {
    color: #000000;
    float: right;
    margin-right: 40px;
  }

  .page-engine_status .page-engine_status_box .box-card2 .engine_status_value_warn {
    margin-top: 1px;
    font-size: 14px;
    color: rgb(224, 64, 6);
  }

  .page-engine_status .page-engine_status_box .box-card2 .engine_status_value_normal {
    margin-top: 1px;
    font-size: 14px;
    color: rgb(26, 250, 41);
  }

  .page-engine_status .page-engine_status_box .box-card2 .engine_status_value_none {
    font-size: 14px;
    margin-top: 32px;
    text-align: center;
  }

  .page-engine_status .page-engine_status_box .box-card3 .history_value {
    margin-top: 6px;
    font-size: 14px;
  }

  .page-engine_status .page-engine_status_box .small-box-card .box-card3 .engine_status_receive {
  }

  .page-engine_status .page-engine_status_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
  }

  .page-engine_status
  .page-engine_status_box
  .search_form
  .title {
    font-size: 20px;
    height: 35px;
    line-height: 35px;
  }

  .page-engine_status
  .page-engine_status_box
  .search_form
  .title
  .title_i {
    margin-right: 5px;
  }

  .page-engine_status
  .page-engine_status_box
  .search_form
  .inner {
    margin-top: 15px;
    display: inline;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .div1 {
    position: relative;
    border-radius: 4px;
    /*padding: 35px 30px;*/
    overflow: hidden;
    height: 170px;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .gray {
    background: #fff;
    border: 1px solid #9d9d9d;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .div1
  .div11 {
    margin-left: 10px;
    float: left;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .div1
  .div12 {
    position: absolute;
    float: left;
    margin-left: 20px;
    margin-top: 85px;
    font-size: 18px;
    color: #843534;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .div1
  .div13 {
    position: absolute;
    float: left;
    margin-left: 15px;
    margin-top: 120px;
    font-size: 15px;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .div1
  .engine_heartbeat {
    position: absolute;
    float: left;
    margin-left: 15px;
    margin-top: 140px;
    font-size: 15px;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .div1
  .div14 {
    position: absolute;
    float: left;
    margin-left: 20px;
    margin-top: 85px;
    font-size: 18px;
    color: #398439;
  }

  .page-engine_status
  .page-engine_status_box
  .engine_status_content
  .div1
  .div13
  .value {
    color: #000;
    margin-left: 10px;
  }

  .page-engine_status
  .page-engine_status_box
  .div2 {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid #9d9d9d;;
    height: 170px;
  }

  .page-engine_status
  .page-engine_status_box
  .div2
  .div21 {
    margin-top: 20px;
  }

  .page-engine_status
  .page-engine_status_box
  .div2
  .div22 {
    position: absolute;
    text-align: center;
    margin-left: 35px;
    margin-top: 20px;
    font-size: 18px;
    color: #4cae4c;
  }

  .page-engine_status
  .page-engine_status_box
  .div2
  .div23 {
    position: absolute;
    text-align: center;
    margin-left: 30px;
    margin-top: 20px;
    font-size: 18px;
    color: #c9302c;
  }

  .page-engine_status .page-engine_status_box .list {
    background: #fff;
    text-align: center;
    border-right: 1px solid #ebeef5;
    padding: 0 15px;
  }

  .page-engine_status .page-engine_status_box .list:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }


  .page-engine_status
  .page-engine_status_box
  .list
  .app-table
  .label_p {
    font-size: 18px;
    height: 35px;
    line-height: 35px;
    text-align: left;
  }

  .page-engine_status
  .page-engine_status_box
  .list
  .label_p {
    font-size: 18px;
    height: 35px;
    line-height: 35px;
    text-align: center;
  }

  .page-engine_status
  .page-engine_status_box
  .list
  .el-table--small
  th,
  .page-engine_status
  .page-engine_status_box
  .list
  .el-table--small
  td {
    background: #fff;
    text-align: center;
  }

  .page-engine_status
  .page-engine_status_box
  .code {
    margin: 15px 0;
    background: #fff;
  }

  .page-engine_status
  .page-engine_status_box
  .el-table__expanded-cell {
    padding: 15px;
  }
  .page-engine_status
  .page-engine_status_box
  .demo-table-expand
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .info .el-form-item__label {
    color: #45c130;
  }
  .error .el-form-item__label {
    color: #c9302c;
  }
  .warning .el-form-item__label {
    color: #df5000;
  }
  .page-engine_status
  .page-engine_status_box
  .el-form-item__content {
    float: left;
  }
</style>
