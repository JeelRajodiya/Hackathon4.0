const express = require('express');
const bodyparser=require('body-parser');
const nodemailer = require('nodemailer');


const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/forgot.html');
})

app.get('/otp', (req,res) => {
    res.sendFile(__dirname + '/otp.html');
})

let otp;

app.post('/otpcheck',(req,res)=>{
    if(req.body.otpp==otp)
        res.send('succesfull');
    else
        res.send('unsuccesfull');
});

app.post('/otp', (req,res) =>{
    otp = Math.random();
    otp = otp * (1e7-1e6) + 1e6;
    otp = parseInt(otp);
    console.log(otp);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
        user: 'auhackathon4@gmail.com',
        pass: 'zpzwfnlceulsvmti'
        }
    });
    
    var mailOptions = {
        from: 'auhackathon4@gmail.com',
        to: req.body.emails,
        subject: 'Sending Email From AU Hackathon Blogging App 3',
        html:
        `<h4>Your OTP Is ${otp}`+
        '<h3>Please click on the following link to verify your email address:</h3>' +
        '<a href="http://localhost:3000/verify/',
        text: 'Dum Di Di Dey!!!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent');
        }
    });


    // const app = express();
    // app.use(bodyparser.urlencoded({extended : false}));

    // export {otp};
    // app.get('/', (req,res) =>{
    //     res.sendFile(__dirname + '/otp.html');
    // })
    
    // // app.post('/', (req,res) =>{
    //     console.log(req.body.otpp);
    //     console.log(otp);
    //     console.log(typeof req.body.otpp);
    //     console.log(typeof otp);
    //     let otem = parseInt(req.body.otpp);
    //     if(otem == otp){
    //         console.log('Verified');
    //         res.send("Verified");
    //     }
    //     else{
    //         console.log('Unsuccessful');
    //         res.send("Unsuccessful");
    //     }
    // // })

    res.redirect('/otp')

    
        
})

app.listen(3490);