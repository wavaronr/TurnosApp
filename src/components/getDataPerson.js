export const getDataProfile = async () => {
  const url = `/db.json`;
  let dataProfile = [];
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.persons;
    } else {
      console.error('sin data');
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
  return dataProfile;
};

export const getAllDataPersons = async () => {
  const url = `/db.json`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.persons;
    } else {
      console.error('sin data');
      return [];
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
  return [];
};
