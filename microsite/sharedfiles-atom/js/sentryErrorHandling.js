let hostname = window.location.hostname;
let environment = hostname === 'localhost' ? 'development' : hostname.includes('extensionhubs.com') ? 'staging' : 'production';
Sentry.init({
	dsn: sentryDsn,
	environment: environment,
	sampleRate: 0.5,
	// Performancre monitoring
	tracesSampleRate: 0.2,
	// Set sampling rate for profiling - this is relative to tracesSampleRate
	//profilesSampleRate: 0.5,
});

window.addEventListener(
	'error',
	event => {
		if (!event.target) return;

		const userAgent = navigator.userAgent;
        const isGoogleAdsBot = userAgent.includes('AdsBot-Google');
        if (isGoogleAdsBot) return;
		
		if (event.target.tagName === 'IMG') {
			Sentry.captureMessage(`Failed to load image ${event.target} ${event.target.src}`);
		} else if (event.target.tagName === 'LINK') {
			Sentry.captureMessage(`Failed to load css ${event.target} ${event.target.href}`);
		} else if (event.target.tagName === 'SCRIPT') {
			if (!event.target.src.startsWith("https://www.google.com/pagead/1p-conversion") && !event.target.src.startsWith("https://www.googletagmanager.com/")) 
				Sentry.captureMessage(`Failed to load JS ${event.target} ${event.target.src}`);
		}
	},
	true
);

window.onerror = function (message, source, lineno, colno, error) {
	Sentry.captureMessage(`Error: ${error} \nMessage: ${message} \nSource: ${source} \nLineNo: ${lineno} \nColNo: ${colno}`);
	return false; // Prevent the default browser error handling
};
