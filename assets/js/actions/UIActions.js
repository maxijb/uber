import {default as pubsub} from '../dispatcher/Dispatcher';
import {actions, events, urls} from '../constants/Constants';

var UIActions = {

  /**
   * first Load of the application
   */
  appLoad() {
    pubsub.emit(actions.appLoad);
  },


};

export default UIActions;