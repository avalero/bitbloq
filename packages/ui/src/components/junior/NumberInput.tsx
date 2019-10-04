import React, { FC } from "react";
import styled from "@emotion/styled";
import Icon from "../Icon";

export interface INumberInputProps {
  value: number;
  onChange: (newValue: number) => any;
}

const NumberInput: FC<INumberInputProps> = ({ value, onChange }) => {
  const stringValue = Math.round(value).toString();
  const digit1 = stringValue.length === 1 ? "0" : stringValue.substr(-2, 1);
  const digit2 = stringValue.substr(-1);

  return (
    <Container>
      <NumberBox>
        <Digit>{digit1}</Digit>
        <Digit>{digit2}</Digit>
      </NumberBox>
      <Spinners>
        <Spinner>
          <UpButton onClick={() => value < 90 && onChange(value + 10)}>
            <Icon name="angle" />
          </UpButton>
          <DownButton onClick={() => value > 9 && onChange(value - 10)}>
            <Icon name="angle" />
          </DownButton>
        </Spinner>
        <Spinner>
          <UpButton onClick={() => value < 99 && onChange(value + 1)}>
            <Icon name="angle" />
          </UpButton>
          <DownButton onClick={() => value > 0 && onChange(value - 1)}>
            <Icon name="angle" />
          </DownButton>
        </Spinner>
      </Spinners>
    </Container>
  );
};

export default NumberInput;

/* Styled components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  align-items: stretch;
`;

const NumberBox = styled.div`
  display: flex;
  justify-content: space-around;
  box-shadow: inset 0 0 6px 0 rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  background-color: white;
  margin-bottom: 14px;
  padding: 10px;
`;

const Digit = styled.div`
  font-size: 80px;
`;

const Spinners = styled.div`
  width: 150px;
  display: flex;
  justify-content: space-between;
`;

const Spinner = styled.div`
  border: 6px solid #979797;
  background-color: #ddd;
  border-radius: 40px;
  position: relative;

  &::before {
    content: "";
    width: 60px;
    height: 24px;
    background-color: #ddd;
    display: block;
    position: absolute;
    top: 16px;
  }
`;

const Button = styled.button`
  border: none;
  width: 60px;
  height: 30px;
  cursor: pointer;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 14px 0 0 #ddd;
  transform: translate(0, -14px);

  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: 0 12px 0 0 #ddd;
    transform: translate(0, -12px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UpButton = styled(Button)`
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-bottom: 10px;

  svg {
    transform: rotate(180deg);
  }
`;

const DownButton = styled(Button)`
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
`;
