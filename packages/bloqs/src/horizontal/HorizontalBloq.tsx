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

const HorizontalBloq: React.FunctionComponent<IHorizontalBloqProps> = ({
  type,
  className,
  onClick,
  selected,
  disabled,
  bloq,
  port,
  shadow = true
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

  return (
    <Container className={className} onClick={onClick}>
      <SVG>
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
            d="M2 29.043C5.687 31.4 8 35.495 8 40c0 4.505-2.313 8.6-6 10.957V77a1 1 0 001 1h74a1 1 0 001-1V46.198l1.501-.387a6.003 6.003 0 000-11.622L78 33.802V3a1 1 0 00-1-1H3a1 1 0 00-1 1v26.043z"
          />
          <path
            id="block-small-action-shadow-shape"
            d="M0 33.2V6a3 3 0 013-3h74a3 3 0 013 3v26.252c3.45.888 6 4.02 6 7.748v3c0 3.728-2.55 6.86-6 7.748V80a3 3 0 01-3 3H3a3 3 0 01-3-3V52.8A11 11 0 006 43a11 11 0 00-6-9.8z"
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
        </defs>
        <g fill="none">
          {shadow && (
            <use
              xlinkHref={SHAPES[type.category].shadow}
              fill={showDisabled ? "#bbb" : COLORS[type.category].dark}
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
            fill={
              showDisabled
                ? "url('#diagonalHatch')"
                : COLORS[type.category].light
            }
            stroke={
              showDisabled
                ? "url('#diagonalHatch')"
                : COLORS[type.category].light
            }
            strokeWidth={type.category === BloqCategory.Wait ? 0 : 4}
          />
          {port && (
            <g transform="translate(6 67)">
              <rect
                width={18}
                height={16}
                y={5}
                fill={showDisabled ? "#bbb" : COLORS[type.category].dark}
                rx={2}
              />
              {showDisabled && (
                <rect width={18} height={18} fill="#FFF" rx={2} />
              )}
              <rect
                width={18}
                height={18}
                fill={
                  showDisabled
                    ? "url('#diagonalHatch')"
                    : COLORS[type.category].light
                }
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
      {icon && !iconComponent && <BloqIcon src={icon} alt={type.name} />}
      {iconComponent && <IconComponent bloq={bloq} component={iconComponent} />}
    </Container>
  );
};

export default HorizontalBloq;

/* styled components */

const Container = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  width: 86px;
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

const SVG = styled.svg`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 86px;
  height: 88px;
`;
