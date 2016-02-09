'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jsonSchema = require('./leboncoin.json');
var fs = require('fs');


var url = 'http://www.leboncoin.fr/ventes_immobilieres/915700197.htm?ca=12_s'

request(url, function (error, response, html) {
  if (!error) {
	  
	var $ = cheerio.load(html);
   
	// Recup the web page's datas :	
	var webPrice = parseInt($("[itemprop='price']").text().replace(" ", ""));
	var webCity = $("[itemprop='addressLocality']").text();
	var webPostalCode = parseInt($("[itemprop='postalCode']").text());
		
	var tabElement = $("[class='lbcParams criterias'] > table > tr > td");    
	var webGoodType = tabElement[0].children[0].data;
	var webNbCoins = parseInt(tabElement[1].children[0].data.replace(" ",""));
	
	var webArea; 
	webArea = parseInt(tabElement[2].children[0].data.replace(" ",""));
    if(webArea == null)
    {
		webArea = parseInt(tabElement[3].children[0].data.replace(" ",""));
    };

	
	// Creation object : 	
	var data_json = {};

	data_json.price = webPrice;
	data_json.city = webCity;		
	data_json.postalCode = webPostalCode;
	data_json.goodType = webGoodType;
	
	if (webPrice >= 30000) {
		data_json.category = 'Vente';
	} else 
	{
		data_json.category = 'Location';
	}

	data_json.nbCoins = webNbCoins;
	data_json.area = webArea;

	var json = JSON.stringify(data_json, null, 4);
	
	// Writting :
	fs.writeFile('jsonStorage.json',json ,function(err) {
		if(err) {
		  console.log(err);
		} else {
		  console.log('Successful generation !');
		}
	}); 
	
  }
  
});