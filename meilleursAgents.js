'use strict';

var request = require('request');
var cheerio = require('cheerio');
var jsonSchema = require('./meilleursAgents.json');
var data_json = require('./jsonStorage.json');
var fs = require('fs');


// Take the data for the json of leboncoin
var data_json_city = data_json.city.toLowerCase();
var data_json_postalCode = data_json.postalCode;

// Use those datas to do the link between leboncoin and meilleurs agents
var url;
url = 'https://www.meilleursagents.com/prix-immobilier/' + data_json_city + '-' + data_json_postalCode + '/#estimates';


request(url, function (error, response, html) {
  if (!error) {
	  
	var $ = cheerio.load(html);
	
	// Recup the web page's datas :	
	var webLocation = $('h1[class="h2 rounded-number rounded-number--1 content-sections__heading"]').text();
		
	var moyPriceM2 = $('.small-4.medium-2.columns').map(function () {
		return Number($(this).text().match(/[0-9,]/g).join("").replace(",", "."));
	}).slice(3);

	if (data_json.goodType == "Appartement") {
		moyPriceM2 = moyPriceM2.slice(0, 3);
	}
	else if (data_json.goodType == "Maison") {
		moyPriceM2 = moyPriceM2.slice(3, 6);
	}

    var goodDeall = '';
    var estimation = data_json.price / data_json.area;

    if(estimation < moyPriceM2[1])
    {
       goodDeall = "Yes";
    }
    if(estimation > moyPriceM2[1])
    {
       goodDeall = "No";
    }
    if(estimation = moyPriceM2[1])
    {
        goodDeall = "No";
    }
	
	// Creation object : 	
	var data_json_MA = {};

	data_json_MA.location = webLocation;
	data_json_MA.goodType = data_json.goodType;
	data_json_MA.priceProposed = data_json.price;
	data_json_MA.area = data_json.area;
	data_json_MA.goodDeal = goodDeall;

	var jsonMA = JSON.stringify(data_json_MA, null, 4);
		
	// Writting :
	fs.writeFile('jsonStorageMA.json',jsonMA ,function(err) {
		if(err) {
		  console.log(err);
		} else {
		  console.log('Successful generation !');
		}	
	}); 
  }
  
});
