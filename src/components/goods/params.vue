<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- 警告框 -->
      <el-alert
        title="注意：只允许为三级分类设置相关参数"
        show-icon
        :closable="false"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <span>选择商品分类：</span>
        <el-cascader
          v-model="selectedKeys"
          :options="cateList"
          :props="cascaderProps"
          @change="cascaderChange"
        ></el-cascader>
      </el-row>

      <!-- tab栏切换 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isBtn"
            type="primary"
            size="normal"
            @click="addParanmsDialogVisible = true"
            >添加参数</el-button
          >

<!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column align="center" type="expand" label="O">
              <template slot-scope="{ row }">
                <el-tag
                  closable
                  :key="index"
                  v-for="(value, index) in row.attr_vals"
                  @close="handleClose(index, row)"
                  >{{ value }}</el-tag
                >

                <el-input
                  style="width: 80px"
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row)"
                  >修改</el-button
                >
                <el-button
                  @click="removeParams(row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isBtn"
            type="primary"
            size="normal"
            @click="addParanmsDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column align="center" type="expand" label="O">
              <template slot-scope="{ row }">
                <el-tag
                  closable
                  :key="index"
                  v-for="(value, index) in row.attr_vals"
                  @close="handleClose(index, row)"
                  >{{ value }}</el-tag
                >

                <el-input
                  style="width: 80px"
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            
            <el-table-column
              align="center"
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row)"
                  >修改</el-button
                >
                <el-button
                  @click="removeParams(row.attr_id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数 -->
    <el-dialog
      :title="`添加${titleText}`"
      :visible.sync="addParanmsDialogVisible"
      width="50%"
      @close="addParamsDialogClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="cat_name">
          <el-input v-model="addParamsForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParanmsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParanms">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数 -->
    <el-dialog
      :title="`修该${titleText}`"
      :visible.sync="editParanmsDialogVisible"
      width="50%"
      @close="editParamsDialogClose"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParanmsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParanms">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类列表
      cateList: [],
      selectedKeys: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },

      // 被激活的tab栏名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      addParanmsDialogVisible: false,
      addParamsForm: {
        cat_name: '',
      },
      addParamsFormRules: {
        cat_name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur',
          },
        ],
      },

      editParamsForm: { attr_name: '' },
      editParamsFormRules: {
        cat_name: [
          {
            required: true,
            message: '参数不能为空',
            trigger: 'blur',
          },
        ],
      },
      editParanmsDialogVisible: false,
    }
  },
  methods: {
    /**
     * 获取所有商品分类
     */
    async getCateList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },

    /**
     * 级联选择器发生变化
     */
    cascaderChange() {
      this.getParamsData()
    },

    /**
     * tab栏切换的事件
     */
    handleTabClick() {
      this.getParamsData()
    },

    /**
     * 获取参数列表数据
     */
    async getParamsData() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        this.$message.warning('请选择三级分类')
        return
      }

      // 根据三级分类id获取数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为每一项都添加一个布尔，控制按钮和输入框的切换
        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    /**
     * 监听对话框的关闭
     */
    addParamsDialogClose() {
      this.$refs.addParamsFormRef.resetFields()
    },

    /**
     * 添加分类
     */
    addParanms() {
      this.$refs.addParamsFormRef.validate(async (vali) => {
        if (!vali) return
        const { data: res } = await this.$http.post(
          `/categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.cat_name,
            attr_sel: this.activeName,
          }
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }

        this.getParamsData()
        this.addParanmsDialogVisible = false
        this.$message.success('添加成功')
      })
    },

    /**
     * 修改对话框
     */
    editParamsDialogClose() {
      this.$refs.editParamsFormRef.resetFields()
    },

    /**
     * 显示修改对话框
     */
    async showEditDialog(row) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `/categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_sel: this.activeName,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('参数获取失败')
      }
      this.editParamsForm = res.data
      this.editParanmsDialogVisible = true
    },

    /**
     * 保存修改
     */
    editParanms() {
      this.$refs.editParamsFormRef.validate(async (vali) => {
        if (!vali) return
        const { data: res } = await this.$http.put(
          `/categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editParanmsDialogVisible = false
      })
    },

    /**
     * 删除动态参数
     */
    async removeParams(id) {
      let confirmRes = await this.$confirm('永久删除该参数吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)

      if (confirmRes === 'cancel') {
        return this.$message.info('已取消了删除')
      }

      const { data: res } = await this.$http.delete(
        `/categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }

      this.$message.success('删除成功')
      this.getParamsData()
    },

    /**
     * 动态添加标签
     * 文本框失去焦点或者enter
     */
    async handleInputConfirm(row) {
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue.trim())
      }
      row.inputVisible = false
      row.inputValue = ''
      this.saveAttrVals(row)
    },

    /**
     * 按钮和文本输入框动态切换
     */
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    /**
     * 删除标签
     */
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },

    /**
     * 操作标签的添加与删除
     */
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `/categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_vals: row.attr_vals.join(' '),
          attr_sel: row.attr_sel,
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }

      this.$message.success('修改成功')
    },
  },

  mounted() {
    this.getCateList()
  },

  computed: {
    // 按钮可操作性
    isBtn() {
      return this.selectedKeys.length !== 3
    },

    // 三级分类id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }

      return null
    },

    // 根据操作动态添加标题
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 20px 0;
}

.el-tag {
  margin-right: 10px !important;
}
</style>