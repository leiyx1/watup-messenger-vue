# watup-messenger

## 安装依赖包
```
npm install
```
可以先下载好 electron 和 chromedriver 的 **zip 文件**（以及 SHASUM）放到 `%USERPROFILE%\AppData\Local\electron\Cache` 中，不然下载会很慢

[下载页面](https://github.com/electron/electron/releases/tag/v5.0.6)

### 运行
```
npm run electron:serve
```

### 构建
```
npm run electron:build
```
先下载好 nsis 和 nsis-resources 的 zip 文件，**解压后的文件夹**放到 `%USERPROFILE%\AppData\Local\electron-builder\Cache` 中

下载 winCodeSign 的 zip 文件，**解压后的文件夹**放到 `%USERPROFILE%\AppData\Local\winCodeSign\Cache` 中

[下载页面](https://github.com/electron-userland/electron-builder-binaries/releases)

### 前端数据存储约定
#### 使用Vuex存储的信息（期望这些数据可以在这次登陆中方便的调用到）
* username
* userId
* token

#### 使用Nedb存储的东西（期望这些数据可以在关闭应用，下次启动之后依旧存在）
* messages (本地聊天记录)
* friendList
* chatList
* token (用于持久免密登录) 
* emailAddress

