import { JSDOM } from 'jsdom';
import 'jsdom-global/register';
import { loadGoogleAnalyticsScript } from '../index';

const { window } = new JSDOM('<!doctype html><html><body><script></script></body></html>');

(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = {
    userAgent: 'node.js',
    clipboard: {}
};

describe('loadGoogleAnalyticsScript', () => {
    it('should add google analytics to the dom', () => {
        expect((global as any).window.ga).toBeUndefined();

        loadGoogleAnalyticsScript();

        expect((global as any).window.ga).toBeDefined();
        expect(typeof (global as any).window.ga === 'function').toBeTruthy();
    });
});
