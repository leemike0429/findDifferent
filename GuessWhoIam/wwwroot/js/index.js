import messages from './lang.js';
if (localStorage.getItem('lang') == undefined) {
  localStorage.setItem('lang',"tw");
}

let app = new Vue({
  i18n: new VueI18n({
    messages
  }),
  data() {
    return {
      locale: localStorage.getItem('lang') || 'tw',
      langs: messages[`${localStorage.getItem("lang")}`].index.langs,
      isShow: false
    }
  },
  methods: {
    openSetting() {
      this.isShow = !this.isShow;
    },
    changeLang(val) {
      this.locale = val;
      this.$i18n.locale = this.locale; //切換語言
      localStorage.setItem("lang", val); //存回localStorage
      this.langs = messages[this.locale].index.langs; 
      document.title = messages[this.locale].index.title; //改標題
      this.openSetting();
    }
  },
  created() {
    document.title = messages[this.locale].index.title
    this.$i18n.locale = this.locale;
  }
})

app.$mount('#app')