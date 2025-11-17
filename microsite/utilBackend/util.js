import fs from 'fs';

export function setHeadersFunction(res, time=36000) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Cloudflare-CDN-Cache-Control', `public, max-age=${time}`); //max-age in seconds
	res.setHeader('Cache-Control', `private, max-age=${time}, lastModified=false, etag=false`);
}

export function callPath(req, res, htmlFilePath) {
	fs.readFile(htmlFilePath, 'utf8', function read(err, data) {
		if (err) {
			throw err;
		}
		const content = data.replace('$$$$', loadGtmValue(req.headers['cf-ipcountry']));
		res.send(content);
	});
}


//If gtm to be loaded on a page, this function returns true or false based on geo counry
export function loadGtmValue(reqCountry) {
	const allowedCountries = ['US'];

	let loadGtm = false;
	if (allowedCountries.includes(reqCountry)) {
		loadGtm = true;
	}
	return loadGtm;
}
