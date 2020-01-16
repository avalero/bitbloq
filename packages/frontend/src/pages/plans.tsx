import React, { FC } from "react";
import styled from "@emotion/styled";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  colors,
  Button,
  Icon,
  HorizontalRule,
  Tooltip,
  useTranslate
} from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import LandingLayout from "../components/LandingLayout";
import NewDocumentButton from "../components/NewDocumentButton";
import { documentTypes, plans, featureTable } from "../config.js";
import { IPlan } from "../types";
import memberPlanImage from "../images/member-plan.svg";
import teacherPlanImage from "../images/teacher-plan.svg";

const PlansPage: NextPage = () => {
  const t = useTranslate();
  const router = useRouter();
  const unregisteredPlan = plans.find(p => p.name === "unregistered");
  const memberPlan = plans.find(p => p.name === "member");
  const teacherPlan = plans.find(p => p.name === "teacher");

  const tablePlans = [unregisteredPlan, memberPlan, teacherPlan];

  return (
    <LandingLayout headerFixed={true}>
      <Header>{t("plans.choose-plan")}</Header>
      <Plans>
        {memberPlan && (
          <Plan plan={memberPlan} image={memberPlanImage} showAppList={true} />
        )}
        {teacherPlan && (
          <Plan plan={teacherPlan} image={teacherPlanImage} big={true} />
        )}
        <TryContent>
          <h2>{t("plans.try-it")}</h2>
          <h3>{t("plans.try-without-registration")}</h3>
          <NewDocumentButton
            quaternary
            attachmentPosition="top left"
            targetPosition="bottom left"
          />
        </TryContent>
      </Plans>
      <FeatureTable>
        <FeatureHeader>
          <FeatureName />
          {tablePlans.map(
            plan =>
              plan && (
                <FeaturePlan key={plan.name}>
                  {t(`plans.${plan.name}`)}
                </FeaturePlan>
              )
          )}
        </FeatureHeader>
        {featureTable.map(row => (
          <FeatureRow key={row}>
            <FeatureName>{t(`plans.features.${row}`)}</FeatureName>
            {tablePlans.map(
              plan =>
                plan && (
                  <FeaturePlan key={`${row} ${plan.name}`}>
                    {plan.featureTable.indexOf(row) >= 0 ? (
                      <Tick name="tick" />
                    ) : (
                      <Rectangle />
                    )}
                  </FeaturePlan>
                )
            )}
          </FeatureRow>
        ))}
        <ButtonRow>
          <FeatureName />
          <FeaturePlan>
            <NewDocumentButton />
          </FeaturePlan>
          {memberPlan && (
            <FeaturePlan>
              <PlanButton onClick={() => router.push("/signup?plan=member")}>
                {t(`plans.member-signup`)}
              </PlanButton>
            </FeaturePlan>
          )}
          {teacherPlan && (
            <FeaturePlan>
              <PlanButton onClick={() => router.push("/signup?plan=teacher")}>
                {t(`plans.teacher-signup`)}
              </PlanButton>
            </FeaturePlan>
          )}
        </ButtonRow>
      </FeatureTable>
    </LandingLayout>
  );
};

export default withApollo(PlansPage, {
  requiresSession: false,
  onlyWithoutSession: true
});

