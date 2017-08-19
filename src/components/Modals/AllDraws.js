import React from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';
import { selectUnit, changeStackOrder, toggleVisibility } from '../../actions';

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

  const hideDraw = (id) => {
      dispatch(hideSelected(id));
  };

  const iconStyle = {
    float: 'right',
    fontSize: '1.3em'
  }

  return (
    <Modal title="All Drawings " id="allDrawsPanel" isVisible={popups.allDraws} popupName={'allDraws'}>
      <ol id="unitDraw" onClick={onItemClick} >
        {
          allDraws.list.map((item, i) => {
            const className = (i === allDraws.currentId) ? 'selected' : '';
            const iconClass = 'fa ' + (item.visible ? 'fa-eye' : 'fa-eye-slash');
            return (
                <li key={i} id={`draw~${i}`} className={className} > {item.type} | {item.id}
                  {' '}<i className={iconClass} style = {iconStyle} aria-hidden="true" onClick={e =>dispatch(toggleVisibility(i))} />
                </li>
              )
          })
        }
      </ol>
      <div>
        <button className="btn btn-primary" onClick={e => dispatch(changeStackOrder(true))} id="upStackOrder" >
          <i className="fa fa-arrow-up" aria-hidden="true" />
              Move Up
            </button>
        <button className="btn btn-primary" onClick={e => dispatch(changeStackOrder(false))} id="downStackOrder">
          <i className="fa fa-arrow-down" aria-hidden="true" />
              Move Down
            </button>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({ config, allDraws }) => ({ allDraws: allDraws.present, popups: config.present.popups });

AllDraws = connect(mapStateToProps)(AllDraws);

export default AllDraws;
