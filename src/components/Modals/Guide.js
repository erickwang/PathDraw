import React from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';
import { changeGuide, changeRules, toggleGuide } from '../../actions';


import glamorous from 'glamorous';

const Wrapper = glamorous.div({
  width: 300,
  '& > div': {
    padding: 15,
    borderBottom: '1px solid #006674'
  },
  'input[type=number]': {
    width: 50
  },
  '.guideForm' : {
    '.guideXY': {
      margin: 10,
      label: {
        marginLeft: 26
      },
      '#x': {
        marginRight: 14
      }
    },
    '.guideWidth': {
      marginTop: 10,
      label: {
        marginLeft: 12
      }
    }
  },
  '.form-control': {
    padding: '2px 2px'
  }
})




let Guide = props => {
  if(!props.popups.guide){
    return null;
  }

  let guideImageRef = null;
  let xRef = null;
  let yRef = null;
  let widthRef = null;
  let heightRef = null;
  let hLineRef = null;
  let vLineRef = null;
  let guideToggleRef = null;
  let rulerToggleRef = null;

  const onGuideChange = e => {
    if(e.target === guideImageRef){
      props.dispatch(changeGuide("guideImg", e.target.value));
    }else if(e.target === xRef){
      props.dispatch(changeGuide("x", e.target.value));
    }else if(e.target === yRef){
      props.dispatch(changeGuide("y", e.target.value));
    }else if(e.target === widthRef){
      props.dispatch(changeGuide("width", e.target.value));
    }else if(e.target === heightRef){
      props.dispatch(changeGuide("height", e.target.value));
    }
  }

  const onRulesChange = e => {
    let value = e.target.value;
    if(e.target === hLineRef){
      props.dispatch(changeRules("hRules", e.target.value));
    }else if(e.target ===vLineRef){
      props.dispatch(changeRules("vRules", e.target.value));
    }
  }

  const onToggle = e => {
    if(e.target === guideToggleRef){
      props.dispatch(toggleGuide('guide'));
    }else if(e.target === rulerToggleRef){
      props.dispatch(toggleGuide('ruler'));
    }
  }

  const {guideImg, x, y, width, height} = props.guide;
  const {hRules, vRules, showGuide, showRules} = props.guide;
  return (
      <Modal title="Guide" id="guidePanel" popupName={'guide'} >
        <Wrapper>
        <div>
          <input type='text' className="form-control" value ={guideImg}
            ref = {n => {guideImageRef = n}} onChange = {onGuideChange}/>
        </div>
          <div className = "guideForm" >
          <div className="guideXY">
            <label>X:</label>
            <input className="form-control" type = "number" ref = {n => {xRef = n}}
              value = {x} 
              onChange = {onGuideChange}/>
            <label>Y:</label>
            <input className="form-control" type = "number" ref = {n => {yRef = n}} 
              value = {y} 
              onChange = {onGuideChange}/>
        </div>
        <div className=" guideWidth" >
            <label >Width:</label>
            <input className="form-control" type = "number" ref = {n => {widthRef = n}} 
              value = {width} 
              onChange = {onGuideChange}/>
            <label>Height:</label>
            <input className="form-control" type = "number" ref = {n => {heightRef = n}}
              value = {height} 
              onChange = {onGuideChange}/>
          </div>
          </div>

          <div >
            <label>Horizontal GuideLines : </label>
              <input className="form-control"  type = "text" ref = {n => {hLineRef = n}}
                onChange = {onRulesChange}
                value = {hRules.join(',')} />

            <label  className="verti">Vertical GuideLines : </label>
              <input className="form-control "  type = "text" ref = {n => {vLineRef = n}}
                onChange = {onRulesChange}
                value = {vRules.join(',')} />
        </div>

        <div className="check" >
        <input type = "checkbox" checked = {showGuide} ref = {n => {guideToggleRef = n}}
          onChange = {onToggle} />
          <label> Show Guide </label> 

          <input type = "checkbox" checked = {showRules} ref = {n => {rulerToggleRef = n}}
            onChange = {onToggle} />
          <label > Show Ruler </label>
    </div>
    </Wrapper>
      </Modal>
            )
};

const mapStateToProps = ({ config, guide}) => {
  return ({
    popups: config.present.popups,
    guide: guide.present
  });
}

Guide = connect(mapStateToProps)(Guide);

export default Guide;
