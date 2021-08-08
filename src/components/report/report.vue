<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 900px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {}
  },

  async mounted() {
    let myEcharts = echarts.init(document.getElementById('main'))
    /**
     * 获取数据
     */
    const { data: res } = await this.$http.get('/reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('图表数据据获取失败')
    }

    myEcharts.setOption(res.data)
  },
}
</script>

<style lang="less" scoped>

</style>