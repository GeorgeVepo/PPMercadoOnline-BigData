var _today = "";
//var __dirname = "/home/georgevepo/Desktop/PPMercadoOnline-BigData-main";
var __dirname = "C:/Users/george.melo.vepo/Desktop/Work/PPMercadoOnline-BigData";
var _fs = require("fs");

module.exports = {
    format: function () {
        var args = [].slice.call(arguments);
        return this.replace(/(\{\d+\})/g, function (a) {
            return args[+(a.substr(1, a.length - 2)) || 0];
        });
    },
    sleep: async function (milliseconds) {
        await new Promise(resolve => setTimeout(resolve, milliseconds));
    },
    getDate: function () {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var MM = today.getMinutes();
        var ss = today.getSeconds();
        var mmm = today.getMilliseconds();

        today = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + MM + ':' + ss + '.' + mmm
        return today;
    },
    tryConnection: async function(page, url, selector, tentativas){    

        while(tentativas > 0){
            try {
                await new Promise(resolve => setTimeout(resolve, 30000));
                
                await page.goto(url, {
                    timeout: 20000
                });

                
                this.gerarLog("goto " + url);

                await page.waitForSelector(selector, {
                    timeout: 20000
                })

                this.gerarLog("waitForSelector " + selector);

                break;                
            } catch (e) {   
                tentativas -= 1;
                if(tentativas <= 0){
                    throw e;
                }                    
            }                            
        }            
    },
    gerarLog: async function (message) {  
        _today = this.getDate(); 
        console.log("\r\n" + _today + "\r\n" + message + "\r\n");
        _fs.appendFile(__dirname + '//log.txt', "\r\n" + _today + "\r\n" + message + "\r\n", function (err) {});
    
    }

}
