<template>

  <el-dialog title="上传图片"
             append-to-body
             v-model="dialogFormVisible">
    <div class="upload-box">
      <div class="avatar-uploader"
           @click="selectHandle"
           v-show="showBtn == -1">
        <div class="el-upload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <input ref="picker"
                 v-show="false"
                 multiple
                 type="file"
                 accept="image/*"
                 @change="beforeAvatarUpload" />
        </div>
      </div>

      <el-table :data="list"
                v-show="showBtn != -1"
                max-height="400"
                style="width: 100%">
        <el-table-column label="文件"
                         width="180">
          <template #default="scope">
            <div class="upload-table-image">
              <img :src="scope.row.filePicture" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="名称"
                         width="180">
        </el-table-column>
        <el-table-column prop="size"
                         label="大小">
        </el-table-column>
        <el-table-column prop="stat"
                         label="状态">
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-show="showBtn == 1"
                   @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   v-loading.fullscreen.lock="fullscreenLoading"
                   @click="handleSure">确 定</el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script>
// import { uploadFile } from '@/utils/upload'
import resourceAPI from '@/api/resource'

export default {
  name: 'Upload',
  data() {
    return {
      imageUrl: '',
      targetFiles: [],
      dialogFormVisible: false,
      fullscreenLoading: false,
      list: [],
      dataNormalFiles: [],
      maxFiles: [],
      showBtn: -1
    }
  },
  created() {
  },
  methods: {
    beforeAvatarUpload(e) {
      const targetFiles = []
      // console.log('file', e, e.target.files)
      const fileList = e.target.files
      Object.values(fileList).forEach((targetFile) => {
        // const targetFile = targetFiles.raw
        // console.log('targetFile', targetFile.raw)
        const file = new File([targetFile], targetFile.name.replace(/_/g, '-'), { type: targetFile.type })
        targetFiles.push(file)
      })
      this.targetFiles = targetFiles
      console.log('targetFiles', targetFiles)
      this.submitUpload()
    },
    async submitUpload() {
      if (this.targetFiles.length == 0) {
        return
      }
      const requestQueue = []

      this.targetFiles.forEach(file => {
        const obj = {}
        obj.key = file.lastModified
        obj.name = file.name
        obj.size = this.getFileSize(file)
        obj.filePicture = this.getObjectURL(file)
        const res = (/\.json$|\.pdf$|\.doc$|\.docx$|\.xls$|\.xlsx$|\.txt$|\.jpg$|\.jpeg$|\.gif$|\.svg$|\.png$|\.mp3$|\.mp4$|\.m3u8$/i).test(obj.name)
        if (res) {
          if (file.size > 2 * 1024 * 1024) {
            obj.stat = '上传失败'
            this.maxFiles.push(obj)
          } else {
            this.dataNormalFiles.push(obj)
            var params = new FormData();
            params.append('name', file.name)
            params.append('file', file)
            requestQueue.push(resourceAPI.uploadFile(params))
            obj.stat = '上传中'
          }
        } else {
          obj.stat = '上传失败'
          this.maxFiles.push(obj)
        }
      })
      console.log('requestQueue', requestQueue)
      this.list = [...this.dataNormalFiles, ...this.maxFiles]
      this.showBtn = 0
      const fileList = await Promise.all(requestQueue)
      console.log('fileList', fileList)
      this.dataNormalFiles.forEach(file => {
        file.stat = '上传成功'
      })
      this.list = [...this.dataNormalFiles, ...this.maxFiles]
      this.showBtn = 1
      this.$emit('updataList')
    },
    getFileSize(file) {
      const size = file.size < (1024 * 1024) ? `${(file.size / 1024).toFixed(1)}KB` : `${(file.size / (1024 * 1024)).toFixed(1)}M`
      return size
    },
    getObjectURL(file) {
      const binaryData = []
      binaryData.push(file)
      return window.URL.createObjectURL(new Blob(binaryData, { type: 'application/zip' }))
    },
    show() {
      this.showBtn = -1
      this.list = []
      this.targetFiles = []
      this.dialogFormVisible = true
    },
    handleSure() {
      this.dialogFormVisible = false
      this.targetFiles = []
      this.list = []
      this.showBtn = -1
    },
    selectHandle() {
      this.$refs.picker && this.$refs.picker.click()
    }
  }
}

</script>
<style lang="scss">
.avatar-uploader {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.upload-box {
  width: 100%;
}
.upload-table-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
