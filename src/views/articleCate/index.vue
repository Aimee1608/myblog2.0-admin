<template>
  <div class="app-container">
    <div class="log-type-container">

      <div class="btn-box">
        <el-button type="primary"
                   @click="onSubmit">新建</el-button>
      </div>
      <div class="table-box">
        <el-table :data="list"
                  v-loading="listLoading"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%">
          <el-table-column prop="_id"
                           label="ID"
                           align="center"
                           width="220">
          </el-table-column>
          <el-table-column prop="name"
                           label="分类名称"
                           align="center"
                           width="180">
          </el-table-column>
          <el-table-column align="center"
                           label="是否开启">
            <template #default="scope">
              <span>{{scope.row.state == 1 ? '是': '否'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button @click="editHandle(scope.row)">编辑 </el-button>
              <el-popconfirm title="确定删除吗？"
                             @confirm="deleteHandle(scope.row)">
                <template #reference>
                  <el-button>删除 </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <el-dialog :title="(isEdit? '编辑' : '创建') + '文章类型'"
                 v-model="dialogFormVisible">
        <el-form :rules="form"
                 ref="form"
                 :model="articleCate">
          <el-form-item label="分类名称"
                        prop="name"
                        label-width="120px">
            <el-input v-model="articleCate.name"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否开启"
                        prop="name"
                        label-width="120px">
            <el-switch v-model="articleCate.state"
                       :active-value="1"
                       :inactive-value="0"
                       active-color="#13ce66"
                       inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       @click="handleSure">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <div class="log-type-pagination-container">
      <el-pagination background
                     :page-size="pageSize"
                     v-model:current-page="current"
                     layout="prev, pager, next"
                     @current-change="handleCurrentChange"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import articleCateAPI from '@/api/articleCate'

export default {
  name: 'ArticleCate',
  data() {
    return {
      pageSize: 10,
      current: 1,
      total: 0,
      isEdit: false,
      listLoading: false,
      list: [
        {
          _id: '1',
          name: '业务类型名称',
          createdAt: '444',
          lastModifiedDate: ''
        }
      ],
      articleCate: { name: '' },
      dialogFormVisible: false,
      fullscreenLoading: false,
      form: {
        name: [
          { required: true, message: '请输入文章类型名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      allList: []
    }
  },
  methods: {
    onSubmit() {
      this.isEdit = false
      this.articleCate._id = ''
      this.articleCate.name = ''
      this.dialogFormVisible = true
    },
    async handleSure() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.fullscreenLoading = true
          let res
          if (this.isEdit) {
            res = await articleCateAPI.edit({ _id: this.articleCate._id, name: this.articleCate.name })
          } else {
            res = await articleCateAPI.add({ name: this.articleCate.name, state: this.articleCate.state })
          }
          // console.log('===articleCate--res', res)
          this.dialogFormVisible = false
          this.fullscreenLoading = false
          this.$message(this.isEdit ? '修改成功' : '创建成功')
          this.articleCate.name = ''
          this.articleCate._id = ''
          this.articleCate.parentId = null
          this.isEdit = false
          await this.getArticleCateList()
        } else {
          return false
        }
      })
    },
    editHandle(item) {
      this.isEdit = true
      this.articleCate.name = item.name
      this.articleCate._id = item._id
      this.articleCate.state = item.state
      this.dialogFormVisible = true
    },
    async deleteHandle(item) {
      const res = await articleCateAPI.remove({ _id: item._id })
      this.$message('删除成功')
      await this.getArticleCateList()
    },
    async getArticleCateList() {
      this.listLoading = true
      const res = await articleCateAPI.getList({
        pageSize: this.pageSize,
        currentPage: this.current
      })
      // console.log('list---data', data)
      const {
        list,
        pagination
      } = res.data
      console.log('list---data', res.data)
      this.list = list
      this.total = pagination.total
      this.totalPage = pagination.totalPage
      this.current = pagination.currentPage
      this.listLoading = false
    },
    handleCurrentChange(val) {
      this.current = val
      this.getArticleCateList()
    }
  },
  async created() {
    console.log('list---data')
    await this.getArticleCateList()
  }
}
</script>
<style lang="scss" scoped>
.log-type-container {
  background: #ffffff;
}
.btn-box {
  padding: 10px 10px;
}
.table-box {
  padding: 10px;
}
.log-type-pagination-container {
  width: 100%;
  padding: 20px 0;
  text-align: center;
}
</style>
