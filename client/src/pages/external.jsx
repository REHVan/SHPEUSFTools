import React, { useState, useEffect } from 'react';
import FormInputDisplay from '../components/FormInputDisplay';
import Button from '../components/Button';
import UserNavBar from '../components/UserNavBar';
import { useNavigate } from 'react-router-dom';

function External() {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subjectEmail, setSubjectEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  
  // State for feedback message and timestamp
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch contacts from the database
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
              navigate("/external");
          } else {
              navigate("/");
          }
      } catch (error) {
          console.error('Error fetching user details:', error);
      }     
  };

  checkUserRole();

    fetch('/get_contacts')
      .then(response => response.json())
      .then(data => setContacts(data))
      .catch(error => console.error('Error fetching contacts:', error));

    // Fetch email templates
    fetch('/get_email_templates')
      .then(response => response.json())
      .then(data => setTemplates(data))
      .catch(error => console.error('Error fetching templates:', error));
  }, []);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setMessage(template.body);
      setSubjectEmail(template.subject);
    }
  };

  const handleCheckboxChange = (contactId) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const sendEmail = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/send_email_external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromEmail,
          ccEmail,
          subjectEmail,
          messageEmail: message,
          selectedContacts
        })
      });
  
      const responseBody = await response.json(); // Parse the JSON response
  
      if (response.ok) {
        // Set feedback message and timestamp
        setFeedbackMessage(`${responseBody.message} at ${new Date().toLocaleTimeString()}`);
        setTimestamp(new Date().toLocaleTimeString());
        // Optionally clear the form fields or selected contacts if needed
        // Reset form fields or show a success message here
      } else {
        setFeedbackMessage(responseBody.message || "Failed to send emails.");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setFeedbackMessage('Error sending emails. Please try again.');
    }
  };
  

  return (
    <>
         <UserNavBar />
         <form onSubmit={sendEmail}>
        <FormInputDisplay
          label="From:"
          id="fromEmail"
          type="text"
          name="fromEmail"
          required
          value={fromEmail}
          onChange={e => setFromEmail(e.target.value)}
        />
        <FormInputDisplay
          label="CC:"
          id="ccEmail"
          type="text"
          name="ccEmail"
          value={ccEmail}
          onChange={e => setCcEmail(e.target.value)}
        />
        <FormInputDisplay
          label="Subject:"
          id="subjectEmail"
          type="text"
          name="subjectEmail"
          required
          value={subjectEmail}
          onChange={e => setSubjectEmail(e.target.value)}
        />
        <div>
          <label htmlFor="emailTemplate">Template:</label>
          <select id="emailTemplate" onChange={handleTemplateChange}>
            <option value="">Select a template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.template_name}</option>
            ))}
          </select>
        </div>
        <FormInputDisplay
          label="Message:"
          id="messageEmail"
          type="textarea"
          name="messageEmail"
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Select</th>
              <th className="py-2 px-4 border">Company Name</th>
              <th className="py-2 px-4 border">Contact Name</th>
              <th className="py-2 px-4 border">Email Address</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td className="py-2 px-4 border">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(contact.id)}
                    checked={selectedContacts.includes(contact.id)}
                  />
                </td>
                <td className="py-2 px-4 border">{contact.company_name}</td>
                <td className="py-2 px-4 border">{contact.contact_name}</td>
                <td className="py-2 px-4 border">{contact.email_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="submit" label="Send Email" className="mt-4" />
      </form>
      
      {/* Display feedback message */}
      {feedbackMessage && (
        <div className="feedback-message">
          <p>{feedbackMessage}</p>
        </div>
      )}
    </>
  );
}

export default External;
