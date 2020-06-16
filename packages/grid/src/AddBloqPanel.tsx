import React, { FC, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { breakpoints, Icon, JuniorButton } from "@bitbloq/ui";
import {
  IBloqType,
  BloqCategory,
  BloqPlaceholder,
  HorizontalBloq
} from "@bitbloq/bloqs";
import { bloqTypes } from "./config";

interface IAddBloqPanelProps {
  availableBloqs: { [bloq: string]: number };
  onSelectBloqType: (bloqType: IBloqType) => any;
  disabled: boolean;
}

const AddBloqPanel: FC<IAddBloqPanelProps> = ({
  availableBloqs,
  onSelectBloqType,
  disabled
}) => {
  return (
    <Container>
      <BloqsWrap>
        <Bloqs>
          {Object.keys(availableBloqs).map(typeName => {
            const type = bloqTypes.find(t => t.name === typeName)!;
            const canAdd = availableBloqs[typeName] !== 0;
            return (
              <Bloq
                transparent={!canAdd && !disabled}
                type={type}
                gray={disabled}
                selectable={canAdd && !disabled}
                onClick={() => canAdd && !disabled && onSelectBloqType(type)}
              />
            );
          })}
        </Bloqs>
      </BloqsWrap>
    </Container>
  );
};

export default AddBloqPanel;

/* Styled components */

const Bloq = styled(HorizontalBloq)<{ transparent?: boolean }>`
  opacity: ${props => (props.transparent ? 0.2 : 1)};
`;

const Bloqs = styled.div`
  display: grid;
  overflow: hidden;
  grid-gap: 16px;
  grid-template-columns: auto auto auto;
  transform: scale(0.7);
  @media screen and (min-width: ${breakpoints.tablet}px) {
    grid-gap: 10px;
    transform: scale(1);
  }
`;

const BloqsWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Container = styled.div`
  flex: 1;
  border-radius: 6px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
`;
