const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const app = express();


const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' +  Date.now() + path.extname(file.originalname));
  }
})


const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkExtension(file, cb);
  }
}).single('myFile');


function checkExtension(file, cb){

  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = filetypes.test(file.mimetype);

  if(mimeType && extname){
    return cb(null, true);
  }else{
    cb('Error: Images Only..!');
  }

}

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.render('index');
})

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {  
    if(err){
      res.render('index',{
        msg: err
      })
    }else{
      
      if(req.file == undefined){
        res.render('index',{
          msg: 'No file selected'
        })
      }else{
        res.render('index', {
          msg: 'File uploaded',
          file:`uploads/${req.file.filename}`
        })
      }

    }

  });
});

app.listen(3000, () => console.log('Listening on 3000..'));