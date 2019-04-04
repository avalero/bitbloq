import React from "react";
import styled from "@emotion/styled";
import { useTranslate, colors, Icon, Input, Select } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";

import { IComponent, IComponentInstance, IPort } from "../index";

interface IComponentPropertiesPanelProps {
  isOpen: boolean;
  components: IComponent[];
  componentInstance: IComponentInstance;
  onInstanceUpdate: (newInstance: IComponentInstance) => any;
  availablePorts: IPort[];
  onDeleteComponent: () => any;
}

const ComponentPropertiesPanel: React.FunctionComponent<
  IComponentPropertiesPanelProps
> = ({
  isOpen,
  components,
  componentInstance,
  onInstanceUpdate,
  onDeleteComponent,
  availablePorts
}) => {
  const wrapStyle = useSpring({
    width: isOpen ? 300 : 0,
    from: { width: 0 },
    config: { tension: 600, friction: 40 }
  });

  const t = useTranslate();

  if (!componentInstance) {
    return null;
  }

  const component = components.find(
    c => c.name === componentInstance.component
  );

  const portOptions = availablePorts.map(port => ({
    label: port.name,
    value: port.name
  }));

  return (
    <Wrap style={wrapStyle}>
      <Content>
        <Header>
          <Title>{componentInstance.component}</Title>
          <DeleteButton onClick={onDeleteComponent}>
            <Icon name="trash" />
          </DeleteButton>
        </Header>
        <Properties>
          <FormGroup>
            <label>{t("bloq-component-name")}</label>
            <Input
              value={componentInstance.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onInstanceUpdate({ ...componentInstance, name: e.target.value })
              }
            />
          </FormGroup>
          <FormGroup>
            <label>{t("bloq-component-port")}</label>
            <StyledSelect
              options={portOptions}
              value={componentInstance.port}
              onChange={(port: string) =>
                onInstanceUpdate({ ...componentInstance, port })
              }
            />
          </FormGroup>
        </Properties>
      </Content>
    </Wrap>
  );
};

export default ComponentPropertiesPanel;

/* styled components */

const Wrap = styled(animated.div)`
  overflow: hidden;
  display: flex;
`;

const Content = styled.div`
  min-width: 300px;
  border-left: 1px solid ${colors.gray3};
`;

const Header = styled.div`
  height: 50px;
  border-bottom: 1px solid ${colors.gray3};
  display: flex;
  align-items: center;
  padding: 0px 20px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: bold;
  font-style: italic;
  flex: 1;
`;

const Properties = styled.div`
  padding: 20px;
  font-size: 13px;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  label {
    display: block;
    width: 120px;
  }

  input {
    flex: 1;
  }
`;

interface ISelectProps {
  options: any;
  value: any;
  onChange: any;
}
const StyledSelect = styled(Select)<ISelectProps>`
  flex: 1;
`;

const DeleteButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  border: solid 1px white;

  &:hover {
    border: solid 1px #dddddd;
    background-color: #e8e8e8;
  }
`;
