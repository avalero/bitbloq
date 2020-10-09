import React, { FC, createContext, useContext } from "react";
import { IBloqType } from "./types";

export interface IBloqsDefinitionContext {
  bloqTypes: IBloqType[];
  bloqTypesMap: Record<string, IBloqType>;
  categoryBloqs: Record<string, IBloqType[]>;
}

export const BloqsDefinitionContext = createContext<IBloqsDefinitionContext>({
  bloqTypes: [],
  bloqTypesMap: {},
  categoryBloqs: {}
});

export interface IBloqsDefinitionProviderProps {
  bloqTypes: IBloqType[];
  categories: string[];
}

export const BloqsDefinitionProvider: FC<IBloqsDefinitionProviderProps> = ({
  bloqTypes,
  categories,
  children
}) => {
  const bloqTypesMap = bloqTypes.reduce(
    (map, b) => ({ ...map, [b.name]: b }),
    {}
  );

  const categoryBloqs = categories.reduce(
    (acc, category) => ({
      ...acc,
      [category]: bloqTypes.filter(bloq => bloq.category === category)
    }),
    {}
  );

  return (
    <BloqsDefinitionContext.Provider
      value={{ bloqTypes, bloqTypesMap, categoryBloqs }}
    >
      {children}
    </BloqsDefinitionContext.Provider>
  );
};

interface IUseBloqsDefinition {
  bloqTypes: IBloqType[];
  getBloqType: (name: string) => IBloqType;
  getCategoryBloqs: (name: string) => IBloqType[];
}
const useBloqsDefinition = (): IUseBloqsDefinition => {
  const { bloqTypes, bloqTypesMap, categoryBloqs } = useContext(
    BloqsDefinitionContext
  );

  const getBloqType = (name: string) => bloqTypesMap[name];
  const getCategoryBloqs = (name: string) => categoryBloqs[name];

  return { bloqTypes, getBloqType, getCategoryBloqs };
};

export default useBloqsDefinition;
