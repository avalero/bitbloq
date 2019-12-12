import React, { FC, useState } from "react";
import { useMutation } from "react-apollo";
import styled from "@emotion/styled";
import { DialogModal, Button, Input, Modal, useTranslate } from "@bitbloq/ui";
import { CHANGE_PASSWORD_MUTATION } from "../apollo/queries";
import { plans } from "../config";
import ErrorMessage from "./ErrorMessage";
import PlanOption from "./PlanOption";

interface IChangePlanModalProps {
  className?: string;
  disabledSave?: boolean;
  title?: string;
  onCancel: () => any;
  transparentOverlay?: boolean;
  isOpen?: boolean;
}

const ChangePlanModal: FC<IChangePlanModalProps> = props => {
  const {
    className,
    disabledSave = false,
    onCancel,
    isOpen = true,
    transparentOverlay
  } = props;

  const teacherPlan = plans.filter(p => p.name === "teacher")[0];

  const t = useTranslate();

  const onClose = () => {
    onCancel();
  };

  const onSubmitPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      title={t("account.user-data.plan.button")}
      onClose={onClose}
      transparentOverlay={transparentOverlay}
    >
      <Content>
        <form onSubmit={onSubmitPlan}>
          <PlanLabel>{t("account.user-data.plan.label")}</PlanLabel>
          <PlanContent plan={teacherPlan} showFeatures={true} />
          <Buttons>
            <Button
              tertiary
              type="button"
              onClick={() => {
                onClose();
              }}
            >
              {t("general-cancel-button")}
            </Button>
            <Button type="submit" disabled={disabledSave}>
              {t("account.user-data.plan.button")}
            </Button>
          </Buttons>
        </form>
      </Content>
    </Modal>
  );
};

export default ChangePlanModal;

/* styled components */

const Content = styled.div`
  box-sizing: border-box;
  padding: 30px;
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 50px;
  justify-content: space-between;
  ${Button} {
    height: 40px;
    border-radius: 4px;
  }
`;

const PlanContent = styled(PlanOption)`
  font-size: 14px;
  margin: 0;
  width: 740px;

  p {
    margin: 0 0 12px;
  }
`;

const PlanLabel = styled.label`
  color: #323843;
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
  height: 16px;
  margin-bottom: 10px;
`;
