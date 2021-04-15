import answers from "./answers.js";
import userList from "./userList.js";
import messages from './lang.js';

const langObj = messages[`${localStorage.getItem('lang')}`];
let $bus = new Vue(); //用於傳遞同層之間資料的接駁車(event bus)

Vue.component("loading", {
  template: `<transition>
              <div v-show="isShow" class="loading">
              <div class="text-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only"></span>
                </div>
              </div>
             </div>
            </transition>`,
  data() {
    return {
      isShow: false,
    }
  },
  created() {
    $bus.$on("loading", val => {
      this.isShow = val;
    })
  }
})

Vue.component("user-list", {
  template: `<section class="section_user-list">
    <div :class="cardStyle(user)" v-for="user in users">
      <div class="user-pic">
        <img :src="imageUrl(user)"  ondragstart="return false">
      </div>
      <div class="user-info">
        <div class="grouping mb-1 justify-content-between position-relative"><span class="player-name">{{user.name == name ? user.name + meComputed: user.name}}</span> <span class="player-score">{{user.score}}</span><span class="getPoint" :class="{getPointAtive: user.getPointAnimationAtive}">+1</span></div>
        <div class="grouping">
          <div class="life-wrap">
            <span class="life-display" :style="{filter:displayStyle(user)}">{{user.life}} / {{user.totalLife}} </span>
            <span class="life-bar" :style="{width:percentage(user)}"></span>
          </div>
        </div>
        <div class="user-prop" v-if="user.name == name" >
            <span class="item-card-user" v-for="(card,index) in user.cards" v-if="card.isUsed == false" v-show="delaytime">
                <img :src="card.image" v-if="card.id !=3" v-on:click="chooseCard(card.id),closeSideBar(),showSideBar()">
                <img :src="card.image" v-else v-on:click="closeSideBar(),getMoreTime()">
            </span>
            <div id="enemy-bar">
                <img v-for="enemy in enemyList" :src="imageUrl(enemy)" v-on:click="attackSPerson(enemy.name),closeSideBar()">
            </div>
        </div>
        <div class="grouping" v-if="user.name != name">
          <span class="item-card" v-for="(card,index) in user.cards" v-if="card.isUsed == false" v-show="delaytime">
                <img :src="card.image" style="width:100%">
            </span>
        </div>
      </div>
      <div class="user-timer" v-if="user.name != name">
        <div class="user-timer-wrap">
         <span class="user-timer-bar" :style="{height:user.timerPercentage}"></span>
        </div>
      </div>
    </div>
  </section>`,
  props: ["conn", "me"],
  data: function () {
    return {
      totalLife: 3,
      users: userList,
      delaytime: false,
      name: "",
      imageName: "",
      userList: [],
      enemyList: [],
      card: "",
      defaultCardList: [
        { id: 2, name: "消血卡", image: "../images/prop-ghost.png", isUsed: false },
        { id: 3, name: "加時卡", image: "../images/prop-time.png", isUsed: false },
        { id: 4, name: "搶奪卡", image: "../images/prop-exchange.png", isUsed: false }]
    }
  },
  methods: {
    minusLife(wrong) {
      let user = userList.find(x => x.name == this.name);
      if (user.life == 0) {
        return;
      } else {
        user.life -= wrong;
        let userData = {
          ...user,
          roomId: sessionStorage.getItem("roomId")
        }
        this.postApi("reducelife", userData);
      }
    },
    addScore(score) {
      let user = userList.find(x => x.name == this.name);
      user.score += score;
      let userData = {
        ...user,
        roomId: sessionStorage.getItem("roomId")
      }

      this.postApi("getPoint", userData);
      this.getPointAnimation(user);
    },
    showSideBar() {
      document.getElementById("enemy-bar").style.display = "flex";
    },
    closeSideBar() {
      document.getElementById("enemy-bar").style.display = "none";
    },
    chooseCard(cardId) {
      this.card = cardId;
    },
    countToTwo() {
      setTimeout(() => {
        this.delaytime = true
      }, 2000)
    },
    attackSPerson(person) {//攻擊別人的三張卡片
      let attacker = this.users.find(x => x.name == this.name).name;
      let attacked = this.users.find(x => x.name == person).name;
      this.AttackApi(attacker, this.card, attacked);
      this.card = "";
    },
    getMoreTime() {//增加自己秒數的卡片
      if (this.users.find(x => x.name == this.name).time != 0) {
        let attacker = this.users.find(x => x.name == this.name).name;
        let attacked = this.users.find(x => x.name == this.name).name;
        this.AttackApi(attacker, 3, attacked);
        $bus.$emit("Buff");
      }
    },
    percentage(user) {
      return `${user.life / this.totalLife * 100}%`
    },
    displayStyle(user) {
      return user.life == 3 ? "invert(1)" : "invert(0)"
    },
    cardStyle(user) {
      return {
        "dead": user.life == 0,
        "user-card-other": user.name != this.name,
        "user-card-myself": user.name == this.name
      }
    },
    imageUrl(user) {
      return `../images/${user.imageName}-avatar.png`
    },
    postApi(url, user) {
      axios.post(`../api/signalr/${url}`, user)
    },
    AttackApi(attacker, cardId, attacked) {
      axios.post("../api/signalr/Attack", {
        Attacker: attacker,
        Card: cardId,
        Attacked: attacked,
        roomId: sessionStorage.getItem("roomId")
      })
    },
    getPointAnimation(user) {
      user.getPointAnimationAtive = true;

      setTimeout(() => {
        user.getPointAnimationAtive = false;
      }, 1000)
    },
    leave() {
      this.conn.stop().catch(err => {
        console.error(err.toString());
      });
    },
    removeRoom() {
      const roomId = sessionStorage.getItem("roomId");
      let roomList = JSON.parse(localStorage.getItem("roomList"));
      let roomIndex = roomList.findIndex(x => x.roomId == roomId);
      roomList.splice(roomIndex, 1);
      localStorage.setItem("roomList", JSON.stringify(roomList));
    }
  },
  computed: {
    meComputed() {
      return `(${this.me})`
    }
  },
  created() {
    document.title = langObj.userlist.header;
    this.removeRoom();
    this.countToTwo();
    this.name = sessionStorage.getItem("player");
    this.user = userList.find(x => x.name == this.name);
    this.enemyList = userList.filter(x => x.name != this.name);

    this.conn.on("StartGame", ({ cardList }) => { //[signalR]取得該場遊戲的隨機題目
      for (var i = 0; i <= 3; i++) {
        this.users[i].cards[1] = JSON.parse(JSON.stringify(this.defaultCardList.find(x => x.id == cardList[i])));
      }
    })
    this.conn.on("Reducelife", (name, lifePoint) => { //[SignalR] 接收來自其他人的生命變化
      this.users.find(x => x.name == name).life = lifePoint;
    });

    this.conn.on("GetPoint", (name, score) => { //[SignalR] 接收來自其他人的分數變化
      this.users.find(x => x.name == name).score = score;
    });
    this.conn.on("Timer", (name, percentage) => { //[SignalR] 接收來自其他人的時間變化
      this.users.find(x => x.name == name).timerPercentage = percentage;
    });
    this.conn.on("Attack", (attacker, card, attacked) => { //[SignalR] 接收來自其他人的卡片效果

      this.users.find(x => x.name == attacker).cards.find(x => x.id == card).isUsed = true;

      switch (card) {
        case 1://阻擋卡id=1
          if (this.name == attacked) {
            $bus.$emit("block")
          }

          break;
        case 2://吸血卡id=2
          this.users.find(x => x.name == attacked).life = 1;
          break;
        case 4://搶奪卡id=4 
          let randomNumArray = []
          for (let i = 0; i <= 1; i++) {
            let randomNum = Math.floor(Math.random() * 2);
            randomNumArray.push(randomNum)
            var stolencard = this.users.find(x => x.name == attacked).cards[randomNumArray[i]]
            if (stolencard.isUsed == false) {
              this.users.find(x => x.name == attacker).cards.push(JSON.parse(JSON.stringify(stolencard)))
              this.users.find(x => x.name == attacked).cards.find(x => x == stolencard).isUsed = true;
              return
            }
          }
          break;
      }

    });

    $bus.$on("ReduceLife", error => { //[畫面] 收通知，生命 -1
      this.minusLife(error);
    });
    $bus.$on("GetPoint", score => { //[畫面] 收通知，得分 +1
      this.addScore(score);
    });
    $bus.$on("Settlement", () => {//[前端畫面] 收通知，進行結算，將結果存至localStorage
      this.leave();
      setTimeout(() => {
        $bus.$emit("loading", true);
      }, 500)
      let result = this.users.map(x => {
        return ({
          name: x.name,
          name_en: x.imageName,
          score: x.score,
          life: x.life
        })
      })
      localStorage.setItem("result", JSON.stringify(result));

      setTimeout(() => {
        window.location.replace("/html/GamingResult.html");
      }, 2000)
    })
  }
});

