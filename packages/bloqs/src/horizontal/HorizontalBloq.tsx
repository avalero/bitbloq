import React from "react";
import styled from "@emotion/styled";
import nunjucks from "nunjucks";
import { colors, Icon } from "@bitbloq/ui";
import IconComponent from "./IconComponent";

import { IBloqType, IBloq, isBloqSelectComponentParameter } from "../index";
import { BloqCategory } from "../enums";

interface IHorizontalBloqProps {
  type?: IBloqType;
  className?: string;
  onClick?: React.MouseEventHandler;
  selected?: boolean;
  disabled?: boolean;
  bloq?: IBloq;
  port?: string;
  shadow?: boolean;
  active?: boolean;
  gray?: boolean;
  activeIndicator?: React.ReactNode;
  selectable?: boolean;
}

const COLORS = {
  [BloqCategory.Event]: {
    dark: "#9A7C22",
    light: "#D8AF31"
  },
  [BloqCategory.Action]: {
    dark: "#448A24",
    light: "#59B52E"
  },
  [BloqCategory.Wait]: {
    dark: "#AD480B",
    light: "#DD5B0C"
  },
  [BloqCategory.Loop]: {
    dark: "#6b4191",
    light: "#8955b8"
  },
  [BloqCategory.EndLoop]: {
    dark: "#6b4191",
    light: "#8955b8"
  }
};

const SHAPES = {
  [BloqCategory.Event]: {
    main: "#block-event-shape",
    shadow: "#block-event-shadow-shape"
  },
  [BloqCategory.Action]: {
    main: "#block-action-shape",
    shadow: "#block-action-shadow-shape"
  },
  [BloqCategory.Wait]: {
    main: "#block-wait-shape",
    shadow: "#block-wait-shadow-shape"
  },
  [BloqCategory.Loop]: {
    main: "#block-action-shape",
    shadow: "#block-action-shadow-shape"
  },
  [BloqCategory.EndLoop]: {
    main: "#block-small-action-shape",
    shadow: "#block-small-action-shadow-shape"
  }
};

const IS_SMALL = {
  [BloqCategory.EndLoop]: true
};

