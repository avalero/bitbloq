import React from 'react';
import uuid from 'uuid/v1';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {colors, shadow} from '../../base-styles';
import DragIcon from '../icons/Drag';
import {selectObject, deselectObject, createObject} from '../../actions/threed';
import {getObjects, getSelectedObjects} from '../../reducers/threed/';
import config from '../../config/threed';

const Container = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #cfcfcf;
`;

const Tree = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
  padding: 20px 0px;
`;

const ObjectList = styled.ul`
  width: 100%;
`;

const ObjectItem = styled.li`
  width: 100%;
`;

const ObjectName = styled.div`
  padding: 0px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-color: #eee;
  border-style: solid;
  border-width: 1px 0px 1px 0px;
  background-color: white;
  font-size: 13px;
  height: 30px;
  margin-bottom: -1px;

  ${props =>
    props.isSelected &&
    css`
      color: white;
      background-color: #4dc3ff;
      border-color: inherit;
    `};

  span {
    flex: 1;
  }

  img {
    width: 24px;
  }
`;

const DragHandle = styled.div`
  margin-right: ${props => 8 + 12 * (props.depth || 0)}px;
  svg {
    width: 13px;
  }
`;

const AddButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #ebebeb;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #cfcfcf;
  z-index: 2;

  ${props =>
    props.open &&
    css`
      ${shadow};
    `};
`;

const AddDropdown = styled.div`
  background-color: white;
  color: #333;
  position: absolute;
  top: 51px;
  left: 0px;
  right: 0px;
  transition: opacity 0.3s;
  ${shadow} border-radius: 0px 0px 4px 4px;
  opacity: 0;
  display: none;

  ${props =>
    props.open &&
    css`
      opacity: 1;
      display: block;
    `};
`;

const AddDropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 20px;
  height: 42px;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;

  &:hover {
    background-color: #ebebeb;
  }

  svg {
    height: auto;
    width: 24px;
    margin-right: 10px;
  }
`;

class ObjectTree extends React.Component {
  state = {
    addDropDownOpen: false,
  };

  componentDidMount() {
    document.body.addEventListener('click', this.onBodyClick);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onBodyClick);
  }

  onBodyClick = () => {
    this.setState({addDropDownOpen: false});
  };

  onAddObject(shape) {
    const {advancedMode} = this.props;
    this.setState({addDropDownOpen: false});

    const baseShape = shape.create();

    if (advancedMode) {
      this.props.createObject(baseShape);
    } else {
      const basicModeOperations = config.objectOperations
        .map(operation => {
          if (['translation', 'rotation', 'scale'].includes(operation.name)) {
            return operation.create();
          }
        })
        .filter(operation => operation);

      this.props.createObject({
        ...baseShape,
        operations: basicModeOperations,
      });
    }
  }

  renderObjectList(objects, depth = 0) {
    const {
      objects: topObjects,
      selectedObjects,
      selectObject,
      deselectObject,
      controlPressed,
      shiftPressed,
    } = this.props;

    if (objects && objects.length) {
      return (
        <ObjectList>
          {objects.map(object => {
            const isSelected = selectedObjects.includes(object);
            const isTop = topObjects.includes(object);
            const isSelectedTop =
              selectedObjects.length > 0 &&
              topObjects.includes(selectedObjects[0]);
            const {parameters = {}} = object;
            const {children} = parameters;

            return (
              <ObjectItem key={object.id}>
                <ObjectName
                  isFirstSelected={selectedObjects.indexOf(object) === 0}
                  isSelected={isSelected}
                  onClick={() => {
                    if (
                      isTop &&
                      isSelectedTop &&
                      (controlPressed || shiftPressed)
                    ) {
                      if (isSelected) {
                        deselectObject(object);
                      } else {
                        selectObject(object, true);
                      }
                    } else {
                      if (isSelected && selectedObjects.length === 1) {
                        deselectObject(object);
                      } else {
                        selectObject(object);
                      }
                    }
                  }}>
                  <DragHandle depth={depth}>
                    <DragIcon />
                  </DragHandle>
                  <span>{object.name || object.type}</span>
                </ObjectName>
                {this.renderObjectList(children, depth + 1)}
              </ObjectItem>
            );
          })}
        </ObjectList>
      );
    }
  }

  render() {
    const {addDropDownOpen} = this.state;
    const {objects} = this.props;

    return (
      <Container>
        <AddButton
          onClick={() => this.setState({addDropDownOpen: true})}
          open={addDropDownOpen}>
          <div>+ Add object</div>
          <AddDropdown open={addDropDownOpen}>
            {config.shapes.map(shape => (
              <AddDropdownItem
                key={shape.name}
                onClick={e => {
                  e.stopPropagation();
                  this.onAddObject(shape);
                }}>
                {shape.icon}
                <div>{shape.label}</div>
              </AddDropdownItem>
            ))}
          </AddDropdown>
        </AddButton>
        <Tree>{this.renderObjectList(objects)}</Tree>
      </Container>
    );
  }
}

const mapStateToProps = ({ui, threed}) => ({
  objects: getObjects(threed),
  selectedObjects: getSelectedObjects(threed),
  controlPressed: ui.controlPressed,
  shiftPressed: ui.shiftPressed,
  advancedMode: threed.ui.advancedMode,
});

const mapDispatchToProps = dispatch => ({
  selectObject: (object, addToSelection) =>
    dispatch(selectObject(object, addToSelection)),
  deselectObject: object => dispatch(deselectObject(object)),
  createObject: object => dispatch(createObject(object)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObjectTree);
