import {uploadImage} from '@/api/modules/file'
import Vue from "vue";
import panelList from '@/views/posterMaker/cellConfigPanel/panelList'

export default {
  data() {
    return {
      showAssetsWindow: false,
      requestedAssets: false,
      commonAssets: [],
      fileList: []
    }
  },
  methods: {
    async handleImgFileChange(e) {
      console.log('file', e.target)
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      const fileName = file.name
      const suffix = fileName.split('.').pop()
      console.log('e.target.files', file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async (fileReader) => {
        const url = fileReader.target.result.substring(fileReader.target.result.indexOf(',') + 1)
        const localImgUrl = 'data:image/png;base64,' + url
        // 上传图片
        const id = _.uniqueId('asset_')
        const _formData = new FormData()
        _formData.append('filename', id + Date.now() + '.' + suffix)
        _formData.append('file', file)
        const item = {
          uploading: true,
          asset_id: id,
          asset_name: fileName,
          asset_content: localImgUrl,
        }
        this.commonAssets.unshift(item)
        try {
          const uploadResult = await uploadImage(_formData)
          const {url} = uploadResult.data
          // 保存到数据库
          const result = await this.$api.SAVE_ASSETS(fileName, url)
          item.asset_id = result.insertId
          item.uploading = false
        } catch (error) {
          this.$message('照片上传失败~')
          console.log('upload image error', error)
          const index = this.commonAssets.indexOf(item)
          this.commonAssets.splice(index, 1)
        }
      }
    },
    setBackgroundImage(asset) {
      if (asset.uploading) return
      this.$set(this.configProps, panelList.backgroundImage.propKey, asset.asset_content)
    }
  },
  watch: {
    async showAssetsWindow(val) {
      if (val && !this.requestedAssets) {
        const data = await this.$api.GET_COMMON_ASSETS()
        if (data) {
          Vue.set(this, 'commonAssets', data)
        } else {
          console.log('查询素材库图片错误')
        }
      }
    }
  }
}
