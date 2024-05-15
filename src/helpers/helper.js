function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

function getLocalStorage(key) {
  const stringData = localStorage.getItem(key);
  if (!stringData) {
    throw new Error(`There is no ${key} in LocalStorage`);
  }

  if (!isValidJSON(stringData)) {
    console.warn(`Data for ${key} is not valid JSON`);
    return null;
  }

  try {
    const parsedData = JSON.parse(stringData);
    if (!Array.isArray(parsedData)) {
      throw new Error(`Data for ${key} is not an array`);
    }
    return parsedData;
  } catch (error) {
    console.error(`Error parsing data for ${key}:`, error);
    throw error;
  }
}

export { getLocalStorage };
