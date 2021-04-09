import messages from './lang.js';

Vue.component("hall", {
  template: `<section class="section_hall">
                <div class="modal-mask" :style="modalStyle">
                  <div class="modal-container"  @click.self="toggleModal">
                    <div class="modal-body">
                       <h1>{{title}}</h1>
                       <input v-model="roomId" @keyup.enter="createRoom">
                       <button @click="createRoom">{{confirm}}</button>
                    </div>
                  </div>
                </div>
                <div>
                   <button @click="isShowModal=true">{{create}}</button> 
                </div>
                <div v-for="room in roomList" class="room" :data-id="room.roomId" :data-count="room.count" @click="enterRoom" :class="{disabled: room.count == 4}">
                  <span>{{roomname}} : {{room.roomId}} </span>
                  <span>{{room.count}} / 4</span>
                </div>
        </section>`,
  props: ["conn", "title", "confirm", "create","roomname"],
  data() {
    return {
      roomList: [],
      roomId: "",
      isShowModal: false
    }
  },
  methods: {
    toggleModal() {
      this.isShowModal = !this.isShowModal;
    },
    createRoom() {
      let roomId = this.roomId;
      if (this.roomList.find(x => x.roomId == roomId)) {
        alert("房號與別人撞房囉!!!!");
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
      }, 500)

    },
    blockStyle(count) {
      return count == 4 ? true : false
    },
    receive() {
      this.conn.on("GetRoomList", roomList => {
        this.roomList = roomList.map(x => {
          return ({
            roomId: x.roomId,
            count: x.count,
            disabled: false
          })
        })
      })
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
    document.title = messages[`${localStorage.getItem('lang')}`].hall.header;
    this.conn.start();
    this.receive();
  }
})

let app = new Vue({
  i18n: new VueI18n({
    messages
  }),
  data() {
    return {
      conn: new signalR.HubConnectionBuilder().withUrl("/hallHub").build(),
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
