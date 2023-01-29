const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ip = require("ip");
const ipAddress = ip.address();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
// console.log(process.env.SENDER_EMAIL,process.env.EMAIL_PASS);

var pas = process.env.EMAIL_PASS;
console.log(pas);

const app = express();
app.use(cors({}));
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let nname, eemail, passw;
let otp;

function otpgen(email) {
	otp = Math.random();
	otp = otp * (1e6 - 1e5) + 1e5;
	otp = parseInt(otp);

	var transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.SENDER_EMAIL,
			pass: process.env.EMAIL_PASS,
		},
		headers: {
			"x-priority": "1",
			"x-msmail-priority": "High",
			importance: "high",
		},
	});

	var mailOptions = {
		from: `Hackathon 4.0 <process.env.SENDER_EMAIL>`,
		to: email,
		subject: "Hackathon Blogging App",
		html:
			`<h4>Your OTP Is ${otp}` +
			"<h3>Please click on the following link to verify your email address:</h3>" +
			'<a href="http://localhost:3000/verify/',
		text: "Dum Di Di Dey!!!",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent");
		}
	});
	console.log(otp);
	return otp;
}

const dbUrl =
	"mongodb+srv://admin:admin@cluster0.gu429ye.mongodb.net/?retryWrites=true&w=majority";
const connectionParams = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};
mongoose.set("strictQuery", true);

mongoose.connect(dbUrl, connectionParams).then(() => {
	console.info("Connection Successful To DB");
});

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	Password: String,
});

const User = mongoose.model("User", userSchema);

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// })

// app.get("/signup", (req, res) => {
// 	res.sendFile(__dirname + "/signup.html");
// });

// app.get("/forgot", (req, res) => {
// 	res.sendFile(__dirname + "/forgot.html");
// });

// app.get("/otpf", (req, res) => {
// 	res.sendFile(__dirname + "/otpf.html");
// });

app.post("/otpcheck", (req, res) => {
	if (req.body.otpp == otp) {
		console.log("Successful");
		// res.redirect("/");
		res.send(200);
	} else {
		console.log("UnSuccessful");
		res.send(403);
		// res.redirect("/signup");
	}
});

app.post("/otpf", async (req, res) => {
	if (otp == req.body.otpf) {
		// res.sendFile(__dirname + "/newpass.html");
		res.send(200);
	} else {
		res.send("better luck next time");
	}
});

app.post("/newpass", async (req, res) => {
	console.log(req.body.newpass);
	const newpass = await bcrypt.hash(req.body.newpass, 10);
	console.log(eemail);
	let check = await User.updateOne(
		{ email: eemail },
		{ $set: { Password: newpass } }
	);
	console.log(check);

	res.send(`Updated Now <a href="/">Sign In</a>`);
});

app.post("/otpsu", async (req, res) => {
	if (otp == req.body.otps) {
		try {
			const hashdpwd = await bcrypt.hash(passw, 10);
			console.log(hashdpwd);

			const newUser = new User({
				name: nname,
				email: eemail,
				Password: hashdpwd,
			});

			await newUser.save();

			res.redirect("/");
		} catch {
			res.redirect("/signup");
		}
	}
});

app.post("/", async (req, res) => {
	const pass = req.body.pwd;
	const mail = req.body.email;
	console.log("Yoyo");
	console.log(req.body);
	console.log(pass);
	console.log(mail);
	let check = await User.findOne({ email: mail });

	if (check) {
		const match = await bcrypt.compare(req.body.pwd, check.Password);
		if (match) {
			res.send("Welcome to Dashboard");
		} else {
			res.send("wrong Pass");
			// res.redirect("/");
		}
	} else {
		res.send("Not Find");
		// res.redirect('/signup');
	}
});

app.post("/signup", async (req, res) => {
	otpgen(req.body.email);
	nname = req.body.nam;
	eemail = req.body.email;
	passw = req.body.pwdd;
	console.log(req.body.pwdd);
	res.send(200);
	// res.sendFile(__dirname + "/otpsu.html");
});

app.post("/forgot", async (req, res) => {
	console.log(req.body.email);
	eemail = req.body.email;
	otpgen(req.body.email);
	res.send(200);

	// res.redirect("/otpf");
});

app.listen(process.env.PORT, () => {
	console.log(`Network access via: ${ipAddress}:${3430}!`);
});

app.post("/signup", async (req, res) => {
	otpgen(req.body.email);
	nname = req.body.nam;
	eemail = req.body.email;
	passw = req.body.pwdd;
	console.log(req.body.pwdd);
	res.send(200);

	// res.sendFile(__dirname + "/otpsu.html");
});
