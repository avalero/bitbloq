import _ from "lodash";
import React, { FC } from "react";
import { colors, Icon, Option, Tooltip, useTranslate } from "@bitbloq/ui";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { IPlan } from "../types";

interface IPlanOptionProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  plan: IPlan;
  showFeatures?: boolean;
}

const PlanOption: FC<IPlanOptionProps> = ({
  checked,
  className,
  disabled,
  onClick,
  plan,
  showFeatures
}) => {
  const t = useTranslate();

  return (
    <PlanContainer className={className} disabled={disabled}>
      <PlanHeader>
        {checked !== undefined && (
          <BulletOption
            checked={checked}
            disabled={disabled}
            onClick={onClick!}
          />
        )}
        <PlanTitle bullet={checked !== undefined}>
          <span>{t(`plans.${plan.name}`)}</span>
          {plan.isFree ? (
            <PlanCost>{t(`signup.plan-selection.free`)}</PlanCost>
          ) : plan.isBetaFree && plan.originalPrice ? (
            <PlanCost>
              <span>
                {t("signup.plan-selection.monthly-price", [
                  plan.originalPrice.toLocaleString()
                ])}
              </span>
              <span> {t(`signup.plan-selection.free-beta`)}</span>
            </PlanCost>
          ) : (
            plan.originalPrice && (
              <PlanCost>
                {t("signup.plan-selection.monthly-price", [
                  plan.originalPrice.toLocaleString()
                ])}
              </PlanCost>
            )
          )}
        </PlanTitle>
      </PlanHeader>
      {showFeatures && (
        <PlanFeatures>
          <p>
            {t(`signup.plan-selection.advantages`, [t(`plans.${plan.name}`)])}
          </p>
          {(plan.highlightedFeatures || []).map(feature => (
            <Feature key={feature}>
              <Tick name="tick" />
              {t(`plans.features.${feature}`)}
            </Feature>
          ))}
          {plan.bitbloqCloud && (
            <BitbloqCloud>
              <BitbloqCloudLogo name="cloud-logo" />
              {t("plans.includes-bitbloq-cloud")}
              <Tooltip
                position="bottom"
                content={t("plans.bitbloq-cloud-info")}
              >
                {tooltipProps => (
                  <div {...tooltipProps}>
                    <QuestionIcon name="interrogation" />
                  </div>
                )}
              </Tooltip>
            </BitbloqCloud>
          )}
        </PlanFeatures>
      )}
    </PlanContainer>
  );
};

export default PlanOption;

const BulletOption = styled(Option)``;

interface IPlanContainerProps {
  disabled?: boolean;
}

const PlanContainer = styled.div<IPlanContainerProps>`
  background-color: #fbfbfb;
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 20px;
  overflow: hidden;

  ${props =>
    props.disabled &&
    css`
      * {
        color: ${colors.disabledColor} !important;
      }
    `};
`;

const PlanHeader = styled.div`
  background-color: white;
  display: flex;
  height: 40px;

  ${BulletOption} {
    justify-content: center;
    width: 40px;
  }

  &:not(:last-child) {
    border-bottom: solid 1px #cfcfcf;
  }
`;

const PlanTitle = styled.div<{ bullet: boolean }>`
  align-items: center;
  border-left: ${props => (props.bullet ? "solid 1px #cfcfcf" : "none")};
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0 20px;
`;

const PlanCost = styled.div`
  font-weight: bold;

  > :first-of-type {
    color: #e0e0e0;
    text-decoration: line-through;
  }
`;

const PlanFeatures = styled.div`
  background-color: white;
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  margin: 20px;
  padding: 20px;

  > p {
    font-weight: bold;
  }
`;

const Feature = styled.li`
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

const BitbloqCloud = styled.div`
  display: flex;
  align-items: center;
`;

const BitbloqCloudLogo = styled(Icon)`
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const Tick = styled(Icon)`
  color: ${colors.green};
  margin-right: 5px;
  svg {
    width: 14px;
  }
`;

const QuestionIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  cursor: pointer;
`;