Vue.component("find-difference", {
  template: `
    <section class="section_main">
            <div class="container-md">
                <div class="row">
                    <div class="col-6 text-center mt-5 pt-5 mx-auto">
                        <div class="img-wrap" >
                            <img :src="topicUrl" ondragstart="return false" @click.self="errorClickHandler">
                            <span class="answer" :class="borderStyle(obj)" :style="commonStyles(obj)" @click="select(obj)" v-for="obj in answer"></span>
                        </div>
                    </div>
                    <div class="col-6 text-center mt-5 pt-5 mx-auto">
                        <div class="img-wrap">
                            <img :src="originUrl" ondragstart="return false" @click.self="errorClickHandler">
                            <span class="answer" :class="borderStyle(obj)" :style="commonStyles(obj)" @click="select(obj)" v-for="obj in answer"></span>
                        </div>
                    </div>
                            <img src="../images/Block.gif" v-if="block" style="width: 70vw;height:75vh;z-index:100;position:absolute;top:23%;left:15%;" >
            </div>
        </div>
    </section>
    `,
  props: ["conn"],
  data: function () {
    return {
      baseUrl: "../images/",
      topics: ["stitch", "lionking", "disney", "mickey", "beautyBeast"],
      topic: {
        id: null,
        name: null,
      },
      errorCount: 0,
      answers: answers,
      answer: null,
      isEnd: false,
      originUrl: "",
      topicUrl: "",
      userInfo: null,
      block: ""
    }
  },
  methods: {
    getImageUrl() {
      let roomId = sessionStorage.getItem("roomId");
      this.conn.invoke("StartGame", roomId); //[signalR]於房間編號???；開始遊戲，

      this.conn.on("StartGame", ({ topicIndex, themeId}) => {
        //[signalR]取得該場遊戲的隨機題目  
        console.log("aaaa")
        console.log(topicIndex, themeId)
        this.topic.id = topicIndex; // 3題中哪一題
        this.topic.name = this.topics[themeId]; //題目代號
        this.getOriginUrl();
        this.getTopicUrl();
        this.getAnswer();
      })
    },
    getOriginUrl() {
      this.originUrl = `${this.baseUrl}${this.topic.name}.jpg`;
    },
    getTopicUrl() {
      this.topicUrl = `${this.baseUrl}${this.topic.name}${this.topic.id}.jpg`;
    },
    getAnswer() {
      this.answer = this.answers[`${this.topic.name}${this.topic.id}`];
    },
    displayUnit(number) {
      return `${number}px`;
    },
    select(obj) {
      if (this.isEnd == true) return;
      if (obj.selected == "") {
        obj.selected = this.userInfo.name;
        $bus.$emit("GetPoint", 1); //[畫面]發通知，自己的得分 + 1
        this.postApi("getbugstatus", {
          name: this.userInfo.name,
          bugId: obj.id,
          roomId: sessionStorage.getItem("roomId")
        }); //[signalR]發通知，給群組該玩家得分
      }
    },
    commonStyles(obj) {
      return ({
        width: this.displayUnit(obj.radius),
        height: this.displayUnit(obj.radius),
        top: this.displayUnit(obj.y),
        left: this.displayUnit(obj.x),
        width: this.displayUnit(obj.radius),
        opacity: obj.selected != "" ? 1 : 0,
        transform: obj.selected != "" ? "scale(1)" : "scale(2)"
      })
    },
    borderStyle(obj) {
      return obj.selected == "" ? "" : obj.selected == this.userInfo.name ? "myself" : "others"
    },
    errorClickHandler() {
      if (this.isEnd == true) return;

      this.errorCount++;
      $bus.$emit("ReduceLife", 1) //[畫面] 自己生命 -1
      if (this.errorCount == 3) { //當累積錯誤達3
        this.isEnd = true;
        $bus.$emit("GameOver");
        this.postApi("Over", {
          name: this.userInfo.name,
          roomId: sessionStorage.getItem("roomId")
        })
      }
    },
    getUserInfo() {
      this.userInfo = userList.find(x => x.name == sessionStorage.getItem("player"));
    },
    postApi(url, obj) {
      axios.post(`../api/signalr/${url}`, obj);
    }
  },
  created() {
    this.getUserInfo();
    this.getImageUrl();
    $bus.$on("block", () => {
      this.block = true;
      setTimeout(() => {
        this.block = false
      }, 2500)
    });
    $bus.$on("TimeUp", parameter => {
      this.isEnd = parameter
    });

    this.conn.on("GetBugStatus", (name, bugId) => {
      let a = this.answer.find(x => x.id == bugId);
      this.answer.find(x => x.id == bugId).selected = name;
    })
  },
  watch: {
    answer: {
      handler: function () {
        if (this.answer.every(x => x.selected != "")) {
          $bus.$emit("Settlement");
          $bus.$emit("GameOver");
          this.postApi("Over", {
            name: this.userInfo.name
          });
          this.isEnd = true;
        }
      },
      deep: true
    }
  }
});

