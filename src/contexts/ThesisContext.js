import React, { createContext, useState, useEffect, Children } from 'react';
import axios from 'axios';

export const ThesisContext = createContext();

export const ThesisProvider = ({children}) => {
    const [data, setData] = useState([]); // Tüm veriler
    const [filteredData, setFilteredData] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [filteredKeywords, setFilteredKeywords] = useState([]);


     // Fetch all keywords from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/keywords/getAll");
        setKeywords(response.data);
        setFilteredKeywords(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

    // Backend'den veri çekme
    useEffect(() => {
      axios
        .get("http://localhost:8080/api/thesis/getAll")
        .then((response) => {
          console.log("API Yanıtı:", response.data);
          
          // Yanıtın formatını kontrol et ve uygun şekilde işle
          if (response.data && Array.isArray(response.data)) {
            setData(response.data); // Eğer yanıt direkt bir array ise
            setFilteredData(response.data);
          } else if (response.data.success && response.data.data) {
            setData(response.data.data); // Eğer success ve data mevcutsa
            setFilteredData(response.data.data);
          } else {
            console.error("API başarısız:", response.data.message || "Yanıt formatı beklenenden farklı.");
          }
        })
        .catch((error) => {
          console.error("Veri çekme hatası:", error.message || error);
        });
    }, []);
  return(
    <ThesisContext.Provider value={{data,setData,filteredData,setFilteredData,keywords,setKeywords,filteredKeywords,setFilteredKeywords}}>
        {children}
    </ThesisContext.Provider>
  )
}
