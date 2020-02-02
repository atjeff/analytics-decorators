import { loadGoogleAnalyticsScript } from '../index';

describe('loadGoogleAnalyticsScript', () => {
    it('should add google analytics to the dom', () => {
        expect((global as any).window.ga).toBeUndefined();

        loadGoogleAnalyticsScript();

        expect((global as any).window.ga).toBeDefined();
        expect(typeof (global as any).window.ga === 'function').toBeTruthy();
    });

    it('should return when the script loads', async () => {
        jest.spyOn(window.document as any, 'createElement').mockImplementation(() => {
            return {
                async: 0,
                src: '',
                addEventListener: (listenerName: string, callback: Function, something: boolean) => {
                    callback();
                }
            };
        });

        await loadGoogleAnalyticsScript();
    });
});
