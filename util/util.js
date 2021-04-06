var shell = require('shelljs');

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
                shell.exec('sudo sh /home/georgevepo/Desktop/hma vpn/hma-connect.sh');
                await new Promise(resolve => setTimeout(resolve, 30000));
                
                await page.goto(url, {
                    timeout: 20000
                });

                await page.waitForSelector(selector, {
                    timeout: 20000
                })

                break;                
            } catch (e) {   
                tentativas -= 1;
                if(tentativas <= 0){
                    throw e;
                }                    
            }                            
        }            
    },
    disconnectToVPN: async function(){
        //shell.exec('echo 9424 | sudo -S killall openvpn');
        //cmd.run('taskkill /s localhost  /u Administrador /p 9424367mtp  /f /im "HMA! Pro VPN.exe"');
        //cmd.run('net stop "OpenVPNService"');
        //return await new Promise(resolve => setTimeout(resolve, 10000)); 
    }

}
