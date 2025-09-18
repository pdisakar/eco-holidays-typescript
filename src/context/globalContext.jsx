"use client";
import { createContext, useContext, useState } from "react";

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children, globalData, optionsData }) => {
  //const [data, setData] = useState(globalData);
  return (
    <GlobalDataContext.Provider value={{ globalData, optionsData }}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalDataContext);
