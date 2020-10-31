const {app} = require('electron');

const config = {
    mainLoadURL: 'http://y.test.guanmai.cn/ ',
    printLoadURL: 'https://js.guanmai.cn/build/mes/print.html',
    isOpenDevTools: false,
    showPrint: false,
    isOpenPrintDevTools: false
};

try {
    const mes = require(app.getPath('desktop') + '/mes.json');
    Object.assign(config, mes);
} catch (err) {
    console.log(err);
}

module.exports = config;
