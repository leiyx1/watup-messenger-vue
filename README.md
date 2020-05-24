# watup-messenger

## 安装依赖包
```
npm install
```

### 运行
```
npm run electron:serve
```
可以先下载好 electron 和 chromedriver 的 **zip 文件**（以及 SHASUM）放到 `%USERPROFILE%\AppData\Local\electron\Cache` 中，不然下载会很慢

[下载页面](https://github.com/electron/electron/releases/tag/v5.0.6)

### 构建
```
npm run electron:build
```
先下载好 nsis 和 nsis-resources 的 zip 文件，**解压后的文件夹**放到 `%USERPROFILE%\AppData\Local\electron-builder\Cache` 中

下载 winCodeSign 的 zip 文件，**解压后的文件夹**放到 `%USERPROFILE%\AppData\Local\winCodeSign\Cache` 中

[下载页面](https://github.com/electron-userland/electron-builder-binaries/releases)