const HorizontalBloq: React.FunctionComponent<IHorizontalBloqProps> = ({
  type,
  className,
  onClick,
  selected,
  disabled,
  bloq,
  port,
  shadow = true,
  active,
  gray,
  activeIndicator,
  selectable = true
}) => {
  if (!type) {
    return null;
  }
  const parameters = (bloq && bloq.parameters) || {};
  let icon = type.icon;
  const { iconSwitch, iconComponent } = type;
  if (iconSwitch) {
    const iconKey = Object.keys(iconSwitch).find(
      key => nunjucks.renderString(`{{${key}}}`, parameters) === "true"
    );
    icon = iconSwitch[iconKey || Object.keys(iconSwitch)[0]];
  }

  const missingComponent = port === "?";
  const showDisabled = disabled || missingComponent;

  const isSmall = !!IS_SMALL[type.category];

  const lightColor = gray ? colors.gray7 : COLORS[type.category].light;
  const darkColor = gray ? colors.gray7 : COLORS[type.category].dark;

  return (
    <Container
      className={className}
      onClick={onClick}
      isSmall={isSmall}
      selectable={selectable}
      data-active={active}
    >
      <SVG isSmall={isSmall}>
        <defs>
          <path
            id="block-event-shape"
            d="M79.501 34.189L78 33.802V3a1 1 0 00-1-1H24C11.85 2 2 11.85 2 24v32c0 12.15 9.85 22 22 22h53a1 1 0 001-1V46.198l1.501-.387a6.003 6.003 0 000-11.622z"
          />
          <path
            id="block-event-shadow-shape"
            d="M80 32.252c3.45.888 6 4.02 6 7.748v3c0 3.728-2.55 6.86-6 7.748V80a3 3 0 01-3 3H24C10.745 83 0 72.255 0 59V27C0 13.745 10.745 3 24 3h53a3 3 0 013 3v26.252z"
          />
          <path
            id="block-action-shape"
            d="M2 29.043C5.687 31.4 8 35.495 8 40c0 4.505-2.313 8.6-6 10.957V77a1 1 0 001 1h74a1 1 0 001-1V46.198l1.501-.387a6.003 6.003 0 000-11.622L78 33.802V3a1 1 0 00-1-1H3a1 1 0 00-1 1v26.043z"
          />
          <path
            id="block-action-shadow-shape"
            d="M0 33.2V6a3 3 0 013-3h74a3 3 0 013 3v26.252c3.45.888 6 4.02 6 7.748v3c0 3.728-2.55 6.86-6 7.748V80a3 3 0 01-3 3H3a3 3 0 01-3-3V52.8A11 11 0 006 43a11 11 0 00-6-9.8z"
          />
          <path
            id="block-small-action-shape"
            d="M0 30.2V3c0-1.657 1.343-3 3-3h34c1.657 0 3 1.343 3 3v29.252c3.45.888 6 4.02 6 7.748 0 3.728-2.55 6.86-6 7.748V77c0 1.657-1.343 3-3 3H3c-1.657 0-3-1.343-3-3V49.8c3.562-1.82 6-5.525 6-9.8s-2.438-7.98-6-9.8z"
          />
          <path
            id="block-small-action-shadow-shape"
            d="M0 33.2V6c0-1.657 1.343-3 3-3h34c1.657 0 3 1.343 3 3v26.252c3.45.888 6 4.02 6 7.748v3c0 3.728-2.55 6.86-6 7.748V80c0 1.657-1.343 3-3 3H3c-1.657 0-3-1.343-3-3V52.8c3.562-1.82 6-5.525 6-9.8s-2.438-7.98-6-9.8z"
          />
          <path
            id="block-wait-shape"
            d="M0 30.2V24C0 10.745 10.745 0 24 0h32c13.255 0 24 10.745 24 24v8.252a8.003 8.003 0 010 15.496V56c0 13.255-10.745 24-24 24H24C10.745 80 0 69.255 0 56v-6.2A11 11 0 006 40a11 11 0 00-6-9.8z"
          />
          <path
            id="block-wait-shadow-shape"
            d="M0 33.2V27C0 13.745 10.745 3 24 3h32c13.255 0 24 10.745 24 24v5.252c3.45.888 6 4.02 6 7.748v3c0 3.728-2.55 6.86-6 7.748V59c0 13.255-10.745 24-24 24H24C10.745 83 0 72.255 0 59v-6.2A11 11 0 006 43a11 11 0 00-6-9.8z"
          />
          <pattern
            id="diagonalHatch"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
          >
            <path
              d="M-1,1 l2,-2
               M0,8 l8,-8
               M7,9 l2,-2"
              stroke="#e5e5e5"
              strokeWidth={2}
            />
          </pattern>
          <filter id="horizontal-bloq-active-outline">
            <feMorphology
              in="SourceAlpha"
              result="DILATED"
              operator="dilate"
              radius="3"
            ></feMorphology>

            <feFlood
              floodColor="#ff7354"
              floodOpacity="1"
              result="ORANGE"
            ></feFlood>
            <feComposite
              in="ORANGE"
              in2="DILATED"
              operator="in"
              result="OUTLINE"
            ></feComposite>

            <feMerge>
              <feMergeNode in="OUTLINE" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g
          fill="none"
          filter={active ? "url(#horizontal-bloq-active-outline)" : ""}
          transform="translate(4,4)"
        >
          {shadow && (
            <use
              xlinkHref={SHAPES[type.category].shadow}
              fill={showDisabled ? "#bbb" : darkColor}
            />
          )}
          {showDisabled && (
            <use
              xlinkHref={SHAPES[type.category].main}
              fill="#FFF"
              stroke="#FFF"
              strokeWidth={type.category === BloqCategory.Wait ? 0 : 4}
            />
          )}
          <use
            xlinkHref={SHAPES[type.category].main}
            fill={showDisabled ? "url('#diagonalHatch')" : lightColor}
            stroke={showDisabled ? "url('#diagonalHatch')" : lightColor}
            strokeWidth={type.category === BloqCategory.Wait ? 0 : 4}
          />
          {port && (
            <g transform="translate(6 67)">
              <rect
                width={18}
                height={16}
                y={5}
                fill={showDisabled ? "#bbb" : darkColor}
                rx={2}
              />
              {showDisabled && (
                <rect width={18} height={18} fill="#FFF" rx={2} />
              )}
              <rect
                width={18}
                height={18}
                fill={showDisabled ? "url('#diagonalHatch')" : lightColor}
                rx={2}
              />
              <text
                fill={
                  missingComponent
                    ? colors.red
                    : showDisabled
                    ? colors.black
                    : "#FFF"
                }
                fontSize="16px"
                fontWeight="bold"
                x={9}
                y={11}
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {port}
              </text>
            </g>
          )}
        </g>
      </SVG>
      {!gray && icon && !iconComponent && (
        <BloqIcon src={icon} alt={type.name} />
      )}
      {!gray && iconComponent && (
        <IconComponent bloq={bloq} component={iconComponent} />
      )}
      {active && activeIndicator}
    </Container>
  );
};

export default HorizontalBloq;

/* styled components */

const Container = styled.div<{ isSmall: boolean; selectable: boolean }>`
  cursor: ${props => (props.selectable ? "pointer" : "inherit")};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  width: ${props => (props.isSmall ? 46 : 86)}px;
  height: 83px;
`;

const BloqIcon = styled.img`
  margin-left: -4px;
  width: 54px;
  height: 54px;
  z-index: 1;
`;

interface IPortIndicatorProps {
  error: boolean;
}
const PortIndicator = styled.div<IPortIndicatorProps>`
  position: absolute;
  left: 50%;
  top: 60px;
  transform: translate(-50%, -50%);
  height: 24px;
  width: 24px;
  border-radius: 14px;
  border: 1px solid #979797;
  background-color: #d8d8d8;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.error ? colors.red : "#000")};
  z-index: 2;
`;

const SVG = styled.svg<{ isSmall: boolean }>`
  position: absolute;
  top: -4px;
  left: -4px;
  width: ${props => (props.isSmall ? 54 : 94)}px;
  height: 96px;
`;
