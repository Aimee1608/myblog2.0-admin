<template>
  <!-- 添加文章 -->
  <div class="wrap">
    <el-form ref="baseRules" class="create-form" :rules="baseRules" :model="info" label-width="120px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="info.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="分类" prop="classId">
        <el-select v-model="info.classId" @change="classIdChange" style="width: 300px;" placeholder="请选择分类">
          <el-option v-for="item in articleCateList" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="info.tags" multiple style="width: 300px;" placeholder="请选择标签">
          <el-option v-for="item in tags" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <el-row class="mark">
          <el-col :span="12">
            <el-input type="textarea" ref="textarea" v-model="info.content" placeholder="请输入文章内容" cols="25" rows="10" class="editor" />
            <Upload ref="upload" @updataList="updataList" />
          </el-col>
          <el-col :span="12">
            <Content class="show" :content="info.content" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button class v-if="id" @click="save">保存</el-button>
      <el-button v-else @click="add">新增</el-button>
      <el-button @click="cancle">取消</el-button>
    </div>
  </div>
</template>

<script>
import articleAPI from '@/api/article'
import articleCateAPI from '@/api/articleCate'
import Content from '@/components/Content/index.vue'
import tagsAPI from '@/api/tags'
import Upload from '@/components/Upload/index.vue'
export default {
  name: 'AddArticle',
  components: {
    // 定义组件
    Content,
    Upload
  },
  data() {
    return {
      id: null,
      info: {
        title: '',
        classId: '',
        content: '',
        tags: []
      },
      baseRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        classId: [{ required: true, message: '请选择文章类型', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
      },
      articleCateList: [],
      tags: []
    }
  },
  async created() {
    // 生命周期函数
    this.id = this.$route.query.id
    await this.getAllLogTypeList()
    await this.getAllTagsList()
    if (this.id) {
      await this.getInfo(this.id)
    }
  },
  methods: {
    // 事件处理器
    async add() {
      const res = await articleAPI.add(this.info)
      console.log('articleAPI.add---res', res)
      if (res.code == 0) {
        this.$message({ message: '新增成功', type: 'success' })
        this.$router.push('/list')
      } else {
        this.$message({ message: '新增失败', type: 'error' })
      }
    },
    async save() {
      const res = await articleAPI.edit(this.info)
      console.log('articleAPI.add---res', res)
      if (res.code == 0) {
        this.$message({ message: '保存成功', type: 'success' })
      } else {
        this.$message({ message: '保存失败', type: 'error' })
      }
    },
    cancle() {
      this.$router.push('/list')
    },
    async getInfo(id) {
      const res = await articleAPI.getInfo({ id })
      console.log('articleAPI.info---res', res)

      this.info = res.data
      // this.contentValue = Marked(this.info.content)
      console.log('this.content', this.content)
      this.classIdChange(this.info.classId)
    },
    async getAllLogTypeList() {
      const res = await articleCateAPI.getAllList()
      const { data } = res
      this.articleCateList = data
    },
    async getAllTagsList() {
      const res = await tagsAPI.getAllList()
      const { data } = res
      this.allTags = data
    },
    filterTags(classId) {
      const tags = this.allTags.filter(item => {
        return item.classId === classId
      })
      this.tags = tags
    },
    classIdChange(value) {
      this.filterTags(value)
    },
    updataList(files = []) {
      console.log('自动复制图片', files)
      let text = ''
      files.forEach(item => {
        if (item.code == 0) {
          text += `![${item.data.name}](${item.data.url})  `
        }
      })
      console.log('文本内容 text', text)

      // 输入框获取光标
      const getPosition = function (element) {
        let cursorPos = 0
        if (document.selection) {
          // IE
          const selectRange = document.selection.createRange()
          selectRange.moveStart('character', -element.value.length)
          cursorPos = selectRange.text.length
        } else if (element.selectionStart || element.selectionStart == '0') {
          cursorPos = element.selectionStart
        }
        return cursorPos
      }
      const index = getPosition(this.$refs.textarea.$el.children[0])
      const value = this.info.content
      const newValue = value.substr(0, index + 1) + '\n' + text + '\n' + value.substr(index + text.length + 1)
      this.info.content = newValue
    }
  }
}
</script>

<style lang="scss">
.t {
  width: 300px;
  height: 100px;
}

.mark {
  // width: 1200px;
  // height: 600px;
  margin: 0 auto;
}
.editor {
  height: 100%;
  textarea {
    height: 100%;
  }
}
.editor,
.show {
  // width: 550px;
  height: 600px;
  border: 1px solid #666;
}
.show {
  padding: 0 10px;
  background: #fff;
}
.btn-box {
  text-align: center;
}
.create-form {
  padding-top: 10px;
}
</style>
