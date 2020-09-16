import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Markdown from "react-markdown";
import { Icon, Tooltip, useTranslate } from "@bitbloq/ui";
import config from "../config";
import { IObjectsCommonJSON } from "@bitbloq/lib3d";

export interface IToolbarProps {
  objects: IObjectsCommonJSON[];
  onCreateObject: (object: any) => any;
  selectedObjects: IObjectsCommonJSON[];
  advancedMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => any;
  onRedo: () => any;
}

const Toolbar: FC<IToolbarProps> = ({
  objects,
  onCreateObject,
  selectedObjects,
  advancedMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const t = useTranslate();
  const onComposeObjects = (operation: any, label: string) => {
    const object = {
      ...operation.create(selectedObjects),
      operations: config.defaultOperations(advancedMode),
      viewOptions: {
        name: label
      }
    };

    onCreateObject(object);
  };

  return (
    <Container>
      <Operations>
        {config.compositionOperations.map(operation => {
          if (operation.advancedMode && !advancedMode) {
            return;
          }

          const { minObjects = 0, maxObjects = Infinity } = operation;
          const numObjects = selectedObjects.length;
          const topObjects = selectedObjects.every(o => objects.includes(o));
          const canApply =
            topObjects && numObjects >= minObjects && numObjects <= maxObjects;

          let tooltipContent: React.ReactChild = "";
          if (canApply) {
            tooltipContent = t(operation.label);
          } else {
            if (!topObjects) {
              tooltipContent = <Markdown source={t("tooltip-select-top")} />;
            } else if (minObjects > 1) {
              tooltipContent = (
                <Markdown source={t("tooltip-select-multiple")} />
              );
            } else if (maxObjects === 1) {
              tooltipContent = <Markdown source={t("tooltip-select-one")} />;
            }
          }

          return (
            <Tooltip key={operation.name} content={tooltipContent}>
              {tooltipProps => (
                <Button
                  {...tooltipProps}
                  disabled={!canApply}
                  onClick={() =>
                    canApply && onComposeObjects(operation, t(operation.label))
                  }
                >
                  {operation.icon}
                </Button>
              )}
            </Tooltip>
          );
        })}
      </Operations>
      <UndoRedo>
        <Tooltip content={t("undo")}>
          {tooltipProps => (
            <Button
              {...tooltipProps}
              disabled={!canUndo}
              onClick={() => canUndo && onUndo()}
            >
              <Icon name="undo" />
            </Button>
          )}
        </Tooltip>
        <Tooltip content={t("redo")}>
          {tooltipProps => (
            <Button
              {...tooltipProps}
              disabled={!canRedo}
              onClick={() => canRedo && onRedo()}
            >
              <Icon name="redo" />
            </Button>
          )}
        </Tooltip>
      </UndoRedo>
    </Container>
  );
};

export default React.memo(Toolbar);

/* styled components */
const Container = styled.div`
  height: 50px;
  border-bottom: 1px solid #cfcfcf;
  padding: 0px 20px;
  display: flex;
`;

interface IButtonProps {
  disabled?: boolean;
}

const Button = styled.div<IButtonProps>`
  background-color: #ebebeb;
  width: 60px;
  border-width: 0px 1px;
  border-style: solid;
  border-color: #cfcfcf;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -1px;

  img {
    width: 20px;
    height: auto;
  }

  ${props =>
    props.disabled &&
    css`
      color: #bdc0c6;
      cursor: not-allowed;
    `};
`;

const Operations = styled.div`
  flex: 1;
  display: flex;
`;

const UndoRedo = styled.div`
  display: flex;
`;
