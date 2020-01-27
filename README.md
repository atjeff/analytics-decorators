# analytics-decorators

Heavily inspired by [react-ga](https://github.com/react-ga/react-ga)

### Example
```ts
interface Props {
    currentPage: string;
    currentPageTitle: string;
}

interface State {
    formError: boolean;
}

class ReactComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            formError: false
        };
    }

    @TrackAnalyticsEvent({
        eventCategory: 'Videos',
        eventAction: 'play',
        eventLabel: 'Fall Campaign'
    })
    onButtonClick() {}

    @TrackAnalyticsPageView<ReactComponent>(({ props }) => ({
        path: props.currentPage,
        title: props.currentPageTitle
    }))
    routeToPage() {}

    @TrackAnalyticsHit<ReactComponent>(({ state }) => {
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

    @TrackAnalyticsTimingEvent<ReactComponent>({
        timingCategory: 'category',
        timingVar: 'lookup',
        timingValue: 123
    })
    onProcessingFinished() {}
}
```