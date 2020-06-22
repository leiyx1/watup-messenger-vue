<template>
  <div class="vedioBox">
    <div class="vedioTop">
      <span>Watup 视频聊天</span>
    </div>
    <div class="vedioBody">
      <div class="left">
        <video
          autoplay
          class="Vedio"
          id="localVideo"
          playsinline
          :controls="false"
          muted
          :srcObject.prop="localStream"
        ></video>
      </div>
      <div class="right">
        <video
          autoplay
          class="Vedio"
          id="remoteVideo"
          playsinline
          :controls="false"
          :srcObject.prop="remoteStream"
        ></video>
      </div>
    </div>
    <div class="vedioFoot">
      <span style="opacity: 0.1">雷总牛逼ε=ε=(~￣▽￣)~</span>
      <el-button type="danger" @click="quitVideoChat">退出</el-button>
    </div>
  </div>
</template>

<script>
import getWebsocket from "@/JavaScript/Websocket";
import {
  joinVideoChat,
  leaveVideoChat,
  getPeer,
  savePeer,
  getStream,
} from "@/JavaScript/Websocket";

export default {
  name: "WebRtc",
  data() {
    return {
      localStream: null,
      remoteStream: null,
      init: this.$route.query.init,
      friendId: this.$route.query.id,
      peer: null,
      ws: null,
    };
  },
  mounted() {
    console.log("in webrtc", this.init, this.friendId);
    joinVideoChat();
    this.ws = getWebsocket();
    const constraints = {
      video: true,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        console.log("Got MediaStream:", stream);
        this.gotMedia(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  },
  methods: {
    quitVideoChat() {
      this.peer.destroy();
      leaveVideoChat();
      this.$router.push("/index/chatpanel");
    },
    gotMedia(stream) {
      if (this.init) {
        const Peer = require("simple-peer");
        this.localStream = stream;

        let iceConfig = {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
              urls: "turn:106.13.79.136:3478?transport=udp",
              username: "watup",
              credential: "watup@2020",
            },
          ],
        };
        this.peer = new Peer({
          initiator: this.init,
          stream: stream,
          config: iceConfig,
        });

        this.peer.on("signal", (data) => {
          console.log(JSON.stringify(data));
          let wrappedData = {
            type: "SIGNAL",
            receiverId: this.friendId,
            signal: data,
          };
          this.ws.send(JSON.stringify(wrappedData));
        });

        this.peer.on("stream", (stream) => {
          console.log("stream", stream);
          this.remoteStream = stream;
        });

        savePeer(this.peer);
      } else {
        this.localStream = stream;
        this.peer = getPeer();
        this.peer.addStream(stream);
        this.remoteStream = getStream();
      }
    },
  },
};
</script>

<style lang="scss">
.vedioBox {
  width: 100%;
  height: 100%;
  position: fixed;
  .vedioTop {
    height: 10%;
    span {
      padding-top: 2%;
      padding-left: 2%;
      float: left;
      font-size: 20px;
      font-weight: 800;
    }
  }
  .vedioBody {
    border: solid 1px #d3d3d3;
    height: 65%;
    display: flex;
    flex-direction: row;
    .left {
      width: 50%;
      padding: 2%;
      .Vedio {
        object-fit: fill;
        width: 100%;
        height: 100%;
      }
    }
    .right {
      width: 50%;
      padding: 2%;
      .Vedio {
        object-fit: fill;
        width: 100%;
        height: 100%;
      }
    }
  }
  .vedioFoot {
    height: 25%;
    .el-button {
      margin-top: 5%;
      margin-left: 50%;
    }
  }
}
</style>
