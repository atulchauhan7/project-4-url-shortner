const urlModel = require("../models/urlModel");
const shortid = require('shortid');


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidUrl=/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/


const createUrl = async function (req, res) {
  try {
      const longUrl=req.body.longUrl
      const baseUrl="http://localhost:3000"

    if (!isValid(longUrl)) {
        res.status(400).send({ status: false, message: "URL is required" });
        return;
    }

    if(!isValidUrl.test(longUrl)) {
        res.status(400).send({ status: false, msg: "Plz enter valid URL" });
        return;
    }
        const isUrlPresent = await urlModel.findOne({longUrl:longUrl})
    if(isUrlPresent){
        res.status(400).send({status:false, message:"short url already created for this URL"})
        return
    }

      const urlCode = shortid.generate()
      const shortUrl = baseUrl+ '/' +urlCode
      console.log(shortid.generate());

      urlCreated = await urlModel.create({ urlCode, longUrl, shortUrl })

      res.status(201).send({status:true, message:"Short Url created successfully!",data:urlCreated})

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getUrl=async function(req,res){   
    try {
        let urlCode=req.params.urlCode

        isUrlCodePresent=await urlModel.findOne({urlCode:urlCode})

        if (urlCode.trim().length==0) {
            res.status(400).send({ status: false, message: "plz provide URL Code in params" });
            return;
        }


        if(!isUrlCodePresent){
            res.status(404).send({status:false, message:"Url not found with this urlCode"})
            return
        }
        res.status(301).redirect(isUrlCodePresent.longUrl)
    } catch (err) {
        res.status(500).send({status:false, message:err.message})
    }
}

module.exports = { createUrl,getUrl };
