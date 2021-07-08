var _util = require('./util/util.js');
var _db = require('./data/db.js');
var _reclameAqui = require('./webscrapper/reclameaqui.js');
var _urls = require('./conn/urls.js');
const _killChrome = require('kill-chrome');
var _cargaInicial = true;


async function executarMonitoramento(cargaInicial) {
	_util.gerarLog("Monitoramento executado");

	
		await new Promise(resolve => setTimeout(resolve, 30000));	
		var list = await _db.findAll();	
		_util.gerarLog("registros no banco" + "\r\n" + list.length);
		_reclameAqui.ExecutarMonitoramento(_urls.ObterURLUberEats(), __dirname, cargaInicial, 1000)
		.then(async function()  {	
			return _reclameAqui.ExecutarMonitoramento(_urls.ObterURLIFood(), __dirname, cargaInicial, 10000);	 		
		}).then(async function()  {	
			return _reclameAqui.ExecutarMonitoramento(_urls.ObterURLRappi(), __dirname, cargaInicial, 578);	 		
		}).then(async function()  {	
			return _reclameAqui.ExecutarMonitoramento(_urls.ObterURLJamesDelivery(), __dirname, cargaInicial, 1);	 
	}); 

	
}

const http = require('http');

const hostname = '127.0.0.1';
const port = 8085;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');  
});

server.listen(port, hostname, () => {
  console.log(_util.getDate() + ` - Server running at http://${hostname}:${port}/`);
  
  executarMonitoramento(_cargaInicial).then(function () {
  setInterval(async function () {
	_killChrome().then(async function () {
		executarMonitoramento(_cargaInicial).then(function () {
			_killChrome();
			_cargaInicial = false;
		});	
	});			
	}, 86400000);	
});	
});
