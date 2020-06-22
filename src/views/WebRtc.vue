<template>
  <div>
    <el-button @click="quitVideoChat">退出</el-button>
    <video autoplay id="localVideo" playsinline :controls="false" muted :srcObject.prop="localStream"></video>
    <video autoplay id="remoteVideo" playsinline :controls="false" :srcObject.prop="remoteStream"></video>
  </div>
</template>

<script>
    import getWebsocket from "@/JavaScript/Websocket";
    import { joinVideoChat, leaveVideoChat, getPeer, savePeer} from "@/JavaScript/Websocket";

    export default {
        name: "WebRtc",
        data() {
            return {
                localStream: null,
                remoteStream: null,
                init: this.$route.query.init,
                friendId: this.$route.query.id,
                peer: null,
                ws: null
            }
        },
        mounted() {
            console.log('in webrtc', this.init, this.friendId);
            joinVideoChat();
            this.ws = getWebsocket();
            const constraints = {
                'video': true,
                'audio': true
            };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    console.log('Got MediaStream:', stream);
                    this.gotMedia(stream)
                })
                .catch(error => {
                    console.error('Error accessing media devices.', error);
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
                    const Peer = require('simple-peer');
                    this.localStream = stream;

                    let iceConfig = {
                        iceServers: [
                            {urls: 'stun:stun.l.google.com:19302'},
                            {urls: 'turn:106.13.79.136:3478?transport=udp', 'username': 'watup', 'credential': 'watup@2020'}
                        ]
                    };
                    this.peer = new Peer({initiator: this.init, stream: stream, config: iceConfig});

                    this.peer.on('signal', data => {
                        console.log(JSON.stringify(data));
                        let wrappedData = {
                            type: 'SIGNAL',
                            receiverId: this.friendId,
                            signal: data
                        };
                        this.ws.send(JSON.stringify(wrappedData));
                    });

                    savePeer(this.peer);

                    this.peer.on('stream', stream => {
                        this.remoteStream = stream;
                    });
                } else {
                    this.localStream = stream;
                    this.peer = getPeer();
                    this.peer.addStream(stream);
                    this.peer.on('stream', stream => {
                        this.remoteStream = stream;
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>