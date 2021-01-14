<template>
  <!-- 预留 -->
  <div class="page-dashboard"></div>
</template>

<script>
  import permission from '@/components/mixin/permission';

  export default {
    mixins: [permission],
    name: "dashboard",
    data() {
      return {}
    },
    methods: {
      load() {}
    },
    mounted() {
      this.load();
    }
  }
</script>

<style>
  .page-dashboard {
    width: 100%;
  }
</style>
