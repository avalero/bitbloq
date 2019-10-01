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

export interface IProportionalGroupProps {
  parameters: object[];
  operation: object;
  onOperationChange: (operation: object) => any;
}

class ProportionalGroup extends React.Component<IProportionalGroupProps> {
  state = {
    isLocked: true,
    errors: new Map<string, boolean>()
  };

  onParameterChange = (parameter: object, value: any) => {
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

  render() {
    const { parameters, operation, t, tooltipProps } = this.props;
    const { isLocked } = this.state;

    const count = parameters.length;

    return (
      <Container>
        {parameters.map((parameter, i) => (
          <React.Fragment key={parameter.name}>
            {this.state.errors.has(parameter.name) &&
            this.state.errors.get(parameter.name) ? (
              <Tooltip
                position="left"
                content={
                  <TooltipText>
                    <img src={warningIcon} />
                    {t(parameter.errorMessage, [parameter.errorValue])}
                  </TooltipText>
                }
                isVisible={true}
              >
                {(tooltipProps: TooltipProps) => (
                  <>
                    <audio src={errorSound} autoPlay />
                    <PropertyInput
                      tooltipProps={tooltipProps}
                      parameter={{ ...parameter, type: "integer" }}
                      value={operation[parameter.name]}
                      onBlur={() => {
                        let errors: Map<string, boolean> = this.state.errors;
                        errors.set(parameter.name, false);
                        if (this.state.isLocked) {
                          parameters.forEach(param => {
                            errors.set(param.name, false);
                          });
                        }
                        this.setState({ errors });
                      }}
                      onChange={(value: any, text: string) => {
                        const oldValue = operation[parameter.name];
                        let errors: Map<string, boolean> = this.state.errors;
                        if (
                          text &&
                          (!parameter.validate || parameter.validate(+text))
                        ) {
                          errors.set(parameter.name, false);
                          if (this.state.isLocked) {
                            parameters.forEach(param => {
                              errors.set(param.name, false);
                            });
                          }
                          this.onParameterChange(parameter, value);
                        } else if (
                          !text &&
                          (!parameter.validate || parameter.validate(+value))
                        ) {
                          errors.set(parameter.name, false);
                          if (this.state.isLocked) {
                            parameters.forEach(param => {
                              errors.set(param.name, false);
                            });
                          }
                          this.onParameterChange(parameter, value);
                        } else {
                          errors.set(parameter.name, true);
                          if (this.state.isLocked) {
                            parameters.forEach(param => {
                              errors.set(param.name, true);
                            });
                          }
                          this.onParameterChange(parameter, oldValue);
                        }
                        this.setState({ errors });
                      }}
                    />
                    {i > 0 && (
                      <Line
                        style={{ transform: `translate(0, ${(i - 1) * 46}px)` }}
                      />
                    )}
                  </>
                )}
              </Tooltip>
            ) : (
              <>
                <PropertyInput
                  tooltipProps={tooltipProps}
                  parameter={{ ...parameter, type: "integer" }}
                  value={operation[parameter.name]}
                  onBlur={() => {
                    let errors: Map<string, boolean> = this.state.errors;
                    errors.set(parameter.name, false);
                    if (this.state.isLocked) {
                      parameters.forEach(param => {
                        errors.set(param.name, false);
                      });
                    }
                    this.setState({ errors });
                  }}
                  onChange={(value: any, text: string) => {
                    const oldValue = operation[parameter.name];
                    let errors: Map<string, boolean> = this.state.errors;
                    if (
                      text &&
                      (!parameter.validate || parameter.validate(+text))
                    ) {
                      errors.set(parameter.name, false);
                      if (this.state.isLocked) {
                        parameters.forEach(param => {
                          errors.set(param.name, false);
                        });
                      }
                      this.onParameterChange(parameter, value);
                    } else if (
                      !text &&
                      (!parameter.validate || parameter.validate(+value))
                    ) {
                      errors.set(parameter.name, false);
                      if (this.state.isLocked) {
                        parameters.forEach(param => {
                          errors.set(param.name, false);
                        });
                      }
                      this.onParameterChange(parameter, value);
                    } else {
                      errors.set(parameter.name, true);
                      if (this.state.isLocked) {
                        parameters.forEach(param => {
                          errors.set(param.name, true);
                        });
                      }
                      this.onParameterChange(parameter, oldValue);
                    }
                    this.setState({ errors });
                  }}
                />
                {i > 0 && (
                  <Line
                    style={{ transform: `translate(0, ${(i - 1) * 46}px)` }}
                  />
                )}
              </>
            )}
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
