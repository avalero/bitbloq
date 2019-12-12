import React, { FC, useState } from "react";
import { useMutation } from "react-apollo";
import styled from "@emotion/styled";
import { DialogModal, Button, Modal, useTranslate } from "@bitbloq/ui";
import { CHANGE_PLAN_MUTATION } from "../apollo/queries";
import { plans } from "../config";
import ErrorLayout from "./ErrorLayout";
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

  const [changePlan, { error }] = useMutation(CHANGE_PLAN_MUTATION);
  const [planChanged, setPlanChanged] = useState<boolean>(false);
  const t = useTranslate();

  const onClose = () => {
    setPlanChanged(false);
    onCancel();
  };

  const onSubmitPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await changePlan({
      variables: {
        userPlan: "teacher"
      }
    });
    setPlanChanged(true);
  };

  return (
    <>
      {error && <ErrorLayout code="500" />}
      <DialogModal
        isOpen={isOpen && planChanged}
        title={t("account.user-data.plan.changed-title")}
        text={t("account.user-data.plan.changed")}
        okText={t("general-accept-button")}
        onOk={onClose}
      />
      <Modal
        className={className}
        isOpen={isOpen && !planChanged}
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
    </>
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
