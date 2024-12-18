import React from "react";

const CreatAccount =()=>{


    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-gray-200 p-8 rounded shadow-md w-full max-w-sm mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                <form >
                    <div className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        <label className="p-3 ">
                            Username
                            <input 
                                id="username"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                                focus:outline-none focus:shadow-outline mb-3"
                                type="text"
                                required
                                />
                        </label>
                    
                    
                        <label className="p-3">
                            Email
                            <input 
                                type="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                                focus:outline-none focus:shadow-outline
                                mb-3"
                             required/>


                        </label>


                        <label className="p-3">
                            Password
                            <input 
                            type="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                            focus:outline-none focus:shadow-outline
                            mb-3"
                            required/>
                        </label>


                        <label className="p-3">
                            Confirm Password
                            <input 
                            type="password" 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                            focus:outline-none focus:shadow-outline
                            mb-3"
                            required/>
                        </label>

                    </div>
                    <div>
                        <button
                        type="submit"
                        className="justify-center flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold 
                        py-2 px-4 rounded m-3 focus:outline-none focus::shadow-outline w-auto mx-auto"
                        >Create Account</button>   

                    </div>

                </form>
            </div>

        </div>
    );
};
export default CreatAccount;