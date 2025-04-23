import React, { useState, useEffect } from 'react';
import FormInputDisplay from '../components/FormInputDisplay';
import Button from '../components/Button';
import UserNavBar from '../components/UserNavBar';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function ContactData() {
  const [contacts, setContacts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    company: '',
    position: '',
    notes: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 50;
  const navigate = useNavigate();

  useEffect(() => {

    var UID = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
    
      // Check if the key starts with 'firebase:authUser:'
      if (key.startsWith('firebase:authUser:')) {
        // Get the user data stored under this key
        const firebaseUser = sessionStorage.getItem(key);
    
        // Parse the JSON and extract the UID
        if (firebaseUser) {
          const parsedUser = JSON.parse(firebaseUser);
          const uid = parsedUser.uid; 
          UID =uid;
          break; // Exit loop after finding the correct key
        }
      }
    }
    
    fetch(`${process.env.REACT_APP_BACKEND_URL}get_contacts?uid=${UID}`)
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error('Error fetching contacts:', error));
  }, []);

  const handleAddContact = async (e) => {

    var UID = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
    
      // Check if the key starts with 'firebase:authUser:'
      if (key.startsWith('firebase:authUser:')) {
        // Get the user data stored under this key
        const firebaseUser = sessionStorage.getItem(key);
    
        // Parse the JSON and extract the UID
        if (firebaseUser) {
          const parsedUser = JSON.parse(firebaseUser);
          const uid = parsedUser.uid; 
          UID =uid;
          break; // Exit loop after finding the correct key
        }
      }
    }
    
    e.preventDefault();
    try {
      console.log(UID)
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}add_contact?uid=${UID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setContacts((prevContacts) => [...prevContacts, data]);
      setNewContact({
        name: '',
        email: '',
        company: '',
        position: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleEdit = (contact) => {
    setIsEditing(true);
    setCurrentContactId(contact.id);
    setNewContact({
      name: contact.name,
      email: contact.email,
      company: contact.company,
      position: contact.position,
      notes: contact.notes
    });
  };

  console.log("TESITNG");
  const handleBlur = async () => {
    if (currentContactId) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}update_contact/${currentContactId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContact),
        });

        if (response.ok) {
          const updatedContact = await response.json();
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.id === currentContactId ? updatedContact : contact
            )
          );
          // Clear the form and reset editing state
          setNewContact({
            name: '',
            email: '',
            company: '',
            position: '',
            notes: ''
          });
          setIsEditing(false);
          setCurrentContactId(null);
        } else {
          console.error('Failed to save contact:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving contact:', error);
      }
    }
  };

  const handleDelete = (contactId) => {
    var UID = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
    
      // Check if the key starts with 'firebase:authUser:'
      if (key.startsWith('firebase:authUser:')) {
        // Get the user data stored under this key
        const firebaseUser = sessionStorage.getItem(key);
    
        // Parse the JSON and extract the UID
        if (firebaseUser) {
          const parsedUser = JSON.parse(firebaseUser);
          const uid = parsedUser.uid; 
          UID =uid;
          break; // Exit loop after finding the correct key
        }
      }
    }
    fetch(`${process.env.REACT_APP_BACKEND_URL}delete_contact/${contactId}?uid=${UID}`, { method: 'DELETE' })
      .then((response) => {
        if (response.ok) {
          setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId));
        } else {
          console.error('Failed to delete contact:', response.statusText);
        }
      })
      .catch((error) => console.error('Error deleting contact:', error));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Expected keys: company_name, contact_name, email_address, position, notes
      try {
        const response = await fetch('/upload_contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts: jsonData })
        });

        if (!response.ok) throw new Error('Upload failed');
        const newContacts = await response.json();
        setContacts((prev) => [...prev, ...newContacts]);
      } catch (error) {
        console.error('Error uploading contacts:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <UserNavBar />
      <div className="max-w-3xl mx-auto p-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-4"
        />

        <form onSubmit={handleAddContact} className="bg-white p-4 rounded-lg shadow-md">
          <FormInputDisplay
            label="Contact Name"
            id="Name"
            type="text"
            required
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <FormInputDisplay
            label="Email Address"
            id="Email"
            type="text"
            required
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
          />
          <FormInputDisplay
            label="Company Name"
            id="Company"
            type="text"
            required
            value={newContact.company}
            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
          />
          <FormInputDisplay
            label="Position"
            id="Position"
            type="text"
            value={newContact.position}
            onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
          />
          <FormInputDisplay
            label="Notes"
            id="Notes"
            type="text"
            value={newContact.notes}
            onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
          />

          <button className="mt-4 w-[70%] rounded-lg mx-auto block" type="submit">
            Add Contact
          </button>
        </form>

        <table className="w-full bg-white mt-4 rounded-lg shadow-md">
          <thead>
            <tr>
            <th className="py-2 px-4 border">Contact Name</th>
            <th className="py-2 px-4 border">Email Address</th>
              <th className="py-2 px-4 border">Company Name</th>
              <th className="py-2 px-4 border">Position</th>
              <th className="py-2 px-4 border">Notes</th>
              <th className="py-2 px-4 border">Edit</th>
              <th className="py-2 px-4 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact) => (
              <tr key={contact.id}>
                <td className="py-2 px-4 border">
                {isEditing && currentContactId === contact.id ? (
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    onBlur={handleBlur} // Save on blur
                  />
                ) : (
                  contact.name
                )}
                </td>
                <td className="py-2 px-4 border">
                {isEditing && currentContactId === contact.id ? (
                  <input
                    type="text"
                    value={newContact.email}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email: e.target.value })
                    }
                    onBlur={handleBlur} // Save on blur
                  />
                ) : (
                  contact.email
                )}
                </td>
                <td className="py-2 px-4 border">
                {isEditing && currentContactId === contact.id ? (
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={(e) =>
                      setNewContact({ ...newContact, company: e.target.value })
                    }
                    onBlur={handleBlur} 
                  />
                ) : (
                  contact.company
                )}
                </td>
                <td className="py-2 px-4 border">
                  {isEditing && currentContactId === contact.id ? (
                    <input
                      type="text"
                      value={newContact.position}
                      onChange={(e) =>
                        setNewContact({ ...newContact, position: e.target.value })
                      }
                      onBlur={handleBlur} 
                    />
                  ) : (
                    contact.position
                  )}
                </td>
                <td className="py-2 px-4 border">
                {isEditing && currentContactId === contact.id ? (
                    <input
                      type="text"
                      value={newContact.notes}
                      onChange={(e) =>
                        setNewContact({ ...newContact, notes: e.target.value })
                      }
                      onBlur={handleBlur} 
                    />
                  ) : (
                    contact.notes
                  )}
                </td>
                <td className="py-2 px-4 border">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                  onClick={() => handleEdit(contact)}
                  disabled={isEditing} // Disable if already editing
                >
                  Edit
                </button>
                </td>
                <td className="py-2 px-4 border">
                  <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700" onClick={() => handleDelete(contact.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(contacts.length / contactsPerPage)).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default ContactData;
