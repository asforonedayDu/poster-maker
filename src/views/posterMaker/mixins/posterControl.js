import Vue from "vue";
import ca from "element-ui/src/locale/lang/ca";
import cells from '@/components/poster/cells'
import {cleanCellProps, cleanPageProps, getMaxCellId, getMaxPageId} from "@/views/posterMaker/libs/static";
import el from "element-ui/src/locale/lang/el";

export default {
  data() {
    return {
      isShowDialogPosterManageWindow: false,
      isShowSetAudioWindow: false,
      audio: {
        href: '',
        loop: true,
        autoPlay: true,
      },
      tempData: {
        href: '',
        loop: true,
        autoPlay: true,
      },
      posterList: [],
      onSelectExistedPoster: null,
      onSelectSaveTargetPoster: null,
      requestedPosterList: false,
      inputNewPosterName: '',
      poster: {
        poster_id: null,
      },
      fontList: [],
    }
  },
  methods: {
    showSetAudioWindow() {
      Object.assign(this.tempData, this.audio)
      this.isShowSetAudioWindow = true
    },
    handleSaveAudioData() {
      Object.assign(this.audio, this.tempData)
      this.isShowSetAudioWindow = false
    },
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
    async handleSelectPoster() {
      if (this.onSelectExistedPoster === null) {
        this.$message('请选择一个海报')
        return
      }
      let posterData
      const loading = this.$loading({background: 'rgba(0,0,0,0.3)'})
      try {
        posterData = await this.$api.GET_POSTER_DETAIL(this.posterList[this.onSelectExistedPoster].poster_id)
      } catch (e) {
        loading.close()
        this.$message('请求错误~')
        return
      }
      loading.close()
      this.setPosterData(posterData.poster_data)
    },
    setPosterData(posterData) {
      posterData = JSON.parse(posterData)
      if (posterData.pages && posterData.pages.length > 0) {
        // 设置默认值
        let maxPageId = getMaxPageId(posterData.pages)
        posterData.pages && posterData.pages.forEach(page => {
          if (/Infinity|null/i.test(page.id)) {
            maxPageId += 1
            page.id = maxPageId
          }

          let maxId = getMaxCellId(page.cells)
          !page.props && (page.props = {})
          if (!page?.props?.name) {
            page.name && (page.props.name = page.name)
          }
          if (page.cells) {
            page.cells.forEach(cell => {
              const defaultCell = cells.find(i => i.name === cell.type)
              Object.keys(defaultCell.defaultProps).forEach(defaultKey => {
                if (!cell.props.hasOwnProperty(defaultKey)) cell.props[defaultKey] = defaultCell.defaultProps[defaultKey]
              })
              if (!cell.props.name) {
                cell.name && (cell.props.name = cell.name)
              }
              if (/Infinity|null/i.test(cell.id)) {
                maxId += 1
                cell.id = `${page.id}_${maxId}`
              }
            })
          } else {
            page.cells = []
          }
        })
        Vue.set(this, 'pages', posterData.pages)
      }
      if (this.onSelectExistedPoster) {
        this.posterList[this.onSelectExistedPoster].poster_data = posterData
      }
      if (posterData.audio) {
        Object.assign(this.audio, posterData.audio);
        Object.assign(this.tempData, posterData.audio);
      }
      this.poster.poster_id = this.posterList[this.onSelectExistedPoster].poster_id
      this.onSelectExistedPoster = null
      this.isShowDialogPosterManageWindow = false
      this.onSelectPage = null
    },
    async savePosterData() {
      if (this.onSelectSaveTargetPoster === null) {
        this.$message('请选择一个海报')
        return
      }
      const data = _.cloneDeep(this.pages)
      data.forEach(page => {
        cleanPageProps(page)
        page.cells && page.cells.forEach(cell => {
          cleanCellProps(cell)
        })
      })
      const poster = this.posterList[this.onSelectSaveTargetPoster]
      const result = await this.$api.UPDATE_POSTER({
        poster_id: poster.poster_id,
        create_user_id: poster.create_user_id,
        poster_name: poster.poster_name,
        poster_type: poster.poster_type,
        poster_data: JSON.stringify({
          pages: data,
          audio: {...this.audio},
        }),
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
        create_user_id: 1, poster_name: this.inputNewPosterName, poster_type: 1, poster_data: JSON.stringify({
          pages: data,
          audio: {...this.audio},
        })
      })
      this.inputNewPosterName = ''
      this.$message('保存成功')
      this.poster.poster_id = result.insertId
      this.requestedPosterList = false
      this.isShowDialogPosterManageWindow = false
    },
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
    },
  }
}
