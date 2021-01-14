<template>
  <div class="page-user_manage">
      <el-tabs v-model="activeName" type="card"  @tab-click="handleClick">
        <el-tab-pane label="供应商管理" name="user">
            <user />
        </el-tab-pane>
        <el-tab-pane label="角色权限管理" name="role">
            <role />
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
 import permission from '@/components/mixin/permission';
 import role from "@/views/manage_center/user_manage/role";
 import user from "@/views/manage_center/user_manage/user";

  export default {
    mixins: [permission],
    components: {
        role,
        user
    },
    name: "user_manage",
    data() {
      return {
        activeName: "user",
      }
    },
    methods: {
      handleClick(tab, event) {
        this.activeName = tab.name;
        this.$router.push(tab.name);
      },
    },
    mounted() {
      this.activeName = this.$route.name;
    }
  };
</script>


<style>
.page-user_manage {
    width: 100%;
    height: calc(100% - 51px);
    padding: 0 15px;
    font-size: 14px;
}
.page-user_manage .el-tabs{
    min-height: calc(100% - 41px);
}
.page-user_manage .el-tabs--card>.el-tabs__header{
    margin:0;
}
.page-user_manage::after {
    content: "";
    clear: both;
    display: block;
}
.page-user_manage .el-tabs {
    background: #fff;
}
</style>

