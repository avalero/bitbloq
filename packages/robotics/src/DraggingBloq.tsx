import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { draggingBloqsState } from "./state";
import BloqList from "./BloqList";

const DraggingBloq: FC = () => {
  const draggingBloqs = useRecoilValue(draggingBloqsState);

  if (draggingBloqs.bloqs.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        left: draggingBloqs.x,
        top: draggingBloqs.y,
        zIndex: 50
      }}
    >
      <BloqList bloqs={draggingBloqs.bloqs} section="" path={[]} />
    </div>
  );
};

export default DraggingBloq;
