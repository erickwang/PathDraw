import React from 'react';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';
import { showPopup } from '../../actions';
import styled from 'styled-components';

 const Wrapper = styled.div`
 position: absolute;
 background-color: #ddd;
 display: inline-block;
 color: #006674;
 border: 1px solid #006674;
 font-size: 1em;
 box-shadow: 0 5px 10px rgba(0,0,0,0.50);
 left: 700px;
 top: 230px;
  & header {
     background-color: #006674;
     padding: 5px;
     color: white;
     & i {
         display: inline-block;
         float: right;
     }
 }
& > div {
   padding: 15px;
 }
 & button {
   margin: 5px 0 5px 5px;
 }
 & section {
   max-height: 600px;
 }
 `
 
let Modal = (props) => {
  let dragPanel,
    rootBox,
    dragOffset;

  const panelDragStart = (e) => {
    e.preventDefault();
    dragPanel = e.currentTarget.parentNode;
    dragOffset = {
      x: e.clientX - dragPanel.getBoundingClientRect().left,
      y: e.clientY - dragPanel.getBoundingClientRect().top,
    };
    rootBox = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
    document.addEventListener('mousemove', panelDragMove);
    document.addEventListener('mouseup', panelDragStop);
  };

  const panelDragMove = (e) => {
    let x = e.clientX - dragOffset.x;
    if (x < rootBox.left) x = rootBox.left;
    if (x > rootBox.left + rootBox.width - dragPanel.getBoundingClientRect().width) {
      x = rootBox.left + rootBox.width - dragPanel.getBoundingClientRect().width;
    }

    let y = e.clientY - dragOffset.y + window.scrollY;
    if (y < rootBox.top) y = rootBox.top;
    if (y > rootBox.top + rootBox.height - dragPanel.getBoundingClientRect().height) {
      y = rootBox.top + rootBox.height - dragPanel.getBoundingClientRect().height;
    }
    dragPanel.style.left = `${x}px`;
    dragPanel.style.top = `${y}px`;
  };

  const panelDragStop = (e) => {
    document.removeEventListener('mousemove', panelDragMove);
    document.removeEventListener('mouseup', panelDragStop);
  };

  return (
    <Wrapper id={props.id}>
      <header onMouseDown={panelDragStart}>
        <h4> {props.title}            <i onClick={e => props.dispatch(showPopup(props.popupName, false))} className="fa fa-times" aria-hidden="true" /></h4>
      </header>
      <section>
      {props.children}
      </section>
    </Wrapper>
  );
};

Modal = connect()(Modal);

export default Modal;
