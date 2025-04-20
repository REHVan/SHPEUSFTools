import React, { useState } from 'react';
import HeaderDisplay from '../components/HeaderDisplay';
import FormInputDisplay from '../components/FormInputDisplay';
import Button from '../components/Button';
import Form from '../components/Form';

function Login() {
  const [isRegistering, setIsRegistering] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      console.log("Testing1")
      console.log(process.env.REACT_APP_BACKEND_URL);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      console.log("Testing2")

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration error:', data);
        alert(data.message || 'Failed to register');
        return;
      }

      alert('Registration successful!');
    } catch (err) {
      console.error('Network error:', err);
      alert('Something went wrong');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('emailLogin');
    const password = formData.get('passwordLogin');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login error:', data);
        alert(data.message || 'Failed to log in');
        return;
      }

      alert('Login successful!');
    } catch (err) {
      console.error('Network error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-8"

    >
      <div className="container mx-auto flex flex-col md:flex-row items-start p-8 rounded-lg shadow-lg mt-16">
        {/* Left Side - About SHPE USF */}
        <div className="md:w-1/2 text-center md:text-left p-6">
          <h2 className="text-6xl font-bold text-red-600">SHPE USF External Team</h2>
        </div>

        {/* Right Side - Forms */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            {/* Tab Buttons */}
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 ${isRegistering ? 'bg-red-600 text-white' : 'bg-blue-800'}`}
                onClick={() => setIsRegistering(true)}
              >
                Create Account
              </button>
              <button
                className={`flex-1 py-2 ${!isRegistering ? 'bg-red-600 text-white' : 'bg-blue-800'}`}
                onClick={() => setIsRegistering(false)}
              >
                Sign In
              </button>
            </div>

            {/* Conditional Rendering for Forms */}
            {isRegistering ? (
              <Form onSubmit={handleRegister}>
                <HeaderDisplay>Create Account</HeaderDisplay>
                <FormInputDisplay label="Email:" id="email" type="email" name="email" required className="mb-4" />
                <FormInputDisplay label="Password:" id="password" type="password" name="password" required className="mb-4" />
                <Button type="submit" label="Register" className="w-full bg-red-600 text-white hover:bg-red-700 py-2 rounded" />
              </Form>
            ) : (
              <Form onSubmit={handleLogin}>
                <HeaderDisplay>Sign In</HeaderDisplay>
                <FormInputDisplay label="Email:" id="emailLogin" type="email" name="emailLogin" required className="mb-4" />
                <FormInputDisplay label="Password:" id="passwordLogin" type="password" name="passwordLogin" required className="mb-4" />
                <Button type="submit" label="Sign In" className="w-full bg-red-600 text-white hover:bg-red-700 py-2 rounded" />
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
