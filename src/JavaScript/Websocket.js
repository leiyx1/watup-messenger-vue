import getNedb from "./NedbConfig";
import store from "../store/index";

let websock;
export default function getWebsocket() {
  if (websock) {
    return websock;
  } else {
    return createWebsocket();
  }
}

function createWebsocket() {
  let token, userId
  token = store.state.user.access_token;
  userId = store.state.user.id;

  let WSUrl = `ws://106.13.110.96:8088/ws?access_token=${token}`;
  websock = new WebSocket(WSUrl);
  websock.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("message received");
    console.log(data);

    //设置chatId
    let chatId;
    if(data.type === "MULTICAST") chatId = data.groupId;
    else if(data.type === "UNICAST")
      chatId = userId === data.senderId ? data.senderId : data.receiverId;
    else{//todo data.type === NOTIFICATION

    }

    //设置mine属性
    let mine = false;
    if (store.state.user.userId === data.senderId) mine = true;

    //设置新的message
    let newMessage = {
      type: data.type,
      mine: mine,
      timestamp: data.timestamp,
      content: data.content,
      chatId: chatId,
    };


    //更新现有chatList
    let updateChatList = store.state.chatList;
    let modified = false;
    for(let i = 0; i < updateChatList.lengeh; ++i){
      let currentChat = updateChatList[i];
      if(data.type === currentChat.type && currentChat.chatId === chatId){
        //将newMessage放入chat的messageList中
        currentChat.messageList.unshift(newMessage)

        //更新unreadCount
        if(currentChat.type === store.state.currentChat.type
            && currentChat.chatId === store.state.currentChat.chatId)
          currentChat.unReadCount = 0;
        else currentChat.unReadCount ++;

        //将chatList中的老chat删除，新chat插到数组头
        updateChatList.splice(i, 1)
        updateChatList.unshift(currentChat)
        modified = true;//标记cahtList被修改
        break;
      }
    }
    //若新收到的消息不属于chatList中任何chat, 即chatList没有在上一步中被修改
    //则插入一个新的chat到chatList中
    if(!modified){
      let friendList = self.$store.state.friends;
      let gourpList = self.$store.state.groups;
      console.log("friendList:")
      console.log(friendList);
      console.log("groupList:")
      console.log(gourpList)

      let obj, name, avatarUrl
      if(data.type === "UNICAST"){
        obj = friendList.find(
          (obj) => obj.id === chatId,
        )
        name = obj.nickname.length === 0?obj.username:obj.nickname;
        avatarUrl = obj.avatarUrl
      }else {
        obj = gourpList.find(
          (obj) => obj.id === chatId,
        )
        name = obj.name;
        avatarUrl = "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2121061596,2871071478&fm=26&gp=0.jpg";
        //todo 放入真正的群头像
      }


      let newChat = {
        chatId: chatId,
        name: name,
        type: data.type,
        avatar: avatarUrl,
        sign: data.content,
        unReadCount: 1,
        messageList: [newMessage]
      }

      //插入updateChatList
      updateChatList.unshift(newChat);

    }
    this.$store.commit("setChatList", updateChatList)

    let currentChat = store.state.currentChat;
    let query = { chatId: currentChat.chatId, type: currentChat.type };
    getNedb().localMessage
      .find(query)
      .sort({ timestamp: 1 })
      .exec(function(err, docs) {
        console.log("setMessageList");
        console.log(docs);
        store.commit("setMessageList", docs);
      });
  };
  websock.onopen = function() {
    var string = `WebSocket is open now.`;
    console.log(string);
  };
  websock.onerror = function(event) {
    console.error("WebSocket error observed:", event);
  };
  websock.onclose = function() {
    console.log("WebSocket is close now");
  };
  return websock;
}
