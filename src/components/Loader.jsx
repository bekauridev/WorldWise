import style from "./Loader.module.css";
/**
 * @param {String} size
 */
function Loader({ size = "5.25" }) {
  return (
    <div className={style.loader}>
      <svg className={style.svg} style={{ width: `${size}em` }} viewBox="25 25 50 50">
        <circle className={style.circle} r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
}

export default Loader;
