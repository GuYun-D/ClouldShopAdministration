<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>定单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-table :data="orderList" border stripe>
          <el-table-column
            type="index"
            label="#"
            width="60"
            align="center"
          ></el-table-column>
          <el-table-column
            label="订单编号"
            prop="order_number"
          ></el-table-column>
          <el-table-column
            label="订单价格"
            prop="order_price"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="是否付款" width="100">
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="row.pay_status === '1'"
                >已付款</el-tag
              >
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="是否发货"
            width="100"
            prop="is_send"
          ></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="{ row }">
              {{ row.create_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="eidtAddressVisible(row)"
              ></el-button>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-location"
                @click="progressVisible"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>

      <!-- 修改地址 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editAddressDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区县" prop="city">
            <el-cascader
              v-model="editForm.city"
              :options="cityData"
              :props="addressProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAddressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddressDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 物流进度 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressDialogVisible"
        width="50%"
      >
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },

      cityData,

      addressProps: { expandTrigger: 'hover' },

      orderList: [],
      total: 0,
      editAddressDialogVisible: false,
      editForm: { city: [], address: '' },
      editFormRules: {
        city: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: 'blur',
          },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },

      progressDialogVisible: false,
      progressInfo:[]
    }
  },

  methods: {
    /**
     * 获取订单列表
     */
    async getOrderList() {
      const { data: res } = await this.$http.get('/orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },

    /**
     *
     */
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    /**
     *页码发生变化
     */
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    /**
     * 显示修改地址对话框
     */
    eidtAddressVisible(row) {
      this.editAddressDialogVisible = true
    },

    /**
     * dialog的关闭
     */
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    /**
     * 物流进度
     */
    async progressVisible() {
      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context:
            '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context:
            '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: '',
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: '',
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: '',
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: '',
        },
      ]
      this.progressDialogVisible = true
    },
  },
  mounted() {
    this.getOrderList()
  },
}
</script>

<style lang="less" scoped>
</style>