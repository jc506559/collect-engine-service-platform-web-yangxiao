<template>
	<!-- 引擎类型管理 -->
	<div class="page-engine_access_auth_search">
		<div class="page-engine_access_auth_search_box">
			<div class="search_form">
				<div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
				<div class="inner">
					<span>引擎名称</span>
					<el-input v-model="searchForm.engine_name" placeholder="请输入" @keyup.enter.native="search"></el-input>
					<el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" class="export_all" @click="exportAll('export')">全部导出</el-button>
				</div>
			</div>
			<!-- table表格 -->
			<div class="app-table">
				<!-- 表格 -->
				<el-table stripe border tooltip-effect="dark" ref="tableElement" :data="tableData" v-loading="loading">
          <el-table-column prop="id__crawl_task_setting_engine_relation.task_setting_rules_range_no" label="引擎Id" align="center" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.engine_type == 0">{{ scope.row.id__crawl_task_setting_engine_relation.task_setting_rules_range_no }}</div>
              <div v-if="scope.row.engine_type == 1">{{ scope.row.id }} </div>
            </template>
          </el-table-column>
					<el-table-column prop="engine_name" label="引擎名称" align="center" show-overflow-tooltip>
					</el-table-column>
          <el-table-column prop="last_verify_time" label="最新认证时间" align="center" >
            <template slot-scope="scope">
              <div v-if="scope.row.last_verify_time">{{ scope.row.last_verify_time }}</div>
              <div v-else>未认证</div>
            </template>
          </el-table-column>
          <el-table-column prop="token" label="Token值" align="center" width="370">
            <template slot-scope="scope">
              <div v-if="scope.row.token">{{ scope.row.token }}</div>
              <div v-else>无</div>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="平台接口地址" align="center"
          ></el-table-column>
					<el-table-column prop="token_effect_time" label="Token生效时间" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.token_effect_time">{{ scope.row.token_effect_time }}</div>
              <div v-else>未认证</div>
            </template>
					</el-table-column>
					<el-table-column prop="period" label="Token到期时间" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.period">{{ scope.row.period }}</div>
              <div v-else>未认证</div>
            </template>
					</el-table-column>
          <el-table-column label="操作" prop="edit" align="center">
            <template slot-scope="scope">
              <div style="text-align: center">
                <el-button type="text" size="small" @click="exportTable(scope.row, 'export')">导出</el-button>
              </div>
            </template>
          </el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<div class="app-pagination">
				<el-pagination :total="total" :page-size="pageSize" :page-sizes="pageSizes" :current-page="currentPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import permission from "@/components/mixin/permission";
	import fileSaver from 'file-saver';
	// 公共方法
	export default {
		mixins: [permission],
		name: 'engine_manage_auth_search',
		computed: {
		},
		data () {
			return {
				// 查询
				searchForm: {},
				$user:null,//当前登录用户
				// 列表相关
				tableName: "crawl_engine",
				loading: false,
				order: ['id desc'],
				where: [],
				currentPage: 1,
				pageSize: 20,
				total: 0,
				pageSizes: [20, 50, 100, 200],
				tableData: [],
        configurationData: {},
				multipleSelection: [],
			}
		},
		methods: {
      // 权限管理，获取该用户在该页面的权限
      getPermission(type) {
          return this.permission.engine_manage_auth_search[type];
      },
			renderStatus (state) {
				switch (state) {
					case 0:
						return '未启动'
						break;
					case 1:
						return '已启动'
						break;
					default:
						break;
				}
			},
			// 搜索
			search () {
				this.currentPage = 1;
				this.where = [];
				if (this.searchForm.engine_name) {
					this.where.push('engine_name%=%' + this.searchForm.engine_name + '%')
				}
				this.list()
			},
			// 修改分页数量
			handleSizeChange (val) {
				this.pageSize = val;
				this.list();
			},
			// 切换分页
			handleCurrentChange (val) {
				this.currentPage = val;
				this.list();
			},
			// 勾选选中项, 并批量删除按钮状态
			handleSelectionChange (arr) {
				// 部分选择
				if (arr.length >= 1) {
					this.deleteBatchBtnDisabled = false;
				} else {
					this.deleteBatchBtnDisabled = true;
				}
				this.multipleSelection = arr;
			},
			// 排序
			handleSortChange (column) {
				// console.log(column, prop, order);
				this.order = column.prop && column.order
					? [column.prop + ' ' + column.order.replace("ending", "")]
					: [];
				this.list();
			},
			// 获取列表
			list () {
				if(this.$user.roleId != 1){
					this.where.push('user_id=' + this.$user.id);
				}
				this.where.push('enabled=' + 1);
				this.loading = true;
				this.$post('/action', {
					data: {
						"select": this.tableName,
						"limit": [(this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize],
            "join": "crawl_task_setting_engine_relation",
						"where": this.where,
						"order": ["crawl_engine.create_time desc"]
					}
				}).then(data => {
					  this.loading = false;
						this.tableData = data.data;
						this.total = data.total;
            for(var i = 0; i < this.tableData.length; i++) {
                if(this.tableData[i].last_verify_time) {
                    this.tableData[i].last_verify_time = this.tableData[i].last_verify_time.substring(0,19);
                }
                if(this.tableData[i].token_effect_time) {
                    this.tableData[i].token_effect_time = this.tableData[i].token_effect_time.substring(0,19);
                }
                if(this.tableData[i].period) {
                    this.tableData[i].period = this.tableData[i].period.substring(0,19)
                }
                this.tableData[i] = Object.assign(this.tableData[i], this.configurationData)
            }
				}).catch(error => {
					this.loading = false;
					this.$message.error({ message: "获取列表失败", type: "error" })
				})
			},
      // 获取接口IP地址和端口
      getIpAndPort() {
			    this.$post('/action', {
			        data: {
			            "select": "crawl_platform_config",
                  "limit": [0,999]
          }
          }).then(data => {
              //获取相应配置标签的配置数据
              for(var i = 0; i < data.data.length-1; i++) {
                  if(data.data[i].type == "engine_interface_info") {
                      var key = data.data[i].key;
                      this.configurationData[key] = data.data[i].value + ":" + data.data[i+1].value
                  }
              }
              this.list();
          })
      },
      exportTable(row, type) {
          if(this.getPermission(type)) {
              var data = {};
              var date = this.$nowYearMonthDay();
              data['引擎Id'] = row.id;
              data['引擎在总线Id'] = row.id__crawl_task_setting_engine_relation.task_setting_rules_range_no;
              data['引擎名称'] = row.engine_name;
              data['最新认证时间'] = row.last_verify_time;
              data['Token值'] = row.token;
              data['平台接口IP'] = row.ip;
              data['Token生效时间'] = row.token_effect_time;
              data['Token到期时间'] = row.period;
              var blob = new Blob([JSON.stringify(data)], { type: "" });
              fileSaver.saveAs(blob, `${row.engine_name}-${date}.json`)
          } else {
              this.$message.error({ message: "没有操作权限", type: "error"})
          }
      },
      exportAll(type) {
          if(this.getPermission(type)) {
              let data = {};
              let date = this.$nowYearMonthDay();
              for(let i = 0; i < this.tableData.length; i++) {
                  let obj = {};
                  obj['引擎Id'] = this.tableData[i].id;
                  obj['引擎在总线Id'] = this.tableData[i].id__crawl_task_setting_engine_relation.task_setting_rules_range_no;
                  obj['引擎名称'] = this.tableData[i].engine_name;
                  obj['最新认证时间'] = this.tableData[i].last_verify_time;
                  obj['Token值'] = this.tableData[i].token;
                  obj['平台接口IP'] = this.tableData[i].ip;
                  obj['Token生效时间'] = this.tableData[i].token_effect_time;
                  obj['Token到期时间'] = this.tableData[i].period;
                  data[`${this.tableData[i].engine_name}认证信息`] = obj;
              }
              let blob = new Blob([JSON.stringify(data)], {type: ""});
              fileSaver.saveAs(blob, `引擎认证信息-${date}.json`)
          } else {
              this.$message.error({ message: "没有操作权限", type: "error"})
          }
      },
			load () {
				this.getIpAndPort();
			},
			clear () {
			}
		},
    created() {

    },
		mounted () {
			this.$user = JSON.parse(localStorage.user);
      this.load()
		},
		destroyed () {
			this.clear()
		}
	}
</script>

<style>
.page-engine_access_auth_search {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
    color:#606266;
}
.page-engine_access_auth_search .page-engine_access_auth_search_box{
  height: 100%;
  background: #fff;
}
.page-engine_access_auth_search .page-engine_access_auth_search_box .search_form {
    background: #fff;
    padding: 15px;
}
.page-engine_access_auth_search .page-engine_access_auth_search_box .app-table{
  padding:0 15px;
}
.page-engine_access_auth_search
    .page-engine_access_auth_search_box
    .search_form
    .title {
    height: 35px;
    line-height: 35px;
}
.page-engine_access_auth_search
    .page-engine_access_auth_search_box
    .search_form
    .title
    i {
    margin-right: 5px;
}
.page-engine_access_auth_search
    .page-engine_access_auth_search_box
    .search_form
    .inner {
    margin-top: 10px;
}
.page-engine_access_auth_search
.page-engine_access_auth_search_box
.search_form
.inner
.export_all {
  float: right;
  margin-right: 60px;
}
.page-engine_access_auth_search
    .page-engine_access_auth_search_box
    .search_form
    .inner
    .el-input {
    max-width: 30%;
    margin-right: 20px;
}
.page-engine_access_auth_search
    .page-engine_access_auth_search_box
    .search_form
    .inner
    > span {
    margin-right: 10px;
}
</style>
