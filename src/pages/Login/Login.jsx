import React from "react";
import {Link} from "react-router-dom"

const Login = () => {

    return(
        <div className=" min-h-screen shadow-md rounded-lg p-6 bg-gray-100">
           <div className="bg-gray-200 p-8 rounded shadow-md w-full max-w-sm mx-auto"> 
            <h2 className="text-2xl font-bold mb-4 text-gray-800 justify-center flex">
                Login
            </h2>
            
            <form>
                <div className="flex flex-col justify-center items-center  ">
                    <div className="rounded mb-4">
                        <div className="mb-4 ">
                            <label className=" block text-gray-700 text-sm font-bold " htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="shadow appearance-none border rounded w-auto py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                            <label className="block text-gray-700 text-sm font-bold " htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="shadow appearance-none border rounded w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />


                            <div className="mt-5 flex flex-col">
                                <button
                                    type="submit"
                                    className="justify-center flex items-center  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none
                                                focus:shadow-outline w-20 mx-auto mt-4"
                                >
                                    Login
                                 </button>
                            </div>
                        </div>
                        </div>
                </div>
            </form>    
            </div>
                                <div className="flex items-center py-5 justify-center" >
                        <a href="" className="text-blue-500 hover:text-blue-700 ml-4"> Forgot Password</a>
                        <Link to="/creatAccount" className="text-blue-500 hover:text-blue-700 ml-4">Creat an account </Link>
                    </div>
 

        </div>
    );
};
export default Login;