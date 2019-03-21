import React from "react";
import styled from "@emotion/styled";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";

import { IBloq, IBloqType, BloqCategory } from "../index.d";

interface IBloqsLineProps {
  bloqs: IBloq[];
  bloqTypes: IBloqType[];
  selectedBloq?: number;
  onBloqClick?: (index: number, e: React.MouseEvent) => any;
}

const BloqsLine: React.FunctionComponent<IBloqsLineProps> = ({
  bloqs,
  bloqTypes,
  selectedBloq,
  onBloqClick
}) => {
  const placeholderCategory =
    bloqs.length === 0 ? BloqCategory.Event : BloqCategory.Action;

  return (
    <Container>
      {bloqs.map((bloq, i) => (
        <StyledBloq
          key={i}
          type={bloqTypes.find(t => t.name === bloq.type)!}
          selected={selectedBloq === i}
          onClick={(e: React.MouseEvent) => onBloqClick && onBloqClick(i, e)}
        />
      ))}
      <BloqPlaceholder
        onClick={(e: React.MouseEvent) =>
          onBloqClick && onBloqClick(bloqs.length, e)
        }
        selected={selectedBloq === bloqs.length}
        category={placeholderCategory}
      />
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
