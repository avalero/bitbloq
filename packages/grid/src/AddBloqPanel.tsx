import React, { FC, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Icon, JuniorButton } from "@bitbloq/ui";
import {
  IBloqType,
  BloqCategory,
  BloqPlaceholder,
  HorizontalBloq
} from "@bitbloq/bloqs";
import { bloqTypes } from "./config";

const bloqWidth = 96; // px

interface IAddBloqPanelProps {
  isOpen: boolean;
  availableBloqs: { [bloq: string]: number };
  onSelectBloqType: (bloqType: IBloqType) => any;
  onClose: () => any;
  selectedLeft: number;
}

const AddBloqPanel: FC<IAddBloqPanelProps> = ({
  isOpen,
  availableBloqs,
  onSelectBloqType,
  onClose,
  selectedLeft
}) => {
  const bloqsRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<number | undefined>(undefined);

  const handleScroll = () => {
    if (!bloqsRef.current) {
      return;
    }

    const container = bloqsRef.current!;
    const content = container.firstElementChild!;

    const newScroll = Math.min(
      Math.round(
        (container.scrollLeft * 10) /
          (content.getBoundingClientRect().width -
            container.getBoundingClientRect().width)
      ) / 10,
      1
    );

    Number.isNaN(newScroll) ||
    content.getBoundingClientRect().width <
      container.getBoundingClientRect().width
      ? setScroll(undefined)
      : setScroll(newScroll);
  };

  const scrollBy = (left: number) => {
    bloqsRef.current!.scrollBy({
      behavior: "smooth",
      left
    });
  };

  useEffect(() => {
    handleScroll();
  }, [availableBloqs]);

  useEffect(() => {
    if (!bloqsRef.current) {
      return;
    }

    handleScroll();
    window.addEventListener("resize", handleScroll);
    bloqsRef.current!.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Overlay />
      <Container>
        <CloseButton onClick={onClose}>
          <Icon name="close" />
        </CloseButton>
        <BloqPlaceholderWrap left={selectedLeft + 10}>
          <BloqPlaceholder category={BloqCategory.Event} selected={true} />
        </BloqPlaceholderWrap>
        {scroll !== undefined && scroll > 0 && (
          <ScrollLeftButton>
            <JuniorButton secondary onClick={() => scrollBy(-bloqWidth)}>
              <Icon name="angle" />
            </JuniorButton>
          </ScrollLeftButton>
        )}
        <BloqsWrapper hasScroll={scroll !== undefined} ref={bloqsRef}>
          <Bloqs>
            {Object.keys(availableBloqs).map(typeName => {
              const type = bloqTypes.find(t => t.name === typeName)!;
              return (
                <Bloq key={type.name}>
                  <HorizontalBloq
                    type={type}
                    onClick={() => onSelectBloqType(type)}
                  />
                  <BloqInformation>
                    {availableBloqs[typeName] > 0 ? (
                      availableBloqs[typeName]
                    ) : (
                      <>&#8734;</>
                    )}
                  </BloqInformation>
                </Bloq>
              );
            })}
          </Bloqs>
        </BloqsWrapper>
        {scroll !== undefined && scroll < 1 && (
          <ScrollRightButton>
            <JuniorButton secondary onClick={() => scrollBy(bloqWidth)}>
              <Icon name="angle" />
            </JuniorButton>
          </ScrollRightButton>
        )}
      </Container>
    </>
  );
};

export default AddBloqPanel;

/* Styled components */

const Bloq = styled.div`
  &:not(:last-of-type) {
    margin-right: 10px;
  }
`;

const BloqInformation = styled.div`
  box-sizing: content-box;
  font-size: 20px;
  font-weight: bold;
  height: 24px;
  padding-top: 5px;
  text-align: center;
`;

interface IBloqPlaceholderWrapProps {
  left: number;
}

const BloqPlaceholderWrap = styled.div<IBloqPlaceholderWrapProps>`
  position: absolute;
  bottom: 0px;
  transform: translate(0, 100%);
  left: ${props => props.left}px;
  background-color: white;
  padding: 10px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const Bloqs = styled.div`
  display: flex;
`;

interface IBloqsWrapperProps {
  hasScroll: boolean;
}

const BloqsWrapper = styled.div<IBloqsWrapperProps>`
  display: flex;
  overflow: auto;
  width: 100%;

  ${props =>
    !props.hasScroll &&
    `
    justify-content: center;
  `}
`;

const Container = styled.div`
  align-items: center;
  background-color: white;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 20px 107px 10px;
  position: absolute;
  width: 100%;
  z-index: 10; // zIndex description: 15
`;

const CloseButton = styled.div`
  align-items: center;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(-50%, -100%);
  width: 40px;

  svg {
    height: 20px;
    width: 20px;
  }
`;

const Overlay = styled.div`
  background-color: rgba(55, 59, 68, 0.3);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

const ScrollButton = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: absolute;
  top: 0;
  width: 60px;

  button {
    height: 40px;
    padding: 0px;
    width: 40px;

    svg {
      height: 20px;
      width: 20px;
    }
  }
`;

const ScrollLeftButton = styled(ScrollButton)`
  left: 0px;
  svg {
    transform: rotate(90deg);
  }
`;

const ScrollRightButton = styled(ScrollButton)`
  right: 0px;
  svg {
    transform: rotate(-90deg);
  }
`;
