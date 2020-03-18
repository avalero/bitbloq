import React from "react";
import { Global, css } from "@emotion/core";
import { baseStyles } from "@bitbloq/ui";
import { addDecorator } from "@storybook/react";

addDecorator(story => (
  <>
    <Global styles={baseStyles} />
    {story()}
  </>
));
