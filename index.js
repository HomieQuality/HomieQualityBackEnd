const functions = require('firebase-functions');
var cheerio = require('cheerio');
var request = require('request');
//const express = require('express');
//const app     = express();
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.database();
var ref = db.ref("/News/TheRoot/post");
const  url = "http://www.theroot.com/tag/news";
var titleArray = []
var authorArray = []
var imgArray = []
var timeArray = []
var newsItemArray = []

// // Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.newsscrape = functions.https.onRequest((req, res) => {
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      console.log(html);

      $('.post-wrapper').each(function(i, elem){
        var title;
        title = $(this).find("h1").text();
        titleArray.push(title);
      });

      $('.meta__byline').each(function(i,elem){
        var author;
        author = $(this).text();
        authorArray.push(author);
      });

      $("picture").each(function(i, elem){
        var img;
        img = $(this).find("source").attr("data-srcset");
        imgArray.push(img);
      });

      $('.meta__time').each(function(i, elem){
        var time;
        time = $(this).attr("datetime")
        timeArray.push(time);
      });
    }

    for(var i =0; i<titleArray.length; i++ ){
      var newsItem = { title : "", author : "", img : "", time:""};
      newsItem.title = titleArray[i];
      newsItem.author = authorArray[i];
      newsItem.img = imgArray[i];
      newsItem.time = timeArray[i];

      newsItemArray.push(newsItem);
      ref.push(newsItem);
    }

    res.send(JSON.stringify(newsItemArray));
  });

});

//app.listen('8081')
//console.log('Listening on port 8081');
//ref.once("value", function(data){
//    response.send(data.val());
//});
