/**
 * GTM Tracking Wrapper
 * Facilitates sending events to dataLayer and rendering visual toasts.
 */

window.dataLayer = window.dataLayer || [];

const GTM_ID = 'GTM-W9FFCVPK'; // Placeholder for Tag Manager
const GA4_ID = 'G-TESTING123'; // Dummy GA4 ID so Omnibug detects network hits

// 1. Direct GA4 Implementation (gtag.js) to guarantee Omnibug hits
const gaScript = document.createElement("script");
gaScript.async = true;
gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA4_ID);

// 2. Append GTM Script
(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', GTM_ID);

document.addEventListener("DOMContentLoaded", () => {

    // Initial Events
    trackEvent("session_start", { page_location: window.location.href });
    trackEvent("page_view", {
        page_title: document.title,
        page_path: window.location.pathname
    });

    // Global Link Clicks
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link && !link.classList.contains("no-track")) {
            trackEvent("link_click", {
                link_url: link.href,
                link_text: link.innerText.trim(),
                event_category: "navigation",
                event_label: link.href
            });
        }
    });

    // Scroll Depth Tracking
    let scrollDepths = new Set();
    window.addEventListener("scroll", () => {
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (window.scrollY / docHeight) * 100;

        const marks = [25, 50, 75, 100];
        marks.forEach(mark => {
            if (scrollPercent >= mark && !scrollDepths.has(mark)) {
                scrollDepths.add(mark);
                trackEvent("scroll", {
                    scroll_depth: mark,
                    event_category: "scroll",
                    event_action: mark + "%"
                });
            }
        });
    });
});

/**
 * Pushes event to dataLayer and shows a visual toast
 */
window.trackEvent = function (eventName, eventParams = {}) {
    // Merge standard properties
    const payload = {
        event: eventName,
        ...eventParams
    };

    // Push format for GTM
    window.dataLayer.push(payload);

    // Explicitly send GA4 hit for Omnibug detection based on dummy GA4 Tag
    gtag('event', eventName, eventParams);
};
