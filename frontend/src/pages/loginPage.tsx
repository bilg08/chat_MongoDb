import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import { useIsUserLoggedContext } from "../context/isUserLogged";
export const LoginPage = () => {
    const [userInfo, setUserInfo] = useState({});
    const {setIsUserLogged} = useIsUserLoggedContext()
    const navigate = useNavigate();
  function handleUserInfo(e: any) {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }
    async function handleLoginRequest(e: any) {
      e.preventDefault()
    try {
      const data = await axios.post(
        "http://localhost:8000/users/login",
        userInfo
        );
        await localStorage.setItem('token', data.data.token);
        setIsUserLogged(true)
        navigate('/')
    } catch (error) {}
  }
   async function handleSignUpRequest(e: any) {
      e.preventDefault()
    try {
      const data = await axios.post(
        "http://localhost:8000/users/register",
        userInfo
        );
        await localStorage.setItem('token', data.data.token);
        setIsUserLogged(true)
        navigate('/')
    } catch (error) {}
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Нэвтрэх/Бүртгүүлэх
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Имайл
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleUserInfo}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Нууц үг
                </label>
                <input
                  onChange={handleUserInfo}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  
                  
                </div>
              </div>
              <button
                type="submit"
                onClick={handleLoginRequest}
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Нэвтрэх
              </button>
              <button
                type="submit"
                onClick={handleSignUpRequest}
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Бүртгүүлэх
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