interface IPlanProps {
  image: string;
  plan: IPlan;
  big?: boolean;
  showAppList?: boolean;
}
const Plan: FC<IPlanProps> = ({ plan, big, image, showAppList }) => {
  const t = useTranslate();
  const router = useRouter();

  return (
    <PlanContainer big={big}>
      <PlanHeader big={big}>
        <img src={image} />
        <h2>{t(`plans.${plan.name}`)}</h2>
      </PlanHeader>
      <HorizontalRule small />
      <PlanContent>
        <PriceContainer>
          {plan.originalPrice && (
            <OldPricing>
              {t("plans.monthly-price", [plan.originalPrice.toLocaleString()])}
            </OldPricing>
          )}
          {plan.isFree || plan.isBetaFree
            ? t("plans.free")
            : t("plans.monthly-price", [(plan.price || "").toLocaleString()])}
          {plan.isBetaFree && (
            <PriceCaption>{t("plans.during-beta")}</PriceCaption>
          )}
        </PriceContainer>
        <h3>{t(`plans.${plan.name}-subtitle`)}</h3>
        {showAppList && (
          <AppList>
            {Object.keys(documentTypes)
              .map(id => ({ ...documentTypes[id], id }))
              .map(type => (
                <AppIcon color={type.color} key={type.id}>
                  <Icon name={type.icon} />
                </AppIcon>
              ))}
          </AppList>
        )}
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
            <Tooltip position="bottom" content={t("plans.bitbloq-cloud-info")}>
              {tooltipProps => (
                <div {...tooltipProps}>
                  <QuestionIcon name="interrogation" />
                </div>
              )}
            </Tooltip>
          </BitbloqCloud>
        )}
      </PlanContent>
      <PlanButton onClick={() => router.push(`/signup?plan=${plan.name}`)}>
        {t(`plans.${plan.name}-signup`)}
      </PlanButton>
    </PlanContainer>
  );
};

/* styled components */

const Header = styled.h1`
  font-size: 30px;
  font-weight: 300;
  text-align: center;
  max-width: 400px;
  margin: 60px auto 40px auto;
  line-height: 1.2;
`;

const Plans = styled.div`
  background-color: #f1f1f1;
  border-radius: 10px;
  display: flex;
  padding: 0px 60px;
  margin: 100px 0px;
  line-height: 1.2;
`;

const PlanContainer = styled.div<{ big?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: ${props => (props.big ? 380 : 340)}px;
  border-radius: 10px;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  margin: ${props => (props.big ? -57 : -43)}px 0px;

  &:first-of-type {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  h3 {
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
  }

  button {
    margin: 30px;
  }
`;

const PlanHeader = styled.div<{ big?: boolean }>`
  height: ${props => (props.big ? 190 : 170)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0px 30px 0px;
  }
`;

const PlanContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 0px 30px;
`;

const Rectangle = styled.div`
  background-color: #f1f1f1;
  height: 2px;
  margin: auto;
  width: 14px;
`;

const AppList = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const AppIcon = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: 10px;
  border-radius: 4px;
  color: white;
  background-color: ${props => props.color};

  &:last-of-type {
    margin-right: 0px;
  }

  svg {
    width: 32px;
  }
`;

const PriceContainer = styled.div`
  flex: 1;
  font-size: 40px;
  font-weight: bold;
  margin: 30px 0px;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`;

const OldPricing = styled.div`
  color: ${colors.red};
  font-weight: bold;
  text-decoration: line-through;
  font-size: 16px;
`;

const PriceCaption = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const Feature = styled.li`
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const BitbloqCloud = styled.div`
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`;

const BitbloqCloudLogo = styled(Icon)`
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const QuestionIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  cursor: pointer;
`;

const Tick = styled(Icon)`
  color: ${colors.green};
  margin-right: 5px;
  svg {
    width: 14px;
  }
`;

const PlanButton = styled(Button)`
  font-size: 14px;
  padding: 0px 10px;
`;

const TryContent = styled.div`
  flex: 1;
  padding: 30px 0px 30px 30px;
  h2 {
    margin: 20px 0px 10px 0px;
    font-size: 40px;
    font-weight: bold;
  }
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
`;

const FeatureTable = styled.div`
  margin-bottom: 160px;
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  border-bottom: 1px solid ${colors.gray4};
  display: flex;
  font-size: 14px;

  &:hover {
    background-color: ${colors.gray2};
  }
`;

const FeatureHeader = styled(FeatureRow)`
  font-size: 18px;
  font-weight: bold;
`;

const FeatureName = styled.div`
  flex: 1;
`;

const FeaturePlan = styled.div`
  width: 216px;
  text-align: center;
  padding-right: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  margin-top: 20px;
  button {
    width: 100%;
  }
`;
