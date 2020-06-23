<template>
  <div class="windows">
    <div class="images" v-viewer="{movable: false}" style="display: none">
      <img v-for="src in images" :src="src" :key="src">
    </div>
    <div class="top">
      <span>{{ chatInfo(currentChat).name }}</span>
      <el-dropdown trigger="click" class="btn" @command="handleCommand">
        <el-button plain size="small" icon="el-icon-more" circle></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="delete">
            删除聊天记录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-divider class="divider" />
    <div class="message" id="message">
      <!-- <div
        class="others"
        v-for="item in currentChat.messages"
        :key="item"
        :class="{ me: item.mySent }"
      >
        <img :src="item.avatar" alt="头像" />
        <el-card shadow="hover"> {{ item.content }}</el-card>
      </div> -->
      <ul>
        <li
          v-for="(item, index) in messageList"
          :key="index"
          :class="{ 'chat-mine': item.mine }"
        >
          <img
            :src="
              item.mine == true ? mineUrl : userInfo(item.senderId).avatarUrl
            "
            alt="头像"
            style="height: 50px; width: 50px"
          />
          <div
            :class="{
              'message-body': true,
              'multi-message-body': item.type === 'MULTICAST',
            }"
          >
            <div class="namebox">
              <span>{{ item.mine == true ? mineName : userInfo(item.senderId).name }}</span>
            </div>
            <el-card shadow="hover"
              ><div class="wordbox">
                <span v-html="realMessage(item.content)" @click="viewLargerImage($event)" ></span>
              </div></el-card>
          </div>
        </li>
      </ul>
    </div>
    <el-divider class="divider" />
    <div class="tools">
      <div class="left">
        <el-button circle type="text"
          ><i class="el-icon-picture-outline-round"></i
        ></el-button>
      </div>
      <div class="right">
        <el-button circle type="text" @click="videoChat"
          ><i class="el-icon-phone-outline"></i
        ></el-button>
      </div>
    </div>

    <div class="send">
      <el-input
        class="textarea"
        type="textarea"
        v-model="text"
        ref="msgInputContainer"
        contenteditable="true"
        :rows="4"
        @keyup.enter.native="sendUniMessage()"
      >
      </el-input>
      <div class="footer">
        <el-button class="btn" @click="sendUniMessage()">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import getWebsocket from "../JavaScript/Websocket";
import getNedb from "../JavaScript/NedbConfig";

  export default {
    name: "userChat",
    // components: {
    //   VEmojiPicker,
    // },
    props: ["chat"],
    data() {
      return {
        text: "",
        images: []
      };
    },
    watch: {
      messageList() {
        this.scrollToBottom();
      },
    },
    computed: {

      mineUrl: {
        get: function () {
          return this.$store.state.user.avatarUrl;
        },
      },
      mineName: {
        get: function () {
          return this.$store.state.user.username;
        }
      },
      messageList: {
        get: function () {
          return this.$store.state.currentChat.messageList;
        },
        set: function (val) {
          console.log("messageList setter");
          this.$store.commit("setMessageList", val);
        },
      },
      currentChat: {
        get: function () {
          return this.$store.state.currentChat;
        },
        set: function (val) {
          this.$store.commit("setCurrentChat", val);
        },
      },

    },
    methods: {
      viewLargerImage: function(event){
        let imgUrl = event.target.currentSrc;
        if(typeof imgUrl !== "undefined"){
          this.images = [];
          this.images.push(imgUrl);
          this.$nextTick(
            this.show()
          )

        }
      },
      show () {
        let viewer = this.$el.querySelector('.images').$viewer
        viewer.show()
      },
        realMessage(val) {
            return val.search("img:")===0?`<img src="${val.slice(4)}" alt="聊天图片">`:val;
        },
      handlePaste(val) {
        let file = val.clipboardData.files[0];
        if (file && file.type.match("image/*")) {
          console.log(file)

          let param = new FormData();
          param.append('img', file);

          let config = {
            headers: { "Content-Type": "multipart/form-data" },
          };

          this.$axios.post(
            `/api/user/uploadImg` ,param, config
          ).then(res =>{
              this.text="img:"+res.data.data;
              console.log(this.text)
          })
          //this.text = this.text + file;
          // if(file.type === "image/png" || file.type === "image/jpg"){
          //   this.text = this.text + "[" + val.clipboardData.files[0].name + "]";
          // }
        }


      },
        // base图片压缩
        compressPic:function(base64, scale, callback){
            const that = this;
            let _img = new Image();
            _img.src = base64;
            _img.onload = function() {
                let _canvas = document.createElement("canvas");
                let w = this.width / scale;
                let h = this.height / scale;
                _canvas.setAttribute("width", w);
                _canvas.setAttribute("height", h);
                _canvas.getContext("2d").drawImage(this, 0, 0, w, h);
                let base64 = _canvas.toDataURL("image/jpeg");
                // 当canvas对象的原型中没有toBlob方法的时候，手动添加该方法
                if (!HTMLCanvasElement.prototype.toBlob) {
                    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                        value: function (callback, type, quality) {
                            let binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                                len = binStr.length,
                                arr = new Uint8Array(len);
                            for (let i = 0; i < len; i++) {
                                arr[i] = binStr.charCodeAt(i);
                            }
                            callback(new Blob([arr], {type: type || 'image/png'}));
                        }
                    });
                }else{
                    _canvas.toBlob(function(blob) {
                        if(blob.size > 1024*1024){
                            that.compressPic(base64, scale, callback);
                        }else{
                            callback(blob, base64);
                        }
                    }, "image/jpeg");
                }
            }
        },
      userInfo(id) {
        let ret
        ret = this.$store.state.userCache.find((obj) => obj.id === id)
        return ret
      },
      chatInfo(chat) {
        let ret
        if (chat.type === "UNICAST") {
          ret = this.$store.state.userCache.find(
            (obj) => obj.id === chat.chatId
          );
        } else {
          ret = this.$store.state.groups.find((obj) => obj.id === chat.chatId);
        }
        return ret
      },
      handleCommand(command) {
        if (command === "delete") {
          //删除聊天记录
          getNedb().localMessage.remove(
            {type: this.currentChat.type, chatId: this.currentChat.chatId},
            {multi: true},
            function (err, numRemove) {
              if (err !== null) {
                console.log(err);
              } else {
                console.log(`${numRemove} 条数据被删除`);
              }
            }
          );
        }
      },
      sendUniMessage() {
        if (this.text === "" || this.text === "\n" || this.text === "\r") {
          this.$notify.error({
            title: "错误",
            message: "不可发送给空消息"
          })
          this.text = "";
        } else {
          console.log(`send uni message:` + this.text + " to " + this.currentChat.chatId);
          let message = {
            type: this.currentChat.type,
            receiverId: this.currentChat.chatId,
            content: `${this.text}`,
          };
          if (this.currentChat.type === "UNICAST")
            message.receiverId = this.currentChat.chatId;
          else if (this.currentChat.type === "MULTICAST")
            message.groupId = this.currentChat.chatId;
          getWebsocket().send(JSON.stringify(message));
          this.text = "";
          this.scrollToBottom();
        }

      },
      scrollToBottom() {
        this.$nextTick(() => {
          let msg = document.getElementById("message"); // 获取对象
          if (msg.scrollHeight !== null && msg.scrollTop !== null)
            msg.scrollTop = msg.scrollHeight; // 滚动高度
        });
      },
      videoChat() {
        this.$router.push({path: "/webrtc", query: {init: false, id: this.currentChat.chatId}})
      }
    },
    mounted() {
      let msg = document.getElementById("message"); // 获取对象
      msg.scrollTop = msg.scrollHeight; // 滚动高度
        document.addEventListener('paste', this.handlePaste)
    },
    beforeMount() {
      // setMessageListByChatID
      // this.refreshMessages();
    },
  };
