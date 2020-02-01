import {
    createAnalyticsTracker,
    get,
    getMany,
    initialize,
    sendEvent,
    sendException,
    sendHit,
    sendPageView,
    sendTimingEvent,
    set,
    setMany,
    windowHasGoogleAnalytics
} from './analytics.core';
import { GoogleAnalyticsHitTypes } from './models/ga-hit-types.enum';
import * as loadGAUtil from './util/load-ga.util';

beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
});

const trackerId = 'TRACKER-ID-12345';

describe('Analytics Core', () => {
    describe('initialize', () => {
        it(`should call loadGoogleAnalyticsScript if ga isn't loaded`, async () => {
            const mockLoadGoogleAnalyticsScript = jest.spyOn(loadGAUtil, 'loadGoogleAnalyticsScript').mockImplementation();

            await initialize(trackerId);

            expect(mockLoadGoogleAnalyticsScript).toHaveBeenCalled();

            mockLoadGoogleAnalyticsScript.mockRestore();
        });

        it(`shouldn't call loadGoogleAnalyticsScript if ga is loaded`, async () => {
            const mockLoadGoogleAnalyticsScript = jest.spyOn(loadGAUtil, 'loadGoogleAnalyticsScript');
            const gaCreateSpy = jest.fn();
            loadGAUtil.loadGoogleAnalyticsScript();
            mockLoadGoogleAnalyticsScript.mockReset();
            (global as any).window.ga.create = gaCreateSpy;

            await initialize(trackerId);

            expect(mockLoadGoogleAnalyticsScript).not.toHaveBeenCalled();
        });

        it('should call ga.create', async () => {
            const gaCreateSpy = jest.fn();
            loadGAUtil.loadGoogleAnalyticsScript();
            (global as any).window.ga.create = gaCreateSpy;

            await initialize(trackerId);

            expect(gaCreateSpy).toHaveBeenCalled();
        });
    });

    describe('createAnalyticsTracker', () => {
        it('should call ga.create', () => {
            const gaCreateSpy = jest.fn();
            loadGAUtil.loadGoogleAnalyticsScript();
            (global as any).window.ga.create = gaCreateSpy;

            createAnalyticsTracker(trackerId);

            expect(gaCreateSpy).toHaveBeenCalled();
        });

        it('should call ga.create with the passed in values', () => {
            const gaCreateSpy = jest.fn();
            loadGAUtil.loadGoogleAnalyticsScript();
            (global as any).window.ga.create = gaCreateSpy;

            createAnalyticsTracker(trackerId, 'testing-domain');

            expect(gaCreateSpy.mock.calls[0][0]).toMatchSnapshot();
        });
    });

    describe('createAnalyticsTracker', () => {
        it(`should return false if window.ga doesn't exist`, () => {
            expect(windowHasGoogleAnalytics({})).toBeFalsy();
        });

        it('should return true if window.ga exists', () => {
            expect(windowHasGoogleAnalytics({ ga: () => {} })).toBeTruthy();
        });
    });

    describe('sendEvent', () => {
        beforeEach(() => {
            jest.restoreAllMocks();
        });
        it('should call send with the passed in event', async () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            await initialize(trackerId);

            sendEvent({
                eventCategory: 'Videos',
                eventAction: 'play',
                eventLabel: 'Fall Campaign'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });

        it('should not throw a type error', async () => {
            const sendSpy = jest.fn();

            sendEvent({
                eventCategory: 'Videos',
                eventAction: 'play',
                eventLabel: 'Fall Campaign'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('sendPageView', () => {
        it('should call send with the path', async () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            await initialize(trackerId);

            sendPageView({
                path: 'some-path'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });

        it('should call send with the path and title when it exists', async () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            await initialize(trackerId);

            sendPageView({
                path: 'some-path',
                title: 'Some Path Page!'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('sendException', () => {
        it('should call send with the passed in exception', async () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            await initialize(trackerId);

            sendException({
                exDescription: 'Someone broke the app',
                exFatal: true
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('sendHit', () => {
        it('should call send with the passed in generic hit type and payload', async () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            await initialize(trackerId);

            sendHit({
                hitType: GoogleAnalyticsHitTypes.exception,
                fieldsObject: {
                    exDescription: 'Someone broke the app',
                    exFatal: true
                }
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('sendTimingEvent', () => {
        it('should call send with the category, var, value', async () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            await initialize(trackerId);

            sendTimingEvent({
                timingCategory: 'Form',
                timingVar: 'completionTime',
                timingValue: '1234'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });

        it('should call send with the category, var, value and label when it exists', async () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            await initialize(trackerId);

            sendTimingEvent({
                timingCategory: 'Form',
                timingVar: 'completionTime',
                timingValue: '1234',
                timingLabel: 'Login Form'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('get', () => {
        it('should call get with the passed in fieldName', async () => {
            const getSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                get: getSpy
            });

            await initialize(trackerId);

            const output = get('test-field');

            expect(getSpy).toHaveBeenCalled();
            expect(output).toBeUndefined();
        });

        it('should return the fieldValue if it exists', async () => {
            const expectedOutput = { test: 2 };
            const getSpy = jest.fn().mockReturnValue(expectedOutput);
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                get: getSpy
            });

            await initialize(trackerId);

            const output = get('test-field');

            expect(output).toEqual(expectedOutput);
        });
    });

    describe('getMany', () => {
        it('should call get once for each field name', async () => {
            const getSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                get: getSpy
            });

            await initialize(trackerId);

            getMany(['test-field', 'test-field2']);

            expect(getSpy).toHaveBeenCalledTimes(2);
        });

        it('should return the values if they exist', async () => {
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                get: jest.fn(value => ({ value }))
            });

            await initialize(trackerId);

            const result = getMany(['test-field', 'test-field2']);

            expect(result).toMatchSnapshot();
        });
    });

    describe('set', () => {
        it('should call set with the field name and value', async () => {
            const setSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                set: setSpy
            });

            await initialize(trackerId);

            set('name', 'value');

            expect(setSpy).toHaveBeenCalled();
        });
    });

    describe('setMany', () => {
        it('should call set with a fieldsObject', async () => {
            const setSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                set: setSpy
            });

            await initialize(trackerId);

            setMany({
                allowAnchor: true,
                appId: 'test1234'
            });

            expect(setSpy).toMatchSnapshot();
        });
    });
});
