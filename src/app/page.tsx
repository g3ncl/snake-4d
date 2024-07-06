import styles from "./page.module.css";
import Game from "@/components/Game/Game";

const Home = (): JSX.Element => {
  return (
    <main className={styles.main}>
      <Game />
    </main>
  );
};

export default Home;
