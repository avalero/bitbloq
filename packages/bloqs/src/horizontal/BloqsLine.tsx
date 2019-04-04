import React from "react";
import styled from "@emotion/styled";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";

import { IBloq, IBloqType } from "../index";
import { BloqCategory } from "../enums";

interface IBloqsLineProps {
  bloqs: IBloq[];
  bloqTypes: IBloqType[];
  selectedBloq: number;
  selectedPlaceholder: number;
  onBloqClick: (index: number, e: React.MouseEvent) => any;
  onPlaceholderClick: (index: number, e: React.MouseEvent) => any;
  getBloqPort: (bloq: IBloq) => string | undefined;
}

const BloqsLine: React.FunctionComponent<IBloqsLineProps> = ({
  bloqs,
  bloqTypes,
  selectedBloq,
  selectedPlaceholder,
  onBloqClick,
  onPlaceholderClick,
  getBloqPort
}) => {
  const startsWithEvent = () => {
    if (!bloqs[0]) {
      return false;
    }

    const bloqType = bloqTypes.find(t => t.name === bloqs[0].type);
    return bloqType && bloqType.category === BloqCategory.Event;
  };

  return (
    <Container>
      {!startsWithEvent() && (
        <BloqPlaceholder
          onClick={(e: React.MouseEvent) => onPlaceholderClick(0, e)}
          selected={selectedPlaceholder === 0}
          category={BloqCategory.Event}
        />
      )}
      {bloqs.map((bloq, i) => (
        <React.Fragment key={i}>
          <StyledBloq
            type={bloqTypes.find(t => t.name === bloq.type)!}
            selected={selectedBloq === i}
            onClick={(e: React.MouseEvent) => onBloqClick(i, e)}
            bloq={bloq}
            port={getBloqPort(bloq)}
          />
          {(selectedBloq === i ||
            selectedPlaceholder === i + 1 ||
            i === bloqs.length - 1) && (
            <BloqPlaceholder
              onClick={(e: React.MouseEvent) => onPlaceholderClick(i + 1, e)}
              selected={selectedPlaceholder === i + 1}
              category={BloqCategory.Action}
              half={i < bloqs.length - 1}
            />
          )}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default BloqsLine;

/* styled components */

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin-right: 5px;
`;
