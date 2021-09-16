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
                           label="标签名称"
                           align="center"
                           width="180">
          </el-table-column>
          <el-table-column prop="classId"
                           label="分类"
                           align="center"
                           width="180">
            <template #default="scope">
              <span>{{getParent(scope.row.classId)}}</span>
            </template>
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
      <el-dialog :title="(isEdit? '编辑' : '创建') + '文章标签'"
                 v-model="dialogFormVisible">
        <el-form :rules="form"
                 ref="form"
                 :model="tags">
          <el-form-item label="所属分类"
                        label-width="120px"
                        prop="classId">
            <el-select v-model="tags.classId"
                       style="width: 300px;"
                       placeholder="请选择分类">
              <el-option v-for="item in tagsList"
                         :label="item.name"
                         :key="item._id"
                         :value="item._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签名称"
                        prop="name"
                        label-width="120px">
            <el-input v-model="tags.name"
                      autocomplete="off"></el-input>
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
import tagsAPI from '@/api/tags'

export default {
  name: 'Tags',
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
      tags: { name: '', classId: null },
      dialogFormVisible: false,
      fullscreenLoading: false,
      form: {
        name: [
          { required: true, message: '请输入文章类型名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      tagsList: [],
      allList: []
    }
  },
  methods: {
    onSubmit() {
      this.isEdit = false
      this.tags._id = ''
      this.tags.name = ''
      this.tags.classId = null
      this.dialogFormVisible = true
    },
    async handleSure() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.fullscreenLoading = true
          let res
          if (this.isEdit) {
            res = await tagsAPI.edit({ _id: this.tags._id, name: this.tags.name, classId: this.tags.classId })
          } else {
            res = await tagsAPI.add({ name: this.tags.name, classId: this.tags.classId })
          }
          // console.log('===tags--res', res)
          this.dialogFormVisible = false
          this.fullscreenLoading = false
          this.$message(this.isEdit ? '修改成功' : '创建成功')
          this.tags.name = ''
          this.tags._id = ''
          this.tags.classId = null
          this.isEdit = false
          await this.gettagsList()
        } else {
          return false
        }
      })
    },
    editHandle(item) {
      this.isEdit = true
      this.tags.name = item.name
      this.tags._id = item._id
      this.tags.classId = item.classId
      this.dialogFormVisible = true
    },
    async deleteHandle(item) {
      const res = await tagsAPI.remove({ _id: item._id })
      this.$message('删除成功')
      await this.gettagsList()
    },
    async gettagsList() {
      this.listLoading = true
      const res = await tagsAPI.getList({
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
      this.gettagsList()
    },
    async getAllLogTypeList() {
      const res = await articleCateAPI.getAllList()
      const { data } = res
      this.tagsList = data
      this.allList = data
    },
    getParent(classId) {
      const item = this.allList.find(item => item._id === classId) || {}
      return item.name
    }
  },
  async created() {
    console.log('list---data')
    await this.getAllLogTypeList()
    await this.gettagsList()
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