Vue.component("timer", {
  template: `<section class="section_timer">
    <span class="time-display">{{userInfo.time}} {{sec}} </span>
    <div class="timer-wrap">
      <span class="time-bar" :style="{height:percentage}"></span>
    </div>
  </section>`,
  props: ["conn", "sec"],
  data: function () {
    return {
      percentage: "",
      userInfo: null,
      timer: null,
      overPlayerList: []
    }
  },
  methods: {
    countDown() {
      this.timer = setInterval(() => {
        this.userInfo.time -= 1;
        this.getPercentage();
        this.postApi("Timer", {
          name: this.userInfo.name,
          percentage: this.percentage,
          roomId: sessionStorage.getItem("roomId")
        });
        if (this.userInfo.time == 0) {
          $bus.$emit("TimeUp", true);
          this.postApi("Over", {
            name: this.userInfo.name,
            roomId: sessionStorage.getItem("roomId")
          });
          clearInterval(this.timer);
        }
      }, 1000);
    },
    addTime() {
      if (this.userInfo.time <= 35) {
        this.userInfo.time += 6;
      }
      else {
        this.userInfo.time = 41;
      }
    },
    getUserInfo() {
      this.userInfo = userList.find(x => x.name == sessionStorage.getItem("player"));
    },
    getPercentage() {
      this.percentage = `${this.userInfo.time / this.userInfo.totalTime * 100}%`;
    },
    postApi(url, obj) {
      axios.post(`../api/signalr/${url}`, obj)
    }
  },
  created() {
    this.getUserInfo();
    this.countDown();

    $bus.$on("GameOver", () => {
      clearInterval(this.timer)
    });
    $bus.$on("Buff", () => {
      this.addTime();
    });
    this.conn.on("Over", player => {
      this.overPlayerList.push(player);
      if (this.overPlayerList.length == 4) $bus.$emit("Settlement");
    })
  }
});

