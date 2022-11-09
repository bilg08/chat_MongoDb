import { Routes,Route } from 'react-router-dom';
import { useIsUserLoggedContext } from './context/isUserLogged';
import { HomePage } from './pages/homePage';
import { LoginPage } from './pages/loginPage';
function App() {
  const {isUserLogged} = useIsUserLoggedContext();
  return (
    <Routes>
      {isUserLogged===true ? <>
      <Route path='/' element={<HomePage/>} />
      </> :
       <Route path='/' element={<LoginPage />} />
     }
    </Routes>
  );
}

export default App;
