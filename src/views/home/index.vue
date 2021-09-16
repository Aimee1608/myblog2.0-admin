<template>
  <div class="app-container">
    <el-row :gutter="30">
      <el-col :span="12">
        <div class="home-card">
          <div class="home-card-title">文章总数</div>
          <div class="home-card-count">{{info.article}}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="home-card">
          <div class="home-card-title">评论总数</div>
          <div class="home-card-count">{{info.comment}}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="home-card">
          <div class="home-card-title">用户总数</div>
          <div class="home-card-count">{{info.user}}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="home-card">
          <div class="home-card-title">点赞总数</div>
          <div class="home-card-count">{{info.love}}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import articleAPI from '@/api/article'
export default {
  components: {

  },
  data() {
    return {
      info: {
        article: 0,
        love: 0,
        comment: 0,
        user: 0
      }
    }
  },
  async created() {
    await this.getHomeInfo()
  },
  methods: {
    async getHomeInfo() {
      const res = await articleAPI.getHomeInfo()
      this.info = res.data
    }
  }
}

</script>
<style lang="scss">
.home-card {
  width: 100%;
  height: 300px;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 30px;
  display: flex;
  align-content: center;
  justify-content: center;
  justify-self: center;
  flex-direction: column;
  align-items: center;
  .home-card-title {
    color: #409eff;
    font-size: 16px;
    line-height: 26px;
    padding: 10px;
  }
  .home-card-count {
    color: #67c23a;
    font-size: 48px;
    line-height: 26px;
    padding: 10px;
  }
}
</style>
