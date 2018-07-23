import React from 'react';
import { connect } from 'react-redux';
import Modal from './Modal';
import { selectUnit, changeStackOrder, toggleVisibility, toggleLock } from '../../actions';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #ddd;
  max-height: 600px;
  width: 236px;

  & li:hover, & .selected {
    background-color: #ffff99,
  }

  & li {
    background-color: #ddf;
    color: #333;
    font-size:1em;
    cursor: default;
    padding: 5px 10px;
  }
  & footer > button {
    margin: 30px 5px 10px 5px;
  }
`

let AllDraws = ({ allDraws, popups, dispatch }) => {
  if(!popups.allDraws){
    return null;
  }
  const onItemClick = (e) => {
    let id = e.target.id;
    id = parseInt(id.substr(id.indexOf('~') + 1));
    if (!isNaN(id)) {
      dispatch(selectUnit(id));
    }
  };

  const showDraw = (id) => {
      dispatch(toggleVisibility(id));
  };
 
   const showLockDraw = (id) => { 
      dispatch(toggleLock(id));
  };

  const hideDraw = (id) => {
      dispatch(hideSelected(id));
  };

  const iconStyle = {
    float: 'right',
    fontSize: '1.3em'
  }

  return (
    <Modal title="All Drawings " id="allDrawsPanel" isVisible={popups.allDraws} popupName={'allDraws'}>
      <Wrapper>
        <ol id="unitDraw" onClick={onItemClick} >
          {
            allDraws.list.map((item, i) => { 
              const className = (i === allDraws.currentId) ? 'selected' : '';
              const iconClass = 'fa ' + (item.visible ? 'fa-eye' : 'fa-eye-slash');
              const iconLock = 'fa ' + (item.lock ? 'fa-unlock-alt' : 'fa-lock');
              return (
                  <li key={i} id={`draw~${i}`} className={className} > {item.type} | {item.id}
                    {' '} <i className={iconClass} style = {iconStyle} aria-hidden="true" 
                      onClick={e => dispatch(toggleVisibility(i))} />
                     {' '} <i className={iconLock} style = {iconStyle} aria-hidden="true" 
                        onClick={e => dispatch(toggleLock(i))} />
                   </li>
                )
            })
          }
        </ol>
        <footer>
          <button className="btn btn-primary" onClick={e => dispatch(changeStackOrder(true))} >
            <i className="fa fa-arrow-up" aria-hidden="true" />
                Move Up
              </button>
          <button className="btn btn-primary" onClick={e => dispatch(changeStackOrder(false))} >
            <i className="fa fa-arrow-down" aria-hidden="true" />
                Move Down
              </button>
        </footer>
      </Wrapper>
    </Modal>
  );
};

const mapStateToProps = ({ config, allDraws }) => ({ allDraws: allDraws.present, popups: config.present.popups });

AllDraws = connect(mapStateToProps)(AllDraws);

export default AllDraws;
