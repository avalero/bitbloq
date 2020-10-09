import React, { FC, createContext, useContext } from "react";
import { useRecoilCallback } from "recoil";
import { IRoboticsContent } from "./index";
import { boardState, componentsState, bloqsState } from "./state";

export const UpdateContentContext = createContext<
  (content: IRoboticsContent) => void
>(() => null);

export interface IUpdateContentProviderProps {
  onContentChange: (content: IRoboticsContent) => void;
}

export const UpdateContentProvider: FC<IUpdateContentProviderProps> = ({
  onContentChange,
  children
}) => {
  return (
    <UpdateContentContext.Provider value={onContentChange}>
      {children}
    </UpdateContentContext.Provider>
  );
};

const useUpdateContent = () => {
  const onContentChange = useContext(UpdateContentContext);

  const update = useRecoilCallback(({ snapshot }) => async () => {
    const board = await snapshot.getPromise(boardState);
    const components = await snapshot.getPromise(componentsState);
    const bloqs = await snapshot.getPromise(bloqsState);

    const content: IRoboticsContent = {
      hardware: {
        board: board?.name || "",
        components
      },
      bloqs
    };

    onContentChange(content);
  });

  return () => setTimeout(update, 0);
};

export default useUpdateContent;
