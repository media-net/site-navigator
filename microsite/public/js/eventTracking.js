//Shared resource
(function (f, b) {
	if (!b.__SV) {
		var e, g, i, h;
		window.mixpanel = b;
		b._i = [];
		b.init = function (e, f, c) {
			function g(a, d) {
				var b = d.split('.');
				2 == b.length && ((a = a[b[0]]), (d = b[1]));
				a[d] = function () {
					a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
				};
			}
			var a = b;
			'undefined' !== typeof c ? (a = b[c] = []) : (c = 'mixpanel');
			a.people = a.people || [];
			a.toString = function (a) {
				var d = 'mixpanel';
				'mixpanel' !== c && (d += '.' + c);
				a || (d += ' (stub)');
				return d;
			};
			a.people.toString = function () {
				return a.toString(1) + '.people (stub)';
			};
			i =
				'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove'.split(
					' '
				);
			for (h = 0; h < i.length; h++) g(a, i[h]);
			var j = 'set set_once union unset remove delete'.split(' ');
			a.get_group = function () {
				function b(c) {
					d[c] = function () {
						call2_args = arguments;
						call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
						a.push([e, call2]);
					};
				}
				for (var d = {}, e = ['get_group'].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]);
				return d;
			};
			b._i.push([e, f, c]);
		};
		b.__SV = 1.2;
		e = f.createElement('script');
		e.type = 'text/javascript';
		e.async = !0;
		e.src =
			'undefined' !== typeof MIXPANEL_CUSTOM_LIB_URL
				? MIXPANEL_CUSTOM_LIB_URL
				: 'file:' === f.location.protocol && '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//)
				? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
				: '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
		g = f.getElementsByTagName('script')[0];
		g.parentNode.insertBefore(e, g);
	}
})(document, window.mixpanel || []);

mixpanel.init('7317283d1b73a1bf35908d0b6c2192d3', {
	debug: true,
	track_pageview: false,
	persistence: 'localStorage',
	api_host: MIXPANEL_API_HOST,
	ignore_dnt: true,
});

var curExperimentName = '';
var curVariant = '';

if (
	window['convert'] &&
	window['convert']['data'] &&
	window['convert']['data']['experiments'] &&
	window['convert']['currentData'] &&
	window['convert']['currentData']['experiments']
) {
	var refObject = window['convert']['data']['experiments'];

	for (var key in window['convert']['currentData']['experiments']) {
		if (!window['convert']['currentData']['experiments'].hasOwnProperty(key)) {
			continue;
		}

		var currentExperiment = window['convert']['currentData']['experiments'][key];
		curExperimentName = refObject[key] && refObject[key].n ? refObject[key].n : 'unknown experiment name';
		curExperimentName = curExperimentName.replace('Test #', '');
		curVariant = currentExperiment['variation_name'] ? currentExperiment['variation_name'] : 'unknown variant';
		curVariant = curVariant.replace('Var #', '');
	}
}

let convertTrackParams = {
	convert_experience_id: curExperimentName,
	convert_variation_id: curVariant,
};

const urlParamKeyValues = {
	utm_campaign: 'utm_campaign', //campaignid
	utm_custom1: 'utm_custom1', //adgroupid
	utm_term: 'utm_term', //targetid
	utm_content: 'utm_content', //creative
	utm_custom2: 'utm_custom2', //matchtype placement
	utm_custom3: 'utm_custom3', //keyword
	utm_custom4: 'utm_custom4', //network
	utm_source: 'utm_source', //Example: Google
	utm_custom5: 'utm_custom5', //To be kept as a buffer
	//ad1: 'convert_experience_id', //Convert tracking
	//ad2: 'convert_variation_id'  //Convert tracking
};
const validKeys = new Set(Object.keys(urlParamKeyValues));

const currentURL = new URL(window.location.href);
const urlSearchParams = currentURL.searchParams;
const queryParams = {};
for (const key of Object.keys(urlParamKeyValues)) {
	queryParams[urlParamKeyValues[key]] = '';
}

if (!convertTrackParams.convert_experience_id && urlSearchParams.get('ad1')) {
	// If convert track params are not extracted from window object, try to extract from url query params. Else empty string.
	convertTrackParams.convert_experience_id = urlSearchParams.get('ad1');
}
if (!convertTrackParams.convert_variation_id && urlSearchParams.get('ad2')) {
	convertTrackParams.convert_variation_id = urlSearchParams.get('ad2');
}

for (const [key, value] of urlSearchParams) {
	if (validKeys.has(key)) {
		const matchValue = urlParamKeyValues[key];
		if (matchValue.includes('-') && value.includes('-')) {
			const [firstPart, secondPart] = matchValue.split('-');
			const [firstValue, secondValue] = value.split('-');
			queryParams[firstPart] = firstValue;
			queryParams[secondPart] = secondValue;
		} else {
			queryParams[matchValue] = value;
		}
	}
}

let fullpathname = window.location.pathname;
let pathname = fullpathname.substring(1);
if (pathname === '' || pathname === '/') {
	pathname = 'index.html';
}

if (pathname.toLowerCase() === 'index.html' || pathname.toLowerCase().startsWith('aw-')  || pathname.toLowerCase().startsWith('pr-') || pathname.toLowerCase().startsWith('fm-') || pathname.toLowerCase().startsWith('our-product') || pathname.toLowerCase().startsWith('product_')) {
	mixpanel.register({landingurlregex: pathname});
	mixpanel.register(queryParams);
	mixpanel.register(convertTrackParams);
}


function gtmTrack(eventName) {
	if (gtm) {
		eventDict = {};
		eventDict['event'] = eventName;
		eventDict['browser'] = jscd.browser;
		eventDict['OS'] = jscd.os + ' ' + jscd.osVersion;
		const gtmCombinedProperties = Object.assign({}, queryParams, eventDict);
		window.dataLayer.push(gtmCombinedProperties);
	}
}

async function mixpanelTrack(mixpanelEventName, eventAttributes = {}) {

	if (!conditionChecksForTrackingEvent(mixpanelEventName)) {
		return;
	}

    if (Object.keys(eventAttributes).length > 0) { // Register event attributes in Mixpanel if they have properties
        mixpanel.register(eventAttributes);
    }
	
	mixpanel.track(mixpanelEventName, mixpanelCustomProperties);
}

let blockedMixpanelEvents = [
	'Overlay1Display',
	'Overlay2Display',
	'Overlay3Display',
	'sourceLocationList',
	'destLocationList',
	'sourceLocationSelected',
	'destLocationSelected',
];
let blockedUrls = ['nsionhubs.com', 'localhost'];

function conditionChecksForTrackingEvent(mixpanelEventName) {
	if (!urlTrackable() || (blockedMixpanelEvents.includes(mixpanelEventName) && !urlSearchParams.has('debug'))) {
		return false;
	}

	if (urlSearchParams.has('test')) {
		return false;
	}

	if (
		mixpanelEventName === 'UserLanderVisit' &&
		!(pathname.toLowerCase() === 'index.html' || pathname.toLowerCase().startsWith('aw-') || pathname.toLowerCase().startsWith('pr-') || pathname.toLowerCase().startsWith('fm-') || pathname.toLowerCase().startsWith('our-product') || pathname.toLowerCase().startsWith('product_'))
	) {
		return false;
	}

	return true;
}

function urlTrackable() {
	return !blockedUrls.some(blockedUrl => currentURL.hostname.includes(blockedUrl)) || urlSearchParams.has('trackStaging');
}