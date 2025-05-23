import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar'; // assuming AdminNavbar is used for admins
import UserNavBar from '../components/UserNavBar'; // assuming UserNavBar for normal users
import { useNavigate } from 'react-router-dom';

function Template() {
  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [templates, setTemplates] = useState([]);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    var UID = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
    
      // Check if the key starts with 'firebase:authUser:'
      if (key.startsWith('firebase:authUser:')) {
        const firebaseUser = sessionStorage.getItem(key);
    
        if (firebaseUser) {
          const parsedUser = JSON.parse(firebaseUser);
          const uid = parsedUser.uid; 
          UID = uid;
          break;
        }
      }
    }
    
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}get_email_templates?uid=${UID}`);
        const data = await response.json();
        setTemplates(data); // Fetching all templates here
      } catch (error) {
        console.error('Error fetching email templates:', error);
      }
    };
    fetchTemplates();
  }, []);

  const handleAddOrUpdateTemplate = async (e) => {
    e.preventDefault();

    var UID = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
    
      // Check if the key starts with 'firebase:authUser:'
      if (key.startsWith('firebase:authUser:')) {
        const firebaseUser = sessionStorage.getItem(key);
    
        if (firebaseUser) {
          const parsedUser = JSON.parse(firebaseUser);
          const uid = parsedUser.uid; 
          UID = uid;
          break;
        }
      }
    }

    const endpoint = editingTemplateId ? `${process.env.REACT_APP_BACKEND_URL}update_template/${editingTemplateId}?uid=${UID}` : `${process.env.REACT_APP_BACKEND_URL}add_email_template?uid=${UID}`;
    const method = editingTemplateId ? 'PUT' : 'POST';
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName, subject, body })
      });
      if (response.ok) {
        const updatedTemplate = await response.json();
        setTemplates((prevTemplates) =>
          editingTemplateId ? prevTemplates.map((t) => (t.id === editingTemplateId ? updatedTemplate : t)) : [...prevTemplates, updatedTemplate]
        );
        setEditingTemplateId(null);
        setTemplateName('');
        setSubject('');
        setBody('');
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplateId(template.id);
    setTemplateName(template.name || '');
    setSubject(template.emailsubject || '');
    setBody(template.emailbody || '');
  };

  const handleDelete = async (templateId) => {
    try {
      var UID = 0;
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
      
        if (key.startsWith('firebase:authUser:')) {
          const firebaseUser = sessionStorage.getItem(key);
      
          if (firebaseUser) {
            const parsedUser = JSON.parse(firebaseUser);
            const uid = parsedUser.uid; 
            UID = uid;
            break;
          }
        }
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}delete_template/${templateId}?uid=${UID}`, { method: 'DELETE' });
      if (response.ok) {
        setTemplates((prevTemplates) => prevTemplates.filter((t) => t.id !== templateId));
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <div className="flex">
      <UserNavBar />
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Manage Email Templates</h2>
        <form onSubmit={handleAddOrUpdateTemplate} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-lg font-medium">Template Name</label>
            <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-lg font-medium">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-lg font-medium">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full p-2 border rounded-lg" rows="4" required></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
            {editingTemplateId ? 'Update Template' : 'Save Template'}
          </button>
          <h3>Warning: Convert templates to markup. The following key words will replace with correct contact data in email that send. [ContactName] [CompanyName]</h3>

        </form>
        <h2 className="text-2xl font-bold mt-8 mb-4">Existing Templates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left">Template Name</th>
                <th className="py-3 px-4 text-left">Subject</th>
                <th className="py-3 px-4 text-left">Body</th>
                <th className="py-3 px-4 text-left">Edit</th>
                <th className="py-3 px-4 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-t">
                  <td className="py-2 px-4">{template.name}</td>
                  <td className="py-2 px-4">{template.emailsubject}</td>
                  <td className="py-2 px-4">{template.emailbody}</td>
                  <td className="py-2 px-4">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700" onClick={() => handleEdit(template)}>Edit</button>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(template.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Template;
