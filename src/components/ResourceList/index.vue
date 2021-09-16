<template>
  <div class="resourceList-box">
    <div class="resourceList-container">
      <div :class="['resource-box', fromType == 'filePicker'?'resource-box-picker':'']">
        <el-row :gutter="20">
          <el-col :xs="fromType == 'filePicker' ? 6 : 8"
                  :sm="fromType == 'filePicker' ? 6 : 6"
                  :md="fromType == 'filePicker' ? 6 : 6"
                  :lg="fromType == 'filePicker' ? 6 : 4"
                  :xl="fromType == 'filePicker' ? 6 : 3"
                  v-for="(item, index) in list"
                  :key="item._id">
            <div @click="fromType == 'filePicker' && selectPicture(item)"
                 :class="['resource-card', selected._id == item._id ? 'resource-card-selected': '']">
              <div class="resource-card-image">
                <el-image v-if="fromType != 'filePicker'"
                          :src="item.url"
                          class="resource-image"
                          :preview-src-list="[item.url]">
                </el-image>
                <div v-if="fromType == 'filePicker'"
                     class="resource-image-file">
                  <img class="resource-image"
                       :src="item.url" />
                </div>
              </div>
              <div class="resource-bottom">
                <span class="resource-bottom-name">{{item.name}}</span>
                <div class="resource-bottom-handle">
                  <el-link type="primary"
                           :underline="false"
                           @click="copyHandle(item.url)">
                    <i class="el-icon-document-copy"></i>
                  </el-link>
                  <el-popconfirm @confirm="deleteHandle(item)"
                                 :title="'确定删除  '+item.name + '  吗？'">
                    <template #reference>
                      <el-link type="primary"
                               :underline="false">
                        <i class="el-icon-delete"></i>
                      </el-link>
                    </template>
                  </el-popconfirm>

                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="resource-pagination-container">
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

import resourceAPI from '@/api/resource'
import { copyHandle } from '@/utils'
export default {
  name: 'ResourceList',
  data() {
    return {
      pageSize: 12,
      current: 1,
      total: 0,
      isEdit: false,
      listLoading: false,
      list: [],
      selected: {}
    }
  },
  props: ['fromType'],
  components: {

  },
  methods: {
    copyHandle,
    onSubmit() {
      this.$refs.upload && this.$refs.upload.show()
    },
    async getResourceList() {
      this.listLoading = true
      this.pageSize = this.fromType == 'filePicker' ? 8 : 12
      const res = await resourceAPI.getResourceList({
        pageSize: this.pageSize,
        currentPage: this.current
      })
      // console.log('list---data', data)
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
      this.getResourceList()
    },
    updataList() {
      this.current = 1
      this.getResourceList()
    },
    selectPicture(item) {
      this.selected = item
      this.$emit('selectHandle', item)
    },
    async deleteHandle(item) {
      const res = await resourceAPI.deleteResource(item._id)
      if (res.code == 0) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getResourceList()
      }
    }
  },
  created() {
    this.getResourceList()
  }
}
</script>
<style lang="scss" scoped>
.resource-container {
  // background: #ffffff;
}
.btn-box {
  padding: 10px 10px;
}
.resource-box {
  padding: 10px;
  min-height: 600px;
}
.resource-box-picker {
  min-height: 0;
  .resource-card-image {
    height: 130px;
  }
  .resource-card {
    cursor: pointer;
    box-sizing: border-box;
    height: 190px;
  }
  .resource-card-selected {
    border: 2px solid #66b1ff;
  }
}
.resource-pagination-container {
  width: 100%;
  padding: 20px 0;
  text-align: center;
}

.resource-image {
  width: 100%;
  height: auto;
  display: block;
  margin: auto 0;
}
.resource-image-file {
  margin: auto 0;
}
.resource-clearfix:before,
.resource-clearfix:after {
  display: table;
  content: '';
}

.resource-clearfix:after {
  clear: both;
}
.resource-card {
  // height: 260px;
  // border: 2px solid transparent;
  padding: 0;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  margin-bottom: 30px;
}
.resource-card-image {
  height: 200px;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  align-content: center;
  justify-items: center;
  justify-content: center;
}
.resource-bottom {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 0 14px;
  align-items: center;
  // i {
  //   display: none;
  //   cursor: pointer;
  //   color: #66b1ff;
  // }
  .resource-bottom-handle {
    display: none;
    // display: flex;
    i {
      margin: 0 10px;
    }
  }
  &:hover {
    .resource-bottom-name {
      display: none;
    }
    .resource-bottom-handle {
      display: block;
    }
  }
}
</style>
