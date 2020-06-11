import db from "./NedbConfig";
import store from "../store/index";

let websock;
export default function getWebsocket(name){
    if(websock){
        return websock
    }else{
        return createWebsocket(name)
    }
}
let token   //后端完成后改为使用token进行websocket连接

function createWebsocket() {
    //token = store.state.user.token;
    token = '81ea4a40-57d1-411d-a9f6-da339116b4c8';
    let WSUrl = `ws://106.13.110.96:8088/ws?token=${token}`;
    websock = new WebSocket(WSUrl);
    websock.onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log("message received")
        console.log(data)

        let updateChatList = store.state.chatList;
        let mine = false;
        if(store.state.user.userId === data.senderId) mine = true
        //todo 将收到的event进行解析，存入数据库
        let updateMessgeList = updateChatList.messageList
        let NewMessage = {
          type: data
        }





        let newMessageSaveToNedb = {
            type: data.type,
            mine: mine,
            timestamp: time,
            content: data.content,
            chatId: data.senderId, //todo 存入senderId
            avatar: //todo 理应实时刷新
                "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        };
        if (data.type === 'UNICAST') {
            let curChat;
            let modified = false;
            for (let i = 0; i < newChatList.length; i++) {//先遍历 找找有没有在chatList里面
                curChat = newChatList[i];//遍历到的chat
                if (curChat.type === 'UNICAST') {
                    if (curChat.chatId === data.senderId) {//找到了
                        let unread;
                        if(store.state.currentChat.chatId === curChat.chatId) unread = 0;
                        else unread = curChat.unReadCount + 1;
                        let updateChat = { //后期使用ChatId和type找到对应的messages in Nedb
                            chatId: curChat.chatId,
                            name: curChat.name,
                            type: 'UNICAST',
                            avatar: //todo 理应实时获取
                                "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                            sign: data.content,
                            unReadCount: unread,
                        };
                        newChatList.splice(i, 1); //将此条删除
                        newChatList.unshift(updateChat); //再将其添加到第一位
                        store.commit("setChatList", newChatList); //更新表格

                        modified = true;
                        break;
                    }
                }
            }
            if (!modified) {//没有原有聊天
                let newChat = {
                    chatId: data.senderId,
                    name: 'wwwwwwwwww', //todo 使用friendId在Nedb中获取
                    type: 'UNICAST',
                    avatar: //todo 理应实时获取
                        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    sign: data.content,
                    unReadCount: 1,
                }
                newChatList.unshift(newChat); //将新的聊天添加到chatList第一位
                store.commit("setChatList", newChatList); //更新表格
            }
        } else if (data.type === 'MULTICAST') {
            newMessageSaveToNedb.groupId = data.groupId //todo 存入groupId
            //todo
        } else {//todo type = notification

        }
        db.localMessage.insert(newMessageSaveToNedb, function (err, newDoc) {
            if (err !== null) {
                console.log('error occured: ');
                console.log(err)
            } else {
                console.log('new ' + newDoc.type + ' insert successfully: ' + newDoc.content)
            }
        });


        let currentChat = store.state.currentChat
        let query = {chatId: currentChat.chatId, type: currentChat.type}
        db.localMessage.find(query).sort({timestamp: 1}).exec(function (err, docs) {
            console.log("setMessageList")
            console.log(docs)
            store.commit("setMessageList", docs)
        })
    };
    websock.onopen = function () {
        var string = `WebSocket is open now.`;
        console.log(string);
    };
    websock.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    }
    websock.onclose = function () {
        console.log("WebSocket is close now")
    }
}

