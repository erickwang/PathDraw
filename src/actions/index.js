let nextId = 100;
const currentId = 0;

// Actions from Toolbar

export const changeInsertType = insertType => ({
  type: 'CHANGE_INSERT_TYPE',
  insertType
})

export const insert = (insertType, ptx = 0, pty = 0, pt2x = 0, pt2y = 0 ) => ({
  type: 'INSERT',
  insertType,
  nextId: nextId++,
  ptx,
  pty,
  pt2x,
  pt2y
});

export const remove = (isAll, id) => ({
  type: 'REMOVE',
  isAll,
  currentId
});

export const showPopup = (popupName, isShow = true) => ({
  type: 'SHOW_POPUP',
  popupName,
  isShow
});

export const zoom = zoomType => ({
  type: 'ZOOM',
  zoomType
});

// Actions from Properties Panel


export const setDimension = (isWidth, value) => ({
  type: 'CHANGE_DIMENSION',
  isWidth,
  value
});

export const setStroke = value => ({
  type: 'CHANGE_STROKE',
  value
});

export const setStrokeWidth = value => ({
  type: 'CHANGE_STROKE_WIDTH',
  value
});

export const setFill = value => ({
  type: 'CHANGE_FILL',
  value
});

export const setOtherConfigProps = (property, value) => ({
  type: 'OTHER_CONFIG_PROPS',
  property,
  value
});

export const selectUnit = index => ({
  type: 'SELECT_UNIT',
  index
});

export const changeStackOrder = isUp => ({
  type: 'CHANGE_STACK_ORDER',
  isUp
});

export const editItem = (data, index) => ({
  type: 'EDIT_ITEM',
  data,
  index
});
//editItemMicro is only to avoid pushing into undo stack
export const editItemMicro = (data, index) => ({
  type: 'EDIT_ITEM_MICRO',
  data,
  index
});

export const editItemAttr = (data, index) => ({
  type: 'EDIT_ITEM_ATTR',
  data,
  index
});

export const selectPathSeg = index => ({
  type: 'SELECT_PATH_SEG',
  index
});

export const higherEdit = () => ({
  type: 'HIGHER_EDIT'
});

export const editSource = svgStr => ({
  type: 'EDIT_SOURCE',
  svgStr
});

export const toggleVisibility = index => ({
  type: 'TOGGLE_VISIBILITY',
  index
});

export const toggleLock = index => ({
  type: 'TOGGLE_LOCK',
  index
});

export const changeGuide = (property, value) => ({
  type: 'CHANGE_GUIDE',
  property,
  value
});

export const changeRules = (ruleType, newVal) => ({
  type: 'CHANGE_RULES',
  ruleType,
  newVal
});

export const toggleGuide = property => ({
  type: 'TOGGLE_GUIDE',
  property
});