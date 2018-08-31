import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v1';
import styled, {css} from 'react-emotion';
import {updateObject, wrapObjects, deleteObject} from '../../actions/threed';
import {getSelectedObjects} from '../../reducers/threed';
import {colors} from '../../base-styles';
import {resolveClass, createFromJSON} from '../../lib/object3d';
import Object3D from '../../lib/object3d/Object3D';
import CompoundObject from '../../lib/object3d/CompoundObject';
import CubeIcon from '../../assets/images/cube.svg';
import CylinderIcon from '../../assets/images/cylinder.svg';
import SphereIcon from '../../assets/images/sphere.svg';
import TranslateIcon from '../../assets/images/translate.svg';
import RotateIcon from '../../assets/images/rotate.svg';
import ScaleIcon from '../../assets/images/scale.svg';
import TrashIcon from '../../assets/images/trash.svg';
import Select from '../Select';
import Union from '../../lib/object3d/Union';
import Difference from '../../lib/object3d/Difference';
import Intersection from '../../lib/object3d/Intersection';

const Container = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 12px;
  width: 300px;
  max-height: 100%;
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  font-size: 1.1em;
  color: #fafafa;
  background-color: #777;
  display: flex;
  align-items: center;
  padding: 12px;
`;

const Panel = styled.div`
  background-color: #fafafa;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  overflow: hidden;

  ${props =>
    props.isSubPanel &&
    css`
      background-color: white;

      ${PanelHeader} {
        font-size: 1em;
        color: #333;
        background-color: #eee;
        padding: 6px;
      }
    `};
`;

const PanelIcon = styled.img`
  height: 24px;
  margin-right: 6px;
`;

const PanelBody = styled.div`
  padding: 6px;
`;

const PanelHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const DeleteButton = styled.img`
  width: 20px;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: center;

  label {
    width: 72px;
    display: block;
  }

  input {
    border: 1px solid #ccc;
    border-radius: 6px;
    flex: 1;
    height: 18px;
    padding: 6px 12px;
    width: 100%;

    &:focus {
      outline: none;
      border: 1px solid #2684ff;
      box-shadow: 0 0 0 1px #2684ff;
    }
  }
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
  background-color: ${colors.brand};
  padding: 6px;
  border-radius: 6px;
  margin-bottom: 12px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
`;

const ButtonIcon = styled.img`
  height: 24px;
  margin-right: 6px;
