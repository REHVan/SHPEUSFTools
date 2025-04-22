import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserSessionPersistence,
} from 'firebase/auth';
import Cookies from 'js-cookie';
import Button from '../components/Button';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export default function HomePage() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const csrfToken = Cookies.get('csrfToken');

      await fetch(`${process.env.REACT_APP_BACKEND_URL}sessionLogin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, csrfToken }),
      });

      // await auth.signOut();
      window.location.assign('/external');
    } catch (err) {
      console.error('Register error', err);
      alert('Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const csrfToken = Cookies.get('csrfToken');

      await fetch(`${process.env.REACT_APP_BACKEND_URL}sessionLogin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, csrfToken }),
      });

      await auth.signOut();
      window.location.assign('/profile');
    } catch (err) {
      console.error('Login error', err);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200 px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4">Welcome to UniSponsor</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
          Your all-in-one outreach tool to effortlessly send mass emails and land professional connections.
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-xl text-white font-semibold ${isRegistering ? 'bg-indigo-600' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setIsRegistering(true)}
          >
            Create Account
          </button>
          <button
            className={`flex-1 py-2 rounded-r-xl text-white font-semibold ${!isRegistering ? 'bg-indigo-600' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setIsRegistering(false)}
          >
            Login
          </button>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <Button type="submit" className="w-full rounded-xl text-lg py-3">
            {isRegistering ? 'Register' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}




/* newest version working, i think
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserSessionPersistence,
} from 'firebase/auth';
import Cookies from 'js-cookie';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const csrfToken = Cookies.get('csrfToken');

      await fetch(`${process.env.REACT_APP_BACKEND_URL}sessionLogin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, csrfToken }),
      });

      //await auth.signOut();
      //window.location.assign('/external');
    } catch (err) {
      console.error('Register error', err);
      alert('Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const csrfToken = Cookies.get('csrfToken');

      await fetch(`${process.env.REACT_APP_BACKEND_URL}sessionLogin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, csrfToken }),
      });

      await auth.signOut();
      window.location.assign('/profile');
    } catch (err) {
      console.error('Login error', err);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={isRegistering ? handleRegister : handleLogin}>
      <input name="email" placeholder="Email" type="email" required />
      <input name="password" placeholder="Password" type="password" required />
      <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      <p onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Log in' : 'New here? Register'}
      </p>
    </form>
  );
};

export default Login;
*/
















/*oldest version, not working*/
/*import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import {firebase} from 'firebase/app';
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

      firebase.auth().setPersistence
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const idToken = await userCredential.user.getIdToken();
      // window.alert(idToken);
      // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}sessionLogin`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify({ idToken }),
      // });

      // const checkSession = await fetch(`${process.env.REACT_APP_BACKEND_URL}debug-session`, {
      //   credentials: 'include',
      // });
      // console.log(await checkSession.json());

      // const data = await response.json();

      // if (!response.ok) {
      //   alert(data.message || 'Failed to establish session');
      //   return;
      // }
      // console.log(`${process.env.REACT_APP_FRONTEND_URL}`);
      // window.alert("hold");
     // window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/external`;
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

     // window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/external`;
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
*/