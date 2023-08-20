import React, { useState } from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { userLogin } from '../redux/userSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const { token } = useSelector((state) => state["user"]);
    if (token) {
        return <Navigate to="/" replace:true />;
    }

    const handleLogin = async () => {
        const response = await dispatch(userLogin({email,password}));
        if (response.meta.requestStatus === "fulfilled") {
            navigate("/", { replace: true });
        }
    };

    return (
    <div className="w-screen flex flex-col items-center justify-center min-h-screen max-h-screen overflow-x-hidden">
        <div className="flex bg-white w-full rounded-lg shadow-xl border-t-2 overflow-hidden mx-auto max-w-xs md:max-w-sm lg:max-w-3xl xl:max-w-4xl">
            <div className="hidden lg:block lg:w-1/2 bg-cover bg-[url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')]" ></div>
            <div className="w-full p-8 lg:w-1/2">
                <h2 className="text-2xl font-semibold text-gray-700 text-center">VTrack</h2>
                <p className="text-xl text-gray-600 text-center">Welcome back!</p>
                <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input required onChange={(e)=>setEmail(e.target.value)} className="bg-gray-200 text-gray-900 font-medium focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full" type="email"/>
                </div>
                <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input required onChange={(e)=>setPassword(e.target.value)} className="bg-gray-200 text-gray-900 font-medium focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full" type="password"/>
                </div>
                <div className="mt-8">
                    <button onClick={handleLogin} className="bg-gray-800 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-700">Login</button>
                </div>
                <div className="mt-4 gap-x-2 lg:gap-x-4 flex items-center justify-center ">
                    <span className="w-fit">Don't have an account ?</span>
                    <Link to='/register' className="text-lg font-semibold text-gray-500 hover:text-gray-900">Sign up</Link>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Login