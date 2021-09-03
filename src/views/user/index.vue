<template>
  <div class="app-container">
    <div class="user-container">
      <div style="margin: 10px;">
        <el-input placeholder="请输入用户id 或用户名搜索"
                  style="width: 600px;"
                  clearable
                  @keyup.enter.native="searchEnterFun"
                  @clear="clearHandle"
                  @change="changeHandle"
                  v-model="search">
          <template #suffix>
            <i class="el-input__icon el-icon-search"></i>
          </template>
        </el-input>
      </div>
      <div class="table-box">
        <el-table :data="list"
                  v-loading="listLoading"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%">
          <el-table-column prop="userId"
                           label="userId"
                           align="center">
          </el-table-column>
          <el-table-column prop="username"
                           align="center"
                           label="用户名">
          </el-table-column>
          <el-table-column prop="webBlogName"
                           align="center"
                           label="博客">
          </el-table-column>
          <el-table-column prop="webBlog"
                           align="center"
                           label="博客地址">
          </el-table-column>
          <el-table-column prop="webBlogDesc"
                           align="center"
                           label="博客描述">
          </el-table-column>
          <el-table-column align="center"
                           label="博客Icon">
            <template #default="scope">
              <img :src="scope.row.webBlogIcon" />
            </template>
          </el-table-column>
          <el-table-column prop="webBlogState"
                           align="center"
                           label="博客推荐状态">
          </el-table-column>
          <el-table-column label="权限"
                           align="center">
            <template #default="scope">
              <span>{{ getRole(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最近登录时间"
                           align="center">
            <template #default="scope">
              <span>{{ initDate(scope.row.lastLoginDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template #default="scope">
              <el-button @click="editHandle(scope.row)">编辑 </el-button>
            </template>

          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-container">
      <el-pagination background
                     :page-size="pageSize"
                     :current-page.sync="current"
                     layout="prev, pager, next"
                     @current-change="handleCurrentChange"
                     :total="total">
      </el-pagination>
    </div>
    <el-dialog title="编辑权限"
               v-model="dialogFormVisible">
      <el-form :rules="form"
               ref="form"
               :model="logType">
        <el-form-item label="活动名称"
                      prop="name"
                      label-width="120px">
          <el-select v-model="editItem.status"
                     placeholder="请选择区间范围"
                     style="width: 200px">
            <el-option :label="item.label"
                       v-for="item in userType"
                       :disabled="item.status == editItem.status || editItem.status == 2 && editItem.status === 3"
                       :key="item.status"
                       :value="item.status"></el-option>
          </el-select>
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
</template>

<script>
import _ from 'lodash'
import { getUserListPage, editStatus } from '@/api/user'
import { initDate } from '@/utils'
import {
  mapGetters
} from 'vuex'
export default {
  data() {
    return {
      search: '',
      isEdit: false,
      listLoading: false,
      list: [],
      logType: { name: '' },
      dialogFormVisible: false,
      fullscreenLoading: false,
      form: {
        name: [
          { required: true, message: '请输入活动类型名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      pageSize: 10,
      current: 1,
      total: 0,
      totalPage: 0,
      keywords: '',
      userType: [
        { status: 3, label: '普通用户' },
        { status: 2, label: '管理员' },
        { status: 1, label: '超级管理员' }
      ],
      editItem: {}
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'userId',
      'role',
      'status'
    ])
  },
  methods: {
    getRole(status) {
      const userRole = {
        3: '普通用户',
        2: '管理员',
        1: '超级管理员'
      }
      return userRole[status]
    },
    initDate(time) {
      return initDate(time)
    },
    onSubmit() {
      this.isEdit = false
      this.logType._id = ''
      this.logType.name = ''
      this.dialogFormVisible = true
    },
    async handleSure() {
      const res = await editStatus({ _id: this.editItem._id, status: this.editItem.status })
      if (+res.code === 0) {
        this.editItem = {}
        this.$message('编辑成功')
        await this.getUserListPage()
      }
      this.dialogFormVisible = false
      this.fullscreenLoading = false
    },
    editHandle(item) {
      console.log('this.status', this.status, item.status)
      if (+item.status === 1 && this.status === 2) {
        this.$message({
          message: '没有操作权限',
          type: 'error'
        })
        return
      }
      this.editItem = _.cloneDeep(item)
      this.isEdit = true
      this.dialogFormVisible = true
    },
    searchEnterFun(e) {
      const keyCode = window.event ? e.keyCode : e.which
      // console.log('回车搜索',keyCode,e);
      if (keyCode === 13 && this.search.trim()) {
        this.keywords = this.search.trim()
        this.current = 1
        this.getUserListPage()
      }
    },
    clearHandle() {
      this.keywords = ''
      this.getUserListPage()
    },
    changeHandle(val) {
      if (!val) {
        this.keywords = ''
        this.current = 1
        this.getUserListPage()
      }
    },
    async getUserListPage() {
      this.listLoading = true
      const res = await getUserListPage({
        keywords: this.keywords,
        userType: this.userType,
        pageSize: this.pageSize,
        currentPage: this.current
      })
      const { data: { list, pagination } } = res
      // console.log('list---data', data)
      this.list = list
      this.total = pagination.total
      this.totalPage = pagination.totalPage
      this.current = pagination.currentPage
      this.listLoading = false
    },
    handleCurrentChange(val) {
      this.current = val
      this.getUserListPage()
    }
  },

  created() {
    // if (this.role === 'normal') {
    //    this.$alert('没有访问权限', {
    //       confirmButtonText: '确定',
    //       showClose: false,
    //       callback: action => {
    //         this.$router.replace('/list')
    //       }
    //     })
    //     return
    // }
    this.getUserListPage()
  }
}
</script>
<style lang="scss" scoped>
.user-container {
  background: #ffffff;
  padding: 10px 0;
}
.btn-box {
  padding: 10px 10px;
}
.table-box {
  padding: 10px;
}
.pagination-container {
  width: 100%;
  padding: 20px 0;
  text-align: center;
}
</style>
