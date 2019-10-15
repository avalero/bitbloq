import React, { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";

import { colors, Icon, useTranslate } from "@bitbloq/ui";

export interface BreadcrumbLink {
  route?: string;
  text: string;
  type: "folder" | "document";
}

export interface BreadcrumbsProps {
  links?: BreadcrumbLink[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links }) => {
  const t = useTranslate();

  const [maxWidth, setMaxWidth] = useState(0);

  const setElementMaxWidth = (): void => {
    const element: Element = document.getElementsByClassName(
      "breadcrumb-target"
    )[0];

    const elementLeft: number = element.offsetLeft;
    const parentLeft: number = element.parentElement.offsetLeft;
    const parentWidth: number = element.parentElement.offsetWidth;

    const maxWidth: number = parentLeft + parentWidth - elementLeft;
    setMaxWidth(maxWidth);
  };

  useEffect(() => {
    setElementMaxWidth();
    window.addEventListener("resize", setElementMaxWidth);

    return () => window.removeEventListener("resize", setElementMaxWidth);
  }, []);

  return (
    <Wrap>
      <Links aria-label="Migas de pan">
        <BreadcrumbRoot>
          <a href={(links && links[0].route) || ""}>{t("breadcrumbs-root")}</a>
        </BreadcrumbRoot>
        <BreadcrumbsNoRoot>
          {links &&
            links.slice(1).map((link: BreadcrumbLink, index: number) => (
              <React.Fragment key={index}>
                <Separator name="angle" />
                {index === links.length - 2 ? (
                  <BreadcrumbTarget
                    className="breadcrumb-target"
                    maxWidth={maxWidth}
                  >
                    <IconLink
                      name={
                        link.type === "document" ? "document" : "folder-icon"
                      }
                    />
                    <p>{link.text}</p>
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

const Breadcrumbsd: React.FC<BreadcrumbsProps> = ({ links }) => {
  return (
    <Wrap>
      <nav style={{ width: "100%" }} aria-label="Migas de pan">
        <Links>
          {links &&
            links.map((link, i) => {
              if (i < links.length - 1) {
                return (
                  <FolderLink key={i}>
                    <Link href={link.route ? link.route : ""}>
                      {link.text === "root" ? (
                        "Mis documentos"
                      ) : link.type === "folder" ? (
                        <>
                          <IconLink name="folder-icon" /> <p>{link.text}</p>
                        </>
                      ) : (
                        <>
                          <IconLink name="document" />
                          <p>{link.text}</p>
                        </>
                      )}
                    </Link>
                    <Separator name="angle" />
                  </FolderLink>
                );
              } else {
                return (
                  <DocumentLink key={i}>
                    {link.type === "folder" ? (
                      <IconLink name="folder-icon" />
                    ) : link.text === "Mis documentos" ? null : (
                      <IconLink name="document" />
                    )}
                    <p>{link.text}</p>
                  </DocumentLink>
                );
              }
            })}
        </Links>
      </nav>
    </Wrap>
  );
};

export default Breadcrumbs;

const Breadcrumb = styled.li`
  align-items: center;
  color: #373b44;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;

  a,
  p {
    overflow: hidden;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface BreadcrumbLinkProps {
  folders: number;
}
const BreadcrumbLink = styled(Breadcrumb)<BreadcrumbLinkProps>`
  max-width: ${(props: BreadcrumbLinkProps) =>
    props.folders === 1 ? "50" : props.folders === 2 ? "30" : "25"}%;
  font-weight: bold;
`;

const BreadcrumbRoot = styled(Breadcrumb)`
  flex: 0 0;
  font-weight: bold;
`;

const BreadcrumbsNoRoot = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: flex-start;
  width: calc(100% - 105px);
`;

interface BreadcrumbTargetProps {
  maxWidth: number;
}
const BreadcrumbTarget = styled(Breadcrumb)<BreadcrumbTargetProps>`
  max-width: ${(props: BreadcrumbTargetProps) => props.maxWidth}px;
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

const ItemLink = styled.li`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const DocumentLink = styled(ItemLink)``;

const FolderLink = styled(ItemLink)``;

const Linksd = styled.ol`
  flex: 1;
  display: flex;
  font-size: 16px;

  li {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }

  a {
    color: #373b44;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
  }

  li:nth-last-of-type(2) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: auto;
  }
  p {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Link = styled.a`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  text-decoration: none;
  color: #373b44;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  p {
    max-width: 210px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const BackImage = styled.img`
  transform: rotate(90deg);
  margin-right: 8px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;
