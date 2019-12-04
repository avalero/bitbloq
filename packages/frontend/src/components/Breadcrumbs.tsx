import React, { useEffect, useRef, useMemo, useState } from "react";
import styled from "@emotion/styled";

import { DropDown, Icon, useTranslate } from "@bitbloq/ui";

export interface IBreadcrumbLink {
  route?: string;
  text: string;
  type: "folder" | "document";
}

export interface IBreadcrumbsProps {
  links: IBreadcrumbLink[];
  title?: string;
}

const Breadcrumbs: React.FC<IBreadcrumbsProps> = ({ links, title }) => {
  const t = useTranslate();

  const breadcrumbTarget = useRef<HTMLLIElement>(null);
  const breadcrumbTargetParent = useRef<HTMLDivElement>(null);

  const [maxWidth, setMaxWidth] = useState(0);

  const setElementMaxWidth = (): void => {
    const element = breadcrumbTarget.current as HTMLLIElement;
    const parentElement = breadcrumbTargetParent.current as HTMLDivElement;

    if (element && breadcrumbTargetParent) {
      const elementLeft = element.offsetLeft;
      const parentLeft = parentElement.offsetLeft;
      const parentWidth = parentElement.offsetWidth;

      const newMaxWidth = parentLeft + parentWidth - elementLeft;
      setMaxWidth(newMaxWidth);
    }
  };

  useEffect(() => {
    setElementMaxWidth();
    window.addEventListener("resize", setElementMaxWidth);

    return () => window.removeEventListener("resize", setElementMaxWidth);
  });

  const [customLinks, hideFolders] = useMemo(() => {
    if (links.length > 4) {
      return [links.slice(links.length - 3), links.slice(1, links.length - 3)];
    } else {
      return [links.slice(1), []];
    }
  }, [links]);

  return (
    <Wrap>
      <Links aria-label="Migas de pan">
        <BreadcrumbRoot>
          <a href={(links && links[0] && links[0].route) || ""}>
            {t("breadcrumbs-root")}
          </a>
        </BreadcrumbRoot>
        {hideFolders.length > 0 ? (
          <>
            <Separator name="angle" />
            <DropDown
              attachmentPosition="top left"
              targetPosition="bottom left"
              offset="-6px 0"
            >
              {(isOpen: boolean) => (
                <FoldersMenu isOpen={isOpen}>
                  <Icon name="ellipsis" />
                </FoldersMenu>
              )}
              <FolderSelectorOptions>
                {hideFolders.map((folder, index) => (
                  <FolderSelectorOption key={index} href={folder.route}>
                    <MenuIcon name="folder-icon" />
                    <p>{folder.text}</p>
                  </FolderSelectorOption>
                ))}
              </FolderSelectorOptions>
            </DropDown>
          </>
        ) : (
          <></>
        )}
        <BreadcrumbsNoRoot
          isThereHidden={hideFolders.length > 0}
          ref={breadcrumbTargetParent}
        >
          {customLinks &&
            customLinks.map((link, index) => (
              <React.Fragment key={index}>
                <Separator name="angle" />
                {index === customLinks.length - 1 ? (
                  <BreadcrumbTarget ref={breadcrumbTarget} maxWidth={maxWidth}>
                    <IconLink
                      name={
                        link.type === "document" ? "document" : "folder-icon"
                      }
                    />
                    <p>{title || link.text}</p>
                  </BreadcrumbTarget>
                ) : (
                  <BreadcrumbLink folders={links.length - 2}>
                    <IconLink name="folder-icon" />
                    <a href={link.route || ""}>{link.text}</a>
                  </BreadcrumbLink>
                )}
              </React.Fragment>
            ))}
        </BreadcrumbsNoRoot>
      </Links>
    </Wrap>
  );
};

export default Breadcrumbs;

const Breadcrumb = styled.li`
  align-items: center;
  color: #373b44;
  display: flex;
  font-size: 14px;
  font-weight: normal;
  justify-content: flex-start;

  a,
  p {
    margin: 0;
    overflow: hidden;
    padding-right: 2px;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a {
    color: inherit;
    font-weight: bold;
  }
`;

const BreadcrumbLink = styled(Breadcrumb)<{ folders: number }>`
  max-width: ${props =>
    props.folders === 1 ? "50" : props.folders === 2 ? "30" : "25"}%;

  a {
    height: 16px;
    padding: 0;
  }
`;

const BreadcrumbRoot = styled(Breadcrumb)`
  flex: 0 0;
`;

const BreadcrumbsNoRoot = styled.div<{ isThereHidden: boolean }>`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: flex-start;
  width: calc(100% - 110px - ${props => (props.isThereHidden ? 65 : 0)}px);
`;

const BreadcrumbTarget = styled(Breadcrumb)<{ maxWidth: number }>`
  max-width: ${props => props.maxWidth}px;

  p {
    height: 16px;
    padding: 0;
  }
`;

const FoldersMenu = styled.div<{ isOpen: boolean }>`
  align-items: center;
  background-color: ${props => (props.isOpen ? "#e8e8e8" : "#fff")};
  border: solid 1px #dddddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 34px;
  justify-content: center;
  width: 34px;

  &:hover {
    background-color: #e8e8e8;
  }

  svg {
    height: 14px;
    width: 14px;
  }
`;

const FolderSelectorOption = styled.a`
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  display: flex;
  height: 35px;
  padding: 0 14px 0 13px;
  text-decoration: none;

  p {
    color: #3b3e45;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background-color: #ebebeb;
  }
`;

const FolderSelectorOptions = styled.div`
  background-color: white;
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  max-height: 303px;
  max-width: 849px;
  overflow: scroll;

  &:hover {
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const IconLink = styled(Icon)`
  flex-shrink: 0;
  margin-right: 6px;
  height: 20px;
  width: 20px;
`;

const Links = styled.ul`
  align-items: center;
  display: flex;
  font-size: 16px;
  height: 100%;
  justify-content: flex-start;
  width: 100%;
`;

const MenuIcon = styled(Icon)`
  flex-shrink: 0;
  height: 13px;
  margin-right: 14px;
  width: 13px;
`;

const Separator = styled(Icon)`
  flex-shrink: 0;
  height: 13px;
  margin: 10px;
  transform: rotate(-90deg);
  width: 13px;
`;

const Wrap = styled.nav`
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: flex-start;
  overflow: hidden;
  width: 100%;
`;
