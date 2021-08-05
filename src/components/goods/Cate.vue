<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-row style="margin-bottom: 20px">
        <el-button type="primary" size="default" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>
      <!-- 表格 -->
      <!-- 
        :data: 数据源
        :expand-type="false" 是否是展开行的样式
        :selection-type="false" 是否显示多选框
        :columns="columns" 表格每列的配置项
        show-index 显示序号
        index-text: string 序号标题内容
       -->
      <TreeTable
        index-text="#"
        :show-row-hover="false"
        border
        show-index
        :data="cateList"
        :expand-type="false"
        :selection-type="false"
        :columns="columns"
      >
        <!-- 是否有效列 -->
        <template slot="isOk" slot-scope="{ row }">
          <i
            class="el-icon-success"
            style="color: lightgreen; font-size: 20px"
            v-if="row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" v-else></i>
        </template>

        <!-- 排序列 -->
        <template slot="sort" slot-scope="{ row }">
          <el-tag v-if="row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <!-- 操作列 -->
        <template slot="opt" slot-scope="{}">
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </TreeTable>
      <!-- 分页区 -->
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="addCateDIalogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-selected="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pageSize: 5,
      },
      // 总数据条数
      total: '',
      // vue-table配置项
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 说明该列将被定义为自定义模板列
          type: 'template',
          // 表示当前列的模板列名称叫做isOk，写在表格的内容节点里面
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],

      // 添加分类对话框
      editCateDialogVisible: false,
      /**
       * 表单第二个参数为可选，id和level初始化为0，意为若未选择等级，默认添加一级分类
       */
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        // 分类的等级，默认添加的是一级分类
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur',
          },
        ],
      },

      // 父级分类的列表
      parentCateList: [],
      // 级联选择框的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 选中后的选项存储地方
      selectedKeys: [],
    }
  },

  methods: {
    /**
     * 获取商品分类列表
     */
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分类列表数据获取失败')
      }
      this.cateList = res.data
      this.total = res.data.length
    },

    /**
     * 显示添加分类对话框
     */
    showAddCateDialog() {
      this.getParentCateList()
      this.editCateDialogVisible = true
    },

    /**
     * 获取一级， 二级分类
     */
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
    },

    /**
     * 级联选择器选项发生变化
     */
    parentCateChange() {
      // 函数触发，说明用户添加了等级，更新表单的id和等级
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]

        this.addCateForm.cat_level = this.selectedKeys[this.selectedKeys.length]
        return
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },

    /**
     * 添加分类
     */
    addCate() {
      this.$refs.addCateFormRef.validate(async (vali) => {
        if (!vali) return
        const { data: res } = await this.$http.post(
          '/categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success("添加成功")
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },

    /**
     * 监听dialog的关闭事件，重置表单
     */
    addCateDIalogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
  },

  mounted() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
</style>