const express = require("express");
const app = express();
//const bodyParser = require('body-parser');

const cors = require("cors");


app.use(cors());


const axios = require("axios");
const cheerio = require("cheerio");
const path = require('path');

app.use(express.urlencoded({extended:true}))
app.use(express.json());


const getVideo = async url => {
  
  const html = await axios.get(url);
  
  const $ = cheerio.load(html.data);
  
  const videoString = $("meta[property='og:video']").attr("content");
  
  return videoString;
};



const getImage = async url => {
  
  const html = await axios.get(url);
  
  const $ = cheerio.load(html.data);
  
  const imgString = $("meta[property='og:image']").attr("content");
  
  return imgString;
};


app.get('/',(req,res)=>{
	res.sendFile(__dirname+"/home.html");
})


app.get('/video',(req,res)=>{
  res.sendFile(__dirname+"/videoForm.html");
})


app.get('/image',(req,res)=>{
  res.sendFile(__dirname+"/imageForm.html");
})





app.post('/video',async (req,res)=>{

  try{
     
     const link = await getVideo(req.body.link);
    
     res.send(`<video  controls autoplay>
              <source src=${link} type="video/mp4">
 
              Your browser does not support the video tag.
            </video>`
            )
  

    }

  catch(e){
    res.json({e:e})
  }
})




app.post('/image',async (req,res)=>{

  try{
     
     const link = await getImage(req.body.link);
    
     res.send(`<img src=${link} alt='image'>`)
  

    }

  catch(e){
    res.json({e:e})
  }
})






PORT = process.env.PORT || 8000

app.listen(PORT,()=>{
	console.log(`Server is Run at ${PORT}`)
})

