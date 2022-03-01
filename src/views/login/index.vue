<template>
  <div class="app-container">
    <div class="login-box">
      <el-button type="primary" @click="goLogin(1)">微博登录</el-button>
      <el-button type="primary" @click="goLogin(2)">github登录</el-button>
    </div>
  </div>
</template>
<script>
import { GITHUB_OAUTH, WEIBO_OAUTH } from '@/config'
export default {
  name: 'login',
  components: {},
  data() {
    return {}
  },
  created() {},
  methods: {
    goLogin(type) {
      if (type === 1) {
        window.location.href = WEIBO_OAUTH.url
      } else {
        window.location.href = GITHUB_OAUTH.url
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
