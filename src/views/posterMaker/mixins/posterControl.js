import Vue from "vue";
import ca from "element-ui/src/locale/lang/ca";

export default {
  data() {
    return {
      isShowDialogPosterManageWindow: false,
      posterList: [],
      onSelectExistedPoster: null,
      onSelectSaveTargetPoster: null,
      requestedPosterList: false,
      inputNewPosterName: '',
      poster: {
        poster_id: null,
      }
    }
  },
  methods: {
    async deletePosterData() {
      if (this.onSelectExistedPoster === null) {
        this.$message('请选择一个海报')
        return
      }
      const result = await this.$api.DELETE_POSTER_LIST(this.posterList[this.onSelectExistedPoster].poster_id)
      this.posterList.splice(this.onSelectExistedPoster, 1)
      this.onSelectExistedPoster = null
      this.requestedPosterList = false
      this.$message('删除成功')
    },
    showPosterManageWindow() {
      this.isShowDialogPosterManageWindow = true
    },
    setPosterData() {
      if (this.onSelectExistedPoster === null) {
        this.$message('请选择一个海报')
        return
      }
      Vue.set(this, 'pages', JSON.parse(this.posterList[this.onSelectExistedPoster].poster_data))
      this.poster.poster_id = this.posterList[this.onSelectExistedPoster].poster_id
      this.onSelectExistedPoster = null
      this.isShowDialogPosterManageWindow = false
    },
    async savePosterData() {
      if (this.onSelectSaveTargetPoster === null) {
        this.$message('请选择一个海报')
        return
      }
      const data = _.cloneDeep(this.pages)
      const poster = this.posterList[this.onSelectSaveTargetPoster]
      const result = await this.$api.UPDATE_POSTER({
        poster_id: poster.poster_id,
        create_user_id: poster.create_user_id,
        poster_name: poster.poster_name,
        poster_type: poster.poster_type,
        poster_data: JSON.stringify(data),
      })
      this.requestedPosterList = false
      this.$message('保存成功')
      this.isShowDialogPosterManageWindow = false
    },
    getPageData() {
      const data = _.cloneDeep(this.pages)
      data.forEach(page => {
        page.cells && page.cells.forEach(cell => {
          delete cell.descriptor
        })
      })
      // this.$alert(data, '数据', {
      //   confirmButtonText: '确定',
      //   callback: action => {
      //   }
      // });
      console.log('poster data', data)
      return data
    },
    async handleCreatePoster() {
      if (!this.inputNewPosterName) {
        this.$message('请输入海报名')
        return
      }
      const data = this.getPageData()
      if (!data || data.length === 0) {
        this.$message('海报数据不能为空')
        return
      }
      const result = await this.$api.CREATE_POSTER({
        create_user_id: 1, poster_name: this.inputNewPosterName, poster_type: 1, poster_data: JSON.stringify(data)
      })
      this.inputNewPosterName = ''
      this.$message('保存成功')
      this.poster.poster_id = result.insertId
      this.requestedPosterList = false
      this.isShowDialogPosterManageWindow = false
    }
  },
  watch: {
    async isShowDialogPosterManageWindow(val) {
      if (val && !this.requestedPosterList) {
        let data;
        try {
          data = await this.$api.GET_POSTER_LIST()
        } catch (e) {
          this.$message('获取数据失败~')
          return
        }
        Vue.set(this, 'posterList', data)
        this.requestedPosterList = true
      }
    }
  }
}
