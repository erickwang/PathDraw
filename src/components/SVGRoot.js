import React from 'react';
import { connect } from 'react-redux';
import anime from 'animejs';
import {toAnimationObj} from "../utils/animation";
import SvgControlsUI from './SvgControlsUI';
import Ruler from './Ruler';
import { insert, editItem, selectUnit} from '../actions';
import * as utils from '../utils';
import glamorous from 'glamorous';
const Wrapper = glamorous.div({
' #rootSvg':{
  backgroundColor: '#ddd'
},
' #content':{
  backgroundColor:'white'
}
})

class SVGRoot extends React.Component {

  keyboardOffset = 0;
  currentItem = null;
  isKeyDown = false;

  constructor(props){
    super(props);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onMoveKeyDown);
    document.addEventListener('keyup', this.onMoveKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onMoveKeyDown);
    document.removeEventListener('keyup', this.onMoveKeyUp);
  }

  onMoveKeyDown = e => {
    let {currentId, segIndex} = this.props.allDraws;
    if (currentId === -1 || segIndex !== -1) {
      return;
    }
    if (!(e.keyCode >= 37 && e.keyCode <= 40)) {
      return;
    }
    if (!this.keyboardOffset) {
      this.keyboardOffset = { x: 0, y: 0 };
    }
    this.isKeyDown = true;
    let changeBy;
    if(e.shiftKey){
      changeBy = 5;
    }else{
      changeBy = 1;
    }
    switch (e.keyCode) {
      case 37:
        this.keyboardOffset.x -= changeBy;
        break;
      case 38:
        this.keyboardOffset.y -= changeBy;
        break;
      case 39:
        this.keyboardOffset.x += changeBy;
        break;
      case 40:
        this.keyboardOffset.y += changeBy;
        break;
    }
    this.currentItem = this.props.allDraws.list.get(currentId);
    document.getElementById(this.currentItem.id).setAttribute('transform', `translate(${this.keyboardOffset.x},${this.keyboardOffset.y})`);
  }

  onMoveKeyUp = e => {
    if(e.keyCode === 27) { //escape key
      if(this.props.allDraws.currentId != -1){
        this.props.dispatch(selectUnit(-1));
      }
      return;
    }
    if (!this.isKeyDown) {
      return;
    }
    const data = utils.translate(utils.dataToObj(this.currentItem.d), this.keyboardOffset.x, this.keyboardOffset.y);
    const d = utils.objToData(data);
    const path = document.getElementById(this.currentItem.id);
    path.removeAttribute('transform');
    let newData = {...this.currentItem, d}
    this.props.dispatch(editItem(newData, this.props.allDraws.currentId));
    this.keyboardOffset = null;
  }
  

  startPane = e => {
    const content = document.getElementById('contentSvg');
    content.style.cursor = 'grabbing';
    const offset = {
      x: e.clientX - parseInt(content.getAttribute('x')),
      y: e.clientY - parseInt(content.getAttribute('y')),
    };


    const doPane = e => {
      content.setAttribute('x', e.clientX - offset.x);
      content.setAttribute('y', e.clientY - offset.y);
    }

    const endPane = e => {
      content.style.cursor = 'default';
      document.removeEventListener('mousemove', doPane);
      document.removeEventListener('mouseup', endPane);

      let currentItem = this.props.allDraws.list.get(this.props.allDraws.currentId);
      this.props.dispatch(editItem({...currentItem, history:false}, this.props.allDraws.currentId));
      //this.drawScale();
    }
    document.addEventListener('mousemove', doPane);
    document.addEventListener('mouseup', endPane);
  }

  addNewItem = (e) => {
    if(e.ctrlKey){
      this.startPane(e);
      return;
    }
    const {zoom, insertType, segSize} = this.props.config;
    this.newOne = document.createElement('rect');
    let pt = utils.toData({x: e.clientX, y: e.clientY}, null, zoom);
    let fillTemp = false;
    let data;
    let arr = [];
    if(insertType == "path"){
      data = 'M ' + pt.x + ' ' + pt.y + ' ';
      arr.push(pt.x, pt.y)
      utils.attr(this.tempPath, {display:'block', d:data});
    }else{
      utils.attr(this.tempContent, {display:'block', x: pt.x, y: pt.y, width: 0, height: 0});
    }
    
    const onMouseMove = (e) => {
      const pt2 = utils.toData({x: e.clientX, y: e.clientY}, null, zoom);
      if(insertType == 'path'){
        const dist = Math.sqrt(Math.pow(pt.x-pt2.x, 2) + Math.pow(pt.y-pt2.y, 2));
        if(fillTemp){
          fillTemp = false;
          data = data.substr(0, data.lastIndexOf('L'));
        }
        if(dist > segSize){
          data += 'L ' + pt2.x + ' ' + pt2.y + ' ';
          arr.push(pt2.x, pt2.y)
          pt = {...pt2};
        }else{
          fillTemp = true;
          data += 'L ' + pt2.x + ' ' + pt2.y + ' ';
        }
        utils.attr(this.tempPath, {display:'block', d:data});
      }else{
        utils.attr(this.tempContent, {x: (pt.x<pt2.x)?pt.x:pt2.x, y: (pt.y<pt2.y)?pt.y:pt2.y, width: Math.abs(pt2.x - pt.x), height:Math.abs( pt2.y - pt.y)}); 
      }
    }
    const onMouseUp = (e) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const pt2 = utils.toData({x: e.clientX, y: e.clientY}, null, zoom);
      if(insertType == 'path'){
        utils.attr(this.tempPath, {display:'none'});
        if(arr.length > 2 ){
          if(this.tempPath.getTotalLength() > 40){
            let d = utils.getSmoothPath(arr);
            this.props.dispatch(insert(insertType, d));
          }
        }
      }else{
        utils.attr(this.tempContent, {display:'none'});
        if(Math.abs(pt2.x - pt.x) < 40 && Math.abs(pt2.y - pt.y) < 40){
          return;
        }
        this.props.dispatch(insert(insertType, pt.x, pt.y, pt2.x, pt2.y));
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  componentDidUpdate() {
    console.log('this.props.config.animate', this.props.config.animate);
    if (this.props.config.animate != -1){
      const list = this.props.allDraws.list;
      list.forEach(item => {
        console.log('item', item);
        if(!item.animateData) return;
        var timeline = anime.timeline({loop: true, autoplay: true});
        const targets = document.querySelector('#'+ item.id);
        console.log('item.id', item.id, targets);
        const newObj = toAnimationObj(item.animateData.toJS());
        console.log(newObj, item.animateData.toJS())
        timeline.add({
          duration: 5000,
          rotate: 40,
          translateX: 0,
          translateY: 0,
          targets,
          easing: 'easeOutExpo'
        })
        /*
        newObj.forEach(unit => {
          timeline.add({
            ...unit,
            targets,
            easing: 'easeOutExpo'
          })
          console.log('timeline', timeline)
        })
        */
      })
    }
  }

  render(){
    const config = this.props.config;
    const guide = this.props.guide;
    let contentSvg;
    return (
      <svg id="rootSvg" width={window.innerWidth - 1} height={window.innerHeight - 20} strokeWidth="2" stroke="#c9c9ca" fill="none" >
        <svg
          id="contentSvg"
          ref={(n) => { contentSvg = n; }}
          width={config.width}
          height={config.height}
          x={(window.innerWidth - config.width) / 2 + 10}
          y={(window.innerHeight - config.height) / 2 + 10}
        >
          <rect onMouseDown = {this.addNewItem} width={config.width} height={config.height} x="0" y="0" fill="#ffffff" />
          <g id="guide" stroke="red" strokeWidth="1" display={(guide.showGuide===true)?'block':'none'} style = {{pointerEvents:'none'}}>
            <image href = {guide.guideImg} x={guide.x} y={guide.y}
              width={guide.width} height={guide.height} />
          </g>
          <svg id="content" ref = {n => {this.content = n}} stroke="blue" style={{pointerEvents: 'none'}}>
            {utils.dataToNode(this.props.allDraws.list)}
          </svg>
           <rect x1="0" y1="0" ref = {n => { this.tempContent = n}} width="0" height="0" stroke = "none" fill="#ffff00" fillOpacity= "0.3" />
           <path ref = {n => { this.tempPath = n}} d = "M 0 0 L 0 0" stroke="#ff0000" strokeOpacity="0.6" />
        </svg> 

        <SvgControlsUI parentRef={contentSvg} />
        <Ruler />
      </svg>
    );
  }
  
};

const mapStateToProps = ({ config, allDraws, guide }) => ({ config:config.present, allDraws:allDraws.present,
  guide: guide.present });

SVGRoot = connect(mapStateToProps)(SVGRoot);

export default SVGRoot;

