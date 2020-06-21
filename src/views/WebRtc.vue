<template>
  <div>
    <video autoplay id="remoteVideo" playsinline :controls="false" :srcObject.prop="srcObject"></video>
  </div>
</template>

<script>
    export default {
        name: "WebRtc",
        data() {
            return {
                srcObject: null
            }
        },
        mounted() {
            var Peer = require('simple-peer');

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(gotMedia).catch(() => {});

            function gotMedia (stream) {
                var peer1 = new Peer({ initiator: true, stream: stream });
                var peer2 = new Peer();

                peer1.on('signal', data => {
                    peer2.signal(data)
                });

                peer2.on('signal', data => {
                    peer1.signal(data)
                });

                peer2.on('stream', stream => {
                    this.srcObject = stream;
                })
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>