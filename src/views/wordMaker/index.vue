<template>
  <div>
    <div class="add-btn">
      <el-input
        class="input-box"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        @change="wordChange"
        placeholder="请输入内容，以、分割"
        v-model="originWords"
      ></el-input>
    </div>
    <div class="box-pos-container">
      <div class="box-pos-part">
        <p class="title">动词区</p>
        <el-checkbox class="radio-check" v-model="vWords.allChosen" @change="handleCheckAllChange($event,'vWords')">全选
        </el-checkbox>
        <el-checkbox-group class="box-pos" v-model="vWords.chosenWords"
                           @change="handleCheckedWordChange($event,'vWords')">
          <el-checkbox-button v-for="word in vWords.words" :label="word" :key="word"
                              @change="handleWordChange($event,word,'vWords')">
            {{word}}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="box-pos-part">
        <p class="title">名词区</p>
        <el-checkbox class="radio-check" v-model="nWords.allChosen" @change="handleCheckAllChange($event,'nWords')">全选
        </el-checkbox>
        <el-checkbox-group class="box-pos" v-model="nWords.chosenWords"
                           @change="handleCheckedWordChange($event,'nWords')">
          <el-checkbox-button v-for="word in nWords.words" :label="word" :key="word"
                              @change="handleWordChange($event,word,'nWords')">
            {{word}}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="box-pos-part">
        <p class="title">形容词区</p>
        <el-checkbox class="radio-check" v-model="aWords.allChosen" @change="handleCheckAllChange($event,'aWords')">全选
        </el-checkbox>
        <el-checkbox-group class="box-pos" v-model="aWords.chosenWords"
                           @change="handleCheckedWordChange($event,'aWords')">
          <el-checkbox-button v-for="word in aWords.words" :label="word" :key="word"
                              @change="handleWordChange($event,word,'aWords')">
            {{word}}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="box-pos-part">
        <p class="title">其它</p>
        <el-checkbox class="radio-check" v-model="otherWords.allChosen"
                     @change="handleCheckAllChange($event,'otherWords')">全选
        </el-checkbox>
        <el-checkbox-group class="box-pos" v-model="otherWords.chosenWords"
                           @change="handleCheckedWordChange($event,'otherWords')">
          <el-checkbox-button v-for="word in otherWords.words" :label="word" :key="word"
                              @change="handleWordChange($event,word,'otherWords')">
            {{word}}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>

    </div>
    <div class="single-word-box" style="margin-top: 20px">
      <el-row>
        <el-radio-group v-model="keyword" size="medium" @change="genWord">
          <el-radio-button :label="i" v-for="(i,idx) in alternativeWords" :key="idx"></el-radio-button>
        </el-radio-group>
      </el-row>
    </div>
    <div class="setting-box">
      <el-row>
        <el-radio-group v-model="position" @change="positionChange">
          <el-radio-button label="前置"></el-radio-button>
          <el-radio-button :disabled="isTwoWord" label="中置"></el-radio-button>
          <el-radio-button label="后置"></el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-switch v-model="isTwoWord" @change="positionChange" active-text="两字" inactive-text="三字"></el-switch>
      </el-row>
      <el-row style="margin-top: 10px;margin-left: 100px">
        <el-input-number
          v-model="timeInterval"
          @change="handleTimeIntervalChange"
          :min="0"
          label="自动换页（秒）"
        ></el-input-number>
        <span class="timerTips">自动换页（秒）</span>
      </el-row>
    </div>
    <div class="gen-word-box" style="margin-top: 20px">
      <el-pagination
        v-if="genWords.length>0"
        style="padding-top: 10px"
        background
        :page-size="size"
        :current-page="currentPage"
        layout="prev, pager, next"
        @current-change="pageChange"
        :total="genWords.length"/>

      <div class="word-list" style="margin-top: 20px">
        <el-button
          :type="chosenWords.indexOf(i) === -1?'default':'primary'"
          @click="chosen(i)"
          v-for="(i,idx) in showWords"
          :key="idx"
        >{{i}}
        </el-button>
      </div>
    </div>
    <div class="chosen-box" style="margin-top: 20px">
      <el-button-group v-for="(i,idx) in chosenWords" :key="idx">
        <el-button type="success">{{i}}</el-button>
        <el-button type="success" plain icon="el-icon-delete" @click="deleteChoose(idx)"></el-button>
      </el-button-group>
    </div>
  </div>
</template>


<script>

