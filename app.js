const path = require('path');
var __dirname = "C://servico";
var fs = require("fs");
var util = require('./util/util.js');
var reclameAqui = require('./webscrapper/reclameaqui.js');
var urls = require('./conn/urls.js');
const killChrome = require('kill-chrome');
var listaReclamacoes = [];
var cargaInicial = true;


async function executarMonitoramento(cargaInicial) {
	fs.appendFile(__dirname + '//Log.txt', "\r\n" + util.getDate() + "\r\nMonitoramento executado\r\n", function (err) {});
	
	reclameAqui.ExecutarMonitoramento(urls.ObterURLUberEats, __dirname, cargaInicial)
	.then(async function(retorno)  {
		listaReclamacoes.concat(retorno);
		return reclameAqui.ExecutarMonitoramento(urls.ObterURLIFood, __dirname, cargaInicial);
	}).then(async function(retorno)  {
		listaReclamacoes.concat(retorno);
		return reclameAqui.ExecutarMonitoramento(urls.ObterURLRappi, __dirname, cargaInicial);
	}).then(async function(retorno)  {
		listaReclamacoes.concat(retorno);
		return reclameAqui.ExecutarMonitoramento(urls.ObterURLJamesDelivery, __dirname, cargaInicial);
	}).then(async function(retorno)  {
		listaReclamacoes.concat(retorno);
	});
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