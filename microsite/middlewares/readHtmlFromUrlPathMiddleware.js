
import path, { dirname } from 'path';
import fs from 'fs';
import {fileURLToPath, parse} from 'url';
import {callPath, setHeadersFunction} from '../utilBackend/util.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// This is the middleware function to handle static file paths and redirection logic
export const readHtmlFromUrlPathMiddleware = (req, res, next) => {
    if (parse(req.url).pathname === '/') {
		const htmlFilePath = path.join(__dirname,'..','public','our-product.html');
		callPath(req, res, htmlFilePath);
        return;
	}

	const staticFilesMap = {
		'/our-product': path.join('our-product.html')
	};

	const matchingKey = Object.keys(staticFilesMap).find(key => req.url.includes(key));

	if (matchingKey && !/\.(js|css)$/.test(req.url)) {
		const htmlFilePath = path.join(__dirname, '..','public', staticFilesMap[matchingKey]);
		callPath(req, res, htmlFilePath);
	} else {
		next();
	}
};