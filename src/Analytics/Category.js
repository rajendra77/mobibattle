import {events, screen} from '../Analytics/EventName';

export function cancatCategory(screenName, eventName) {
    // console.log('----cancatCategory----->', screenName, eventName);
    const concated = screen[screenName] + "_" + events[eventName];
    // console.log('--------concated------>', concated);
    return concated;
}