Vue.component("waiting-room", {
  template: ` 
<section class="section_Room">
    <div class="container">
            <div class="row">
                <div class="col-8">
                    <div class="items-group" >
                        <div class="item" v-for="user in waitingList">
                            <div class="pic">
                                <img :src="imageUrl(user.imageName)" alt="role ">
                            </div>
                            <div class="text">
                                <h2>{{user.name == userName? user.name + meComputed : user.name}}</h2>
                                <h3 class="prepare" v-show="user.isReady == false">{{preparingword}}<span v-for="(i,idx) in 3" class="dot">.</span></h3>
                                <h3 class="prepared" v-show="user.isReady == true">{{preparedword}}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="chatarea">
                        <div class="groups">
                              <button @click="leave" class="leave-btn">{{exit}}</button>
                              <button @click="prepare" class="prepare-btn" :class="{preparedStatus:getReadStatus()}" :disabled="!canReady">{{getReadStatus()?preparingword:prepareword}}</button>
                        </div>
                        <div class="chatbox">
                            <div class="showmessage" id="messagebox">
                                <p v-for="msg in msgs"><span :class="msg.who.toLowerCase().split(' ').join('')">{{msg.who}}</span> {{msg.info}}</p>
                            </div>
                            <div class="typing">
                                <input type="text" id="messageInput" v-model="info" @keyup.enter="sendMsg">
                                <button @click="sendMsg">{{send}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</section>`,
  props: ["conn", "me", "prepareword", "preparingword", "preparedword", "exit", "send"],
  data: function () {
    return {
      totalPeopleNumber: 4,
      userIndexs:[0,1,2,3],
      waitingList: [],
      selectedUsers: [],
      userName: "",
      msgs: [],
      info: "",
      canReady: false,
    }
  },
  methods: {
    getWaitingUser() {
      let roomList = JSON.parse(localStorage.getItem("roomList")) || [];
      const roomId = sessionStorage.getItem("roomId");
      let playerListIndex = roomList.findIndex(x => x.roomId == roomId);
      let index, random;

      if (playerListIndex == -1) {
        index = random = Math.trunc(Math.random() * this.totalPeopleNumber);
        this.userName = langObj.waitingroom.users[random];
      } else {
        let playerList = roomList[playerListIndex].playerList;
        let leftUsers = this.userIndexs.filter(x => {
          return !playerList.includes(x + 1);
        });
        random = Math.trunc(Math.random() * leftUsers.length);
        index = leftUsers[random];
        this.userName = langObj.waitingroom.users[index];
      }

      if (this.userName != null && this.userName != "" && this.userName != undefined && roomId != null && roomId != "" && roomId != undefined) {
        
        sessionStorage.setItem("player", this.userName); //存取當前使用者的角色
        this.conn.start()
          .then(() => {
            let roomId = sessionStorage.getItem("roomId");
            this.conn.invoke("Connection", roomId, index + 1);
          })
          .catch((err) => {
            console.log(err);
          })
      } else if (roomId == null || roomId == undefined || roomId == "") {
        window.location.href = "/html/Lobby.html"
      } else {
        window.location.href = "/html/gaming.html"
      }
    },
    imageUrl(imageName) {
      return `../images/${imageName}.gif`
    },
    sendMsg() {
      axios.post("../api/signalr/send", {
        id: userList.find(x=>x.name == this.userName).id,
        msg: this.info,
        roomId: sessionStorage.getItem("roomId")
      });
      this.info = "";
    },
    leave() {
      this.conn.stop().catch(err => {
        console.error(err.toString())
      });
      this.removeRole();

      window.location.href = "/html/Lobby.html";
    },
    prepare() {
      let status = !this.waitingList.find(x => x.name == this.userName).isReady;
      this.waitingList.find(x => x.name == this.userName).isReady = status;
      axios.post("../api/signalr/prepare", {
        id: userList.find(x => x.name == this.userName).id,
        status: status,
        roomId: sessionStorage.getItem("roomId")
      });
    },
    getReadStatus() {
      let result = this.waitingList.find(x => x.name == this.userName);
      if (result != undefined) {
        return result.isReady
      };
    },
    removeRole() {
      let roomList = JSON.parse(localStorage.getItem("roomList"));
      let roomId = sessionStorage.getItem("roomId");
      let playerListIndex = roomList.findIndex(x => x.roomId == roomId);
      let playerList = roomList[playerListIndex].playerList;
      let playerIndex = langObj.waitingroom.users.findIndex(x => x == this.userName);

      if (playerIndex != -1) {
        playerList.splice(playerIndex, 1);
        if (playerList.length == 0) roomList.splice(playerListIndex, 1);
        else {
          let room = {
            roomId,
            playerList
          };
          roomList.splice(playerListIndex, 1, room);
        }
      }

      localStorage.setItem("roomList", JSON.stringify(roomList));
    }
  },
  computed: {
    prepareComputed() {
      return this.prepareWord
    },
    preparingComputed() {
      return this.preparingWord
    },
    meComputed() {
      return `(${this.me})`
    }
  },
  created() {
    document.title = langObj.waitingroom.header;

    this.getWaitingUser();

    this.conn.on("GetWaitingUsers", playerList => {
      userList.forEach(x => x.isReady = false);
      let roomList = JSON.parse(localStorage.getItem("roomList")) || [];
      const roomId = sessionStorage.getItem("roomId");
      let playerListIndex = roomList.findIndex(x => x.roomId == roomId);
      if (playerListIndex == -1) {
        let room = {
          roomId,
          playerList : playerList.map(x=>x.id)
        }
        roomList.push(room);
      } else {
        roomList[playerListIndex].playerList = playerList.map(x => x.id);
      }
      localStorage.setItem("roomList", JSON.stringify(roomList)); //存放當前角色到角色群
      this.waitingList = playerList.map(x => {
        return userList.find(y => y.id ==  x.id);
      });
    })

    this.conn.on("UserJoin", index => {
      let msg = {
        who: userList.find(x=>x.id == index).name,
        info: `${langObj.waitingroom.join}`
      };
      this.msgs.push(msg);
    });
    this.conn.on("GetMsg", (index, info) => {
      let msg = {
        who: userList.find(x => x.id == index).name,
        info
      };
      this.msgs.push(msg);
    });
    this.conn.on("UserLeave", index => {
      let msg = {
        who: userList.find(x => x.id == index).name,
        info: `${langObj.waitingroom.leave}`
      };
      this.msgs.push(msg);
    });
    this.conn.on("Prepare", (id, status) => {
      this.waitingList.find(x => x.id == id).isReady = status;
    })

    window.addEventListener("beforeunload", () => { // 監聽即將離開前
      this.conn.stop().catch(err => {
        console.error(err.toString())
      });
      this.removeRole();
    })
  },
  watch: {
    waitingList: {
      handler: function () {
        if (this.waitingList.length == 4) {
          this.canReady = true;
        } else {
          this.$emit("change-page", this.waitingList.length);
          this.canReady = false;
        }
        if (this.waitingList.every(x => x.isReady == true)) { //每個人都按準備後
          setTimeout(() => {
            $bus.$emit("loading", true);
          }, 500);
          setTimeout(() => {
            this.$emit("change-page", this.waitingList.length) //通知父層，人數已改變
            localStorage.removeItem("players");

          }, 3000);
        }
      },
      deep: true
    },
  }
});

