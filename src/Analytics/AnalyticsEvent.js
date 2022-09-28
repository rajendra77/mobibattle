import ReactGA from "react-ga";
import { concatAction } from '../Analytics/Action';
import { cancatCategory } from '../Analytics/Category';

export function logEvent(catObj, actionObj) {
    // console.log('--------obj------->', catObj, actionObj);
    const category = cancatCategory(catObj.screen, catObj.event);
    const action = concatAction(actionObj);
    console.log('-------category------->', category, action);
    ReactGA.event({
        category,
        action
      });   
}

