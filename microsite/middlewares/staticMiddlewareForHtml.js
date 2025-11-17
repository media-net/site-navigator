
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from 'express';
import {callPath, setHeadersFunction} from '../utilBackend/util.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const staticMiddlewareForHtml = (req, res, next) => {
    const staticMiddleware = express.static(path.join(__dirname, '..', 'public'), {
        setHeaders: setHeadersFunction,
		etag: false,
		lastModified: false,
        extensions: ['html']
    });

    staticMiddleware(req, res, next);
}

export const staticMiddlewareForSharedfilesPath = (req, res, next) => {
    const staticMiddleware = express.static(path.join(__dirname, '..', 'sharedfiles-atom'), {
		etag: false,
		lastModified: false,
        extensions: ['html']
    });

    staticMiddleware(req, res, next);
}

export const staticMiddlewareForSharedfilesHtml = (req, res, next) => {
    let lastDir = 'yahoo';
    if(req.hostname.includes('metric')){
        lastDir = 'bing';
    }
    const staticMiddleware = express.static(path.join(__dirname, '..', 'sharedfiles-atom', 'html', lastDir), {
        setHeaders: setHeadersFunction,
		etag: false,
		lastModified: false,
        extensions: ['html']
    });

    staticMiddleware(req, res, next);
}