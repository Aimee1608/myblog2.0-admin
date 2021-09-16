<template>
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-input placeholder="请输入留言ID"
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

    <div>
      <el-table v-loading="listLoading"
                :data="list"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="center"
                         label="ID"
                         width="220">
          <template #default="scope"> {{ scope.row._id }} </template>
        </el-table-column>
        <el-table-column width="150"
                         label="userId">
          <template #default="scope"> {{ scope.row.userId }} </template>
        </el-table-column>
        <el-table-column label="content">
          <template #default="scope">
            <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章id"
                         width="220"
                         align="center">
          <template #default="scope">
            <span>{{scope.row.articleId}}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态"
                         width="140"
                         align="center">
          <template #default="scope">
            <span>{{scope.row.state == 1 ? '启用': '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间"
                         width="200"
                         align="center">
          <template #default="scope"> {{ initDate(scope.row.createDate) }} </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         fixed="right"
                         width="200">
          <template #default="scope">
            <el-button @click="editHandle(scope.row)"
                       type="primary"
                       plain>编辑状态</el-button>
            <el-popconfirm title="确定删除吗？"
                           @confirm="deleteHandle(scope.row)">
              <template #reference>
                <el-button type="danger"
                           @click="deleteHandle(scope.row)"
                           plain>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
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

import {
  mapGetters
} from 'vuex'
import _ from 'lodash'
import commentAPI from '@/api/comment'
import { initDate } from '@/utils'
export default {
  data() {
    return {
      search: '',
      list: null,
      listLoading: true,
      keywords: '',
      dialogFormVisible: false,
      pageSize: 10,
      current: 1,
      total: 0,
      totalPage: 0,
      fullscreenLoading: false,
      articleCateList: []
    }
  },
  computed: {
    ...mapGetters(['userId', 'role'])
  },
  async created() {
    await this.getList()
  },
  methods: {
    filterName(value) {
      const item = this.articleCateList.find(item => item._id == value) || {}
      return item.name
    },
    initDate(time) {
      return initDate(time)
    },
    async getList() {
      this.listLoading = true
      const res = await commentAPI.getList({
        keywords: this.keywords,
        pageSize: this.pageSize,
        currentPage: this.current
      })
      const {
        list,
        pagination
      } = res.data
      // console.log('list---data', res.data)
      this.list = list
      this.total = pagination.total
      this.totalPage = pagination.totalPage
      this.current = pagination.currentPage
      this.listLoading = false
    },

    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    searchEnterFun(e) {
      const keyCode = window.event ? e.keyCode : e.which
      // console.log('回车搜索',keyCode,e);
      if (keyCode === 13 && this.search.trim()) {
        this.keywords = this.search.trim()
        this.current = 1
        this.getList()
      }
    },
    clearHandle() {
      this.keywords = ''
      this.getList()
    },
    changeHandle(val) {
      if (!val) {
        this.keywords = ''
        this.current = 1
        this.getList()
      }
    },
    async editHandle(info) {
      const res = await commentAPI.edit({ _id: info._id, state: info.state === 1 ? 0 : 1 })
      console.log('articleAPI.add---res', res)
      if (res.code == 0) {
        this.$message({ message: '修改成功', type: 'success' })
      } else {
        this.$message({ message: '修改失败', type: 'error' })
      }
      await this.getList()
    },
    async deleteHandle(item) {
      const res = await commentAPI.remove({ _id: item._id })
      this.$message('删除成功')
      await this.getList()
    }
  }
}
</script>

<style lang="scss">
.log-tab {
  width: 100%;
  height: 40px;
  border-bottom: 2px solid #409eff;
  margin: 0 0 30px;

  .log-tab-item {
    font-weight: 600;
    background: transparent;
    border-radius: 2px 2px 0 0;
    // width: 114px;
    height: 40px;
    line-height: 40px;
    padding: 0 25px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    text-align: center;
    color: #999;
    display: inline-block;
    cursor: pointer;
  }

  .log-tab-item-active {
    background: #4a82f7;
    color: #fff;
  }
}

.pagination-container {
  width: 100%;
  padding: 20px 0;
  text-align: center;
}
.create-tip {
  padding: 30px 0 0 60px;
  font-size: 13px;
  color: #d61a1b;
}
.list-image {
  width: 100%;
}
</style>
