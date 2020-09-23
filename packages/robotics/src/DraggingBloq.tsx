import React, { FC, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { draggingBloqState } from "./state";
import { bloqCategories } from "./config";
import Bloq from "./Bloq";

const DraggingBloq: FC = () => {
  const draggingBloq = useRecoilValue(draggingBloqState);

  const color = useMemo(() => {
    const category = bloqCategories.find(
      c => c.name === draggingBloq.bloqType?.category
    );
    return category?.color || "";
  }, [draggingBloq]);

  if (!draggingBloq.bloqType) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        left: draggingBloq.x,
        top: draggingBloq.y
      }}
    >
      <Bloq type={draggingBloq.bloqType} />
    </div>
  );
};

export default DraggingBloq;
