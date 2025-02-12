import axios from 'axios';

const GetC = async () => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:8000/fetchdate/total/',
    );
    return response.data.count;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export default GetC;
