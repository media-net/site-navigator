const MIXPANEL_CUSTOM_LIB_URL = 'https://t.sitenavigator.co/lib.min.js';
const MIXPANEL_API_HOST = 'https://t.sitenavigator.co';
const extensionName = 'sitenavigator';
const mixpanelCustomProperties = {};
mixpanelCustomProperties['Extension Name'] = extensionName;
mixpanelCustomProperties['param1'] = 160005;
mixpanelCustomProperties['param2'] = 160006;
if(window.location.pathname.startsWith('/fm-')) {
	mixpanelCustomProperties['param1'] = 160007;
} 