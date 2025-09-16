
const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud a la API');
    }
    return response.json();
  };
  
  export const getPeople = async () => {
    try {
      const response = await fetch('/api/personas');
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching people data:', error);
      throw error;
    }
  };
  
  export const savePerson = async (personData, personIdForUpdate) => {
    const url = personIdForUpdate ? `/api/personas/${personIdForUpdate}` : '/api/personas';
    const method = personIdForUpdate ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error saving person (id: ${personIdForUpdate}):`, error);
      throw error;
    }
  };
  
  export const deletePerson = async (personId) => {
    try {
      const response = await fetch(`/api/personas/${personId}`, {
        method: 'DELETE',
      });
      // DELETE might not return a JSON body, so handle it differently
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // try to parse json, but don't fail if it's not there
        throw new Error(errorData.message || 'Error al eliminar el perfil');
      }
      // Check if there is content to parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
      } else {
          return { message: 'Perfil eliminado exitosamente' }; // or some other confirmation
      }
    } catch (error) {
      console.error(`Error deleting person (id: ${personId}):`, error);
      throw error;
    }
  };
