const express = require('express');


const app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname+'/views');
app.set('view engine','ejs');

app.get('/', (req,res) =>{
    let tem = new Date();
    res.render('content',{time:tem.getSeconds()})
})

app.listen(3000);