export default {
  name: 'wordMaker',
  mounted() {
    window.addEventListener("keyup", this.handleKeyup);
  },
  data() {
    return {
      genWords: [],
      showWords: [],
      size: 80,
      currentPage: 1,
      keyword: "",
      position: "前置",
      isTwoWord: true,
      allChooseV: [],
      allChooseN: [],
      allChooseA: [],
      chosenWords: [],
      originWords: "",
      alternativeWords: [],
      vWords: {
        words: [],
        chosenWords: [],
        allChosen: false
      },
      nWords: {
        words: [],
        chosenWords: [],
        allChosen: false
      },
      aWords: {
        words: [],
        chosenWords: [],
        allChosen: false
      },
      otherWords: {
        words: [],
        chosenWords: [],
        allChosen: false
      },
      autoLoop: true,
      timeInterval: 1,
      totalPage: 5,
      timer: null,
    };
  },
  computed: {
    validatedWords() {
      const result = this.repetition(this.originWords)
      console.log('validatedWords', this.originWords, result)
      return result;
    },
  },
  created() {
    const choose = localStorage.getItem("chosen");
    const wordInit = localStorage.getItem("originWords");
    if (choose) {
      this.chosenWords = JSON.parse(choose);
    }
    if (wordInit) {
      this.originWords = JSON.parse(wordInit);
    }
  },
  watch: {
    genWords() {
      this.clearTimer();
      this.totalPage =
        this.genWords.length > 0
          ? Math.ceil(this.genWords.length / this.size)
          : 1;
      if (this.genWords.length > this.size && this.autoLoop) {
        if (this.timeInterval > 0) {
          this.timer = setInterval(() => {
            if (this.currentPage < this.totalPage) {
              this.currentPage++;
            }
          }, this.timeInterval * 1000);
        }
      }
    },
    validatedWords: {
      handler: async function (newVal = [], oldValue = []) {
        // 增量添加
        const newWords = []
        for (let word of newVal) {
          if (oldValue.indexOf(word) === -1) {
            newWords.push(word)
          }
        }
        console.log('newWords', newWords)
        const cacheResults = this.getCacheResult()
        for (let word of newWords) {
          let pos
          if (Object.prototype.hasOwnProperty.call(cacheResults, word)) {
            pos = cacheResults[word]
          } else {
            try {
              pos = await this.queryWordPos(word)
            } catch (e) {
              console.log('查询词性错误', word, e)
              return
            }
          }
          pos = pos.slice(0, 1)
          switch (pos) {
            case 'v':
              if (!this.vWords.words.indexOf(word) > -1) this.vWords.words.push(word)
              break
            case 'n':
              if (!this.nWords.words.indexOf(word) > -1) this.nWords.words.push(word)
              break
            case 'a':
              if (!this.aWords.words.indexOf(word) > -1) this.aWords.words.push(word)
              break
            default:
              if (!this.otherWords.words.indexOf(word) > -1) this.otherWords.words.push(word)
              break
          }
        }
      },
    },
    currentPage() {
      this.sliceWord();
    }
  },
  methods: {
    handleCheckAllChange($event, key) {
      this[key].chosenWords = $event ? this[key].words : []
      this[key].words.forEach(word => {
        this.handleWordChange($event, word, key)
      })
    },
    handleCheckedWordChange($chosenWords, key) {
      this[key].allChosen = $chosenWords.length === this[key].words.length
    },
    // 选择特定的字添加到可选择列表
    handleWordChange(status, word, key) {
      const index = this.alternativeWords.indexOf(word)
      if (status) {
        // 选中
        if (index === -1) this.alternativeWords.push(word)
      } else {
        if (index !== -1) this.alternativeWords.splice(index, 1)
      }
    },
    getCacheResult() {
      const cacheResults = localStorage.getItem("cacheResults");
      return cacheResults ? JSON.parse(cacheResults) : {};
    },
    async queryWordPos(word) {
      const result = await this.$api.QUERY_WORD_INFO({word})
      const pos = result.words[0].pos
      let cacheResults = JSON.parse(localStorage.getItem("cacheResults"));
      if (!cacheResults) cacheResults = {}
      cacheResults[word] = pos
      localStorage.setItem("cacheResults", JSON.stringify(cacheResults));
      return pos
    },
    getChineseType(pos) {
      const type = pos.slice(0, 1)
      switch (type) {
        case 'v':
          return '动词'
        case 'n':
          return '名词'
        case 'a':
          return '形容词'
        case 'r':
          return '代词'
        case 'q':
          return '量词'
        case 'u':
          return '助词'
        default:
          return '其它'
      }
    },
    genWord(label) {
      this.currentPage = 1
      let genWords = [];
      let twoWord = [];

      if (!this.isTwoWord) {
        if (this.position === "中置") {
          this.validatedWords.map((item) => {
            this.validatedWords.map((val) => {
              genWords.push(item + label + val);
            });
          });
        } else {
          this.validatedWords.map((item) => {
            this.validatedWords.map((val) => {
              twoWord.push(item + val);
            });
          });
          twoWord.map((item) => {
            if (item !== label) {
              genWords.push(
                this.position === "前置" ? label + item : item + label
              );
            }
          });
        }
      } else {
        this.validatedWords.map((item) => {
          if (item !== label) {
            genWords.push(
              this.position === "前置" ? label + item : item + label
            );
          }
        });
      }
      this.genWords = genWords;
      console.log(this.currentPage);
      const offset = this.size * (this.currentPage - 1);
      const end = this.size * this.currentPage;

      this.showWords = this.genWords.slice(offset, end);
    },
    repetition(str) {
      let words = [];
      let newStr = "";
      str = str.replace(/\r\n/g, "");
      str = str.replace(/\n/g, "");
      let reg = new RegExp(
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
      );
      for (let i = 0; i < str.length; i++) {
        if (str[i] === "、" || str[i] === " " || reg.test(str[i])) {
          continue;
        }
        if (newStr.search(str[i]) == -1) {
          newStr += str[i];
          words.push(str[i]);
        }
      }
      return words;
    },
    positionChange() {
      this.keyword && this.genWord(this.keyword);
    },
    wordNumChange() {
      this.keyword && this.genWord(this.keyword);
    },
    pageChange(currentPage) {
      this.currentPage = currentPage;
      this.sliceWord();
    },
    sliceWord() {
      const offset = this.size * (this.currentPage - 1);
      const end = this.size * this.currentPage;
      this.showWords = this.genWords.slice(offset, end);
    },
    chosen(e) {
      if (this.chosenWords.indexOf(e) === -1) {
        this.chosenWords.push(e);
        localStorage.setItem("chosen", JSON.stringify(this.chosenWords));
      }
    },
    deleteChoose(index) {
      this.chosenWords.splice(index, 1);
      localStorage.setItem("chosen", JSON.stringify(this.chosenWords));
    },
    wordChange(v) {
      localStorage.setItem("originWords", JSON.stringify(v));
    },
    handleTimeIntervalChange(v) {
      console.log(v);
      this.clearTimer();
      if (v > 0) {
        this.timer = setInterval(() => {
          if (this.currentPage < this.totalPage) {
            this.currentPage++;
          }
        }, this.timeInterval * 1000);
      }
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    handleKeyup(e) {
      if (e.code === "Space") {
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.currentPage < this.totalPage) {
              this.currentPage++;
            }
          }, this.timeInterval * 1000);
        } else {
          this.clearTimer();
        }
      }
    },
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>

