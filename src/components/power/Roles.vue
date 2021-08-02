<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border>
        <el-table-column type="expand" label="O">
          <template slot-scope="{ row }">
            <el-row
              :class="['bdbutton', index1 === 0 ? 'bdtop' : '']"
              v-for="(level1, index1) in row.children"
              :key="level1.id"
              class="vcenter"
            >
              <!-- 渲染以及权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeTag(row, level1.id)">{{
                  level1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级，三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :key="level2.id"
                  v-for="(level2, index2) in level1.children"
                  :class="[index2 === 0 ? '' : 'bdtop']"
                  class="vcenter"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeTag(row, level2.id)"
                      type="success"
                      >{{ level2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeTag(row, level3.id)"
                      type="warning"
                      v-for="(level3, index3) in level2.children"
                      :key="level3.id"
                      >{{ level3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="80"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <!-- 树形控件 -->

        <el-tree
          show-checkbox
          :data="rightsList"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          :default-checked-keys="defkeys"
          ref="treeRef"
        ></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 用户权限列表
      rolesList: [],
      // 权限列表对话框
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      defaultProps: {
        label: 'authName',
        children: 'children',
      },
      // 树形控件默认展开项的数组,只要三级权限即可
      defkeys: [],
      roleId: ''
    }
  },

  mounted() {
    this.getRolesList()
  },

  methods: {
    /**
     * 获取全部角色权限信息
     */
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },

    /**
     * 删除三级分类的权限（tag）
     */
    async removeTag(row, rightsId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消了删除')
      const { data: res } = await this.$http.delete(
        `/roles/${row.id}/rights/${rightsId}`
      )

      if (res.meta.status !== 200) return this.$message.error('权限删除失败')
      // 接口返回数据就是当前剩余的权限列表，直接赋值，可避免页面重绘
      row.children = res.data
    },

    /**
     * 分配权限的对话框打开
     */
    async showSetRightDialog(role) {
      // 保存用户id，为了树形控件传递id
      this.roleId = role.id
      // 获取所有权限列表
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200)
        return this.$message.error('权限列表获取失败')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },

    /**
     *
     * @param {*} node 节点
     * @param {*} arr 存储节点的函数
     * @returns 返回存储节点的数组
     */
    getLeafKeys(node, arr) {
      // 如果当前节点不含有children属性，说明是三级权限节点，将该节点的id保存到arr中，并返回
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((element) => {
        this.getLeafKeys(element, arr)
      })
    },

    /**
     * 监听树形控件对话框的关闭
     * 重置defkeys,防止bug出现
     */
    setRightDialogClosed() {
      this.defkeys = []

      console.log()
    },

    /**
     * 监听树形组件的关闭,为用户分配权限
     * getCheckedKeys 三级权限选中的id arrList
     * getHalfCheckedKeys 选中的半选的id arrList
     */
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]

      const idStr = keys.join(',') 

      const {data: res} = await this.$http.post(`/roles/${this.roleId}/rights`, {rids: idStr})
      if(res.meta.status !== 200) return rhis.$message.error("分配权限失败")
      this.$message.success("分配权限成功")
      this.getRolesList(
        this.setRightDialogVisible = false
      )
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbutton {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>