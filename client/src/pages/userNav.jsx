import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavBar from '../components/UserNavBar';

function UserNav() {
    
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
        try {
            const response = await fetch('/checkUserRole');
            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login"); // Redirect to login if not authenticated
                    return;
                }
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);

            if (data.userRole === "Admin") {
                navigate("/userNav");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }     
    };

    checkUserRole();
}, []);

  

  return (
    <>
         <UserNavBar />
         <div className="flex flex-col items-center justify-center h-screen space-y-6">

<button
  className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center"
  onClick={() => navigate('/external')}
>
  Send Emails
</button>
<button
  className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center"
  onClick={() => navigate('/contactdata')}
>
  User Data
</button>
<button
  className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center"
  onClick={() => navigate('/template')}
>
  Email Templates
</button>

<button
  className="bg-blue-500 text-white text-3xl font-semibold py-8 px-12 rounded-full w-3/4 text-center"
  onClick={() => navigate('/allProfile')}
>
  Match Making
</button>

</div>

    </>
    
      )
}

export default UserNav