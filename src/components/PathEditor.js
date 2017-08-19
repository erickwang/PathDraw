import React, {Component} from 'react';
import { connect } from 'react-redux';

import * as utils from '../utils';
import segUtils from '../utils/segUtils';

import { editItem, selectPathSeg } from '../actions';

class PathEditor extends Component{
  constructor(props){
    super(props);
    const list = utils.dataToObj(props.data.d);
    this.state = {
      list,
      tempValue: (this.props.segIndex !== -1) ? this.getSegStr(list[this.props.segIndex]) : ''
    }
  }

  componentWillReceiveProps(newProps){
    const list = utils.dataToObj(newProps.data.d);
    this.state = {
      list,
      tempValue: (newProps.segIndex !== -1) ? this.getSegStr(list[newProps.segIndex]) : ''
    }
  }

  changeMicroType = (type) => {
    const newData = segUtils.modifyItem(this.state.list, this.props.segIndex, type);
    this.props.dispatch(editItem({...this.props.data, d: utils.objToData(newData)}, this.props.index));
  };

  attrChange = (type, e) => {
    const newData = { ...this.props.data, [type]: e.target.value };
    this.props.dispatch(editItem(newData, this.props.index));
  };

  placeCtrls = (e) => {
    if (e && e.target && e.target.id) {
      let id = e.target.id;
      id = parseInt(id.substr(id.indexOf('~') + 1));
      if (isNaN(id)) {
        return;
      }
      this.props.dispatch(selectPathSeg(id));
    }
  };

  getSegStr = item => {
    console.log("getSegStr");
    console.dir(item);
    try{
      switch (item.type.toUpperCase()){
        case 'M':
        case 'L':
        case 'T':
          return `${item.type} ${Math.round(item.x)} ${Math.round(item.y)}`;
        case 'H':
        case 'V':
          return `${item.type} ${Math.round(item.val)}`;
        case 'C':
          return (`${item.type} ${Math.round(item.ctx)} ${Math.round(item.cty)} `
            +`${Math.round(item.ct2x)} ${Math.round(item.ct2y)} `
            +`${Math.round(item.x)} ${Math.round(item.y)}`);
        case 'Q':
        case 'S':
          return `${item.type} ${Math.round(item.ctx)} ${Math.round(item.cty)} `
            + `${Math.round(item.x)} ${Math.round(item.y)}`;
        case 'Z':
          return `${item.type}`;
      }
    }catch(e){
      console.log("ERROR");
      return 'error'
    }
  }

  onSegChange = e => {
    const str = e.target.value;
    const regEx = /[MLCQSTHVAZ][\-?0-9\s]+/ig;
    if(regEx.test(str)){
      const obj = utils.dataToObjUnit(str);
      console.log("onSegChange");
      console.dir(obj);
      if(obj){
        this.state.list[this.props.segIndex] = obj;
        this.props.dispatch(editItem({...this.props.data, d: utils.objToData(this.state.list)}, this.props.index));
      }else{
        this.setState({tempValue: str});
      }
    }else{
      this.setState({tempValue: str});
    }
  }


  render(){
    const btnGroupStyle = {
      pointerEvents: (this.props.segIndex === -1) ? 'none' : 'auto',
      opacity: (this.props.segIndex === -1) ? 0.5 : 1
    }
    return (
      <div className="pathListWrapper">
        <div className="dWrapper">
          <label>data : </label>
          <textarea className = "form-control"
            type="text"
            value={this.props.data.d}
            onChange={ e => this.attrChange('d', e)}
          />
        </div>
        <div className="btnWrapper">
          <span style = {btnGroupStyle} >
            <button onClick={() => this.changeMicroType('C')} className="form-control"> C </button>
            <button onClick={() => this.changeMicroType('Q')} className="form-control"> Q </button>
            <button onClick={() => this.changeMicroType('L')} className="form-control"> L </button>
            <button onClick={() => this.changeMicroType('Insert')} className="form-control"> Insert After </button>
            <button onClick={() => this.changeMicroType('Delete')} className="form-control"> Delete </button>
          </span>
        </div>
        <ol onClick={this.placeCtrls} >
        {
          this.state.list.map((item, i) => {
            let node;
            if(i == this.props.segIndex){
              return (<li key={`seg~${i}`} id={`seg~${i}`} ><input type="text" 
                className = 'selected form-control' style = {{width:'100%'}}
                value = {this.state.tempValue} onChange={this.onSegChange} /></li>)
            }else{
               return <li key={`seg~${i}`} id={`seg~${i}`} >{this.getSegStr(item)} </li>;
            }
          })
        }
        </ol>
      </div>
    );
  }
}

const mapStateToProps = ({ allDraws, config }) => ({ data: allDraws.present.list.get(allDraws.present.currentId),
  index: allDraws.present.currentId,
  segIndex: allDraws.present.segIndex
});

PathEditor = connect(mapStateToProps)(PathEditor);

export default PathEditor;
