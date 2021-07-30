<template>
  <div>
    <el-button type="primary" size="default" @click="layout">退出</el-button>
  </div>
</template>

<script>
import { deleteToken } from '../utils/user'
export default {
  name: 'Home',
  methods: {
    layout() {
      deleteToken()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>