`;

const IntegerProperty = ({label, value, onChange}) => (
  <FormGroup>
    <label>{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} />
  </FormGroup>
);

const SelectProperty = ({label, options, value, onChange}) => (
  <FormGroup>
    <label>{label}</label>
    <Select value={value} options={options} onChange={onChange} />
  </FormGroup>
);

const PropertyInput = ({parameter, value, onChange}) => {
  switch (parameter.type) {
    case 'integer':
      return (
        <IntegerProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
        />
      );
    case 'select':
      return (
        <SelectProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
          options={parameter.options}
        />
      );
    default:
      return null;
  }
};

const operationTypes = {
  translation: {
    label: 'Translate',
    icon: TranslateIcon,
    parameterTypes: [
      {
        name: 'x',
        label: 'X',
        type: 'integer',
      },
      {
        name: 'y',
        label: 'Y',
        type: 'integer',
      },
      {
        name: 'z',
        label: 'Z',
        type: 'integer',
      },
    ],
  },
  rotation: {
    label: 'Rotate',
    icon: RotateIcon,
    parameterTypes: [
      {
        name: 'axis',
        label: 'Axis',
        type: 'select',
        options: [
          {
            label: 'X',
            value: 'x',
          },
          {
            label: 'Y',
            value: 'y',
          },
          {
            label: 'Z',
            value: 'z',
          },
        ],
      },
      { 
        name: 'angle',
        label: 'Angle',
        type: 'integer',
      },
    ],
  },
  scale: {
    label: 'Scale',
    icon: ScaleIcon,
    parameterTypes: [
      {
        name: 'width',
        label: 'Width',
        type: 'integer',
      },
      {
        name: 'height',
        label: 'Height',
        type: 'integer',
      },
      {
        name: 'depth',
        label: 'Depth',
        type: 'integer',
      },
    ],
  },
};

class PropertiesPanel extends React.Component {
  onObjectParameterChange = (object, parameter, value) => {
    this.props.updateObject({
      ...object,
      parameters: {
        ...object.parameters,
        [parameter]: value,
      },
    });
  };

  onOperationParameterChange = (object, operation, parameter, value) => {
    this.props.updateObject({
      ...object,
      operations: object.operations.map(
        o => (o === operation ? {...o, [parameter]: value} : o),
      ),
    });
  };

  onUnionClick() {
    const {wrapObjects, selectedObjects} = this.props;
    const unionObject = new Union('Union1', {
      children: selectedObjects.map(child => createFromJSON(child)),
    });
    wrapObjects(unionObject.toJSON(), selectedObjects);
  }

  onDifferenceClick() {
    const {wrapObjects, selectedObjects} = this.props;
    const differenceObject = new Difference('Difference1', {
      children: selectedObjects.map(child => createFromJSON(child)),
    });
    wrapObjects(differenceObject.toJSON(), selectedObjects);
  }

  onIntersectionClick() {
    const {wrapObjects, selectedObjects} = this.props;
    const intersectionObject = new Intersection('Intersection1', {
      children: selectedObjects.map(child => createFromJSON(child)),
    });
    wrapObjects(intersectionObject.toJSON(), selectedObjects);
  }

  onTranslateClick(object) {
    const operation = Object3D.createTranslateOperation(0, 0, 0, false);
    this.addOperation(object, operation);
  }

  onRotateClick(object) {
    const operation = Object3D.createRotateOperation('x', 0, false);
    this.addOperation(object, operation);
  }

  onScaleClick(object) {
    const operation = Object3D.createScaleOperation(1, 1, 1);
    this.addOperation(object, operation);
  }

  addOperation(object, operation) {
    this.props.updateObject({
      ...object,
      operations: [...object.operations, operation],
    });
  }

  removeOperation(object, operation) {
    this.props.updateObject({
      ...object,
      operations: object.operations.filter(op => op !== operation),
    });
  }

  renderCombineOptions() {
    const {selectedObjects} = this.props;

    return (
      <div>
        <Button onClick={() => this.onUnionClick()}>
          <ButtonIcon src={CubeIcon} />
          <div>Union</div>
        </Button>
        <Button onClick={() => this.onDifferenceClick()}>
          <ButtonIcon src={CubeIcon} />
          <div>Difference</div>
        </Button>
        <Button onClick={() => this.onIntersectionClick()}>
          <ButtonIcon src={CubeIcon} />
          <div>Intersection</div>
        </Button>
        <Panel isSubPanel>
          {selectedObjects.map(object => (
            <PanelHeader key={object.id}>
              <div>{object.name}</div>
            </PanelHeader>
          ))}
        </Panel>
      </div>
    );
  }

  renderSubPanels(object, operations = []) {
    const Class3D = resolveClass(object.type);
    const {parameterTypes} = Class3D;

    if (operations.length) {
      const rest = [...operations];
      const last = rest.pop();
      const {label, icon, parameterTypes} = operationTypes[last.type];
      return (
        <Panel isSubPanel>
          <PanelHeader>
            <PanelHeaderTitle>
              <PanelIcon src={icon} />
              <div>{label}</div>
            </PanelHeaderTitle>
            <DeleteButton src={TrashIcon} onClick={() => this.removeOperation(object, last)} />
          </PanelHeader>
          <PanelBody>
            {parameterTypes.map(parameter => (
              <PropertyInput
                key={parameter.name}
                parameter={parameter}
                value={last[parameter.name]}
                onChange={value =>
                  this.onOperationParameterChange(
                    object,
                    last,
                    parameter.name,
                    value,
                  )
                }
              />
            ))}
            {this.renderSubPanels(object, rest)}
          </PanelBody>
        </Panel>
      );
    } else {
      if (Class3D.prototype instanceof CompoundObject) {
        const {parameters = {}} = object;
        const {children = []} = parameters;
        return (
          <Panel isSubPanel>
            {children.map(child => (
              <PanelHeader key={child.id}>
                <div>{child.name}</div>
              </PanelHeader>
            ))}
          </Panel>
        );
      } else {
        return (
          <Panel isSubPanel>
            <PanelHeader>
              <PanelIcon src={CubeIcon} />
              <div>{object.type} Geometry</div>
            </PanelHeader>
            <PanelBody>
              {parameterTypes.map(parameter => (
                <PropertyInput
                  key={parameter.name}
                  parameter={parameter}
                  value={object.parameters[parameter.name]}
                  onChange={value =>
                    this.onObjectParameterChange(object, parameter.name, value)
                  }
                />
              ))}
            </PanelBody>
          </Panel>
        );
      }
    }
  }

  renderObjectPanel(object) {
    const {deleteObject} = this.props;
    return (
      <Panel>
        <PanelHeader>
          <PanelHeaderTitle>{object.name}</PanelHeaderTitle>
          <DeleteButton src={TrashIcon} onClick={() => deleteObject(object)} />
        </PanelHeader>
        <PanelBody>
          <Button onClick={() => this.onTranslateClick(object)}>
            <ButtonIcon src={TranslateIcon} />
            <div>Translate</div>
          </Button>
          <Button onClick={() => this.onRotateClick(object)}>
            <ButtonIcon src={RotateIcon} />
            <div>Rotate</div>
          </Button>
          <Button onClick={() => this.onScaleClick(object)}>
            <ButtonIcon src={ScaleIcon} />
            <div>Scale</div>
          </Button>
          {this.renderSubPanels(object, object.operations)}
        </PanelBody>
      </Panel>
    );
  }

  render() {
    const {objects, selectedObjects} = this.props;
    let content;

    if (selectedObjects.length === 1) {
      content = this.renderObjectPanel(selectedObjects[0]);
    } else if (selectedObjects.length > 1) {
      content = this.renderCombineOptions();
    }

    return <Container>{content}</Container>;
  }
}

const mapStateToProps = ({threed}) => ({
  objects: threed.objects,
  selectedObjects: getSelectedObjects(threed),
});

const mapDispatchToProps = dispatch => ({
  updateObject: object => dispatch(updateObject(object)),
  wrapObjects: (parent, children) => dispatch(wrapObjects(parent, children)),
  deleteObject: object => dispatch(deleteObject(object)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertiesPanel);