</script>

<style lang="scss">
  .windows {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .divider {
      margin: 0px;
    }

    .top {
      // display: flex;
      // flex-direction: row;
      height: 10%;

      span {
        // display: block;
        float: left;
        font-size: large;
        font-weight: 600;
        padding-left: 15px;
        padding-top: 3%;
      }

      .btn {
        float: right;
        margin-top: 2%;
        // margin-bottom: 4%;
        margin-right: 2%;
      }
    }

    .message {
      width: 100%;
      height: 57%;
      overflow-y: scroll;

      ul {
        width: 100%;
        margin: 0px;
        padding-inline-start: 0px;
        list-style: none;

        li {
          padding: 5px;
          display: flex;
          flex-direction: row;

          img {
            padding: 0% 2%;
            height: 60px;
          }

          .message-body {
            display: flex;
            flex-direction: column;
            min-height: 45px;
            max-height: 1000px;

            .namebox {
              display: none;
            }

            .el-card {
              /*margin-top: 5px;*/
              /*margin-bottom: 5px;*/
              // height: 65%;
              max-width: 400px;

              .wordbox {
                span {
                  margin: 10px;
                  padding-right: 0;
                  text-align: left;
                  display: inline-grid;
                  white-space: pre-line;
                  word-wrap: break-word;
                  // overflow: hidden;
                  line-height: 20px;
                }
              }

              // height: 100%;
              .el-card__body {
                padding: 0px;
              }
            }
          }

          .multi-message-body {
            // height: 60px;
            .namebox {
              display: block;
              margin: 0px;
              // height: 25%;
              font-size: 13px;

              span {
                padding-left: 5px;
                float: left;
              }
            }

            .el-card {
              margin-top: 0px;
              margin-bottom: 0px;
              // height: 65%;
              .el-card__body {
                padding: 0px;
              }
            }
          }
        }

        li.chat-mine {
          flex-direction: row-reverse;

          .namebox {
            span {
              float: right;
              padding-right: 5px;
            }
          }
        }

        li.chat-mine.el-card {
          color: #409eff;
        }
      }
    }

    .tools {
      height: 5%;

      .left {
        padding-left: 10px;
        float: left;
      }

      .right {
        padding-right: 10px;
        float: right;
      }
    }

    .send {
      height: 27%;

      .sendArea {
        width: 95%;
        height: 70%;
        font-size: 16px;
        border-style: none;

        // border: 0px;
        outline-style: none;

      }

      .el-textarea__inner {
        border-style: none;
        // outline
      }

      .footer {
        .btn {
          margin-top: 5px;
          margin-right: 5px;
          float: right;
        }
      }
    }

    // .emoji {
    // }
  }
</style>
