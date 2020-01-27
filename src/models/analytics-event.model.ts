export interface AnalyticsEvent {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
    eventValue?: number;
    nonInteraction?: boolean;
}
