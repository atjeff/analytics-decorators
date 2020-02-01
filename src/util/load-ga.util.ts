/**
 * Adds google analytics tracking script to the DOM.
 * https://developers.google.com/analytics/devguides/collection/analyticsjs
 * Check your adblocker if it doesn't load...
 * 
 * @export
 */
export function loadGoogleAnalyticsScript(): Promise<void> {
    return new Promise((resolve) => {
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            (i[r] = i[r] || function() {  (i[r].q = i[r].q || []).push(arguments); }),
            (i[r].l = 1 * +new Date());
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            a.addEventListener('load', (e: Event) => { 
                resolve()
            }, false)
            m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    })
}