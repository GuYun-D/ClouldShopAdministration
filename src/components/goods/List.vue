<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            @clear="getGoodsList"
            clearable
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" @click="addPage">添加商品</el-button>
        </el-col>

        <el-col>
          <!-- table -->
          <el-table :data="goodsList" border stripe>
            <el-table-column
              type="index"
              label="#"
              align="center"
            ></el-table-column>
            <el-table-column
              label="商品名称"
              prop="goods_name"
            ></el-table-column>
            <el-table-column
              label="商品价格(元)"
              width="95px"
              prop="goods_price"
            ></el-table-column>
            <el-table-column
              label="商品重量(kg)"
              width="110px"
              prop="goods_weight"
            ></el-table-column>
            <el-table-column label="创建时间" width="140px" prop="add_time">
              <template slot-scope="{ row }">
                {{ row.add_time | dataFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px">
              <template slot-scope="{ row }">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeGoods(row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },

      goodsList: [],
      total: 0,
    }
  },
  methods: {
    /**
     * 获取商品数据
     */
    async getGoodsList() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }
      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },

    /**
     * 页面容量发生变化
     */
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },

    /**
     * 页码值发生变化
     */
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },

    /**
     * 删除商品
     */
    async removeGoods(row) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)

      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消了删除')
      }

      const { data: res } = await this.$http.delete(`/goods/${row.goods_id}`)
      console.log(row)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGoodsList()
    },

    /**
     * 跳转到添加页面
     */
    addPage(){
      this.$router.push('/goods/add')
    }
  },
  mounted() {
    this.getGoodsList()
  },
}
</script>

<style lang="less" scoped>
</style>