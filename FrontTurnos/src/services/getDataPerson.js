export const getDataPersons = async () => {
  const url = `/api/personas`;
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.persons || [];
    } else {
      console.error('sin data');
      return [];
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
  
};


export const getAllDataPersons = async () => {
  const url = `/api/personas`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.persons || [];
    } else {
      console.error('sin data');
      return [];
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};
