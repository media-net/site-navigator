import AXIOS from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import { staticMiddlewareForHtml, staticMiddlewareForSharedfilesHtml, staticMiddlewareForSharedfilesPath} from './middlewares/staticMiddlewareForHtml.js';
import {readHtmlFromUrlPathMiddleware} from './middlewares/readHtmlFromUrlPathMiddleware.js';
import {callPath, setHeadersFunction} from './utilBackend/util.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookieParser());

  
app.use(cors());
app.use(express.json());


const axios = AXIOS.default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(readHtmlFromUrlPathMiddleware)  // To chane gtm true or false based on user country

app.use('/sharedfiles-atom', staticMiddlewareForSharedfilesPath); // To access shared files
app.use(staticMiddlewareForSharedfilesHtml); // For shared html remove suffix
app.use(staticMiddlewareForHtml); // To remove html suffix
app.use(
	express.static(path.join(__dirname, 'public'), {
		setHeaders: setHeadersFunction,
		etag: false,
		lastModified: false,
	})
);

app.post('/api/feedback', (req, res) => {
	const {reason, details} = req.body;
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.FEEDBACK_EMAIL,
			pass: process.env.FEEDBACK_PASS,
		},
	});

	const mailOptions = {
		from: process.env.FEEDBACK_EMAIL,
		to: process.env.FEEDBACK_TARGET_EMAIL,
		subject: process.env.FEEDBACK_SUBJECT,
		text: `Reason: ${reason} \nDetails: ${details}`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error occurred:', error);
			res.status(500).json({success: false, message: 'Error occurred while sending email'});
		} else {
			console.log('Email sent:', info.response);
			res.status(200).json({success: true, message: 'Feedback submitted successfully'});
		}
	});
});

app.post('/api/contactUs', async (req, res) => {
	const {subject, text} = req.body;

	if(subject.includes('CCPA')) {
		try {
			const response = await axios.post('https://sapi.privatesearchmode.com/apps/atomd/ccpaApi', {
				subject: subject,
				text: text
			});
			
			console.log('CCPA request sent:', response.data);
			// res.status(200).json({success: true, message: 'CCPA request submitted successfully'});
			// return;
		} catch (error) {
			console.log('Error occurred with CCPA request:', error);
			// res.status(500).json({success: false, message: 'Error occurred while processing CCPA request'});
			// return;
		}
	}

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.FEEDBACK_EMAIL,
			pass: process.env.FEEDBACK_PASS,
		},
	});

	const mailOptions = {
		from: process.env.FEEDBACK_EMAIL,
		to: process.env.FEEDBACK_TARGET_EMAIL,
		subject: subject,
		text: text,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error occurred:', error);
			res.status(500).json({success: false, message: 'Error occurred while sending email'});
		} else {
			console.log('Email sent:', info.response);
			res.status(200).json({success: true, message: 'Query submitted successfully'});
		}
	});
});

app.get('/api/proxy/getActivationSourceBucket', async (req, res) => {
	try {
		const queryParams = req.query;
		const queryString = new URLSearchParams(queryParams).toString();
		const apiUrl = `https://www.checkmyspeednow.com/getActivationSourceBucket?${queryString}`;
		
		console.log('Proxying request to:', apiUrl);
		
		const response = await axios.get(apiUrl, {
			headers: {
				'Referer': 'https://packagetrackonline.com',
				'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
			}
		});
		
		res.json(response.data);
	} catch (error) {
		console.error('Proxy error:', error.message);
		res.status(error.response?.status || 500).json({
			success: false,
			message: 'Error fetching data from external API',
			error: error.message
		});
	}
});


app.use((req, res, next) => {
	if (req.url.startsWith('/aw-') || req.url.startsWith('/pr-') || req.url.startsWith('/fm-')) {
		let htmlFilePath = path.join(__dirname, 'public', 'spa.html');
		callPath(req, res, htmlFilePath);
	} else {
		return next();
	}
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
