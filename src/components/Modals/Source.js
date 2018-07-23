import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal';
import {editSource} from '../../actions';
import styled from 'styled-components';

const Wrapper = styled.div`
	width: 600px;
	font-size: 0.8em;
	textarea {
		color: #006674;
		box-shadow: 4px 4px 4px #888;
		right: 0;
		top: 230px;
	}
	& footer {
		padding: 0px 20px 15px;
		text-align: right;
	}
	& .source {
    border: 1px solid gray;
    font-family: "Courier New", "Lucida Console", Monospace;
    margin: 20px 20px 0 20px;
    height: 400px;
     font-size: 16px;
    width: calc(100% - 42px);
  }
`

class Source extends React.Component {

	nodeRef;

	componentDidUpdate(){
		let {popups, width, height} = this.props.config;
		if(!popups.source){
			return;
		}
		let root = window.document.querySelector("#contentSvg #content");
	    let str = "<svg width = '" + width  + "' height = '" + height + "' >" + "\n";
	    for(let i = 0; i < root.childNodes.length; i++){
	      if(root.childNodes[i].nodeType == 1){
	        str += root.childNodes[i].outerHTML  + "\n";
	      }
	    }
	    str += "</svg>";
	    this.nodeRef.value = str;
	}

	render(){
		let {popups} = this.props.config;
		if(!popups.source){
			return null;
		}
		 return (
		    <Modal title = "Source" id = "sourcePanel" popupName = {'source'}>
		    	<Wrapper>
					<textarea className = "source" ref = {n => {this.nodeRef = n}} >
		            </textarea>
		              <footer>
		                <button className = "btn btn-primary" onClick = {e => this.props.dispatch(editSource(this.nodeRef.value))} > Update </button>
		              </footer>
		            </Wrapper>
				</Modal>
		  )
	}

}

const mapStateToProps = ({config}) => ({config: config.present});
Source = connect(mapStateToProps)(Source);

export default Source;