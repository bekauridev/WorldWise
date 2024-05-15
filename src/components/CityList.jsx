import { useCities } from "../contexts/CitiesContexts";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Loader from "./Loader";
import Message from "./Message";

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Loader />;

  if (!cities.length)
    return <Message message="Add your city by clicking on a city on the map" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
