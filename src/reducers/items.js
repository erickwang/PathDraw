import { List, fromJS } from 'immutable';

const initialState = {
  //list: new List([initDraw]),
  list: new List([]),
  currentId: -1,
  segIndex: -1
};

export default function items(state = initialState, action) {
  console.log('reducer items');
  let item = state.list.get(state.currentId);
  switch (action.type) {
    case 'CHANGE_STROKE':
      item = { ...item, stroke: action.value };
      return { ...state, list: state.list.set(state.currentId, item) };
    case 'CHANGE_STROKE_WIDTH':
      item = { ...item, strokeWidth: action.value };
      return { ...state, list: state.list.set(state.currentId, item) };
    case 'CHANGE_FILL':
      item = { ...item, fill: action.value };
      return { ...state, list: state.list.set(state.currentId, item) };
    case 'EDIT_ITEM':
    case 'EDIT_ITEM_MICRO':
      return { ...state, list: state.list.set(action.index, action.data) };
    case 'EDIT_ITEM_ATTR':{
      let data = {...action.data}
      let str = data.type;
      str = 'get' + str.charAt(0).toUpperCase() + str.substr(1);
      data.d = createUtils[str](data);
      return { ...state, list: state.list.set(action.index, data) };
    }
    case 'TOGGLE_VISIBILITY':
      let objShow = state.list.get(action.index);
      objShow = { ...objShow, visible: !objShow.visible };
      return { ...state, list: state.list.set(action.index, objShow) };
      //dhanbal edit
    case 'TOGGLE_LOCK':
      let objLockShow = state.list.get(action.index);
      objLockShow = { ...objLockShow, lock: !objLockShow.lock };
      return { ...state, list: state.list.set(action.index, objLockShow) };
    case 'CHANGE_ANIMATION':
    default:
      return state;
  }
}