Vue.component("count-down", {
  template: `<section class="section_count-down">
    <div class="word-wrap" :class="{leave_x: index == 3}"><span class="word" :class="{leave_y: index == 3}">{{word}}</span></div>
   </section>`,
  data: function () {
    return {
      counts: ["3", "2", "1", "GO!"],
      index: 0,
      timer: null
    }
  },
  methods: {
    countDown() {
      this.timer = setInterval(() => {
        this.index++;
        if (this.index == 3) { // 倒數到 "GO"，停止timer，設延遲讓動畫播完，並發通知給父層，要進行轉場
          clearInterval(this.timer);
          setTimeout(() => {
            this.$emit("transition");
          }, 1500)
        }
      }, 1000)
    },
  },
  computed: {
    word() {
      return this.counts[this.index];
    }
  },
  created() {
    $bus.$emit("loading", false);
    this.countDown();
  }
})

let app = new Vue({
  i18n: new VueI18n({
    messages
  }),
  data: function () {
    return {
      conn: new signalR.HubConnectionBuilder().withUrl("/gamehub").withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol()).build(),
      person: 0,
      transitionAtive: false,
      locale: localStorage.getItem('lang') || 'tw'
    }
  },
  methods: {
    parentChangePage(val) {
      this.person = val;
    },
    transitionHandler() {
      this.transitionAtive = true;
    },
    langChange(val) {
      this.$i18n.locale = val;
      localStorage.setItem('lang', val)
    }
  },
  created() {
    this.$i18n.locale = this.locale;
  }
});

app.$mount("#app")