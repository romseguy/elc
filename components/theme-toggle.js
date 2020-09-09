import React, { useContext } from "react";
import { Button, WindmillContext } from "@windmill/react-ui";

function ThemeToggle() {
  const { mode, toggleMode } = useContext(WindmillContext);
  return (
    <span>
      <Button onClick={toggleMode}>Toggle theme</Button>
      <p>Current theme is: {mode}</p>
    </span>
  );
}

export default ThemeToggle;
