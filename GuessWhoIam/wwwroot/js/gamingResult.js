import messages from './lang.js'; //載入語言包

var gmaeResult = new Vue({
  i18n: new VueI18n({
    messages: messages
  }), //註冊多國語言套件
  el: "#app",
  data: {
    arrayData: [],
    copyArrForLoserArr: [],
    copyArrForPreThird: [],
    winnerData: ["WinnerFirst", "WinnerSecond", "WinnerThird"],
    loserArray: {},
    preThirdArr: [],
    locale: localStorage.getItem('lang') || 'tw',
  },
  created: function () {
    this.$i18n.locale = this.locale; // 設定語言
    document.title = messages[`${localStorage.getItem('lang')}`].result.header;
    this.getRankData();
    this.setTimeOut();
    window.addEventListener("beforeonload", () => {
      this.removeLocalStorage();
    })
  },
  computed: {
    loserPic() { return `../images/${this.loserArray.name_en}_loser.gif` },
  },

  methods: {
    setTimeOut() {
      setTimeout(() => {
        window.location.href = "/Home/Index";
        localStorage.removeItem('result');
      }, 5000)
    },
    imageUrl(user) {
      return `../images/${user.name_en}_win.gif`
    },
    removeLocalStorage() {
      localStorage.removeItem('result');
    },
    getRankData() {
      var data = JSON.parse(localStorage.getItem('result'));

      //排順序
      var rankData = data.sort(function (a, b) {
        return a.score < b.score ? 1 : -1;
      })

      //加上attribute
      var attributeArr = rankData.map((ele, index) => ({ name: ele.name, name_en: ele.name_en, score: ele.score, life: ele.life, attribute: this.winnerData[index] }));

      //排名次
      this.arrayData = attributeArr;


      //問題發生:傳值傳址 -> 多包一層
      this.copyArrForLoserArr = JSON.parse(JSON.stringify(attributeArr));
      this.copyArrForPreThird = JSON.parse(JSON.stringify(attributeArr));

      //最後一名
      this.loserArray = this.copyArrForLoserArr.pop();

      //前三名
      this.preThirdArr = this.copyArrForPreThird.splice(0, 3);
    }
  }
})