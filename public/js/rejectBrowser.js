/**
 * Copyright (c) 12/19/13 Green Seed Technologies, Inc. All rights reserved.
 * Author: James Brinkerhoff <james.brinkerhoff@greenseedtechnologies.com>
 */

$( document ).ready(function () {

	var options = {
		reject : { // Rejection flags for specific browsers
			all: false, // Covers Everything (Nothing blocked)
			msie5: true, msie6: true, msie7:true, msie8:true, msie9:true,
			opera: true, // Opera
			konqueror: true, // Konqueror (Linux)
//			unknown: true,
			firefox1:true, firefox2:true, firefox3:true,
			chrome1:true, chrome2:true, chrome3:true, chrome4:true,
			safari2:true, safari3:true, safari4:true
			/*
			 * Possibilities are endless...
			 *
			 * // MSIE Flags (Global, 5-8)
			 * msie, msie5, msie6, msie7, msie8,
			 * // Firefox Flags (Global, 1-3)
			 * firefox, firefox1, firefox2, firefox3,
			 * // Konqueror Flags (Global, 1-3)
			 * konqueror, konqueror1, konqueror2, konqueror3,
			 * // Chrome Flags (Global, 1-4)
			 * chrome, chrome1, chrome2, chrome3, chrome4,
			 * // Safari Flags (Global, 1-4)
			 * safari, safari2, safari3, safari4,
			 * // Opera Flags (Global, 7-10)
			 * opera, opera7, opera8, opera9, opera10,
			 * // Rendering Engines (Gecko, Webkit, Trident, KHTML, Presto)
			 * gecko, webkit, trident, khtml, presto,
			 * // Operating Systems (Win, Mac, Linux, Solaris, iPhone)
			 * win, mac, linux, solaris, iphone,
			 * unknown // Unknown covers everything else
			 */
		},
		display: ['firefox','chrome','safari','msie'], // What browsers to display and their order (default set below)
		browserShow: true, // Should the browser options be shown?
		browserInfo: { // Settings for which browsers to display
			firefox: {
				text: 'Firefox 26+', // Text below the icon
				url: 'http://www.mozilla.com/firefox/' // URL For icon/text link
			},
			safari: {
				text: 'Safari 5+',
				url: 'http://www.apple.com/safari/download/'
			},
			chrome: {
				text: 'Chrome 25+',
				url: 'http://www.google.com/chrome/'
			},
			msie: {
				text: 'Internet Explorer 10+',
				url: 'http://www.microsoft.com/windows/Internet-explorer/'
			}
		},

		// Header of pop-up window
		header: 'Did you know that your Internet Browser is out of date or is not supported?',
		// Paragraph 1
		paragraph1: 'Your browser is out of date, and may not be compatible with '+
			'our website. A list of supported web browsers can be '+
			'found below.',
		// Paragraph 2
		paragraph2: 'Just click on the icons to get to the download page',
		close: true, // Allow closing of window
		// Message displayed below closing link
		closeMessage: 'By closing this window you acknowledge that your experience '+
			'on this website may be degraded',
		closeLink: 'Close This Window', // Text for closing link
		closeURL: '#', // Close URL
		closeESC: true, // Allow closing of window with esc key

		// If cookies should be used to remmember if the window was closed
		// See cookieSettings for more options
		closeCookie: false,
		// Cookie settings are only used if closeCookie is true
		cookieSettings: {
			// Path for the cookie to be saved on
			// Should be root domain in most cases
			path: '/',
			// Expiration Date (in seconds)
			// 0 (default) means it ends with the current session
			expires: 0
		},

		imagePath: './img/browser/', // Path where images are located
		overlayBgColor: '#000', // Background color for overlay
		overlayOpacity: 0.8, // Background transparency (0-1)

		// Fade in time on open ('slow','medium','fast' or integer in ms)
		fadeInTime: 'fast',
		// Fade out time on close ('slow','medium','fast' or integer in ms)
		fadeOutTime: 'fast',

		// Google Analytics Link Tracking (Optional)
		// Set to true to enable
		// Note: Analytics tracking code must be added separately
		analytics: true
	};

	$.reject(options)
});