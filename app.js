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
    
   

      res.send(`
        <h1> Select Quality and Download Media from Bottom right Corner </h1>

        <script>
        var map={'fullHD':'1080p','720p':'720p','480p':'480p','360p':'360p'};


          function changeQ(quality){
               $('source','video#player').attr('src','http://v.com/'+map[quality]);
                $('span#pp').html(map[quality]);
               console.log($('source','video#player').attr('src'))
          }
        </script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
         

<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet"> 
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
<div class="dropdown">
 <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Quality
 (<span id="pp"></span>)</button>
 <ul class="dropdown-menu">
   <li><a href="#" onclick="changeQ('fullHD')">FullHD</a></li>
   <li><a href="#" onclick="changeQ('720p')">720p</a></li>
   <li><a href="#" onclick="changeQ('360p')">360p</a></li>
 </ul>
</div>


<video id="player"  controls autoplay>
 <source src=${link} type="video/mp4">

</video>

        `)
  

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

