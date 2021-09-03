<template>
  <div class="app-container">
    <div class="resource-container">
      <div class="btn-box">
        <el-button type="primary"
                   @click="onSubmit">上传图片</el-button>
      </div>
    </div>
    <ResourceList ref="resourceList" />
    <Upload ref="upload"
            @updataList="updataList" />
  </div>
</template>

<script>

import Upload from '@/components/Upload/index.vue'
import ResourceList from '@/components/ResourceList/index.vue'
export default {
  name: 'Resource',
  data() {
    return {

    }
  },
  components: {
    Upload,
    ResourceList
  },
  methods: {
    onSubmit() {
      this.$refs.upload && this.$refs.upload.show()
    },
    updataList() {
      this.$refs.resourceList && this.$refs.resourceList.updataList()
    }
  },
  created() {

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
</style>
