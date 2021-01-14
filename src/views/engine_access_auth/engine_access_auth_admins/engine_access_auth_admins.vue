<template>
	<div class="page-engine_access_auth_admins">
		<div class="page-engine_access_auth_admins_box">
			<div class="search_form">
				<div class="title"><i class="icon iconfont icon-chaxun"></i>搜索条件</div>
				<div class="inner">
					<span>引擎名称</span>
					<el-input v-model="searchData.name" placeholder="请输入"></el-input>
					<span>标签</span>
					<el-input v-model="searchData.name" placeholder="请输入"></el-input>
					<el-button type="primary" icon="el-icon-search">搜索</el-button>
				</div>
			</div>
			<div class="list">
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="id" label="引擎ID">
					</el-table-column>
					<el-table-column prop="name" label="引擎名称">
					</el-table-column>
					<el-table-column prop="company" label="公司名">
					</el-table-column>
					<el-table-column prop="contacts" label="联系人">
					</el-table-column>
					<el-table-column prop="target" label="采集目标">
					</el-table-column>
					<el-table-column prop="edition" label="版本">
					</el-table-column>
					<el-table-column prop="tag" label="标签">
					</el-table-column>
					<el-table-column prop="status" label="状态">
					</el-table-column>
					<el-table-column prop="edit" label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small">注销</el-button>
						</template>
					</el-table-column>

				</el-table>
				<div class="list_pagination">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400" />
				</div>
			</div>
		</div>
		<el-button>engine_access_auth_admins</el-button>
	</div>
</template>

<script>
	import permission from "@/components/mixin/permission";

	export default {
		mixins: [permission],
		name: "engine_access_auth_admins",
		data () {
			return {
				searchData: {
					name: "",
					tag: ""
				},
				tableData: [
					{
						id: 1,
						name: "xxxx",
						company: "xxxx",
						contacts: "fang",
						target: "menu",
						edition: "1",
						tag: "a",
						status: "true",
						edit: ""
					}
				],
				currentPage4: 1,
			};
		},
		methods: {
			handleSizeChange () { },
			handleCurrentChange () { },
		},
		mounted () { }
	};
</script>

<style>
.page-engine_access_auth_admins {
    width: 100%;
    height: 100%;
    padding: 0 15px;
    font-size: 14px;
}
.page-engine_access_auth_admins .page-engine_access_auth_admins_box {
    width: 100%;
    height: 100%;
    padding: 15px;
}
.page-engine_access_auth_admins .page-engine_access_auth_admins_box .search_form {
    background: #fff;
    padding: 15px;
    overflow: hidden;
}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .search_form
    .title {
    height: 35px;
    line-height: 35px;
}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .search_form
    .title
    i {
    margin-right: 5px;
}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .search_form
    .inner {
    margin-top: 10px;
}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .search_form
    .inner
    .el-input {
    max-width: 30%;
    margin-right: 20px;
}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .search_form
    .inner
    > span {
    margin-right: 10px;
}
.page-engine_access_auth_admins .page-engine_access_auth_admins_box .list {
    background: #fff;
    text-align: center;
    margin-top: 15px;
    border-right: 1px solid #ebeef5;
}
.page-engine_access_auth_admins .page-engine_access_auth_admins_box .list:after{
     content:".";
     display:block;
     height:0;
     clear:both;
     visibility:hidden;

}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .list
    .el-table--small
    th,
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .list
    .el-table--small
    td {
    background: #fff;
    text-align: center;
}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .list
    .list_pagination{
        margin:20px;
}
.page-engine_access_auth_admins
    .page-engine_access_auth_admins_box
    .code{
        margin: 15px 0;
        background: #fff;
    }
</style>
