import React from "react";
import styles from "./styles/styles.module.css";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Menu from "../Menu/Menu";
import { HeaderProps } from "@/types/props";

const Header = ({
  rotation,
  controllerType,
  updateRotation,
  updateControllerType,
}: HeaderProps): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.leftButtons}>
        <ThemeSwitcher />
        <Menu
          rotation={rotation}
          controllerType={controllerType}
          updateRotation={updateRotation}
          updateControllerType={updateControllerType}
        />
      </div>
    </header>
  );
};

export default Header;
