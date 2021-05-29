var _util = require('./util/util.js');
var _db = require('./data/db.js');
var _reclameAqui = require('./webscrapper/reclameaqui.js');
var _urls = require('./conn/urls.js');
const _killChrome = require('kill-chrome');
var _cargaInicial = true;


async function executarMonitoramento(cargaInicial) {
	_util.gerarLog("Monitoramento executado");
	var list = [];
	
	_reclameAqui.ExecutarMonitoramento(_urls.ObterURLUberEats(), __dirname, cargaInicial)
	.then(async function(retorno)  {	 	
		return _db.insertMany(retorno).then(async function()  {
			list.push(await _db.findAll());
			return _reclameAqui.ExecutarMonitoramento(_urls.ObterURLIFood(), __dirname, cargaInicial);
		});		 
	}).then(async function(retorno)  {
		return _db.insertMany(retorno).then(async function()  {
			list.push(await _db.findAll());
			return _reclameAqui.ExecutarMonitoramento(_urls.ObterURLRappi(), __dirname, cargaInicial);
		});		 		
	}).then(async function(retorno)  {	
		return _db.insertMany(retorno).then(async function()  {
			list.push(await _db.findAll());
			return _reclameAqui.ExecutarMonitoramento(_urls.ObterURLJamesDelivery(), __dirname, cargaInicial);
		});		 
	}).then(async function(retorno)  {
		list.push(await _db.findAll());
		return _db.insertMany(retorno);	
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
