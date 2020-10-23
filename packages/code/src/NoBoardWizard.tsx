import React, { FC, useEffect, useState } from "react";
import { DialogModal, useTranslate } from "@bitbloq/ui";

interface INoBoardWizardProps {
  isOpen: boolean;
  driversUrl: string;
  onClose: () => void;
}

enum Step {
  NoBoardSelected,
  NoBoardConnected,
  Drivers,
  CheckBoardAndCables
}

const NoBoardWizard: FC<INoBoardWizardProps> = ({
  isOpen,
  driversUrl,
  onClose
}) => {
  const t = useTranslate();
  const [step, setStep] = useState<Step>(Step.NoBoardSelected);

  useEffect(() => {
    setStep(Step.NoBoardSelected);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  if (step === Step.NoBoardSelected) {
    return (
      <DialogModal
        isOpen={true}
        title={t("code.no-board-wizard.no-board-selected-title")}
        text={t("code.no-board-wizard.no-board-selected-text")}
        okText={t("code.no-board-wizard.no-board-selected-ok")}
        cancelText={t("code.no-board-wizard.no-board-selected-cancel")}
        onOk={onClose}
        onCancel={() => setStep(Step.NoBoardConnected)}
      />
    );
  }

  if (step === Step.NoBoardConnected) {
    return (
      <DialogModal
        isOpen={true}
        title={t("code.no-board-wizard.no-board-connected-title")}
        text={t("code.no-board-wizard.no-board-connected-text")}
        okText={t("code.no-board-wizard.no-board-connected-ok")}
        cancelText={t("code.no-board-wizard.no-board-connected-cancel")}
        onOk={() => setStep(Step.Drivers)}
        onCancel={onClose}
      />
    );
  }

  if (step === Step.Drivers) {
    return (
      <DialogModal
        isOpen={true}
        title={t("code.no-board-wizard.drivers-title")}
        text={t("code.no-board-wizard.drivers-text")}
        okText={t("code.no-board-wizard.drivers-ok")}
        cancelText={t("code.no-board-wizard.drivers-cancel")}
        onOk={() => setStep(Step.CheckBoardAndCables)}
        onCancel={() => {
          window.open(driversUrl);
          onClose();
        }}
      />
    );
  }

  if (step === Step.CheckBoardAndCables) {
    return (
      <DialogModal
        isOpen={true}
        title={t("code.no-board-wizard.check-title")}
        text={t("code.no-board-wizard.check-text")}
        okText={t("code.no-board-wizard.check-ok")}
        onOk={onClose}
      />
    );
  }

  return null;
};

export default NoBoardWizard;