<style lang="scss" scoped>
  .single-word-box {
    width: 80%;
    margin: 30px auto;
    border: 1px solid #409EFF;
    border-radius: 4px;
    padding: 10px 10px;
  }

  .gen-word-box {
    min-height: 400px;
    width: 80%;
    margin: 0 auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  .word-list {
    box-sizing: content-box;
  }

  .word-list button {
    margin-top: 10px;
  }

  .word-list button:first-child {
    margin-left: 10px;
  }

  .setting-box {
    text-align: center;
    margin: 10px auto;
  }

  .chosen-box {
    width: 80%;
    min-height: 100px;
    margin: 0 auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }

  .chosen-box button {
    margin-top: 10px;
  }

  .chosen-box button:first-child {
    margin-left: 10px;
  }

  .add-btn {
    width: 90%;
    margin: 40px auto 0 auto;
    text-align: center;

    .input-box {
      min-height: 100px;
      height: auto;
      margin: 20px 50px;
    }
  }

  .box-pos-container {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: space-around;
    margin: 20px 50px;

    .box-pos-part {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: flex-start;
      margin: 0 20px;

      .title {
        align-self: center;
        margin: 10px 0;
        text-align: center;
      }

      .radio-check {
        margin: 20px 0;
      }

      .box-pos {
        display: flex;
        flex-flow: row wrap;
      }
    }
  }

  .timerTips {
    margin-left: 10px;
    font-size: 14px;
    color: #b8bcc5;
  }
</style>
