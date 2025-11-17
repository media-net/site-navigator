const MIXPANEL_CUSTOM_LIB_URL = 'https://t.privatesearchmode.com/lib.min.js';
const MIXPANEL_API_HOST = 'https://t.privatesearchmode.com';
const extensionName = 'privatesearch';
const mixpanelCustomProperties = {};
mixpanelCustomProperties['Extension Name'] = extensionName;
mixpanelCustomProperties['param1'] = 160005;
mixpanelCustomProperties['param2'] = 160006;
if(window.location.pathname.startsWith('/fm-')) {
	mixpanelCustomProperties['param1'] = 160007;
} 