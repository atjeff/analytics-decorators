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
        it(`should call loadGoogleAnalyticsScript if ga isn't loaded`, () => {
            const mockLoadGoogleAnalyticsScript = jest.spyOn(loadGAUtil, 'loadGoogleAnalyticsScript').mockImplementation();

            initialize(trackerId);

            expect(mockLoadGoogleAnalyticsScript).toHaveBeenCalled();

            mockLoadGoogleAnalyticsScript.mockRestore();
        });

        it(`shouldn't call loadGoogleAnalyticsScript if ga is loaded`, () => {
            const mockLoadGoogleAnalyticsScript = jest.spyOn(loadGAUtil, 'loadGoogleAnalyticsScript');
            const gaCreateSpy = jest.fn();
            loadGAUtil.loadGoogleAnalyticsScript();
            mockLoadGoogleAnalyticsScript.mockReset();
            (global as any).window.ga.create = gaCreateSpy;

            initialize(trackerId);

            expect(mockLoadGoogleAnalyticsScript).not.toHaveBeenCalled();
        });

        it('should call ga.create', () => {
            const gaCreateSpy = jest.fn();
            loadGAUtil.loadGoogleAnalyticsScript();
            (global as any).window.ga.create = gaCreateSpy;

            initialize(trackerId);

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
        it('should call send with the passed in event', () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            initialize(trackerId);

            sendEvent({
                eventCategory: 'Videos',
                eventAction: 'play',
                eventLabel: 'Fall Campaign'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('sendPageView', () => {
        it('should call send with the path', () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            initialize(trackerId);

            sendPageView({
                path: 'some-path'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });

        it('should call send with the path and title when it exists', () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            initialize(trackerId);

            sendPageView({
                path: 'some-path',
                title: 'Some Path Page!'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('sendException', () => {
        it('should call send with the passed in exception', () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            initialize(trackerId);

            sendException({
                exDescription: 'Someone broke the app',
                exFatal: true
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('sendHit', () => {
        it('should call send with the passed in generic hit type and payload', () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            initialize(trackerId);

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
        it('should call send with the category, var, value', () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            initialize(trackerId);

            sendTimingEvent({
                timingCategory: 'Form',
                timingVar: 'completionTime',
                timingValue: '1234'
            });

            expect(sendSpy.mock.calls[0]).toMatchSnapshot();
        });

        it('should call send with the category, var, value and label when it exists', () => {
            const sendSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                send: sendSpy
            });

            initialize(trackerId);

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
        it('should call get with the passed in fieldName', () => {
            const getSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                get: getSpy
            });

            initialize(trackerId);

            const output = get('test-field');

            expect(getSpy).toHaveBeenCalled();
            expect(output).toBeUndefined();
        });

        it('should return the fieldValue if it exists', () => {
            const expectedOutput = { test: 2 };
            const getSpy = jest.fn().mockReturnValue(expectedOutput);
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                get: getSpy
            });

            initialize(trackerId);

            const output = get('test-field');

            expect(output).toEqual(expectedOutput);
        });
    });

    describe('getMany', () => {
        it('should call get once for each field name', () => {
            const getSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                get: getSpy
            });

            initialize(trackerId);

            getMany(['test-field', 'test-field2']);

            expect(getSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('set', () => {
        it('should call set with the field name and value', () => {
            const setSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                set: setSpy
            });

            initialize(trackerId);

            set('name', 'value');

            expect(setSpy).toHaveBeenCalled();
        });
    });

    describe('setMany', () => {
        it('should call set with a fieldsObject', () => {
            const setSpy = jest.fn();
            jest.spyOn(window.ga as any, 'create').mockReturnValue({
                set: setSpy
            });

            initialize(trackerId);

            setMany({
                allowAnchor: true,
                appId: 'test1234'
            });

            expect(setSpy).toMatchSnapshot();
        });
    });
});
