import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {colors} from '../../base-styles';
import {selectObject, deselectObject, createObject} from '../../actions/threed';
import AddIcon from '../../assets/images/add.svg';
import CubeIcon from '../../assets/images/cube.svg';
import SphereIcon from '../../assets/images/sphere.svg';
import Cube from '../../lib/object3d/Cube';
import Sphere from '../../lib/object3d/Sphere';

const Container = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-right: 1px solid #eee;
`;

const Tree = styled.div`
  flex: 1;
  display: flex;
`;

const ObjectList = styled.ul`
  width: 100%;
  margin-left: 12px;
`;

const ObjectItem = styled.li``;

const ObjectName = styled.div`
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  ${props =>
    props.isSelected &&
    css`
      background-color: #777;
      color: white;
    `};
`;

const AddButton = styled.div`
  display: flex;
  align-items: center;
  color: white;
  background-color: ${colors.brand};
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 1.2em;
  cursor: pointer;
  position: relative;

  img {
    width: 18px;
    margin-right: 6px;
  }
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

  onAddObject(object) {
    const {createObject} = this.props;
    this.setState({addDropDownOpen: false});

    createObject(object.toJSON());
  }

  renderObjectList(objects) {
    const {selectedObjects, selectObject, deselectObject} = this.props;

    if (objects && objects.length) {
      return (
        <ObjectList>
          {objects.map(object => {
            const isSelected = selectedObjects.includes(object.id);
            return (
              <ObjectItem key={object.id}>
                <ObjectName
                  isSelected={isSelected}
                  onClick={() =>
                    isSelected
                      ? deselectObject(object.id)
                      : selectObject(object.id)
                  }>
                  {object.name || object.type}
                </ObjectName>
                {this.renderObjectList(object.children)}
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
        <AddButton onClick={() => this.setState({addDropDownOpen: true})}>
          <img src={AddIcon} />
          <div>Add object</div>
          <AddDropdown open={addDropDownOpen}>
            <AddDropdownItem
              onClick={e => {
                e.stopPropagation();
                this.onAddObject(new Cube('Cube1'));
              }}>
              <img src={CubeIcon} />
              <div>Cube</div>
            </AddDropdownItem>
            <AddDropdownItem
              onClick={e => {
                e.stopPropagation();
                this.onAddObject(new Sphere('Sphere1'));
              }}>
              <img src={SphereIcon} />
              <div>Sphere</div>
            </AddDropdownItem>
          </AddDropdown>
        </AddButton>
        <Tree>{this.renderObjectList(objects)}</Tree>
      </Container>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  objects: threed.objects,
  selectedObjects: threed.selectedObjects,
});

const mapDispatchToProps = dispatch => ({
  selectObject: objectId => dispatch(selectObject(objectId)),
  deselectObject: objectId => dispatch(deselectObject(objectId)),
  createObject: object => dispatch(createObject(object)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObjectTree);
