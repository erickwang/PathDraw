import React from 'react';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import Modal from './Modal';
import { setDimension, setStroke, setStrokeWidth, setFill, setOtherConfigProps } from '../../actions';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 300px;
  font-size: 0.8em;
   & > div {
    padding: 15px;
    border-bottom: 1px solid #006674;
  }
   .svgWidth {
    width: 60px;
  }
   .svgHeight {
    width: 60px;
  }
   .divider {
    margin: 0 10px;
    border-left: 1px solid #006674;
  }
   .stroke .form-control {
     width: 50px !important;
     padding:2px 2px!important;
  }
  .propertyWidth label {
   margin-left:10px;
 }
 & label {
  margin-bottom:5px;
}
`

let Properties = ({ dispatch, ...props }) => {
  if(!props.popups.properties){
    return null;
  }

  const setSegSize = e => {
    if(e.target.value >= 5 && e.target.value <= 40){
      dispatch(setOtherConfigProps('segSize', e.target.value));
    }
  }
  return (
    <Modal title="Properties" id="propertiesPanel" popupName={'properties'}>
    <Wrapper>
      <div className="propertyWidth">
        <label> Width : </label>
        <input
          className="form-control svgWidth"
          value={props.width}
          onChange={e => dispatch(setDimension(true, e.target.value))}
        />
        <label> Height : </label>
        <input
          className="form-control svgHeight"
          value={props.height}
          onChange={e => dispatch(setDimension(false, e.target.value))}
        /> <br />
      </div>
      <div className="stroke">
        <label> Stroke Color : </label>
        <CompactPicker
          style={{ display: 'inline-block' }}
          value={props.stroke}
          onChangeComplete={color => dispatch(setStroke(color.hex))}
        /><br />
        <br />
        <label> Stroke Weight : </label>
        <input
          className="form-control"
          type="number"
          value={props.strokeWidth}
          onChange={e => dispatch(setStrokeWidth(e.target.value))}
        /><br />
      </div>
      <div>
        <label> Fill Color : </label>
        <CompactPicker
          style={{ display: 'inline-block' }}
          onChangeComplete={color => dispatch(setFill(color.hex))}
        />
      </div>
      <div>
        <div>
          <label> Seg Size : </label>
          <input className="form-control" type="number"
            value={props.segSize}
            onChange={setSegSize} />
        </div>
        <div className="check">
          <input type = "checkbox" checked = {props.smoothCurve}
            onChange = {e => dispatch(setOtherConfigProps('smoothCurve', null))} />
          <label > Smooth Curve </label>
        </div>
      </div>
      </Wrapper>
    </Modal>
  		);
}

const mapStateToProps = ({ config }) => ({ ...config.present });

Properties = connect(mapStateToProps)(Properties);

export default Properties;
