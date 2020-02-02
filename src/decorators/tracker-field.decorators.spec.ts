jest.mock('../analytics.core.ts');

import * as analyticsCore from '../analytics.core';
import { Field, UseTrackerFields } from './tracker-field.decorators';

describe('Tracker Field Decorators', () => {
    describe('UseTrackerFields', () => {
        it(`should not modify any arguments if they don't have metadata`, () => {
            const args = ['test1', 'test2'];
            const calledSpy = jest.fn();

            class TestUseTrackerFields {
                @UseTrackerFields()
                testMethod(arg1: string, arg2: string) {
                    calledSpy(arg1, arg2);
                }
            }

            new TestUseTrackerFields().testMethod(args[0], args[1]);

            expect(calledSpy).toMatchSnapshot();
        });

        it(`should replace a specified key param with its value`, () => {
            const args = ['test1', 'test2'];
            const fieldName = 'appId';
            const fieldValue = 'app-id-1234';
            const calledSpy = jest.fn();
            const getSpy = jest.spyOn(analyticsCore, 'get').mockReturnValue(fieldValue);

            class TestUseTrackerFields {
                @UseTrackerFields()
                testMethod(arg1: string, @Field(fieldName) arg2: string) {
                    calledSpy(arg1, arg2);
                }
            }

            new TestUseTrackerFields().testMethod(args[0], args[1]);

            expect(calledSpy).toMatchSnapshot();
            expect(getSpy).toHaveBeenCalled();

            getSpy.mockRestore();
        });

        it(`should replace an array of keys param with their values`, () => {
            const args = ['test1', 'test2'];
            const fieldNames = ['appId', 'appVersion'];
            const fieldValues = ['app-id-1234', '4.2.0'];
            const fieldsResponse = { [fieldNames[0]]: fieldValues[0], [fieldNames[1]]: fieldValues[1] };
            const calledSpy = jest.fn();
            const getManySpy = jest.spyOn(analyticsCore, 'getMany').mockReturnValue(fieldsResponse);

            class TestUseTrackerFields {
                @UseTrackerFields()
                testMethod(arg1: string, @Field(fieldNames) arg2) {
                    calledSpy(arg1, arg2);
                }
            }

            new TestUseTrackerFields().testMethod(args[0], args[1]);

            expect(calledSpy).toMatchSnapshot();
            expect(getManySpy).toHaveBeenCalled();
        });

        it(`shouldn't replace anything if get doesn't return values`, () => {
            const args = ['test1', 'test2'];
            const fieldName = 'appId';
            const calledSpy = jest.fn();

            class TestUseTrackerFields {
                @UseTrackerFields()
                testMethod(arg1: string, @Field(fieldName) arg2: string) {
                    calledSpy(arg1, arg2);
                }
            }

            new TestUseTrackerFields().testMethod(args[0], args[1]);

            expect(calledSpy).toMatchSnapshot();
        });
    });
});
