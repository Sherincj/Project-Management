"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ag from '../assets/mob.png';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const endpoint = isLogin ? 'http://localhost:8000/login' : 'http://localhost:8000/signup';
    const body = isLogin 
      ? new URLSearchParams({ username: email, password })
      : JSON.stringify({ username, email, password, confirm_password: confirmPassword });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': isLogin ? 'application/x-www-form-urlencoded' : 'application/json',
        },
        body: body,
        credentials: isLogin ? 'include' : 'omit',
      });

      if (response.ok) {
        if (isLogin) {
          router.push("/dashboard");
        } else {
          setSuccess("Signup successful! You can now log in.");
          setIsLogin(true);
        }
      } else {
        const data = await response.json();
        setError(data.detail || (isLogin ? "Login failed" : "Signup failed"));
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError("An unexpected error occurred");
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex items-center justify-center h-[94vh] bg-gradient-to-r from-[#e2e2e2] to-[#68489e]">
      <div className="absolute top-12 left-14 z-10 animate-fadeInDown">
        <Image
          src={ag}  
          alt="Logo"
          width={240}
          height={133}
          className="w-60 h-auto"
        />
      </div>
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl min-h-[480px] relative">
        <div className={`absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out ${isLogin ? 'left-0' : 'left-1/2'}`}>
          <form onSubmit={handleSubmit} className={`bg-white flex flex-col items-center justify-center h-full px-10 transition-all duration-700 ${isLogin ? '' : 'items-center'}`}>
            <h1 className={`text-3xl font-bold mb-5 transition-all duration-700 ${isLogin ? '' : 'self-center'}`}>
              {isLogin ? 'Login' : 'Sign Up'}
            </h1>
            <div className={`w-full space-y-4 transition-all duration-700 ${isLogin ? '' : 'flex flex-col items-center'}`}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border-none outline-none"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border-none outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border-none outline-none"
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border-none outline-none"
                />
              )}
              <button
                type="submit"
                className="w-full bg-[#4C3575] text-white text-sm font-semibold py-2 px-4 rounded-lg uppercase tracking-wide"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
        <div className={`absolute top-0 w-[50%] h-full overflow-hidden duration-700 ease-in-out ${isLogin ? 'rounded-[0_150px] left-1/2' : 'rounded-[150px_0] left-0'}`}>
          <div className="bg-gradient-to-r from-[#4C3575] to-[#4C3575] text-white h-full w-full flex items-center justify-center px-8 text-center">
            {isLogin ? (
              <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-5">Hello, Friend!</h1>
                <p className="text-sm mb-5">Register with your personal details to use all of site features</p>
                <button onClick={toggleAuthMode} className="bg-transparent border border-white text-white text-xs py-2 px-11 rounded-lg font-semibold uppercase tracking-wide mt-2 cursor-pointer">
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full transition-all duration-700">
                <h1 className="text-3xl font-bold mb-5">Welcome Back!</h1>
                <p className="text-sm mb-5">Enter your personal details to use all of site features</p>
                <button onClick={toggleAuthMode} className="bg-transparent border border-white text-white text-xs py-2 px-11 rounded-lg font-semibold uppercase tracking-wide mt-2 cursor-pointer">
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
        {error && <div className="absolute bottom-4 left-0 right-0 text-center text-red-500">{error}</div>}
        {success && <div className="absolute bottom-4 left-0 right-0 text-center text-green-500">{success}</div>}
      </div>
    </div>
  );
}