import React from "react";
import styles from "./styles/styles.module.css";

interface DialogProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export const DialogButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button className={styles.dialogButton} onClick={onClick}>
      {children}
    </button>
  );
};

const Dialog = ({ open, children, className }: DialogProps): JSX.Element => {
  if (!open) return <></>;

  return (
    <dialog open={open} className={`${styles.dialog} ${className || ""}`}>
      {children}
    </dialog>
  );
};

export default Dialog;
