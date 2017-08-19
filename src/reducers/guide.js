const initialState = {
  guideImg:'https://s-media-cache-ak0.pinimg.com/736x/e8/63/f7/e863f7204c7feea443051a124a4b3ca4--flower-clipart-flower-art.jpg',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  hRules: [],
  vRules: [],
  showRules: true,
  showGuide: false
};

export default function guide(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_GUIDE':
      return {...state, [action.property]: action.value};
    case 'CHANGE_RULES':
      let value = action.newVal.split(',').map(item => item.trim());
      return {...state, [action.ruleType]: value};
    case 'TOGGLE_GUIDE':
      if(action.property === 'ruler'){
        return {...state, showRules: !state.showRules}
      }else if ( action.property === 'guide'){
        return {...state, showGuide: !state.showGuide}
      }
      return state;
    default:
      return state;
  }
}
