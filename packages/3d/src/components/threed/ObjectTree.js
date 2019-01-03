import React from 'react';
import uuid from 'uuid/v1';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {withTranslate} from '../TranslateProvider';
import {colors, shadow} from '../../base-styles';
import {Icon} from '@bitbloq/ui';
import {
  selectObject,
  deselectObject,
  createObject,
  updateObject,
} from '../../actions/threed';
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
  padding: 0px 18px 0px 8px;
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
    margin-left: 4px;
  }

  img {
    width: 24px;
  }
`;

const DragHandle = styled.div`
  margin-right: ${props => 4 + 12 * (props.depth || 0)}px;
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

const CollapseButton = styled.div`
  display: flex;

  svg {
    width: 10px;
  }

  ${props =>
    props.collapsed &&
    css`
      svg {
        transform: rotate(-90deg);
      }
    `};
`;

const ObjectTypeIcon = styled.div`
  svg {
    width: 12px;
  }
`

class ObjectTree extends React.Component {

  state = {
    addDropDownOpen: false,
    collapsedItems: [],
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

  onCollapseClick = (e, object) => {
    e.stopPropagation();
    this.setState(({collapsedItems, ...state}) => ({
      ...state,
      collapsedItems: collapsedItems.includes(object.id)
        ? collapsedItems.filter(id => id !== object.id)
        : [...collapsedItems, object.id],
    }));
  };

  onAddObject(typeConfig) {
    const {advancedMode, t} = this.props;
    this.setState({addDropDownOpen: false});

    const object = {
      ...typeConfig.create(),
      operations: config.defaultOperations(advancedMode),
      viewOptions: {
        name: t(typeConfig.label)
      }
    };

    this.props.createObject(object);
  }

  onDragEnd(result) {
    const {destination, source, droppableId, draggableId} = result;
    const {objects, updateObject} = this.props;

    if (!destination || !destination.droppableId) return;

    const parent = objects.find(({id}) => id === destination.droppableId);
    if (!parent || !parent.children) return;

    const child = parent.children.find(({id}) => id === draggableId);
    if (!child) return;

    const newChildren = [...parent.children];
    newChildren.splice(source.index, 1);
    newChildren.splice(destination.index, 0, child);
    this.props.updateObject({
      ...parent,
      children: newChildren,
    });
  }

  renderObjectItem(object, index, depth, parent) {
    const {
      objects: topObjects,
      selectedObjects,
      selectObject,
      deselectObject,
      controlPressed,
      shiftPressed,
    } = this.props;
    const {collapsedItems} = this.state;

    const isSelected = selectedObjects.includes(object);
    const isTop = topObjects.includes(object);
    const isSelectedTop =
      selectedObjects.length > 0 && topObjects.includes(selectedObjects[0]);
    const {children = [], id} = object;
    const isCollapsed = collapsedItems.includes(id);

    let icon;
    if (children.length) {
      const typeConfig = config.objectTypes.find(t => t.name === object.type) || {};
      icon = typeConfig.icon;
    }

    return (
      <Draggable draggableId={id} index={index} key={id}>
        {(provided, snapshot) => (
          <ObjectItem {...provided.draggableProps} ref={provided.innerRef}>
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
              <DragHandle {...provided.dragHandleProps} depth={depth}>
                <Icon name="drag" />
              </DragHandle>
              {children.length > 0 && (
                <CollapseButton
                  collapsed={isCollapsed}
                  onClick={e => this.onCollapseClick(e, object)}>
                  <Icon name="angle" />
                </CollapseButton>
              )}
              <span>{object.viewOptions.name || object.type}</span>
              {icon &&
                <ObjectTypeIcon>{icon}</ObjectTypeIcon>
              }
            </ObjectName>
            {!isCollapsed && this.renderObjectList(children, depth + 1, object)}
          </ObjectItem>
        )}
      </Draggable>
    );
  }

  renderObjectList(objects, depth = 0, parent) {
    if (objects && objects.length) {
      const parentId = parent ? parent.id : 'root';
      return (
        <Droppable droppableId={parentId} type={parentId}>
          {provided => (
            <ObjectList
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {objects.map((object, index) =>
                this.renderObjectItem(object, index, depth, parent),
              )}
              {provided.placeholder}
            </ObjectList>
          )}
        </Droppable>
      );
    }
  }

  render() {
    const {addDropDownOpen} = this.state;
    const {objects, t} = this.props;

    return (
      <DragDropContext onDragEnd={result => this.onDragEnd(result)}>
        <Container>
          <AddButton
            onClick={() => this.setState({addDropDownOpen: true})}
            open={addDropDownOpen}>
            <div>+ {t('add-object')}</div>
            <AddDropdown open={addDropDownOpen}>
              {config.objectTypes.map(
                typeConfig =>
                  typeConfig.create && (
                    <AddDropdownItem
                      key={typeConfig.name}
                      onClick={e => {
                        e.stopPropagation();
                        this.onAddObject(typeConfig);
                      }}>
                      {typeConfig.icon}
                      <div>{t(typeConfig.label)}</div>
                    </AddDropdownItem>
                  ),
              )}
            </AddDropdown>
          </AddButton>
          <Tree>{this.renderObjectList(objects)}</Tree>
        </Container>
      </DragDropContext>
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
  updateObject: object => dispatch(updateObject(object)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslate(ObjectTree));
