
const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud a la API de programación');
    }
    return response.json();
  };
  
  export const getProgramming = async (year, month) => {
    try {
      const response = await fetch(`/api/programming/${year}/${month}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching programming data:', error);
      throw error;
    }
  };
  
  export const saveProgramming = async (year, month, schedule) => {
    try {
      const response = await fetch(`/api/programming/${year}/${month}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule }),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error saving programming data:', error);
      throw error;
    }
  };
