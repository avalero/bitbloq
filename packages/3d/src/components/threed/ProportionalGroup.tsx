import React from "react";
import styled from "@emotion/styled";
import {
  Button,
  Icon,
  Tooltip,
  TooltipProps,
  withTranslate
} from "@bitbloq/ui";
import PropertyInput from "./PropertyInput";
import warningIcon from "../../assets/images/warning.svg";
import errorSound from "../../assets/sounds/error.mp3";

interface Parameter {
  errorMessage?: string;
  errorValue?: number;
  fineStep?: number;
  label?: string;
  minValue?: number;
  name: string;
  validate?: (value: number | string) => boolean;
}

export interface IProportionalGroupProps {
  parameters: Parameter[];
  operation: object;
  onOperationChange: (operation: object) => any;
  t: any;
  tooltipProps: TooltipProps;
}

class ProportionalGroup extends React.Component<IProportionalGroupProps> {
  state = {
    isLocked: true,
    inputValues: new Map<string, string>(),
    errors: new Map<string, boolean>(),
    timeout: setTimeout(() => {}, 10)
  };

  onParameterChange = (parameter: Parameter, value: any) => {
    const { parameters, operation } = this.props;
    const oldValue = operation[parameter.name];
    const ratio = value / oldValue;

    const newOperation = parameters.reduce((newOperation, p) => {
      if (p === parameter) {
        return { ...newOperation, [p.name]: value };
      } else if (this.state.isLocked) {
        const newValue = Math.round(operation[p.name] * ratio * 100) / 100;
        return { ...newOperation, [p.name]: newValue };
      } else {
        return newOperation;
      }
    }, operation);

    this.props.onOperationChange(newOperation);
  };

  onBlur = (
    operation: object,
    parameters: Parameter[],
    parameter: Parameter
  ): void => {
    let { inputValues, errors } = this.state;
    const oldValue = operation[parameter.name];
    inputValues.delete(parameter.name);
    errors = this.onSetError(false, errors, parameters, parameter, oldValue);
    this.setState({ errors, inputValues });
  };

  onSetError = (
    error: boolean,
    errors: Map<string, boolean>,
    parameters: Parameter[],
    parameter: Parameter,
    value?: string | number
  ): Map<string, boolean> => {
    errors.set(parameter.name, error);
    if (this.state.isLocked) {
      parameters.forEach(param => {
        errors.set(param.name, error);
      });
    }
    if (value) this.onParameterChange(parameter, value);
    return errors;
  };

  onChange = (
    value: any,
    text: string,
    operation: object,
    parameters: Parameter[],
    parameter: Parameter
  ): void => {
    let { errors, inputValues, timeout } = this.state;
    const oldValue = operation[parameter.name];

    clearTimeout(timeout);

    if (text && (!parameter.validate || parameter.validate(+text))) {
      inputValues.delete(parameter.name);
      errors = this.onSetError(false, errors, parameters, parameter, value);
    } else if (
      text === undefined &&
      (!parameter.validate || parameter.validate(+value))
    ) {
      inputValues.delete(parameter.name);
      errors = this.onSetError(false, errors, parameters, parameter, value);
    } else {
      inputValues.set(parameter.name, value);
      errors = this.onSetError(true, errors, parameters, parameter);
      timeout = setTimeout(
        () => (
          (errors = this.onSetError(
            false,
            errors,
            parameters,
            parameter,
            oldValue
          )),
          inputValues.delete(parameter.name),
          this.setState({ errors, inputValues })
        ),
        3000
      );
    }
    this.setState({ errors, inputValues, timeout });
  };

  render() {
    const { parameters, operation, t, tooltipProps } = this.props;
    const { inputValues, isLocked } = this.state;

    const count = parameters.length;

    return (
      <Container>
        {parameters.map((parameter, i) => (
          <React.Fragment key={parameter.name}>
            {i > 0 && (
              <Line style={{ transform: `translate(0, ${(i - 1) * 46}px)` }} />
            )}
            <div style={{ position: "relative" }}>
              <PropertyInput
                tooltipProps={tooltipProps}
                parameter={{
                  ...parameter,
                  type: "integer",
                  minValue: undefined
                }}
                value={
                  inputValues.has(parameter.name)
                    ? inputValues.get(parameter.name)
                    : operation[parameter.name]
                }
                onBlur={() => {
                  this.onBlur(operation, parameters, parameter);
                }}
                onChange={(value: any, text: string) =>
                  this.onChange(value, text, operation, parameters, parameter)
                }
              />
              {this.state.errors.has(parameter.name) &&
                this.state.errors.get(parameter.name) && (
                  <TooltipPositionf>
                    <audio src={errorSound} autoPlay />
                    <Tooltip
                      isVisible={true}
                      position="left"
                      content={
                        <TooltipText>
                          <img src={warningIcon} />
                          {t(parameter.errorMessage, [parameter.errorValue])}
                        </TooltipText>
                      }
                    >
                      {(tooltipProps: TooltipProps) => (
                        <div
                          style={{ height: "37px", width: "0" }}
                          {...tooltipProps}
                        />
                      )}
                    </Tooltip>
                  </TooltipPositionf>
                )}
            </div>
          </React.Fragment>
        ))}
        <LockButton onClick={() => this.setState({ isLocked: !isLocked })}>
          <Icon name={isLocked ? "padlock-close" : "padlock-open"} />
        </LockButton>
      </Container>
    );
  }
}

export default withTranslate(ProportionalGroup);

const Container = styled.div`
  position: relative;
`;

const LockButton = styled.div`
  position: absolute;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 1px solid #cfcfcf;
  background-color: white;
  color: #9b9da1;
  top: 50%;
  left: 60px;
  transform: translate(0, -50%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Line = styled.div`
  position: absolute;
  top: 20px;
  left: 75px;
  width: 45px;
  height: 45px;
  border-style: solid none solid solid;
  border-color: #d8d8d8;
  border-width: 1px;
`;

const TooltipPositionf = styled.div`
  height: 37px;
  position: absolute;
  right: 120px;
  top: 0;
`;

const TooltipText = styled.div`
  align-items: center;
  color: #fff;
  display: flex;
  font-family: Helvetica;
  font-size: 12px;
  justify-content: space-between;
  padding: 0;

  img {
    margin-right: 5px;
  }
`;
