import React from 'react';
import HeaderDisplay from '../components/HeaderDisplay';
import FormInputDisplay from '../components/FormInputDisplay';
import FormInputDDLDisplay from '../components/FormInputDDLDisplay';
import Button from '../components/Button';
import Form from '../components/Form';

function Login() {
  const orgOptions = [
    { label: 'University of South Florida', value: 'University of South Florida' },
    { label: 'University of Central Missouri', value: 'University of Central Missouri' },
    { label: "Lee's Summit West High School", value: "Lee's Summit West High School" },
  ];

  return (
    <div className="container mx-auto p-4">
      <Form action="/register" method="POST" className="mb-6">
        <HeaderDisplay displayValue="Create Account" />
        <FormInputDisplay 
          label="First Name:" 
          id="fName" 
          type="text" 
          name="fName" 
          required 
          className="mb-4"
        />
        <FormInputDisplay 
          label="Last Name:" 
          id="lName" 
          type="text" 
          name="lName" 
          required 
          className="mb-4"
        />
        <FormInputDDLDisplay 
          label="Org Name:" 
          id="orgName" 
          name="orgName" 
          options={orgOptions} 
          className="mb-4"
        />
        <FormInputDisplay 
          label="Email:" 
          id="email" 
          type="email" 
          name="email" 
          required 
          className="mb-4"
        />
        <FormInputDisplay 
          label="Password:" 
          id="password" 
          type="password" 
          name="password" 
          required 
          className="mb-4"
        />
        <Button 
          type="submit" 
          label="Register" 
          className="w-full bg-blue-500 text-white hover:bg-blue-600 py-2 rounded" 
        />
      </Form>

      <Form action="/login" method="POST">
        <HeaderDisplay displayValue="Sign In" />
        <FormInputDisplay 
          label="Email:" 
          id="emailLogin" 
          type="email" 
          name="emailLogin" 
          required 
          className="mb-4"
        />
        <FormInputDisplay 
          label="Password:" 
          id="passwordLogin" 
          type="password" 
          name="passwordLogin" 
          required 
          className="mb-4"
        />
        <Button 
          type="submit" 
          label="Sign In" 
          className="w-full bg-blue-500 text-white hover:bg-blue-600 py-2 rounded" 
        />
      </Form>
    </div>
  );
}

export default Login;
