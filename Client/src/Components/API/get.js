import axios from 'axios';

const Get = async (page, pageSize) => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/fetchdate/get-data/',
        {
          params: {
            page,  
            pageSize,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
};

export default Get;
