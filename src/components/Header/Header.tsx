import React from "react";
import styles from "./styles/styles.module.css";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Menu from "../Menu/Menu";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import { HeaderProps } from "@/types/props";

const Header = ({
  rotation,
  controllerType,
  updateRotation,
  updateControllerType,
}: HeaderProps): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.leftButtons}>
        <SettingsMenu />
      </div>
      <div className={styles.rightButtons}>
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
