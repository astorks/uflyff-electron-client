const { exec } = require("child_process");

module.exports = {
    packagerConfig: {
        icon: "./img/app-icon",
        executableName: "Flyff Universe",
        asar: true
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "flyffu_electron_client"
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ]
        },
        {
            name: "@electron-forge/maker-deb",
            "config": {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ],
    hooks: {
        generateAssets: (forgeConfig, platform, arch) => new Promise((resolve, reject) => {
            exec('npm run build', (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        })
    }
}