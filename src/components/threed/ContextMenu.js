import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import {hideContextMenu, deleteObject, duplicateObject, editObjectName} from '../../actions/threed';

const Container = styled.div`
  position: fixed;
  background-color: #d8d8d8;
  border: solid 1px #979797;
  min-width: 150px;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  margin-bottom: -1px;
`;

const Option = styled.div`
  border-bottom: solid 1px #979797;
  padding: 12px;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

class ContextMenu extends React.Component {
  containerRef = React.createRef();

  onDuplicateClick = (e) => {
    const { object, hideContextMenu, duplicateObject } = this.props;
    e.stopPropagation();
    duplicateObject(object);
    hideContextMenu();
  }

  onRenameClick = (e) => {
    const { object, hideContextMenu, editObjectName } = this.props;
    e.stopPropagation();
    editObjectName(object);
    hideContextMenu();
  }

  onDeleteClick = (e) => {
    const { object, hideContextMenu, deleteObject } = this.props;
    e.stopPropagation();
    deleteObject(object);
    hideContextMenu();
  }

  getMenuPosition() {
    const {position = {}} = this.props;
    let x = (position.x || 0) - 12;
    let y = (position.y || 0) + 12;

    if (!this.containerRef.current) {
      return {x, y};
    }

    const {innerWidth, innerHeight} = window;
    const rect = this.containerRef.current.getBoundingClientRect();

    if (y + rect.height > innerHeight) {
      y -= rect.height + 24;
    }
    if (x + rect.width > innerWidth) {
      x -= rect.width;
    }
    if (y < 0) {
      y = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
    }
    if (x < 0) {
      y = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
    }

    return {x, y};
  }

  render() {
    const {visible} = this.props;
    const {x, y} = this.getMenuPosition();

    return ReactDOM.createPortal(
      <Container x={x} y={y} visible={visible} innerRef={this.containerRef}>
        <Option onClick={this.onDuplicateClick}>Duplicate</Option>
        <Option onClick={this.onRenameClick}>Rename</Option>
        <Option onClick={this.onDeleteClick}>Delete</Option>
      </Container>,
      window.document.body,
    );
  }
}

const mapStateToProps = ({threed: {contextMenu = {}}}) => ({
  visible: contextMenu.visible,
  object: contextMenu.object,
  position: contextMenu.position,
  test: 288,
});

const mapDispatchToProps = {
  hideContextMenu,
  deleteObject,
  duplicateObject,
  editObjectName
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContextMenu);
