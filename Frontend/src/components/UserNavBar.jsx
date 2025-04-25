// import React from 'react';
// import { Link } from 'react-router-dom';

// function UserNavBar() {
//     return (
//         <nav className="bg-black p-4 h-screen w-48 fixed shadow-lg rounded-r-lg">
//             <div className="flex flex-col items-start">
//                 <ul className="space-y-4">
//                     <li>
//                         <Link to="/external" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md block text-sm">
//                             Send Email
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/contactdata" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md block text-sm">
//                             Contact Data
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/template" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md block text-sm">
//                             Email Template
//                         </Link>
//                     </li>

//                 </ul>
//             </div>
//         </nav>
//     );
// }

// export default UserNavBar;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import LogoutButton from '../components/LogoutButton';

// function UserNavBar() {
//     return (
//         <nav className="bg-gray-800 p-4">
//             <div className="container mx-auto flex justify-between items-center">
//                 <ul className="flex space-x-4">
//                     <li><Link to="/external" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Send Email</Link></li>
//                     <li><Link to="/contactdata" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Contact Data</Link></li>
//                     <li><Link to="/template" className="text-white hover:bg-gray-700 px-3 py-2 rounded">Email Template</Link></li>
//                 </ul>
//             </div>
//         </nav>
//     );
// }

// export default UserNavBar;


import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

function UserNavBar() {
  return (
    <nav className="bg-gray-800 w-64 min-h-screen p-4">
      <div className="flex flex-col items-start space-y-6">
        <Link to="/external" className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg w-full text-center">Send Email</Link>
        <Link to="/contactdata" className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg w-full text-center">Contact Data</Link>
        <Link to="/template" className="text-white hover:bg-gray-700 px-4 py-2 rounded-lg w-full text-center">Email Template</Link>
        <LogoutButton />
      </div>
    </nav>
  );
}

export default UserNavBar;
