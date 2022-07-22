import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxiosFetch = (dataUrl) => {
  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url, {
          params: {},
          cancelToken: source.token,
          headers: {
            access_token: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (isMounted) {
          console.log(response.data);
          setData(response.data);
          setFetchError(null);
        }
      } catch (error) {
        console.log('error ' + error);
        if (isMounted) {
          setFetchError(error.message);
          setData([]);
          localStorage.clear();
          history('login');
        }
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    fetchData(dataUrl);

    return () => {
      isMounted = false;
      source.cancel();
    };
  }, [dataUrl, history]);

  return { data, fetchError, isLoading };
};

export default useAxiosFetch;
