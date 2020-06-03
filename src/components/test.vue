<template>
    <div class="test">

    </div>
</template>

<script>
    export default {
        name : 'test',
        data() {
            return {
                websock: null,
            }
        },
        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        methods: {

        },
    }
</script>
<style lang='less'>

</style>
