module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "com.buaa.watup",
                "productName": "watup-messenger",
                "copyright": "Copyright watup@buaa © 2020",
                "win": {
                    "icon": "src/assets/icon.ico",
                    "target": [
                        {
                            "target": "nsis",
                            "arch": [
                                "x64",
                            ]
                        }
                    ]
                },
                "mac": {
                    "icon": "src/assets/icon.ico"
                },
                "nsis": {
                    "oneClick": false,
                    "allowElevation": true,
                    "allowToChangeInstallationDirectory": true,
                    "installerIcon": "src/assets/icon.ico",
                    "createDesktopShortcut": true,
                    "shortcutName": "watup-messenger",
                },
            }
        }
    }
};