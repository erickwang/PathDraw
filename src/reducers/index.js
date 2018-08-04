import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import undoable, {excludeAction} from 'redux-undo';
import config from './config';
import allDraws from './allDraws';
import items from './items';
import guide from './guide';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  config: undoable(config, {limit: 15}),
  allDraws: undoable(allDraws, {limit: 15, filter: excludeAction(['EDIT_ITEM_MICRO', 'TOGGLE_VISIBILITY', 'TOGGLE_LOCK'])}),
  //items: undoable(items, {limit: 15}),
  guide: undoable(guide, {limit: 15})
});

export default  createStore(rootReducer, composeEnhancers());
