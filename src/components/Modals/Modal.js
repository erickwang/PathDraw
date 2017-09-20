import React from 'react';
import { CompactPicker } from 'react-color';
import { connect } from 'react-redux';

import { showPopup } from '../../actions';


import glamorous from 'glamorous';

const Wrapper = glamorous.div({
  position: 'absolute',
  backgroundColor: '#ddd',
  display: 'inline-block',
  color: '#006674',
  border: '1px solid #c9c9ca',
  fontSize: '0.8em',
  boxShadow: '0 0 10px #888',
  left: 700,
  top: 230,

  header: {
      backgroundColor: '#006674',
      padding: 5,
      color: 'white',
      i: {
          display: 'inline-block',
          float: 'right'
      }
  },

  section: {
    maxHeight: 600,
    overflow: 'auto'
  }
})


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
