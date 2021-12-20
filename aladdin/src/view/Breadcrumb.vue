<template>
  <div>
    <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right" style="margin: 10px">
      <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
        <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    /**
     * 生成面包屑的方法
     */
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      this.levelList = matched;
    }
  },
  mounted() {
    this.getBreadcrumb();
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
    }
  }
}
</script>

<style scoped>

</style>
