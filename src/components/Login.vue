<template>
  <div class="login_container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar">
        <img src="../assets/images/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        class="login-form"
        ref="loginFormRef"
        label-width="0"
        :inline="false"
        size="normal"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item class="password-container" prop="password">
          <el-input
            ref="passwordInputRef"
            type="password"
            prefix-icon="el-icon-unlock"
            v-model="loginForm.password"
          ></el-input>
          <i
            class="iconfont"
            :class="passwordStatus ? 'icon-biyan' : 'icon-yanjing-zhengyan'"
            @click="changePasswordStatus"
          ></i>
        </el-form-item>
        <el-form-item class="btn-container">
          <el-button type="primary" size="default" @click="handleLogin"
            >登录</el-button
          >
          <el-button type="info" size="default" @click="resetFields"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken } from '../utils/user'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },

      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入登录名称',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur',
          },
        ],

        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },

      passwordStatus: false,
    }
  },

  methods: {
    /**
     * 重置表单
     */
    resetFields() {
      this.$refs.loginFormRef.resetFields()
    },

    /**
     * 密码查看的方法
     */
    changePasswordStatus() {
      let passwordInput = this.$refs.passwordInputRef.$refs.input
      this.passwordStatus = !this.passwordStatus
      this.passwordStatus
        ? (passwordInput.type = 'text')
        : (passwordInput.type = 'password')
    },

    /**
     * 登录按钮
     */
    handleLogin() {
      // 表单域验证，el-form的方法，参数是预验证的结果，Boolean
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status != 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // 存储token
        setToken()
        // 编程式导航，跳转/home
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
@color1: #eee;

.login_container {
  height: 100%;
  background-image: url('../assets/images/login_bg.jpg');
  background-position: 0 -133px;
  background-size: cover;
  position: relative;

  .login-box {
    width: 450px;
    height: 300px;
    background-color: rgba(255, 255, 255, 0.26);
    filter: blur(0px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;

    .avatar {
      height: 130px;
      width: 130px;
      padding: 10px;
      border: 1px solid @color1;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(255, 255, 255, 0.26);

      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: @color1;
      }
    }
  }
}

.login-form {
  box-sizing: border-box;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 20px;

  .btn-container {
    display: flex;
    justify-content: flex-end;
  }

  .password-container {
    position: relative;

    i.iconfont {
      position: absolute;
      top: 2px;
      right: 8px;
      font-weight: bold;
      color: rgb(189, 184, 184);
      font-size: 20px;
      cursor: pointer;
    }
  }
}
</style>