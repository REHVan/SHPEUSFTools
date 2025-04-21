import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import HeaderDisplay from '../components/HeaderDisplay';
import FormInputDisplay from '../components/FormInputDisplay';
import Button from '../components/Button';
import Form from '../components/Form';

// Firebase config — pull from .env
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

function Login() {
  const [isRegistering, setIsRegistering] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}sessionLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to establish session');
        return;
      }
      window.alert("hold");
      window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/external`;
    } catch (err) {
      console.error('Registration error:', err);
      alert('Failed to register');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('emailLogin');
    const password = formData.get('passwordLogin');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}sessionLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Failed to log in');
        return;
      }

      window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/external`;
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-8">
      <div className="container mx-auto flex flex-col md:flex-row items-start p-8 rounded-lg shadow-lg mt-16">
        <div className="md:w-1/2 text-center md:text-left p-6" />
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
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
