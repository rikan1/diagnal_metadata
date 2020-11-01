const { Cache } = require('../models/cache.model');
const {getMetadata} = require('page-metadata-parser');
const domino = require('domino');
const request = require('request');
const URL = require('url');

exports.parseUrl = async (req,res)=>{

    const {url} = req.body;
    if(!url){
      return res.status(400).send({message:'url is required!'});
    }

    const parsedUrl = URL.parse(url);

    let baseUrl = parsedUrl.host+parsedUrl.pathname;

    const data =  await Cache.findOne({baseUrl});

    if(data){
      return res.send({
          title: data.title,
          description: data.description,
          image: data.image,
          keywords: data.keywords
      })
    }
  
    request(url, async function (error, response, responseHtml) {

      if (error) {
        return res.status(400).send({message:'There was an error of some kind!'});
      }
      const doc = domino.createWindow(responseHtml).document;
      const metadata = getMetadata(doc, url);

      let cache = new Cache({
        baseUrl,
          title: metadata.title,
          description: metadata.description,
          keywords: metadata.keywords ? metadata.keywords : [],
          image: metadata.image
      });

      let savedCache = await cache.save();

      return res.send({
          title: savedCache.title,
          description: savedCache.description,
          image: savedCache.image,
          keywords:savedCache.keywords
      });
  
    });
   
};