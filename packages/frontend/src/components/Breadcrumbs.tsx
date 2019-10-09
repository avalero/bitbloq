import React, { FC, useState } from "react";
import styled from "@emotion/styled";

import { colors, Icon } from "@bitbloq/ui";

export interface BreadcrumbLink {
  text: string;
  route?: string;
}

export interface BreadcrumbsProps {
  links?: BreadcrumbLink[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ links }) => {
  return (
    <Wrap>
      <Column>
        <nav aria-label="Migas de pan">
          <Links>
            {links &&
              links.map((link, i) => {
                if (i < links.length - 1) {
                  return (
                    <li key={i}>
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
                    </li>
                  );
                } else {
                  return (
                    <li key={i}>
                      {link.type === "folder" ? (
                        <IconLink name="folder-icon" />
                      ) : link.text === "Mis documentos" ? null : (
                        <IconLink name="document" />
                      )}
                      {link.text}
                    </li>
                  );
                }
              })}
          </Links>
        </nav>
      </Column>
    </Wrap>
  );
};

export default Breadcrumbs;

const Wrap = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: left;
`;

const Links = styled.ol`
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

const Separator = styled(Icon)`
  margin-left: 10px;
  margin-right: 10px;
  transform: rotate(-90deg);
  height: 13px;
  width: 13px;
  /* display: none; */
`;

const IconLink = styled(Icon)`
  margin-right: 6px;
  height: 20px;
  width: 20px;
  /* display: none; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
  /* flex-direction: column; */
`;
