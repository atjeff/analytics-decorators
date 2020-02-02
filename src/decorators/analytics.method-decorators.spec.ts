jest.mock('../analytics.core.ts');

import { sendEvent, sendException, sendHit, sendPageView, sendTimingEvent } from '../analytics.core';
import { GoogleAnalyticsHitTypes } from '../models/ga-hit-types.enum';
import {
    TrackAnalyticsEvent,
    TrackAnalyticsException,
    TrackAnalyticsHit,
    TrackAnalyticsPageView,
    TrackAnalyticsTimingEvent
} from './analytics.method-decorators';

describe('Analytics Method Decorators', () => {
    describe('createMethodDecorator', () => {
        it(`should not call the output function if a value isn't returned`, () => {
            class TestTrackAnalyticsEvent {
                @TrackAnalyticsEvent(undefined)
                testMethod() {}
            }

            new TestTrackAnalyticsEvent().testMethod();

            expect(sendEvent).not.toHaveBeenCalled();
        });
    });

    describe('TrackAnalyticsEvent', () => {
        beforeEach(() => (sendEvent as jest.MockedFunction<typeof sendEvent>).mockClear());
        it('should call sendEvent with the passed in event', () => {
            class TestTrackAnalyticsEvent {
                @TrackAnalyticsEvent({
                    eventCategory: 'Videos',
                    eventAction: 'play',
                    eventLabel: 'Fall Campaign'
                })
                testMethod() {}
            }

            new TestTrackAnalyticsEvent().testMethod();

            expect(sendEvent).toMatchSnapshot();
        });

        it('should call the passed in function and call sendEvent with the result', () => {
            class TestTrackAnalyticsEvent {
                @TrackAnalyticsEvent(() => ({
                    eventCategory: 'Videos from a function',
                    eventAction: 'play from a function',
                    eventLabel: 'Fall Campaign from a function'
                }))
                testMethod() {}
            }

            new TestTrackAnalyticsEvent().testMethod();

            expect(sendEvent).toMatchSnapshot();
        });
    });

    describe('TrackAnalyticsPageView', () => {
        beforeEach(() => (sendPageView as jest.MockedFunction<typeof sendPageView>).mockClear());
        it('should call sendPageView with the passed in event', () => {
            class TestTrackAnalyticsPageView {
                @TrackAnalyticsPageView({
                    path: 'somePage/deeperPage',
                    title: 'Page title'
                })
                testMethod() {}
            }

            new TestTrackAnalyticsPageView().testMethod();

            expect(sendPageView).toMatchSnapshot();
        });

        it('should call the passed in function and call sendPageView with the result', () => {
            class TestTrackAnalyticsPageView {
                @TrackAnalyticsPageView(() => ({
                    path: 'somePage/deeperPage from a function',
                    title: 'Page title from a function'
                }))
                testMethod() {}
            }

            new TestTrackAnalyticsPageView().testMethod();

            expect(sendPageView).toMatchSnapshot();
        });
    });

    describe('TrackAnalyticsHit', () => {
        beforeEach(() => (sendHit as jest.MockedFunction<typeof sendHit>).mockClear());
        it('should call sendHit with the passed in event', () => {
            class TestTrackAnalyticsHit {
                @TrackAnalyticsHit({
                    hitType: GoogleAnalyticsHitTypes.exception,
                    fieldsObject: {
                        exDescription: 'Some guy triggered a form error!',
                        exFatal: false
                    }
                })
                testMethod() {}
            }

            new TestTrackAnalyticsHit().testMethod();

            expect(sendHit).toMatchSnapshot();
        });

        it('should call the passed in function and call sendHit with the result', () => {
            class TestTrackAnalyticsHit {
                @TrackAnalyticsHit(() => ({
                    hitType: GoogleAnalyticsHitTypes.exception,
                    fieldsObject: {
                        exDescription: 'Some guy triggered a form error! From a function',
                        exFatal: false
                    }
                }))
                testMethod() {}
            }

            new TestTrackAnalyticsHit().testMethod();

            expect(sendHit).toMatchSnapshot();
        });
    });

    describe('TrackAnalyticsException', () => {
        beforeEach(() => (sendException as jest.MockedFunction<typeof sendException>).mockClear());
        it('should call sendException with the passed in event', () => {
            class TestTrackAnalyticsException {
                @TrackAnalyticsException({
                    exDescription: 'Some guy triggered a form error!',
                    exFatal: false
                })
                testMethod() {}
            }

            new TestTrackAnalyticsException().testMethod();

            expect(sendException).toMatchSnapshot();
        });

        it('should call the passed in function and call sendException with the result', () => {
            class TestTrackAnalyticsException {
                @TrackAnalyticsException(() => ({
                    exDescription: 'Some guy triggered a form error! From a function',
                    exFatal: false
                }))
                testMethod() {}
            }

            new TestTrackAnalyticsException().testMethod();

            expect(sendException).toMatchSnapshot();
        });
    });

    describe('TrackAnalyticsTimingEvent', () => {
        beforeEach(() => (sendTimingEvent as jest.MockedFunction<typeof sendTimingEvent>).mockClear());
        it('should call sendTimingEvent with the passed in event', () => {
            class TestTrackAnalyticsTimingEvent {
                @TrackAnalyticsTimingEvent({
                    timingCategory: 'category',
                    timingVar: 'lookup',
                    timingValue: 123
                })
                testMethod() {}
            }

            new TestTrackAnalyticsTimingEvent().testMethod();

            expect(sendTimingEvent).toMatchSnapshot();
        });

        it('should call the passed in function and call sendTimingEvent with the result', () => {
            class TestTrackAnalyticsTimingEvent {
                @TrackAnalyticsTimingEvent(() => ({
                    timingCategory: 'category from a function',
                    timingVar: 'lookup from a function',
                    timingValue: 123
                }))
                testMethod() {}
            }

            new TestTrackAnalyticsTimingEvent().testMethod();

            expect(sendTimingEvent).toMatchSnapshot();
        });
    });
});
