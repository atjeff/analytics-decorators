import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

(window as any) = window;
document = window.document;
(navigator as any) = {
    userAgent: 'node.js',
    clipboard: {}
};

const script = document.createElement('script');
script.type = 'text/javascript';
document.body.appendChild(script);
