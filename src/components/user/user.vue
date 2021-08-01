<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card shadow="always">
      <!-- 搜索添加页 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="default" @click="addUserDialog = true"
            >添加</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-row>
        <el-table :data="userList" border stripe>
          <el-table-column
            width="80"
            type="index"
            align="center"
            label="索引"
          ></el-table-column>
          <el-table-column
            label="姓名"
            width=""
            prop="username"
          ></el-table-column>
          <el-table-column label="邮箱" width="" prop="email"></el-table-column>
          <el-table-column
            label="电话"
            width=""
            prop="mobile"
          ></el-table-column>
          <el-table-column
            label="角色"
            width=""
            prop="role_name"
          ></el-table-column>
          <el-table-column label="状态" width="">
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStatusChange(row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditDialog(row.id)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteUser(row.id)"
              ></el-button>
              <el-tooltip
                content="分配角色"
                placement="top"
                effect="dark"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-setting"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      >
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          @close="addUserDialogClose"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="addForm.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="addForm.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="addForm.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input
              v-model="addForm.mobile"
              placeholder="请输入号码"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="addNewUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form
          :model="editForm"
          :rules="editFormRulrs"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="editForm.username"
              disabled
              size="normal"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="editForm.email"
              size="normal"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="editForm.mobile"
              size="normal"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    // 邮箱自定义校验规则
    var checkedEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 手机号自定义校验规则
    var checkedMoblie = (rule, value, cb) => {
      const regMoblie =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMoblie.test(value)) {
        // 合法的号码
        return cb()
      }

      cb(new Error('请输入合法的号码'))
    }
    return {
      // 获取用户列表的query对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 4,
      },

      userList: [],
      total: 0,

      // dialog对话框
      addUserDialog: false,

      // 添加用户的表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },

      // 添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名应该在3到10个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码应该在3到10个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 自定义校验规则
          { validator: checkedEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkedMoblie, trigger: 'blur' },
        ],
      },

      editDialogVisible: false,

      // 修改用户的信息
      editForm: {},

      editFormRulrs: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // 自定义校验规则
          { validator: checkedEmail, trigger: 'blur' },
        ],

        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkedMoblie, trigger: 'blur' },
        ],
      },
    }
  },

  mounted() {
    this.getUserList()
  },

  methods: {
    /**
     * 用户列表数据的获取
     */
    async getUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },

    /**
     * 监听pagesize发生改变
     */
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },

    /**
     * 监听页码之改变pagenum
     */
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getUserList()
    },

    /**
     * 修改用户状态
     */
    async userStatusChange(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 前端不需要判断，直接就改了，如果失败了，后端的状态没有修改，前端已经修改成功了，所以要复原
        row.mg_state = !row.mg_state
        return this.$message.error('状态修改失败')
      }
      this.$message.success('用户状态修改成功')
    },

    /**
     * 监听对话框的关闭
     * 当对话框被关闭之后应该清空表单，调用form表单对象上的resetFields方法
     */
    addUserDialogClose() {
      this.$refs.addFormRef.resetFields()
    },

    /**
     * 点击添加新用户
     */
    addNewUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) return this.$message.eror('用户添加失败')
        this.$message.success('用户创建成功')
      })

      this.addUserDialog = false
      // 刷新列表数据
      this.getUserList()
    },

    /**
     * 展示修改用户的对话框
     */
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`/users/${id}`)
      if (res.meta.status !== 200)
        return this.$message.erroe('用户信息获取失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },

    /**
     * 监听修改用户对话框的关闭，重置表单
     */
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    /**
     * 确定修改
     */
    editUserConfirm() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `/users/${this.editForm.id}`,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200)
          return this.$message.error('用户信息修改失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('用户信息修改成功')
      })
    },

    /**
     * 删除用户
     */
    async deleteUser(id) {
      // confirm使用async函数，返回值是字符串，点击确定返回confirm，点击取消返回cancel,但是需要捕获错误
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户?',
        '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消啦')
      }

      const { data: res } = await this.$http.delete('/users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    },
  },
}
</script>

<style lang="less" scoped>
</style>