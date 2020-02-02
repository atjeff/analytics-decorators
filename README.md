# analytics-decorators

A Typescript library that provides methods and decorators to interact with Google's Universal Analytics [(Analytics.js)](https://developers.google.com/analytics/devguides/collection/analyticsjs). 

### Installation

```bash
# Using `yarn`
yarn add analytics-decorators

# Using `npm`
npm install --save analytics-decorators
```

### Usage
Initializing GA:
```ts
import { initialize } from 'analytics-decorators';

initialize('UA-000000000-0').then(() => console.log(`Let's track some stuff`));
```

You can also choose to load GA manually with the tracking script provided [here](https://developers.google.com/analytics/devguides/collection/analyticsjs). Which removes the need to wait for initialize to resolve.


### Example usage with React
```ts
import {
    Field,
    initialize,
    TrackAnalyticsEvent,
    TrackAnalyticsHit,
    TrackAnalyticsPageView,
    TrackAnalyticsTimingEvent,
    UseTrackerFields
} from 'analytics-decorators';
import { GoogleAnalyticsHitTypes } from 'analytics-decorators';
import React from 'react';

interface Props {
    currentPage?: string;
    currentPageTitle?: string;
}

interface State {
    formError: boolean;
}

export class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            formError: false
        };

        initialize('UA-000000000-0').then(() => console.log(`Let's track some stuff`));

        testMethod('test1');

        this.onButtonClick = this.onButtonClick.bind(this);
        this.routeToPage = this.routeToPage.bind(this);
        this.differentPossibilitiesFunction = this.differentPossibilitiesFunction.bind(this);
        this.onProcessingFinished = this.onProcessingFinished.bind(this);
    }

    @TrackAnalyticsEvent({
        eventCategory: 'Videos',
        eventAction: 'play',
        eventLabel: 'Fall Campaign'
    })
    onButtonClick() {}

    @TrackAnalyticsPageView<App>(({ props }) => ({
        path: 'test/test',
        title: 'Home Page'
    }))
    routeToPage() {}

    @TrackAnalyticsHit<App>(({ state }) => {
        const hitType = state.formError ? GoogleAnalyticsHitTypes.exception : GoogleAnalyticsHitTypes.event;

        return {
            hitType,
            fieldsObject: {
                exDescription: 'Some guy triggered a form error!',
                exFatal: false
            }
        };
    })
    differentPossibilitiesFunction() {}

    @TrackAnalyticsTimingEvent<App>({
        timingCategory: 'category',
        timingVar: 'lookup',
        timingValue: 123
    })
    onProcessingFinished() {}

    @UseTrackerFields()
    testMethod(param1: string, @Field('testFieldName') param2?: string) {
        console.log(param1, param2); // test1, valueReturnedFromTracker
    }

    render() {
        return (
            <div>
                <button onClick={this.onButtonClick}>onButtonClick</button>

                <button onClick={this.routeToPage}>routeToPage</button>

                <button onClick={this.differentPossibilitiesFunction}>differentPossibilitiesFunction</button>

                <button onClick={this.onProcessingFinished}>onProcessingFinished</button>
            </div>
        );
    }
}
```