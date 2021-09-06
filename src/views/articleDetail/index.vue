<template>
  <div class="app-container article-detail-container">
    <div class="article-detail-info">
      <div>
        <span>标题：</span>
        {{info.title}}
      </div>
      <div>浏览量 {{info.browseCount}}</div>
      <div>评论量 {{info.commentCount}}</div>
      <div>内容：</div>
      <div class="article-detail-content">
        <Content :content="info.content" />
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="onCancel">
        返回列表
      </el-button>
      <el-button type="primary"
                 @click="onSubmit">编辑</el-button>
    </div>
  </div>
</template>
<script>

import Content from '@/components/Content'
import articleAPI from '@/api/article'

export default {
  components: {
    Content
  },
  data() {
    return {
      info: {},
    }
  },
  async created() {
    this.id = this.$route.query.id
    await this.getInfo(this.id)
  },
  methods: {
    async getInfo(id) {
      const res = await articleAPI.getInfo({ id })
      this.info = res.data
    },
    onSubmit() {
      this.$router.push({
        path: '/createArticle',
        query: {
          id: this.id
        }
      })
    },
    onCancel() {
      this.$router.push('/list')
    }
  }
}

</script>
<style lang="scss">
.btn-box {
  text-align: center;
}
</style>
