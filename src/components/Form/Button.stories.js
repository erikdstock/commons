import React from "react";

import { storiesOf, addDecorator } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Flex } from "rebass";

import { Button } from "components/Form/Button";

storiesOf("Form/Button", module)
  .add("with text", () => (
    <Button onClick={action("clicked")}>Hello Button</Button>
  ))
  .add("variants", () => (
    <Flex width="500px" justifyContent="space-around">
      <Button variant="outline" onClick={action("clicked")}>
        Outline
      </Button>
      <Button variant="inactive" onClick={action("clicked")}>
        Inactive
      </Button>
    </Flex>
  ));
