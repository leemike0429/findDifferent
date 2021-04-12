import messages from './lang.js';

Vue.component("Lobby", {
  template: `<section class="section_lobby">
        <div class="wrap" >
            <div class="container">
                <h1>{{hall}}</h1>
                <button @click="isShowModal=true" class="createBtn">{{create}}</button>
                <button class="leaveBtn" @click="leaveRoom">{{back}}</button>
                <div class="row" class="modal-mask"  :style="modalStyle" @click.self="isShowModal=false">
                    <div class="col-12">                            <div>
                                <div class="modal-container"  @click.self="toggleModal">
                                    <div class="modal-body">
                                        <h4>{{title}}</h4>
                                        <input v-model="roomId" @keyup.enter="createRoom">
                                        <button @click="createRoom">{{confirm}}</button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="doors" id="door">
                    <div class="col-12 col-md-4 col-lg-3" v-for="room in roomList"  :class="{disabled: room.count == 4}">
                        <h3>{{roomname}} : {{room.roomId}} </h3>
                        <div class="perspective" v-on:click="openDoor">
                            <div class="thumb" :data-id="room.roomId" :data-count="room.count"  @click="enterRoom" >
                                <span>{{room.count}}</span>
                            </div>
                            <div class="lighting"></div>
                        </div>
                        <div class="door_shadow"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>`,
  props: ["conn", "hall", "back", "title", "confirm", "create", "roomname","warning"],
  data() {
    return {
      roomList: [],
      roomId: "",
      isShowModal: false
    }
  },
  methods: {
    openDoor(e) {
      var y = e.path[0];
      if (e.target.dataset.count >= 4) return;

      if (y.classList.contains("thumbOpened")) {
        y.classList.remove("thumbOpened");
      }
      else {
        document.querySelectorAll(".thumb").forEach(x => x.classList.remove("thumbOpened"));
        y.classList.add("thumbOpened");
      }
      document.querySelectorAll(".lighting").forEach(x => x.classList.remove("thumbOpened"));
    },
    toggleModal() {
      this.isShowModal = !this.isShowModal;
    },
    createRoom() {
      let roomId = this.roomId;
      if (this.roomList.find(x => x.roomId == roomId)) {
        alert(this.warning);
        this.roomId = "";
      } else {
        this.conn.invoke("CreateRoom", roomId);
        sessionStorage.setItem("roomId", roomId);
        window.location.href = "/html/gaming.html";
      }
    },
    enterRoom(e) {
      let roomId = e.target.dataset.id;
      let count = e.target.dataset.count;
      if (count == 4) return;
      sessionStorage.setItem("roomId", roomId);
      setTimeout(() => {
        window.location.href = "/html/gaming.html";
      }, 1000)

    },
    leaveRoom() {
      window.location.href = "/Home/Index";
    },
    receive() {
      this.conn.on("GetRoomList", roomList => {
        this.roomList = roomList.map(x => {
          return ({
            roomId: x.roomId,
            count: x.count
          })
        })
      })
    },
    hasFour() {
      if (this.roomList.length > 4) {
        $("#door").addClass("door_scroll");
      }
    },
  },
  computed: {
    modalStyle() {
      return {
        'display': this.isShowModal ? '' : 'none'
      };
    }
  },
  created() {
    document.title = messages[`${localStorage.getItem('lang')}`].Lobby.header;
    this.conn.start();
    this.receive();
    this.hasFour();
  }
})

let app = new Vue({
  i18n: new VueI18n({
    messages
  }),
  data() {
    return {
      conn: new signalR.HubConnectionBuilder().withUrl("/LobbyHub").build(),
      locale: localStorage.getItem('lang') || 'tw',
    }
  },
  methods: {
    langChange(val) {
      this.$i18n.locale = val;
      localStorage.setItem('lang', val);
      document.title = messages[`${localStorage.getItem('lang')}`].hall.header;
    }
  },
  created() {
    this.$i18n.locale = this.locale;
  }
});

app.$mount("#app")


