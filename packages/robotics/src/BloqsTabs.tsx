import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import styled from "@emotion/styled";
import {
  breakpoints,
  colors,
  Draggable,
  Icon,
  HorizontalTabs,
  Tabs,
  useTranslate
} from "@bitbloq/ui";
import { bloqCategories, bloqSubCategories } from "./config";
import Bloq from "./Bloq";
import DeleteDroppable from "./DeleteDroppable";
import useBloqsDefinition from "./useBloqsDefinition";
import { draggingBloqsState, componentsState, boardState } from "./state";
import { BloqCategory, BloqSubCategory, IBloqType } from "./types";
import useHardwareDefinition from "./useHardwareDefinition";

const BloqsTabs: FC = () => {
  const t = useTranslate();
  const { getCategoryBloqs } = useBloqsDefinition();
  const { isInstanceOf, getBoard } = useHardwareDefinition();
  const components = useRecoilValue(componentsState);
  const board = useRecoilValue(boardState);
  const boardObject = board && getBoard(board.name);

  const getSubTabs = (category: BloqCategory) => {
    const bloqs = getCategoryBloqs(category).filter(
      bloq =>
        !bloq.forComponents ||
        bloq.forComponents.some(
          type =>
            boardObject?.integrated.some(c =>
              isInstanceOf(c.component, type)
            ) || components.some(c => isInstanceOf(c.component, type))
        )
    );
    const subCategoryBloqs = bloqs.reduce((acc, bloq) => {
      if (!acc[bloq.subCategory]) {
        acc[bloq.subCategory] = [];
      }
      acc[bloq.subCategory].push(bloq);
      return acc;
    }, {} as Record<BloqSubCategory, IBloqType[]>);

    return (
      <HorizontalTabs
        tabs={bloqSubCategories
          .filter(subCategory => subCategoryBloqs[subCategory])
          .map(subCategory => ({
            label: t(`robotics.tabs.${subCategory}`),
            content: (
              <SubTab>
                {subCategoryBloqs[subCategory].map(bloqType => (
                  <Draggable
                    data={{ bloqs: [{ type: bloqType.name }] }}
                    draggableHeight={0}
                    draggableWidth={0}
                    key={bloqType.name}
                  >
                    {props => (
                      <BloqWrap {...props}>
                        <Bloq
                          bloq={{ type: bloqType.name }}
                          section=""
                          path={[0]}
                        />
                      </BloqWrap>
                    )}
                  </Draggable>
                ))}
              </SubTab>
            )
          }))}
      />
    );
  };

  const bloqsTabs = bloqCategories.map(category => ({
    icon: category.icon ? (
      <Icon name={category.icon} />
    ) : (
      t(category.iconText || "")
    ),
    label: t(category.label),
    content: (
      <Tab>
        <TabHeader>{t(`robotics.tab-header.${category.name}`)}</TabHeader>
        {getSubTabs(category.name)}
      </Tab>
    ),
    color: category.color
  }));

  return (
    <Container>
      <Tabs tabs={bloqsTabs} />
      <BloqsDeleteDroppable />
    </Container>
  );
};

export default BloqsTabs;

const BloqsDeleteDroppable: FC = () => {
  const draggingBloqs = useRecoilValue(draggingBloqsState);

  if (draggingBloqs.bloqs.length === 0) {
    return null;
  }

  return <DeleteDroppable />;
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${colors.gray3};
`;

const Tab = styled.div`
  width: 320px;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 350px;
  }
`;

const TabHeader = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: 50px;
  }
`;

const BloqWrap = styled.div`
  display: inline-block;
  margin-bottom: 10px;
`;

const SubTab = styled.div`
  padding: 20px;
`;
