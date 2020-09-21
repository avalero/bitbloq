import React, { FC } from "react";
import styled from "@emotion/styled";
import colors from "../../colors";
import UpDownButton from "./UpDownButton";

export interface INumberInputProps {
  value: number;
  onChange: (newValue: number) => any;
}

const NumberInput: FC<INumberInputProps> = ({ value, onChange }) => {
  return (
    <Container>
      <FirstUpDownButton
        onUpClick={() => value < 90 && onChange(value + 10)}
        onDownClick={() => value > 9 && onChange(value - 10)}
      />
      <UpDownButton
        onUpClick={() => value < 99 && onChange(value + 1)}
        onDownClick={() => value > 0 && onChange(value - 1)}
      />
    </Container>
  );
};

export default NumberInput;

/* Styled components */

const Container = styled.div`
  background-color: ${colors.gray2};
  padding: 10px;
  display: flex;
`;

const FirstUpDownButton = styled(UpDownButton)`
  margin-right: 6px;
`;
