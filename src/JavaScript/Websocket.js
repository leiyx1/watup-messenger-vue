import db from "./NedbConfig";
import store from "../store/index";

let websock;
export default function getWebsocket(name) {
  if (websock) {
    return websock;
  } else {
    return createWebsocket(name);
  }
}

function createWebsocket() {
  let token, userId
  token = store.state.user.token;
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
      //todo avatat理应是实时刷新
      avatar:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
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


      // let newChat = {
      //   chatId: chatId,
      //   name: "wwwwwwwwww", //todo 使用friendId在Nedb中获取
      //   type: "UNICAST",
      //   //todo 理应实时获取
      //   avatar:
      //     "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      //   sign: data.content,
      //   unReadCount: 1,
      // }
    }



    // if (data.type === "UNICAST") {
    //   let curChat;
    //   let modified = false;
    //   for (let i = 0; i < newChatList.length; i++) {
    //     //先遍历 找找有没有在chatList里面
    //     curChat = newChatList[i]; //遍历到的chat
    //     if (curChat.type === "UNICAST") {
    //       if (curChat.chatId === data.senderId) {
    //         //找到了
    //         let unread;
    //         if (store.state.currentChat.chatId === curChat.chatId) unread = 0;
    //         else unread = curChat.unReadCount + 1;
    //         let updateChat = {
    //           //后期使用ChatId和type找到对应的messages in Nedb
    //           chatId: curChat.chatId,
    //           name: curChat.name,
    //           type: "UNICAST",
    //           //todo 理应实时获取
    //           avatar:
    //             "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //           sign: data.content,
    //           unReadCount: unread,
    //         };
    //         newChatList.splice(i, 1); //将此条删除
    //         newChatList.unshift(updateChat); //再将其添加到第一位
    //         store.commit("setChatList", newChatList); //更新表格
    //
    //         modified = true;
    //         break;
    //       }
    //     }
    //   }
    //   if (!modified) {
    //     //没有原有聊天
    //     let newChat = {
    //       chatId: data.senderId,
    //       name: "wwwwwwwwww", //todo 使用friendId在Nedb中获取
    //       type: "UNICAST",
    //       //todo 理应实时获取
    //       avatar:
    //         "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    //       sign: data.content,
    //       unReadCount: 1,
    //     };
    //     newChatList.unshift(newChat); //将新的聊天添加到chatList第一位
    //     store.commit("setChatList", newChatList); //更新表格
    //   }
    // } else if (data.type === "MULTICAST") {
    //   newMessageSaveToNedb.groupId = data.groupId; //todo 存入groupId
    //   //todo
    // } else {
    //   //todo type = notification
    // }
    // db.localMessage.insert(newMessageSaveToNedb, function(err, newDoc) {
    //   if (err !== null) {
    //     console.log("error occured: ");
    //     console.log(err);
    //   } else {
    //     console.log(
    //       "new " + newDoc.type + " insert successfully: " + newDoc.content
    //     );
    //   }
    // });

    let currentChat = store.state.currentChat;
    let query = { chatId: currentChat.chatId, type: currentChat.type };
    db.localMessage
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
}
