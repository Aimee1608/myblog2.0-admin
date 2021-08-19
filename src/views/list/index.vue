<template>
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-input placeholder="请输入文章名称"
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
      <el-button style="float: right;"
                 type="primary"
                 @click="createArticle">创建文章</el-button>
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
                         label="文章标题">
          <template #default="scope"> {{ scope.row.title }} </template>
        </el-table-column>
        <el-table-column label="文章截图"
                         width="220">
          <template #default="scope">
            <img class="list-image"
                 :src="scope.row.image" />
          </template>
        </el-table-column>
        <el-table-column label="所属类别"
                         width="140"
                         align="center">
          <template #default="scope">
            <span>{{filterName(scope.row.classId)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="浏览量">
          <template #default="scope">
            <span>{{scope.row.browseCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="点赞量">
          <template #default="scope">
            <span>{{scope.row.likeCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收藏量">
          <template #default="scope">
            <span>{{scope.row.collectCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论量">
          <template #default="scope">
            <span>{{scope.row.commentCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐">
          <template #default="scope">
            <span>{{scope.row.isRecommend == 1 ? '是': '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否热门"
                         width="140"
                         align="center">
          <template #default="scope">
            <span>{{scope.row.isHot == 1 ? '是': '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         width="140"
                         align="center">
          <template #default="scope">
            <span>{{scope.row.state == 1 ? '启用': '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新操作时间"
                         width="200"
                         align="center">
          <template #default="scope"> {{ initDate(scope.row.lastModifiedDate) }} </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center"
                         fixed="right"
                         width="200">
          <template #default="scope">
            <el-button @click="goArticleDetail(scope.row._id)"
                       type="text">查看</el-button>

            <el-button @click="goArticleEdit(scope.row._id)"
                       type="text">编辑</el-button>
            <el-dropdown @command="(item) => articleEditHandle(item, scope.row, scope.$index)">
              <el-button type="text"
                         style="margin-left: 10px;">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu type="split-button">

                  <el-dropdown-item command="isRecommend">{{scope.row.isRecommend?'关闭': '开启'}}推送</el-dropdown-item>
                  <!-- <el-dropdown-item :disabled="scope.row.status == 0"
                                    command="errorData">错误数据</el-dropdown-item> -->
                  <el-dropdown-item command="isHot">{{scope.row.isHot?'关闭': '开启'}}热门</el-dropdown-item>
                  <el-dropdown-item command="state">{{scope.row.state?'禁用': '启用'}}</el-dropdown-item>
                  <!-- <el-dropdown-item v-if="userId === log.userId || role === 'admin' || role === 'superAdmin'"
                                      command="delete">删除</el-dropdown-item> -->
                </el-dropdown-menu>
              </template>
            </el-dropdown>

          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>

import {
  mapGetters
} from 'vuex'
import _ from 'lodash'
import articleAPI from '@/api/article'
import articleCateAPI from '@/api/articleCate'
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
    await this.getAllLogTypeList()
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
      const res = await articleAPI.getList({
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
    createArticle() { // 创建文章 创建成功并跳转
      // console.log('name---000', this.$refs.baseRules)
      this.$router.push('/createArticle')
    },
    goArticleDetail(id) { // 跳转到文章详情
      this.$router.push({
        path: '/articleDetail',
        query: {
          id
        }
      })
    },
    goArticleEdit(id) { // 跳转到文章详情
      this.$router.push({
        path: '/createArticle',
        query: {
          id
        }
      })
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
    async articleEditHandle(command, log, index) {
      const detail = _.cloneDeep(log)
      if (command === 'isRecommend') {
        detail.isRecommend = detail.isRecommend === 1 ? 0 : 1
      } else if (command === 'isHot') {
        detail.isHot = detail.isHot === 1 ? 0 : 1
      } else if (command === 'state') {
        detail.state = detail.state === 1 ? 0 : 1
      }
      await this.edit(detail, index)

    },
    async edit(info, index) {
      const res = await articleAPI.edit(info)
      console.log('articleAPI.add---res', res)
      if (res.code == 0) {
        this.$message({ message: '修改成功', type: 'success' })
        this.list[index] = info
      } else {
        this.$message({ message: '修改失败', type: 'error' })
      }
    },
    async getAllLogTypeList() {
      const res = await articleCateAPI.getAllList()
      const { data } = res
      this.articleCateList = data
    },
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
