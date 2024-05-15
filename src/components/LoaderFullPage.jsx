import Loader from "./Loader";
import styles from "./LoaderFullPage.module.css";

function SpinnerFullPage() {
  return (
    <div className={styles.spinnerFullpage}>
      <Loader size={"6.25"} />
    </div>
  );
}

export default SpinnerFullPage;
