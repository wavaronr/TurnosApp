const URL_API = 'http://localhost:5000/api/personas';

const getDataPersons = async () => {
  try {
    const response = await fetch(URL_API);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default getDataPersons;
