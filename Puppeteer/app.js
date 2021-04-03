var client = require("./RestClient/client");
const path = require('path');
var __dirname = "C://servico";
var fs = require("fs");
var util = require('./Util/util.js');
//var service = require("os-service");
var reclameAqui = require('./ReclameAqui/obterReclamacoes.js');
const killChrome = require('kill-chrome');
var cargaInicial = true;


async function executarMonitoramento(cargaInicial) {
	fs.appendFile(__dirname + '//Log.txt', "\r\n" + util.getDate() + "\r\nMonitoramento executado\r\n", function (err) {});
	
	var promise = reclameAqui.ExecutarMonitoramento(client.ObterURLUberEats, __dirname, cargaInicial)
	.then(async function()  {
		return reclameAqui.ExecutarMonitoramento(client.ObterURLIFood, __dirname, cargaInicial);
	}).then(async function()  {
		return reclameAqui.ExecutarMonitoramento(client.ObterURLRappi, __dirname, cargaInicial);
	}).then(async function()  {
		return reclameAqui.ExecutarMonitoramento(client.ObterURLJamesDelivery, __dirname, cargaInicial);
	});

	return promise;
}

const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');  
});

server.listen(port, hostname, () => {
  console.log(util.getDate() + ` - Server running at http://${hostname}:${port}/`);
  
  setInterval(async function () {
	killChrome().then(async function () {
		executarMonitoramento(cargaInicial).then(function () {
			killChrome();
			cargaInicial = false;
		});	
	});			
	}, 86400000);	

});
