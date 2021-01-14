<template>
  <div class="mod-sql-editor">

    <div class="app-border-box">

      <el-input v-model="sqlEdit" placeholder="SQL编辑" class="input"></el-input>

      <el-popover
        placement="top"
        v-model="saveTemplate">
        <div class="sql-tpl-popover">
          <p>保存为模板</p>
          <el-input placeholder="请输入模板名称"></el-input>
          <div class="btn-group">
            <el-button size="mini" type="info" @click="saveTemplate = false">取消</el-button>
            <el-button type="primary" size="mini" @click="saveTemplate = false">确定</el-button>
          </div>
        </div>
        <el-button type="info" slot="reference" size="mini">保存为模板</el-button>
      </el-popover>

    </div>

    <el-button class="sql-select-tpl" type="success" @click="sqlDialog = true">选择SQL模板</el-button>
    <el-button class="sql-search" type="primary">查询</el-button>

    <!--SQL弹窗-->
    <el-dialog
      title="选择SQL模板"
      :append-to-body="true"
      :visible.sync="sqlDialog"
      width="40%">
      <el-table :data="templateTable" stripe class="sql-table">
        <el-table-column
          align="center"
          width="50">
          <template slot-scope="scope">
            <el-radio></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="模板名称" prop="date" align="left"></el-table-column>
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="scope">
            <div class="app-icon">
              <i class="el-icon-delete red" title="删除" @click="deleteRow(scope.$index, templateTable)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="info" @click="sqlDialog = false">取消</el-button>
        <el-button size="medium" type="primary" @click="sqlDialog = false">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'mod-sql-editor',
    data() {
      return {
        //SQL编辑
        sqlEdit: "",
        //保存为模板
        saveTemplate: false,
        //SQL弹窗
        sqlDialog: false,
        //SQL弹窗表格
        templateTable: [
          {
            date: "SQL模板名称AAAAAAAA"
          },
          {
            date: "2016-05-04"
          },
          {
            date: "2016-05-01"
          },
          {
            date: "2016-05-01"
          },
          {
            date: "2016-05-01"
          },
          {
            date: "2016-05-01"
          },
          {
            date: "2016-05-01"
          },
          {
            date: "2016-05-01"
          },
          {
            date: "2016-05-03"
          }
        ],
        //字段查询条件初始化
        isShow: true,
        //请输入字段名称
        searchTargetTable: "",
      }
    },
    methods: {},
    mounted() {
    }
  }
</script>

<style>
  .mod-sql-editor {
    width: 100%;
  }

  /*input表单与按钮结合体*/
  .mod-sql-editor .app-border-box {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 34px;
    line-height: 32px;
    outline: 0;
    padding-left: 15px;
    width: calc(100% - 171px);
  }

  .mod-sql-editor .app-border-box .input {
    width: calc(100% - 95px);
    height: 32px;
    line-height: 32px;
  }

  .mod-sql-editor .app-border-box .el-input__inner {
    border: none;
    height: 30px;
    line-height: 30px;
    padding-left: 0px;
  }

  .mod-sql-editor .app-border-box .el-button {
    margin: 1px 2px 0 0;
  }

  .mod-sql-editor .app-border-box .el-button:hover {
    background-color: #f35d45;
  }

  .mod-sql-editor .sql-select-tpl {
    display: inline-block;
    margin-left: 5px;
  }

  .mod-sql-editor .sql-select-tpl + .sql-search {
    margin-left: 5px;
  }

  /* 因全局弹出, 无需指定模块前缀 */

  .sql-tpl-popover {
    width: 200px;
  }

  .sql-tpl-popover .btn-group {
    text-align: center;
  }

  .sql-tpl-popover .el-input {
    margin: 12px 0;
  }

</style>
