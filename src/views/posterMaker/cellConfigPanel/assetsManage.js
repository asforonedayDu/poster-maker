import {uploadImage} from '@/api/modules/file'
import Vue from "vue";
import panelList from '@/views/posterMaker/cellConfigPanel/panelList'

export default {
  data() {
    return {
      showAssetsWindow: false,
      showFontsWindow: false,
      commonAssets: [],
      onSelectAsset: null,
      onSelectFont: null,
    }
  },
  inject: ['allFontList', '$context'],
  methods: {
    async handleFontFileChange(e) {
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      // console.log('file', file)
      const fileName = file.name
      const suffix = fileName.split('.').pop()
      if (!/^(woff2)|(woff)|(ttf)|(eot)|(svg)$/i.test(suffix)) {
        this.$message('不支持的字体格式')
        return
      }
      const _formData = new FormData()
      _formData.append('create_user_id', '1')
      _formData.append('file', file)
      const loading = this.$loading('上传中..')
      try {
        await this.$api.UPLOAD_FONT(_formData)
        await this.getFontList()
      } catch (error) {
        this.$message('字体上传失败~' + error.message || '')
        console.log('upload font error', error)
      } finally {
        e.target.value = ''
        loading.close()
      }
    },
    async getFontList() {
      let data;
      try {
        data = await this.$api.GET_FONT_ASSETS()
      } catch (e) {
        this.$message('获取数据失败~')
        return
      }
      this.allFontList.splice(0, this.allFontList.length);
      data.forEach(item => {
        this.allFontList.push(item)
      })
      this.$context.requestedFontAssets = true
    },
    async handlerFontAssetDelete(font, index) {
      await this.$api.DELETE_COMMON_ASSETS(font.asset_id)
      await this.getFontList()
    },
    async handleImgFileChange(e) {
      // console.log('file', e.target)
      if (!e.target.files || e.target.files.length === 0) return
      const file = e.target.files[0]
      const fileName = file.name
      const suffix = fileName.split('.').pop()
      // console.log('e.target.files', file)
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
          const {url} = uploadResult
          // 保存到数据库
          const result = await this.$api.SAVE_ASSETS(fileName, url)
          item.asset_id = result.insertId
          item.asset_content = url
          item.uploading = false
        } catch (error) {
          this.$message('照片上传失败~')
          console.log('upload image error', error)
          const index = this.commonAssets.indexOf(item)
          this.commonAssets.splice(index, 1)
        } finally {
          e.target.value = ''
        }
      }
    },
    setBackgroundImage(asset) {
      if (asset.uploading) return
      this.$set(this.configProps, panelList.backgroundImage.propKey, asset.asset_content)
      this.showAssetsWindow = false
    },
    handleAssetClick(asset) {
      if (!this.onSelectAsset || this.onSelectAsset.asset_id !== asset.asset_id) {
        this.onSelectAsset = asset
      } else {
        this.onSelectAsset = null
      }
    },
    async deletePicAsset(asset) {
      await this.$api.DELETE_COMMON_ASSETS(asset.asset_id)
      const index = this.commonAssets.indexOf(asset)
      this.commonAssets.splice(index, 1)
      this.onSelectAsset = null
    }
  },
  watch: {
    async showAssetsWindow(val) {
      if (val && !this.$context.requestedAssets) {
        const data = await this.$api.GET_PIC_ASSETS()
        if (data) {
          Vue.set(this, 'commonAssets', data)
          this.$context.requestedAssets = true
        } else {
          console.log('查询素材库图片错误')
        }
      }
    },
    async showFontsWindow(val) {
      if (val && !this.$context.requestedFontAssets) {
        await this.getFontList()
      }
    },
  }
}
