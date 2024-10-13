import React, { useState, useEffect } from 'react';
import FormInputDisplay from '../components/FormInputDisplay';
import Button from '../components/Button';
import AdminNavbar from '../components/AdminNavbar';
import UserNavBar from '../components/UserNavBar';
import { useNavigate } from 'react-router-dom';

function ContactData() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    company_name: '',
    contact_name: '',
    email_address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
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
              navigate("/contactdata");
          } else {
              navigate("/");
          }
      } catch (error) {
          console.error('Error fetching user details:', error);
      }     
  };

  checkUserRole();
    // Fetch contacts from the database
    fetch('/get_contacts')
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error('Error fetching contacts:', error));
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/add_contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContacts((prevContacts) => [...prevContacts, data]);
      setNewContact({ company_name: '', contact_name: '', email_address: '' });
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleEdit = (contact) => {
    setIsEditing(true);
    setCurrentContactId(contact.id);
    setNewContact({
      company_name: contact.company_name,
      contact_name: contact.contact_name,
      email_address: contact.email_address,
    });
  };

  const handleBlur = async () => {
    if (currentContactId) {
      try {
        const response = await fetch(`/update_contact/${currentContactId}`, {
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
          setNewContact({ company_name: '', contact_name: '', email_address: '' });
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
    fetch(`/delete_contact/${contactId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setContacts((prevContacts) =>
            prevContacts.filter((contact) => contact.id !== contactId)
          );
          console.log(`Deleted contact with ID: ${contactId}`);
        } else {
          console.error('Failed to delete contact:', response.statusText);
        }
      })
      .catch((error) => console.error('Error deleting contact:', error));
  };

  return (
    <>
             <UserNavBar />

      <form onSubmit={handleAddContact}>
        <FormInputDisplay
          label="Company Name"
          id="company_name"
          type="text"
          name="company_name"
          required
          value={newContact.company_name}
          onChange={(e) =>
            setNewContact({ ...newContact, company_name: e.target.value })
          }
        />
        <FormInputDisplay
          label="Contact Name"
          id="contact_name"
          type="text"
          name="contact_name"
          required
          value={newContact.contact_name}
          onChange={(e) =>
            setNewContact({ ...newContact, contact_name: e.target.value })
          }
        />
        <FormInputDisplay
          label="Email Address"
          id="email_address"
          type="text"
          name="email_address"
          required
          value={newContact.email_address}
          onChange={(e) =>
            setNewContact({ ...newContact, email_address: e.target.value })
          }
        />
        <Button type="submit" label="Add Contact" className="mt-4" />
      </form>

      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Company Name</th>
            <th className="py-2 px-4 border">Contact Name</th>
            <th className="py-2 px-4 border">Email Address</th>
            <th className="py-2 px-4 border">Edit</th>
            <th className="py-2 px-4 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className="py-2 px-4 border">
                {isEditing && currentContactId === contact.id ? (
                  <input
                    type="text"
                    value={newContact.company_name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, company_name: e.target.value })
                    }
                    onBlur={handleBlur} // Save on blur
                  />
                ) : (
                  contact.company_name
                )}
              </td>
              <td className="py-2 px-4 border">
                {isEditing && currentContactId === contact.id ? (
                  <input
                    type="text"
                    value={newContact.contact_name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, contact_name: e.target.value })
                    }
                    onBlur={handleBlur} // Save on blur
                  />
                ) : (
                  contact.contact_name
                )}
              </td>
              <td className="py-2 px-4 border">
                {isEditing && currentContactId === contact.id ? (
                  <input
                    type="text"
                    value={newContact.email_address}
                    onChange={(e) =>
                      setNewContact({ ...newContact, email_address: e.target.value })
                    }
                    onBlur={handleBlur} // Save on blur
                  />
                ) : (
                  contact.email_address
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
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                  onClick={() => handleDelete(contact.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ContactData;
