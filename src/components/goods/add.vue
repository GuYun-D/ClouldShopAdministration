<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>

      <!-- 步骤条 -->
      <el-steps
        align-center
        :space="200"
        :active="+activeIndex"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRrf"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          style="height: 200px"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addGoodsForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in manyTabData"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  :key="i"
                  v-for="(cb, i) in item.attr_vals"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 
              action: 图片上传的地址
              on-preview:图片预览的函数
              on-remove: 取消预览
              list-type：呈现方式
              headers: 设置响应头
             -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addGoodsForm.goods_introduce"
              ref="myQuillEditor"
            >
            </quill-editor>

            <el-button
              class="addGoods"
              type="primary"
              size="default"
              @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" class="previewImg" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '../../utils/user'
import _ from 'lodash'
export default {
  data() {
    return {
      // 控制步骤条的进度
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 上传图片数组
        pics: [],
        // 富文本内容
        goods_introduce: '',
        // 提交后端，数组是静态属性和动态参数
        attrs: [],
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 所有分类列表
      cateList: [],

      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数列表
      manyTabData: [],
      onlyTabData: [],

      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 请求头
      headerObj: {
        Authorization: getToken(),
      },

      // 图片预览地址
      previewPath: '',

      previewDialogVisible: false,
    }
  },

  methods: {
    // 获取所有商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.cateList = res.data
    },

    /**
     * 级联选择框发生改变的事件
     */
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
        return this.$message.error('请选择三级分类')
      }
    },

    /**
     * 监听tab栏的切换
     */
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },

    async tabClick() {
      if (this.activeIndex === '1') {
        // 访问动态参数面板
        const { data: res } = await this.$http.get(
          `/categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }

        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        // 访问静态属性面板
        const { data: res } = await this.$http.get(
          `/categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }

        this.onlyTabData = res.data
      }
    },

    /**
     * 图片预览的函数
     */
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },

    /**
     * 取消上传的函数
     */
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      let i = this.addGoodsForm.pics.findIndex((item) => item.pic === filePath)
      this.addGoodsForm.pics.splice(i, 1)
    },

    /**
     * 文件上传成功的事件
     */
    handleSuccess(response) {
      const picInfo = {
        pic: response.data.tmp_path,
      }

      this.addGoodsForm.pics.push(picInfo)
    },

    /**
     * 添加商品
     */
    add() {
      this.$refs.addGoodsFormRrf.validate(async (vali) => {
        if (!vali) {
          return this.$message.error('请填写完整表单')
        }
        // 级联选择绑定的是数组，操作goods_cat之前应该先深拷贝
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodsForm.attrs.push(newInfo)
        })

        form.attrs = this.addGoodsForm.attrs

        const { data: res } = await this.$http.post('/goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('商品添加失败')
        }

        this.$message.success('商品添加成功')
        this.$router.push('/goods')
      })
    },
  },

  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    },
  },

  mounted() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.el-tabs {
  height: auto !important;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.addGoods {
  margin-top: 20px;
}
</style>