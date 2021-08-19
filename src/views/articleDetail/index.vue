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
        <div v-html="content">

        </div>
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

import Marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import articleAPI from '@/api/article'
Marked.setOptions({
  renderer: new Marked.Renderer(),
  highlight(code) {
    return hljs.highlightAuto(code).value
  },
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})
export default {
  components: {

  },
  data() {
    return {
      info: {},
      content: ''
    }
  },
  async created() {
    this.id = this.$route.query.id
    await this.getInfo(this.id)
  },
  methods: {
    async getInfo(id) {

      const res = await articleAPI.getInfo({ id })
      console.log('articleAPI.info---res', res)

      this.info = res.data
      this.content = Marked(this.info.content)
      console.log('this.content', this.content)

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
