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
            access: `Bearer ${localStorage.getItem('access')}`,
            refresh: `Bearer ${localStorage.getItem('refresh')}`,
          },
        });

        if (isMounted) {
          setData(response.data);
          setFetchError(null);
        }
      } catch (error) {
        // console.log(error);
        if (isMounted) {
          setFetchError(error.message);
          setData([]);
          localStorage.removeItem('nickname');
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
