import {createContext,useContext,useState} from 'react'
type SelectedAdContextType = {
  isUserLogged: boolean;
  setIsUserLogged: (_val: any) => void;
}

const IsUserLoginContext = createContext<SelectedAdContextType>({
  isUserLogged: false,
  setIsUserLogged: (_val: any) => {},
})
export const IsUserLoginContextProvider = ({children}:any) => {
  const [isUserLogged, setIsUserLogged] = useState(false);

 async function userLogin() {
   const token = await localStorage.getItem('token');
   if (token) {
     setIsUserLogged(true)
   }
  }
  userLogin();

  
    return (
        <IsUserLoginContext.Provider value={{isUserLogged,setIsUserLogged}}>
            {children}
        </IsUserLoginContext.Provider>
    )
}
export const useIsUserLoggedContext = () =>useContext(IsUserLoginContext)