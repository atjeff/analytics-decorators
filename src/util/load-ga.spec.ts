import { loadGoogleAnalyticsScript } from '../index';

describe('loadGoogleAnalyticsScript', () => {
    it('should add google analytics to the dom', () => {
        expect((global as any).window.ga).toBeUndefined();

        loadGoogleAnalyticsScript();

        expect((global as any).window.ga).toBeDefined();
        expect(typeof (global as any).window.ga === 'function').toBeTruthy();
    });
});
