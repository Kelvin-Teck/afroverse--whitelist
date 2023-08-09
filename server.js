const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const Mailgen = require('mailgen');
const awatingUser = require('./models/awaitingUserModel.js');
const {EMAIL, PASSWORD} = require('./emailenv.js');
const PORT = process.env.PORT;


const CONNECT_TO_DB = async () => {

	try{
		const MONGO_URI = process.env.MONGODB_LOCAL_URI || process.env.MONGODB_PRODUCTION_URI;
		
		mongoose.set('strictQuery', false);
		await mongoose.connect(MONGO_URI, {
			dbName: "afroverse--whitelist",
			useNewUrlParser: true,
			useUnifiedTopology:true,
		});
		console.log("database connected succesfully...");
	}catch(error){
		console.log(`database connection failed ${error.message}...`);
	}
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());




app.post('/api/add-awaiting-user', async (req, res) => {
	const {email} = req.body;
	try{
		if(!email){
			return res.status(401).json({status: 'error', message: 'please enter an email...'});		
		}	

		const newAwaitingUser = await awatingUser({
			email,
		});

		newAwaitingUser.save();

		// let config = {
		// 	service: 'gmail',
		// 	auth: {
		// 		user: EMAIL,
		// 		pass: PASSWORD
		// 	}
		// }

		// let transporter = nodemailer.createTransport(config);

		// let MailGenerator = new Mailgen({
		// 	theme: "default",
		// 	product: {
		// 		name: "Mailgen",
		// 		link: "https://mailgen.js/"
		// 	}
		// });

		// let response = {
		// 	body: {
		// 		name: "AfroVerse",
		// 		intro: "Your mail has arrived",
		// 		table: {
		// 			data: [
		// 				{
		// 					item: "Nodemailer Stack Book",
		// 					description: "A Backend Application",
		// 					price: "$10.99",
		// 				}
		// 			]
		// 		},
		// 		outro: "Looking forward to do more business with you"
		// 	}
		// }

		// let mail = MailGenerator.generate(response);

		// let message = {
		// 	from: EMAIL,
		// 	to: email,
		// 	subject: "Place Order",
		// 	html: mail
		// } 

		// transporter.sendMail(message).then( () => {
		// 	return res.status(201).json({
		// 		msg: "you should recieve an email"
		// 	})
		// }).catch( error => {
		// 	return res.status(500).json({error})
		// })



		res.status(200).json({status: 'ok', message: 'Thanks for filling out your mail!.....we will be in touch with you'});

	}catch(err){
		return res.status(500).json({status: 'error', message: err.message})
	}
});



app.listen(PORT, async () => {
	await CONNECT_TO_DB();
	console.log(`server running on http:localhost:${PORT}`)
})

