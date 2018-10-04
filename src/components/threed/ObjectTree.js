import React from 'react';
import uuid from 'uuid/v1';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {colors} from '../../base-styles';
import SubArrowIcon from '../../assets/images/sub-arrow.svg';
import PointsIcon from '../../assets/images/three-points.svg';
import {
  selectObject,
  deselectObject,
  createObject,
  showContextMenu,
} from '../../actions/threed';
import {
  getObjects,
  getSelectedObjects
} from '../../reducers/threed/';
import config from '../../config/threed';

const Container = styled.div`
  width: 210px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #979797;
`;

const Tree = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
`;

const ObjectList = styled.ul`
  width: 100%;
`;

const ObjectItem = styled.li`
  width: 100%;
`;

const ObjectName = styled.div`
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #979797;

  ${props =>
    props.isSelected &&
    css`
      background-color: #e0e0e0;
    `};
  ${props =>
    props.isFirstSelected &&
    css`
      background-color: #ddd;
    `};

  span {
    flex: 1;
  }

  img {
    width: 24px;
  }
`;

const SubArrow = styled.img`
  margin-right: 6px;
  ${props =>
    props.depth &&
    props.depth > 1 &&
    css`
      margin-left: ${12 * props.depth}px;
    `};
`;

const AddButtonWrap = styled.div`
  padding: 12px;
  border-bottom: 1px solid #979797;
`;

const AddButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: ${colors.brand};
  padding: 12px;
  border-radius: 6px;
  font-size: 1.2em;
  cursor: pointer;
  position: relative;
`;

const AddDropdown = styled.div`
  background-color: white;
  color: #333;
  position: absolute;
  top: 48px;
  left: 0px;
  right: 0px;
  transition: opacity 0.3s;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
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
  padding: 12px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }

  img {
    height: 18px;
    width: 18px;
    margin-right: 6px;
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

  onAddObject(shapeName) {
    this.setState({addDropDownOpen: false});

    this.props.createObject(shapeName);
  }

  renderObjectList(objects, depth = 0) {
    const {
      objects: topObjects,
      selectedObjects,
      selectObject,
      deselectObject,
      controlPressed,
      shiftPressed,
      showContextMenu,
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
                  {depth > 0 && <SubArrow src={SubArrowIcon} depth={depth} />}
                  <span>{object.name || object.type}</span>
                  <img
                    src={PointsIcon}
                    onClick={e => {
                      e.stopPropagation();
                      showContextMenu(object, e);
                    }}
                  />
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
        <AddButtonWrap>
          <AddButton onClick={() => this.setState({addDropDownOpen: true})}>
            <div>+ Add object</div>
            <AddDropdown open={addDropDownOpen}>
              {config.shapes.map(shape => (
                <AddDropdownItem
                  key={shape.name}
                  onClick={e => {
                    e.stopPropagation();
                    this.onAddObject(shape.name);
                  }}>
                  <img src={shape.icon} />
                  <div>{shape.label}</div>
                </AddDropdownItem>
              ))}
            </AddDropdown>
          </AddButton>
        </AddButtonWrap>
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
});

const mapDispatchToProps = dispatch => ({
  selectObject: (object, addToSelection) =>
    dispatch(selectObject(object, addToSelection)),
  deselectObject: object => dispatch(deselectObject(object)),
  createObject: object => dispatch(createObject(uuid(), object)),
  showContextMenu: (object, e) =>
    dispatch(showContextMenu(object, e.clientX, e.clientY)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObjectTree);
