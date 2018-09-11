import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v1';
import styled, {css} from 'react-emotion';
import {
  updateObject,
  composeObjects,
  deleteObject,
  addOperation,
  removeOperation,
  setActiveOperation,
  unsetActiveOperation,
} from '../../actions/threed';
import {getSelectedObjects} from '../../reducers/threed';
import {colors} from '../../base-styles';
import {resolveClass} from '../../lib/object3d';
import CompoundObject from '../../lib/object3d/CompoundObject';
import UnionIcon from '../../assets/images/union.svg';
import TrashIcon from '../../assets/images/trash.svg';
import Select from '../Select';
import config from '../../config/threed';

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
    width: 120px;
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

const IntegerProperty = ({label, value, onChange, onFocus, onBlur}) => (
  <FormGroup>
    <label>{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </FormGroup>
);

const SelectProperty = ({label, options, value, onChange, onFocus, onBlur}) => (
  <FormGroup>
    <label>{label}</label>
    <Select
      value={value}
      options={options}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </FormGroup>
);

const BooleanProperty = ({label, value, onChange}) => (
  <FormGroup>
    <label>{label}</label>
    <input
      type="checkbox"
      checked={value}
      onChange={e => onChange(e.target.checked)}
    />
  </FormGroup>
);

const PropertyInput = ({parameter, value, onChange, onFocus, onBlur}) => {
  switch (parameter.type) {
    case 'integer':
      return (
        <IntegerProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );
    case 'select':
      return (
        <SelectProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          options={parameter.options}
        />
      );
    case 'boolean':
      return (
        <BooleanProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

const objectOperationsMap = {};
config.objectOperations.forEach(
  operation => (objectOperationsMap[operation.name] = operation),
);

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

  onAddOperation(object, operationName) {
    this.props.addOperation(object, operationName);
  }

  onComposeObjects(operationName) {
    const {composeObjects, selectedObjects} = this.props;
    composeObjects(selectedObjects, operationName);
  }

  onRemoveOperation(object, operation) {
    this.props.removeOperation(object, operation);
  }

  renderCombineOptions() {
    const {selectedObjects} = this.props;

    return (
      <div>
        {config.compositionOperations.map(operation => (
          <Button
            key={operation.name}
            onClick={() => this.onComposeObjects(operation.name)}>
            <ButtonIcon src={operation.icon} />
            <div>{operation.label}</div>
          </Button>
        ))}
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
    const {setActiveOperation, unsetActiveOperation} = this.props;
    const Class3D = resolveClass(object.type);
    const {parameterTypes} = Class3D;

    if (operations.length) {
      const rest = [...operations];
      const last = rest.pop();
      const {label, icon, parameters} = objectOperationsMap[last.type];
      return (
        <Panel isSubPanel>
          <PanelHeader>
            <PanelHeaderTitle>
              <PanelIcon src={icon} />
              <div>{label}</div>
            </PanelHeaderTitle>
            <DeleteButton
              src={TrashIcon}
              onClick={() => this.onRemoveOperation(object, last)}
            />
          </PanelHeader>
          <PanelBody>
            {parameters.map(parameter => (
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
                onFocus={() => {
                  if (parameter.activeOperation) {
                    setActiveOperation(parameter.activeOperation(object, last));
                  }
                }}
                onBlur={() => {
                  if (parameter.activeOperation) {
                    unsetActiveOperation();
                  }
                }}
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
              <PanelIcon src={UnionIcon} />
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
          {config.objectOperations.map(operation => (
            <Button
              key={operation.name}
              onClick={() => this.onAddOperation(object, operation.name)}>
              <ButtonIcon src={operation.icon} />
              <div>{operation.label}</div>
            </Button>
          ))}
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
  composeObjects: (objects, operationName) =>
    dispatch(composeObjects(objects, operationName)),
  deleteObject: object => dispatch(deleteObject(object)),
  addOperation: (object, operationName) =>
    dispatch(addOperation(object, operationName)),
  removeOperation: (object, operation) =>
    dispatch(removeOperation(object, operation)),
  setActiveOperation: ({object, type, axis, relative}) =>
    dispatch(setActiveOperation(object, type, axis, relative)),
  unsetActiveOperation: () => dispatch(unsetActiveOperation()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertiesPanel);
