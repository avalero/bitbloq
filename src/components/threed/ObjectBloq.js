import React from 'react';
import {connect} from 'react-redux';
import {
  updateObject,
  showContextMenu,
  stopEditingObjectName,
} from '../../actions/threed';
import styled, {css} from 'react-emotion';
import config from '../../config/threed';
import {resolveClass} from '../../lib/object3d';
import PropertiesBloq from './PropertiesBloq';
import PropertyInput from './PropertyInput';
import GroupIcon from '../../assets/images/shape-group.svg';
import PointsIcon from '../../assets/images/three-points.svg';
import ColorPicker from '../ColorPicker';

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ccc;
`;

const ObjectIcon = styled.img`
  width: 40px;
  margin-right: 12px;
`;

const ObjectName = styled.div`
  flex: 1;
  color: #4a4a4a;
  font-size: 1.1em;
`;

const ParametersForm = styled.div`
  padding: 12px;
`;

const ContextMenuButton = styled.img`
  cursor: pointer;
`;

const NameInput = styled.input`
  flex: 1;
  font-size: 1em;
  margin: -2px 0px -4px 0px;
  padding: 0px;
  color: #4a4a4a;
  border-width: 0 0 1px 0;
  border-color: #4a4a4a;
  width: 100%;
  background: transparent;

  &:focus {
    outline: none;
  }
`;

class ObjectBloq extends React.Component {
  nameInputRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.editingName && !prevProps.editingName) {
      this.nameInputRef.current.focus();
    }
  }

  onNameChange = (object, name) => {
    this.props.updateObject({
      ...object,
      name,
    });
  };

  onParameterChange = (parameter, value) => {
    const {object} = this.props;
    this.props.updateObject({
      ...object,
      parameters: {
        ...object.parameters,
        [parameter.name]: value,
      },
    });
  };

  render() {
    const {
      object,
      editingName,
      showContextMenu,
      stopEditingObjectName,
    } = this.props;
    const Class3D = resolveClass(object.type);
    const {parameterTypes = []} = Class3D;

    const parameters = [
      ...parameterTypes,
      {
        name: 'color',
        label: 'Color',
        type: 'color',
      },
    ];

    const shapeConfig = config.shapes.find(
      ({objectClass}) => objectClass === Class3D,
    );
    const icon = (shapeConfig && shapeConfig.icon) || GroupIcon;

    return (
      <PropertiesBloq isTop>
        <Header>
          <ObjectIcon src={icon} />
          {editingName && (
            <NameInput
              type="text"
              innerRef={this.nameInputRef}
              value={object.name}
              onChange={e => this.onNameChange(object, e.target.value)}
              onBlur={() => stopEditingObjectName()}
            />
          )}
          {!editingName && <ObjectName>{object.name}</ObjectName>}
          <ContextMenuButton
            src={PointsIcon}
            onClick={e => {
              e.stopPropagation();
              showContextMenu(object, e);
            }}
          />
        </Header>
        <ParametersForm>
          {parameters.map(parameter => (
            <PropertyInput
              key={parameter.name}
              parameter={parameter}
              value={object.parameters[parameter.name]}
              onChange={value => this.onParameterChange(parameter, value)}
            />
          ))}
        </ParametersForm>
      </PropertiesBloq>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  editingName: threed.editingObjectName,
});

const mapDispatchToProps = dispatch => ({
  updateObject: object => dispatch(updateObject(object)),
  showContextMenu: (object, e) =>
    dispatch(showContextMenu(object, e.clientX, e.clientY)),
  stopEditingObjectName: () => dispatch(stopEditingObjectName()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObjectBloq);
