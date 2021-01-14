<template>
  <div class="app-export-dialog">
    <el-form status-icon label-width="80px"
             :model="editForm" :rules="editFormRules" ref="editForm">
      <el-form-item label="导出格式:" prop="type">
        <el-select v-model="editForm.type" clearable placeholder="选择导出格式">
          <el-option label="CSV" value="csv"></el-option>
          <el-option label="WORD" value="word"></el-option>
          <el-option label="EXCEL" value="excel"></el-option>
          <el-option label="PDF" value="pdf"></el-option>
          <el-option label="HTML" value="html"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="导出数量:" prop="number">
        <el-select v-model="editForm.number" clearable placeholder="选择导出数量">
          <el-option label="1000" :value="1000"></el-option>
          <el-option label="5000" :value="5000"></el-option>
          <el-option label="10000" :value="10000"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资产组:" prop="assetGroup" v-if="!hideAssetGroup">
        <el-select v-model="editForm.assetGroup"
                   @change="changeAssetGroup"
                   filterable clearable placeholder="选择资产组">
          <el-option :label="item.label" :value="item.value" v-for="item in assetGroupList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="域名:" prop="domain" v-if="!hideDomain">
        <el-select v-model="editForm.domain"
                   :disabled="domainDisabled"
                   filterable clearable placeholder="选择域名">
          <el-option :label="item.label" :value="item.value" v-for="item in domainList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件类型:" prop="eventType" v-if="!hideEventType">
        <el-select v-model="editForm.eventType" filterable clearable placeholder="选择事件类型">
          <el-option :label="item.label" :value="item.value" v-for="item in eventTypeList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件等级:" prop="level" v-if="!hideLevel">
        <el-select v-model="editForm.level" filterable clearable placeholder="事件等级">
          <el-option :label="item.label" :value="item.value" v-for="item in levelList" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeExport()">取消</el-button>
      <el-button type="primary" @click="submitExport()" :loading="exportBtnLoading">确定</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    name: "app-export-dialog",
    props: [
      // 常规
      'fileName',
      'tableName',
      'order',
      'join',
      'group',
      'fields',
      'where',
      // 隐藏条件
      'hideAssetGroup',
      'hideDomain',
      'hideEventType',
      'hideLevel',
    ],
    data() {
      return {
        dict: {
          "word": "doc",
          "excel": "xls",
          "html": "html",
          "pdf": "pdf",
          "csv": "csv",
        },
        // 表单
        editForm: {
          type: 'csv',
          number: 1000,
          assetGroup: '',
          domain: '',
          eventType: '',
          level: ''
        },
        assetGroupList: [
          {
            label: 'loading...', value: 0
          }
        ],
        domainDisabled: true,
        domainList: [],
        eventTypeList: [
          {
            label: '域名解析', value: 1
          },
          {
            label: '可用性', value: 2
          },
          {
            label: '内容变更', value: 3
          },
          {
            label: 'http请求', value: 4
          },
          {
            label: '网站挂马', value: 5
          },
          {
            label: '网站黑链', value: 6
          },
          {
            label: '违规内容', value: 7
          }
        ],
        levelList: [
          {
            label: '低', value: 1
          },
          {
            label: '中', value: 2
          },
          {
            label: '高', value: 3
          }
        ],
        editFormRules: {
          type: [
            { required: true, message: '字段不能为空', trigger: 'change' }
          ],
          number: [
            {required: true, message: '字段不能为空', trigger: 'change'}
          ],
//          assetGroup: [
//            {required: true, message: '字段不能为空', trigger: 'change'}
//          ],
//          domain: [
//            {required: true, message: '字段不能为空', trigger: 'change'}
//          ],
//          eventType: [
//            {required: true, message: '字段不能为空', trigger: 'change'}
//          ],
//          level: [
//            {required: true, message: '字段不能为空', trigger: 'change'}
//          ]
        },
        exportBtnLoading: false
      };
    },
    methods: {
      // 关闭
      closeExport() {
        this.clear()
        this.$emit('closeExport')
      },
      // 提交
      submitExport() {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {

            this.exportBtnLoading = true;
            let editForm = this.editForm;
            // 配置where
            let where = [];
            if (editForm.assetGroup && this.hideAssetGroup !== true) {
              where.push(`sc_asset_group.id=${editForm.assetGroup}`);
            }
            if (editForm.domain && this.hideDomain !== true) {
              where.push(`sc_asset.id=${editForm.domain}`);
            }
            if (editForm.eventType && this.hideEventType !== true) {
              where.push(`type=${editForm.eventType}`);
            }
            if (editForm.level && this.hideLevel !== true) {
              where.push(`level=${editForm.level}`);
            }
            // 请求
            this.$post("/action", {
              fileName: `${this.fileName}.${this.dict[editForm.type]}`,
              responseType: 'blob',
              timeout: 5 * 60 * 1000,
              data: {
                "result": editForm.type,
                "select": this.tableName,
                "fields": this.fields || ['*'],
                "limit": [0, editForm.number],
                "join": this.join || [],
                "order": this.order || [],
                "group": this.group || [],
                "where": where.concat(this.where || []),
              }
            }, true).then(data => {
              this.exportBtnLoading = false;
              this.$emit('submitExport')
            });
          } else {
            return false;
          }
        });
      },
      // 切换资产组
      changeAssetGroup(group_id) {
        // 不隐藏的时候联动
        if (!this.hideDomain) {
          this.domainDisabled = true
          this.editForm.domain = 'loading...'
          this.domainList = [
            {
              label: 'loading...', value: 0
            }
          ]
          this.loadDomain(group_id)
        }
      },
      // 资产组
      loadAssetGroup() {
        this.$post("/action", {
          data: {
            "select": "sc_asset_group",
            "fields": ["id value", "group_name label"]
          }
        }, true).then(data => {
          if (Array.isArray(data)) {
            this.assetGroupList = data
          }
        });
      },
      // 域名
      loadDomain(group_id) {
        this.$post("/action", {
          data: {
            "select": "sc_asset",
            "join":"sc_asset_group",
            "fields": ["id value", "name label"],
            "where":`sc_asset_group.id=${group_id}`
          }
        }, true).then(data => {
          if (Array.isArray(data)) {
            this.editForm.domain = ''
            this.domainList = data;
            this.domainDisabled = false
          }
        });
      },
      clear() {
        this.editForm = {
          type: 'csv',
          number: 1000,
          assetGroup: '',
          domain: '',
          eventType: '',
          level: ''
        }
      },
      load() {
        this.loadAssetGroup()
      }
    },
    mounted() {
      this.load()
    }
  }
</script>

<style>
  .app-export-dialog {}

  .app-export-dialog .dialog-footer {
    display: block;
    padding: 10px;
    border-top: 1px solid #ebebeb;
    text-align: right;
    box-sizing: border-box;
    margin: 0 -40px -30px -40px;
  }
</style>
