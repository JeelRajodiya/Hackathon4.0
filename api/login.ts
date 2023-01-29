export default function handler(request, response) {
	const methodMap = {
		POST,
		// GET,
		// DELETE,
	};
	if (
		request.method !== undefined &&
		Object.keys(methodMap).includes(request.method)
	) {
		return methodMap[request.method](request, response);
	} else {
		return response
			.status(400)
			.send(
				`Method not allowed (only ${Object.keys(
					methodMap
				)} are allowed).`
			);
	}
}
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	Password: String,
});

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

const User = mongoose.model("User", userSchema);

async function POST(req, res) {
	const pass = req.body.pwd;
	const mail = req.body.email;
	console.log("Yoyo");
	console.log(req.body);
	// console.log(pass);
	// console.log(mail);
	let check = await User.findOne({ email: mail });

	if (check) {
		const match = await bcrypt.compare(req.body.pwd, check.Password);
		if (match) {
			res.send("Welcome to Dashboard");
		} else {
			res.redirect("/");
		}
	} else {
		res.send("Not Find");
		// res.redirect('/signup');
	}
}
