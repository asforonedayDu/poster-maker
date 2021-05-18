<template>
  <div class="index">
    <div>
      <h1 class="title">视频图片文件上传记录网</h1>
      <van-cell-group>
        <van-field v-model="id" label="代码" placeholder="请输入县级代码或市级代码"/>
        <van-field v-model="name" label="名称" placeholder="请输入县级名称或市级名称"/>
        <van-field v-model="video_id" label="视频名" placeholder="请输入视频名称,并保留后缀（请以英文命名，不得重复）"/>
      </van-cell-group>
      <h2 class="second_title">增加内容</h2>
      <van-popover
        v-model="showPopover"
        trigger="click"
        :actions="actions"
        @select="showPopup"
      >
        <template #reference>
          <van-button type="primary" color="red" round>请选择增加类型(请按顺序排布)</van-button>
        </template>
      </van-popover>
      <van-popup v-model="show" closeable>
        <div class="script_page">
          <h3 style="color:red">增加文字</h3>
          <van-cell-group>
            <van-field type="textarea" v-model="content" label="内容" placeholder="请输入文字内容"/>
          </van-cell-group>
          <van-button type="primary" color="red" round @click="onSubmitScript">确认</van-button>
        </div>
      </van-popup>
      <van-popup v-model="show2" closeable>
        <div class="script_page">
          <h3 style="color:green">增加图片</h3>
          <van-cell-group>
            <van-uploader v-model="imgList" :after-read="afterReadImg" :max-count="1">
              <template #preview-cover="{ file }">
                <div class="preview-cover van-ellipsis">{{ file.name }}</div>
              </template>
            </van-uploader>
            <p>（图片上传前请先将文件名改成英文）</p>
          </van-cell-group>
          <van-button type="primary" color="red" round @click="onSubmitImg">确认</van-button>
        </div>
      </van-popup>
      <van-popup v-model="show3" closeable>
        <div class="script_page">
          <h3 style="color:blue">增加视频</h3>
          <van-cell-group>
            <van-uploader v-model="videoList" :after-read="afterReadVideo">
              <template #preview-cover="{ file }">
                <div class="preview-cover van-ellipsis">{{ file.name }}</div>
              </template>
            </van-uploader>
            <div>（视频上传前请先将文件名改成英文）</div>
            <van-field v-model="img" label="图片" placeholder="请输入图片标题"/>
            <van-field v-model="people_name" label="名称" placeholder="请输入演讲者名称"/>
            <van-field v-model="desc" label="人物简介" placeholder="请输入演讲者职位"/>
            <van-field v-model="location" label="人物来自" placeholder="请输入地点"/>
          </van-cell-group>
          <van-button type="primary" color="red" round @click="onSubmitVideo">确认</van-button>
        </div>
      </van-popup>
      <van-popup v-model="show4" closeable>
        <div class="script_page">
          <h3 style="color:yellowgreen">增加双图</h3>
          <van-cell-group>
            <van-uploader v-model="imgList" :max-count="2">
              <template #preview-cover="{ file }">
                <div class="preview-cover van-ellipsis">{{ file.name }}</div>
              </template>
            </van-uploader>
            <p>（图片上传前请先将文件名改成英文）</p>
          </van-cell-group>
          <van-button type="primary" color="red" round @click="onSubmitTwoImg">确认</van-button>
        </div>
      </van-popup>
      <van-list>
        <van-cell v-for="(item,key) in data" :key="key">
          <div class="list" v-if="item.type == 1">文字: {{item.content}}</div>
          <div class="list" v-if="item.type == 2">图片: {{item.title}}</div>
          <div class="list" v-if="item.type == 3">视频: {{item.title}}</div>
          <div class="list" v-if="item.type == 4">双图: {{item.img1}},{{item.img2}}</div>
        </van-cell>
      </van-list>
      <van-button class="button" type="info" round @click="onSubmit">确认</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import vant from 'vant';
import 'vant/lib/index.css';

Vue.use(vant);

export default {
  name: 'Submit',
  data() {
    return {
      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      actions: [{text: '文字'}, {text: '图片'}, {text: '视频'}, {text: '双图'}],
      id: "",
      name: "",
      video_id: "",
      data: [],
      show: false,
      show2: false,
      show3: false,
      show4: false,
      content: "",
      image_name: "",
      title: "",
      img: "",
      people_name: "",
      desc: "",
      location: "",
      imgList: [],
      videoList: []
    }
  },
  methods: {
    addContent() {
      console.log("aaa")
    },
    showPopup(action) {
      switch (action.text) {
        case "文字":
          this.show = true
          break
        case "图片":
          this.show2 = true
          break
        case "视频":
          this.show3 = true
          break
        case "双图":
          this.show4 = true
          break
      }
    },
    onSubmitScript() {
      this.data.push({type: 1, content: this.content})
      this.show = false
    },
    onSubmitImg() {
      this.data.push({type: 2, title: this.title})
      this.show2 = false
    },
    onSubmitVideo() {
      this.data.push({
        type: 3,
        title: this.title,
        img: this.img,
        people_name: this.people_name,
        desc: this.desc,
        location: this.location
      })
      this.show3 = false
    },
    onSubmitTwoImg() {
      this.data.push({type: 4, img1: this.imgList[0].file.name, img2: this.imgList[1].file.name})
      this.show4 = false
    },
    onSubmit() {
      const target = JSON.stringify({id: this.$data.id, video_id: this.$data.video_id, data: this.$data.data})
      const blob = new Blob(['export default ' + target])
      const url = document
      const name = this.id + '.js'
      const a = document.createElement('a')
      a.download = name
      a.href = URL.createObjectURL(blob)
      document.body.append(a) // 修复firefox中无法触发click
      a.click()
    },
    afterReadImg(img) {
      this.title = img.file.name
    },
    afterReadVideo(video) {
      this.title = video.file.name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .index {
    text-align: center;
    margin: 0 auto;
    width: 600px;
  }

  .title {
    margin: 30px 0 30px 0;
    color: transparent;
    -webkit-text-stroke: 1px red;
    letter-spacing: 0.04em;
  }

  .second_title {
    color: white;
    letter-spacing: 0;
    text-shadow: 0px 1px 0px #999, 0px 2px 0px #888, 0px 3px 0px #777, 0px 4px 0px #666, 0px 5px 0px #555, 0px 6px 0px #444, 0px 7px 0px #333, 0px 8px 7px #001135
  }

  .button {
    margin-top: 10px;
  }

  .goods-card {
    margin: 0;
    background-color: white;
  }

  .delete-button {
    height: 100%;
  }

  .script_page {
    width: 350px;
    height: 350px;
  }

  .preview-cover {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
  }

  .list {
    text-align: center;
    font-size: 16px;
  }
</style>
