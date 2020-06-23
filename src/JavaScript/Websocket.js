import getNedb from "./NedbConfig";
import store from "../store/index";
import getNeDB from "./NedbConfig";
import {
  loadFriendRequests,
  loadFriends,
  loadGroupRequests,
  loadGroups,
} from "./load";
import { desktopNotify } from "./Notification";
import router from "../router";
import { MessageBox, Message } from "element-ui";

let websock;
let inVideoChat=false;
let currentVideoChat;
let Peer = require('simple-peer');
let peer;
let stream;

export default function getWebsocket() {
  if (websock && websock.readyState === 1) {
    return websock;
  } else {
    return createWebsocket();
  }
}

function createWebsocket() {
  let token, userId;
  token = store.state.user.access_token;
  userId = store.state.user.id;

  let WSUrl = `ws://106.13.110.96:8088/ws?access_token=${token}`;
  //let WSUrl = `ws://localhost:8088/ws?access_token=${token}`;
  websock = new WebSocket(WSUrl);
  websock.onmessage = function(event) {
    let data = JSON.parse(event.data);
    console.log("message received");

    if (data.type === "UNICAST" || data.type === "MULTICAST") {
      //收到群聊/私聊信息

      //设置chatId
      let chatId;
      if (data.type === "MULTICAST") chatId = data.groupId;
      else if (data.type === "UNICAST")
        chatId = userId === data.senderId ? data.receiverId : data.senderId;

      //设置新的message
      let newMessage = {
        type: data.type,
        mine: store.state.user.id === data.senderId,
        timestamp: data.timestamp,
        content: data.content,
        senderId: data.senderId,
      };

      //更新现有chatList
      let updateChatList = store.state.chatList;
      let modified = false;
      for (let i = 0; i < updateChatList.length; ++i) {
        let thisChat = updateChatList[i];
        if (data.type === thisChat.type && thisChat.chatId === chatId) {
          //将newMessage放入chat的messageList中
          thisChat.messageList.push(newMessage);
          //更新sign timestamp
          thisChat.sign = newMessage.content;
          thisChat.timestamp = newMessage.timestamp;
          //更新unreadCount,同时发送通知
          if(data.senderId !== store.state.user.id)
            desktopNotify("收到来自" + thisChat.name + "的信息！");
          if (
            thisChat.type === store.state.currentChat.type &&
            thisChat.chatId === store.state.currentChat.chatId
          )
            thisChat.unReadCount = 0;
          else {
            thisChat.unReadCount++;
          }

          //将chatList中的老chat删除，新chat插到数组头
          updateChatList.splice(i, 1);
          updateChatList.unshift(thisChat);

          //存入Nedb
          let query = { chatId: thisChat.chatId, type: thisChat.type };
          getNedb().localMessage.update(
            query,
            { $set: thisChat },
            { multi: true },
            function(err, numUpdated) {
              console.log(numUpdated + "条数据存入nedb");
            }
          );

          modified = true; //标记cahtList被修改
          break;
        }
      }
      //若新收到的消息不属于chatList中任何chat, 即chatList没有在上一步中被修改
      //则插入一个新的chat到chatList中
      if (!modified) {
        let friendList = store.state.friends;
        let groupList = store.state.groups;

        let obj, name, avatarUrl;
        if (data.type === "UNICAST") {
          obj = friendList.find((obj) => obj.id === chatId);
          name = obj.nickname.length === 0 ? obj.username : obj.nickname;
          avatarUrl = obj.avatarUrl;
        } else {
          obj = groupList.find((obj) => obj.id === chatId);
          name = obj.name;
          avatarUrl = obj.avatarUrl;

        }

        let newChat = {
          chatId: chatId,
          name: name,
          type: data.type,
          avatar: avatarUrl,
          sign: data.content,
          unReadCount: 1,
          messageList: [newMessage],
        };
        //通知
        desktopNotify("收到来自" + name + "的信息！");

        //插入updateChatList
        updateChatList.unshift(newChat);
        //存入nedb
        getNeDB().localMessage.insert(newChat, function(err, docs) {
          console.log("add new item:" + docs);
        });
      }
      store.commit("setChatList", updateChatList);
    } else if (data.type === 'NOTIFICATION') {
      let obj, index, name, newChat, updateChatList;
      switch (data.notificationType) {
        case "GROUP_REQUEST":
          loadGroupRequests();
          store.commit("addUnreadGroupRequest");
          desktopNotify(data.content + "给你发送了一条群聊邀请")
          break;
        case "GROUP_REQUEST_ACCEPTED":
          loadGroupRequests();
          loadGroups();
          desktopNotify(data.content + "加入了群聊!");
          break;
        case "GROUP_REMOVED":
          obj = store.state.groups.find((obj) => obj.id === data.content);
          name = obj.name;
          desktopNotify("你已被移出群聊：" + name);
          //同时删除chatList中的群聊(如果有)
          updateChatList = store.state.chatList;
          obj = updateChatList.find(
            (obj) => obj.chatId === data.content && obj.type === "MULTICAST"
          );
          if (obj) {
            index = updateChatList.indexOf(obj);
            updateChatList.splice(index, 1);
            store.commit("setChatList", updateChatList);
            //删除Nedb中的这一条数据
            getNedb().localMessage.remove({chatId:obj.chatId, type: "MULTICAST"})
          }
          //最后刷新群组列表
          loadGroups();
          break;
        case "GROUP_DISBANDED":
          obj = store.state.groups.find((obj) => obj.id === data.content);
          name = obj.name;
          desktopNotify("群聊：" + name + "已被解散");
          //同时删除chatList中的群聊(如果有)
          updateChatList = store.state.chatList;
          obj = updateChatList.find(
            (obj) => obj.chatId === data.content && obj.type === "MULTICAST"
          );
          if (obj) {
            index = updateChatList.indexOf(obj);
            updateChatList.splice(index, 1);
            store.commit("setChatList", updateChatList);
            //删除Nedb中的这一条数据
            getNedb().localMessage.remove({chatId:obj.chatId, type: "MULTICAST"})
          }
          //最后刷新群组列表
          loadGroups();
          break;
        case "friendRequestAdd":
          desktopNotify("收到新的好友申请");
          loadFriendRequests();
          store.commit("addUnreadFriendRequest");
          break;
        case "friendRequestPass":
          loadFriends();
          //直接插入ChatList中
          obj = store.state.friends.find((obj) => obj.id === data.content);
          name = obj.username;
          newChat = {
            chatId: data.content,
            name: name,
            type: "UNICAST",
            sign: "",
            unReadCount: 0,
            messageList: [],
          };
          updateChatList = store.state.chatList;
          updateChatList.unshift(newChat);
          store.commit("setChatList", updateChatList);
          break;
        case "friendRequestReject":
          //fjc说什么都不用做
          break;
        case "friendRemoved":
          loadFriends();
          //删除nedb
          getNedb().localMessage.remove({chatId:data.content, type: "UNICAST"})
          break;
      }
    } else if (data.type === 'SIGNAL') {
      console.log('incoming signal: ', JSON.stringify(data));
      if (!inVideoChat) {
        joinVideoChat(data.senderId);

        let iceConfig = {
          iceServers: [
            {urls: 'stun:stun.l.google.com:19302'},
            {urls: 'turn:106.13.79.136:3478?transport=udp', 'username': 'watup', 'credential': 'watup@2020'}
          ]
        };
        peer = new Peer({initiator: false, config: iceConfig});
        peer.on('signal', data => {
          console.log('outcoming signal: ', JSON.stringify(data));
          let wrappedData = {
            type: 'SIGNAL',
            receiverId: currentVideoChat,
            signal: data
          };
          websock.send(JSON.stringify(wrappedData));
        });
        peer.on('stream', remoteStream => {
          console.log('stream', remoteStream);
          stream = remoteStream;
        });
        console.log('incoming signal: ', JSON.stringify(data));
        peer.signal(data.signal);

        MessageBox(data.senderId + ' 邀请你进行视频聊天', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          router.push({path: '/webrtc', query: {init: false, id: data.senderId}});
        }).catch(() => {
          peer.destroy();
          inVideoChat = false;
          Message({
            type: 'info',
            message: '已拒绝'
          });
        });
      } else if (currentVideoChat === data.senderId) {
        peer.signal(data.signal)
      }
    }
  };
  websock.onopen = function() {
    desktopNotify("服务器已连接！");
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

export function joinVideoChat(id) {
  inVideoChat = true;
  currentVideoChat = id
}

export function leaveVideoChat() {
  inVideoChat = false;
}

export function getPeer() {
  return peer;
}

export function getStream() {
  return stream;
}

export function savePeer(newPeer) {
  peer = newPeer;
}
