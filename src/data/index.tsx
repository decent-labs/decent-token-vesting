import { createContext, useContext } from 'react';
import { Data, useSystemData } from './data';

const createDataRoot = (context: React.Context<Data>) => {
  const DataRoot = ({ children }: { children: React.ReactNode }) => {
    const data = useSystemData();

    return (
      <context.Provider value={data}>
        {children}
      </context.Provider>
    );
  }

  return DataRoot;
}

const dataContext = createContext({} as Data);

const DataProvider = createDataRoot(dataContext);

const useData = () => {
  return useContext(dataContext);
};

const resetApp = () => {
  localStorage.removeItem("vests");
  window.location.reload();
}

export { DataProvider, useData, resetApp };