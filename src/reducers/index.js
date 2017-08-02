import { combineReducers } from 'redux';
import undoable, {excludeAction} from 'redux-undo';

import config from './config';
import allDraws from './allDraws';
import guide from './guide';

const rootReducer = combineReducers({
  config: undoable(config, {limit: 15}),
  allDraws: undoable(allDraws, {limit: 15, filter: excludeAction(['EDIT_ITEM_MICRO', 'TOGGLE_VISIBILITY'])}),
  guide: undoable(guide, {limit: 15})
});

export default rootReducer;
