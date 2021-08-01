<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <span>电商后台管理系统</span>
      <el-button type="info" size="default" @click="layout">退出</el-button>
    </el-header>
    <!-- main区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eef"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="menu.id + ''"
            v-for="menu in menuList"
            :key="menu.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconList[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + menuChild.path"
              v-for="menuChild in menu.children"
              :key="menuChild.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ menuChild.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { deleteToken } from '../utils/user'
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],

      // 根据左侧一级菜单添加字体图标
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },

      isCollapse: false,
    }
  },

  methods: {
    /**
     * 退出登录
     */
    layout() {
      deleteToken()
      this.$router.push('/login')
    },

    /**
     * 获取左侧菜单的数据
     */
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },

    /**
     * 侧边栏的折叠与展开
     */
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },

  mounted() {
    this.getMenuList()
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  padding: 10px 10px;

  > span {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
  }
}

.el-aside {
  background-color: #333744;
  .toggle-button {
    color: #ccc;
    text-align: center;
    padding: 5px 0;
    font-weight: bold;
    background-color: #4a5064;
    font-size: 10px;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
</style>