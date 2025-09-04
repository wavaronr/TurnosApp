export const holidays = async (year) => {
  const url = `https://date.nager.at/api/v3/publicholidays/${year}/CO`;

  const days = [];
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    data?.forEach((item) => {
      const fechaArray = item.date.split("-");
      const diaF = parseInt(fechaArray[2]);
      const mesF = parseInt(fechaArray[1]);
      days.push({ dia: diaF, mes: mesF - 1 });
    });
  } else {
    console.error("Error al obtener los dias festivos");
  }
  return days;
};
