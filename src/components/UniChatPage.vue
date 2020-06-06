<template>
    <div>
        <div>
            <ul class="infinite-list"  style="overflow:auto">
                <li v-bind:key="i" v-for="i in messages" class="infinite-list-item">{{ i.content }}</li>
            </ul>
        </div>
        <div>
            <el-input v-model="token" placeholder="name"></el-input>
            <el-button @click="initWebSocket()">连接</el-button>
            <el-button @click="closeWebSocket">关闭</el-button><br/>
        </div>
        <div>
            <el-input placeholder="input message" v-model="message"></el-input>
            <el-button @click="sendUniMessage">发送</el-button>
        </div>

    </div>

</template>

<script>
    import db from '../nedb/nedbConfig'
    export default {

        name: "UniChatPage",
        data(){
          return{
              messages:[],
              chatUrl: '',
              token: '',
              message: '',
          }
        },
        mounted() {
            //this.initWebSocket();
            //db.localMessage.loadDatabase()
            this.refreshMessages();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        methods: {
            initWebSocket(){ //初始化weosocket
                //this.chatUrl = `ws://106.13.110.96:8088/ws?token=${this.token}`;
                this.chatUrl = `ws://127.0.0.1:8080/websocket/${this.token}`;
                this.websock = new WebSocket(this.chatUrl);
                this.websock.onmessage = function (event) {
                    var data = JSON.parse(event.data);
                    var time = new Date();
                    var newMessage = {
                        senderId: undefined, //todo
                        time: time,
                        content: data.content,
                    };
                    db.localMessage.insert(newMessage, function (err, newDoc) {
                        console.log('111111111111111111111111111')
                        if(err !== null){
                            console.log('error occured: ' + err);
                        }
                        else {
                            console.log('new doc insert successfully: ' + newDoc.content)
                            this.refreshMessages();
                        }
                    });
                }
                this.websock.onopen = function(){
                    var string = `WebSocket is open now.`;
                    console.log(string);
                };
                this.websock.onerror = function (event) {
                    console.error("WebSocket error observed:", event);
                }
                this.websock.onclose = function () {
                    console.log("WebSocket is close now")
                }
            },
            refreshMessages:function(){
                var self = this
                db.localMessage.find({},function (err,docs) {
                    console.log(222222222222222222222222222)
                    console.log(docs)
                    self.messages = docs;
                })
            },
            closeWebSocket(){
                console.log(`current token: ${this.token}`)
              this.websock.close();
            },
            sendUniMessage(){
                console.log(`send uni message:` + this.message)
                this.websock.send(JSON.stringify({
                    type: "UNICAST",
                    receiverId: "5eccfc418e17974a04b86b19",
                    content: `${this.message}`,
                }))
            },
        },
    }
</script>

<style scoped>

</style>
