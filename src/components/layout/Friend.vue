<template>
    <div class="chat-panel">
        <div class="side-list">
        test
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {};
        },
        computed: {
            currentChat: {
                get: function() {
                    return this.$store.state.currentChat;
                },
                set: function(currentChat) {
                    this.$store.commit(
                        "setCurrentChat",
                        JSON.parse(JSON.stringify(currentChat))
                    );
                },
            },
            chatList: {
                get: function() {
                    return this.$store.state.chatList;
                },
                set: function(chatList) {
                    this.$store.commit("setChatList", chatList);
                },
            },
        },
        methods: {
            showChat(chat, index) {
                this.currentChat = chat;
                this.$store.commit("resetUnread");
                this.chatList[index] = this.$store.state.currentChat;
                console.log(chat.unReadCount);
            },
        },
    };
</script>

<style lang="scss">
    .chat-panel {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        // position: fixed;
        .side-list {
            width: 25%;
            height: 100%;
            margin: 0;
            background-color: #d3d3d3;
            .item {
                display: flex;
                align-items: center;
                flex-direction: row;
                height: 70px;
                padding-left: 0px;
                padding-right: 0px;
                .item-avatar {
                    align-items: center;
                    float: left;
                    width: 50px;
                    #badge {
                        height: 50px;
                    }
                    img {
                        width: 50px;
                    }
                }
                .item-body {
                    width: 100%;
                    height: 100%;
                    padding-left: 3%;
                    display: flex;
                    flex-direction: column;
                    .item-title {
                        float: left;
                        height: 33%;
                        // align-items: left;
                        b {
                            // display: inline-block;
                            color: #696969;
                            font-size: medium;
                            float: left;
                            padding-left: 5px;
                            // align-items: left;
                        }
                        span {
                            // display: inline-block;
                            float: right;
                            padding-right: 10px;
                            color: #808080;
                            font-size: small;
                        }
                    }
                    .item-word {
                        float: left;
                        span {
                            float: left;
                            padding-left: 5px;
                            // height: 67%;
                        }
                    }
                }
            }
        }
        .chat-box {
            width: 75%;
        }
    }
</style>
