import React from "react";
import styles from "./styles/styles.module.css";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
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
        <SettingsMenu
          updateControllerType={updateControllerType}
          controllerType={controllerType}
          rotation={rotation}
          updateRotation={updateRotation}
        />
      </div>
      <div className={styles.rightButtons}>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
