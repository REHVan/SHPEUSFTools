import express from 'express';
import cookieParser from 'cookie-parser';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://uni-sponsor.vercel.app';
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; 

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_ADMIN_KEY_BASE64, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/sessionLogin', async (req, res) => {
  const { idToken, csrfToken } = req.body;
  const csrfCookie = req.cookies.csrfToken;

  // Optional CSRF protection — enable in production
  // if (csrfToken !== csrfCookie) {
  //   return res.status(401).send('UNAUTHORIZED REQUEST!');
  // }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const authTime = decodedIdToken.auth_time * 1000;

    if (Date.now() - authTime > 5 * 60 * 1000) {
      return res.status(401).send('Recent sign in required!');
    }

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: EXPIRES_IN });

    const options = {
      maxAge: EXPIRES_IN,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'Strict',
    };

    res.cookie('session', sessionCookie, options);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(401).send('UNAUTHORIZED REQUEST!');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});



// import express from 'express';
// import cors from 'cors';
// import pg from 'pg';
// import bodyParser from 'body-parser';
// import session from 'express-session';
// import pgSession from 'connect-pg-simple';
// import nodemailer from 'nodemailer';
// import env from 'dotenv';
// import { initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import schedule from 'node-schedule';
// import multer from 'multer';
// import admin from 'firebase-admin';
// import cookieParser from 'cookie-parser';
// import admin from 'firebase-admin';

// env.config(); // Load env vars early

// const FRONTEND_URL = process.env.FRONTEND_URL || 'https://uni-sponsor.vercel.app';
// const app = express();
// app.use(cookieParser());

// // Setup DB
// const db = new pg.Client({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
//   ssl: { rejectUnauthorized: false },
// });
// db.connect();

// // Setup Firebase Admin from env base64
// const serviceAccountBuffer = Buffer.from(process.env.FIREBASE_ADMIN_KEY_BASE64, 'base64');
// const serviceAccount = JSON.parse(serviceAccountBuffer.toString('utf-8'));
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// // Setup Firebase Client SDK
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };
// const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(firebaseApp);

// // CORS must be set up BEFORE session
// const corsOptions = {
//   origin: 'https://uni-sponsor.vercel.app',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // Middlewares
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('client/public'));

// // Session setup
// const PgSession = pgSession(session);
// app.use(session({
//   store: new PgSession({ pool: db, tableName: 'session' }),
//   secret: process.env.SESSION_SECRET || 'default_secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: true,
//     sameSite: 'none',
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24,
//   },
// }));

// const upload = multer({ storage: multer.memoryStorage() });

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/client/public/index.html');
// });


// app.get('/ping', (req, res) => {
//   res.json({ message: 'pong', origin: req.headers.origin });
// });

// app.post('/sessionLogin', async (req, res) => {
//   const { idToken } = req.body;
//   console.log("SESSIONLOGIN");
//   console.log(idToken);

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;
//     console.log("Decoded UID:", uid);

//     req.session.userId = uid;
//     req.session.save((err) => {
//       if (err) {
//         console.error("❌ SESSION SAVE ERROR:", err);
//         return res.status(500).json({ message: 'Session failed to save', error: err.message });
//       }
    
//       res.cookie('myCookie', 'cookieValue', {
//         maxAge: 900000,
//         httpOnly: true,
//         sameSite: 'None',
//         secure: true,
//       });
    
//       console.log("✅ Session saved for:", req.session.userId);
//       res.status(200).json({ message: 'Session established' });    
//     });
//   } catch (err) {
//     console.error('Failed to verify token:', err);
//     res.status(401).json({ error: 'Invalid or expired token' });
//   }
// });

// app.post('/login', async (req, res) => {
//   const { emailLogin, passwordLogin } = req.body;
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, emailLogin, passwordLogin);
//     req.session.userId = userCredential.user.uid; // Store user ID in session
//     req.session.save(() => {
//       res.status(200).json({ redirectTo: `${FRONTEND_URL}/external` });
//     });
//     } catch (error) {
//     res.status(401).json({ message: 'Authentication failed', error: error.message });
//   }
// });

// app.get('/debug-session', (req, res) => {
//   console.log('SESSION CONTENTS:', req.session);
//   res.json({ userId: req.session.userId || null });
// });

// app.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const firebaseId = userCredential.user.uid;
//     req.session.userId = firebaseId;

//     await db.query(
//       'INSERT INTO "User" ("firebaseid", "email") VALUES ($1, $2)',
//       [firebaseId, email]
//     );

//     req.session.save(() => {
//       res.status(200).json({ redirectTo: `${FRONTEND_URL}/external` });
//     });
//     } catch (error) {
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// });

// const isAuthenticated = (req, res, next) => {
//   if (req.session.userId) {
//     next();
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// app.get('/user', isAuthenticated, (req, res) => {
//   res.json({ userId: req.session.userId });
// });

// app.post('/send_email_external', upload.single('attachment'), async (req, res) => {
//   const { googlePassword, fromEmail, ccEmail, subjectEmail, messageEmail } = req.body;
//   const firebaseId = req.session.userId;

//   try {
//     const userResult = await db.query(
//       'SELECT id, email FROM "User" WHERE "firebaseid" = $1',
//       [firebaseId]
//     );

//     const user = userResult.rows[0];
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const userEmail = user.email;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: userEmail,
//         pass: googlePassword
//       }
//     });
    
//     const emailResults = [];
//     let delayInMs = 0;

//     const attachmentBuffer = req.file ? req.file.buffer : null;
//     const attachmentName = req.file ? req.file.originalname : null;
//     const selectedContacts = JSON.parse(req.body.selectedContacts);
//     for (let i = 0; i < selectedContacts.length; i++) {
//       const contactId = selectedContacts[i];

//       const contactResult = await db.query(
//         'SELECT name, email, company, position, notes FROM "Contacts" WHERE id = $1',
//         [contactId]
//       );
//       const contact = contactResult.rows[0];
//       if (!contact) {
//         console.warn(`No contact found for ID ${contactId}`);
//         continue;
//       }

//       const personalizedMessage = messageEmail
//         .replace(/\[ContactName\]/g, contact.name)
//         .replace(/\[CompanyName\]/g, contact.company);

//       const personalizedSubject = subjectEmail
//         .replace(/\[ContactName\]/g, contact.name)
//         .replace(/\[CompanyName\]/g, contact.company);

//       const mailOptions = {
//         from: fromEmail,
//         to: contact.email,
//         cc: ccEmail,
//         subject: personalizedSubject,
//         html: personalizedMessage,
//         attachments: attachmentBuffer ? [{
//           filename: attachmentName,
//           content: attachmentBuffer
//         }] : []
//       };

//       const batchIndex = Math.floor(i / 30);
//       const baseHourDelay = batchIndex * 60 * 60 * 1000;
//       const randomDelay = Math.floor(Math.random() * 20000) + 20000;
//       delayInMs = baseHourDelay + i * randomDelay;

//       setTimeout(async () => {
//         try {
//           await transporter.sendMail(mailOptions);
//           console.log(`Email sent to ${contact.email}`);
//           emailResults.push({ email: contact.email, status: 'sent' });
//         } catch (error) {
//           console.error(`Error sending email to ${contact.email}:`, error);
//           emailResults.push({ email: contact.email, status: 'failed', error: error.message });
//         }
//       }, delayInMs);
//     }

//     res.json({
//       message: 'Emails are being scheduled and will be sent over time.',
//       totalScheduled: selectedContacts.length,
//     });

//   } catch (error) {
//     console.error('Error sending emails:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });












// app.post('/schedule_email_external', upload.single('attachment'), async (req, res) => {
//   const { googlePassword, fromEmail, ccEmail, subjectEmail, messageEmail, selectedContacts, scheduledStartTime } = req.body;
//   const startTime = scheduledStartTime ? new Date(scheduledStartTime).getTime() : Date.now();
//   const firebaseId = req.session.userId;

//   try {
//     const userResult = await db.query(
//       'SELECT id FROM "User" WHERE "firebaseid" = $1',
//       [firebaseId]
//     );

//     const user = userResult.rows[0];
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userEmail = user.email;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: userEmail,
//         pass: googlePassword
//       }
//     });

//     const emailResults = [];

//     const attachmentBuffer = req.file ? req.file.buffer : null;
//     const attachmentName = req.file ? req.file.originalname : null;

//     let delayInMs = 0;

//     for (let i = 0; i < selectedContacts.length; i++) {
//       const contactId = selectedContacts[i];
//       const contactResult = await db.query(
//         'SELECT name, email, company, position, notes FROM "Contacts" WHERE id = $1',
//         [contactId]
//       );
//       const contact = contactResult.rows[0];

//       if (!contact) {
//         console.warn(`No contact found for ID ${contactId}`);
//         continue;
//       }

//       const personalizedMessage = messageEmail
//         .replace(/\[ContactName\]/g, contact.name)
//         .replace(/\[CompanyName\]/g, contact.company);

//       const personalizedSubject = subjectEmail
//         .replace(/\[ContactName\]/g, contact.name)
//         .replace(/\[CompanyName\]/g, contact.company);

//       const mailOptions = {
//         from: fromEmail,
//         to: contact.email,
//         cc: ccEmail,
//         subject: personalizedSubject,
//         html: personalizedMessage,
//         attachments: attachmentBuffer ? [{
//           filename: attachmentName,
//           content: attachmentBuffer
//         }] : []
//       };

//       const batchIndex = Math.floor(i / 30); // 30 emails per hour
//       const baseHourDelay = batchIndex * 60 * 60 * 1000;
//       const randomDelay = Math.floor(Math.random() * 20000) + 20000; // 20–40s
//       delayInMs = startTime - Date.now() + baseHourDelay + i * randomDelay;

//       setTimeout(async () => {
//         try {
//           await transporter.sendMail(mailOptions);
//           console.log(`Scheduled email sent to ${contact.email}`);
//           emailResults.push({ email: contact.email, status: 'sent' });
//         } catch (error) {
//           console.error(`Error sending email to ${contact.email}:`, error);
//           emailResults.push({ email: contact.email, status: 'failed', error: error.message });
//         }
//       }, delayInMs);
//     }

//     res.json({ message: 'Scheduled emails to be sent over time.', totalScheduled: selectedContacts.length });
//   } catch (error) {
//     console.error('Error scheduling emails:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// /* <----------------------EMAIL CRUD-------------------------------------->*/
// /* <----------------------EMAIL CREATE-------------------------------------->*/
// app.post('/add_email_template', async (req, res) => {
//   const { templateName, subject, body } = req.body;
//   const firebaseId = req.session.userId; 

//   try {

//     const userResult = await db.query(
//       'SELECT id FROM "User" WHERE "firebaseid" = $1',
//       [firebaseId]
//     );

//     const user = userResult.rows[0];
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const userId = user.id;

//     const templateResult = await db.query(
//       'INSERT INTO "EmailTemplates" (name, emailsubject, emailbody) VALUES ($1, $2, $3) RETURNING *',
//       [templateName, subject, body]
//     );


//     const newTemplate = templateResult.rows[0];

//     await db.query(
//       'INSERT INTO "UserEmailTemplate" (userid, emailid) VALUES ($1, $2)',
//       [userId, newTemplate.id]
//     );

//     res.status(201).json(newTemplate); // Respond with the new template
//   } catch (error) {
//     console.error('Error adding email template:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// /* <----------------------EMAIL READ-------------------------------------->*/
app.get('/get_email_templates', async (req, res) => {
  const { uid } = req.body;
  try {

    const userResult = await db.query(
      'SELECT id FROM "User" WHERE "firebaseid" = $1',
      [uid]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user.id; 
    const emailIdResults = await db.query('SELECT emailid FROM "UserEmailTemplate" WHERE "userid" = $1', [userId]);

    const emailIds = emailIdResults.rows.map(row => row.emailid); 

    if (emailIds.length === 0) {
      return res.json([]); 
    }

    const result = await db.query(
      'SELECT * FROM "EmailTemplates" WHERE "id" = ANY($1)',
      [emailIds] // Passing the array of ContactIds
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).send('Internal Server Error');
  }
});

// /* <----------------------EMAIL UPDATE-------------------------------------->*/
// app.put('/update_template/:id', async (req, res) => {
//   const { id } = req.params;
//   const { templateName, subject, body } = req.body;

//   try {

//     const result = await db.query(
//       'UPDATE "EmailTemplates" SET name = $1, emailsubject = $2, emailbody = $3 WHERE id = $4 RETURNING *',
//       [templateName, subject, body, id]
//     );

//     const updatedTemplate = result.rows[0]; // Get the updated template
//     res.status(200).json(updatedTemplate); // Respond with the updated template
//   } catch (error) {
//     console.error('Error updating email template:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// /* <----------------------EMAIL DELETE-------------------------------------->*/
// app.delete('/delete_template/:id', async (req, res) => {
//     const firebaseId = req.session.userId; 
//     const { id } = req.params;
//     try {
//       const userResult = await db.query(
//         'SELECT id FROM "User" WHERE "firebaseid" = $1',
//         [firebaseId]
//       );
  
//       const user = userResult.rows[0];
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

      


//     const userId = user.id; 
//     await db.query('DELETE FROM "UserEmailTemplate" WHERE userid = $1 and emailid = $2', [userId, id]);
//     await db.query('DELETE FROM "EmailTemplates" WHERE id = $1', [id]);

//     res.status(204).send(); // Send no content response
//   } catch (error) {
//     console.error('Error deleting email template:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });









// /* <----------------------CONTACT CRUD-------------------------------------->*/
// /* <----------------------CONTACT CREATE-------------------------------------->*/
// app.post('/add_contact', isAuthenticated, async (req, res) => {
//   const { name, email, company, position, notes } = req.body;
//   const firebaseId = req.session.userId; // This is the firebaseId

//   try {
//     // Get the actual userId from the User table
//     const userResult = await db.query(
//       'SELECT id FROM "User" WHERE "firebaseid" = $1',
//       [firebaseId]
//     );

//     const user = userResult.rows[0];
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userId = user.id; // Get the actual userId from the User table

//     // Insert the new contact into the Contacts table
//     const contactResult = await db.query(
//       `INSERT INTO "Contacts" (name, email, company, position, notes)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING *`,
//       [name, email, company, position, notes]
//     );

//     const newContact = contactResult.rows[0];

//     // Insert into UserContact table linking the user to the contact
//     await db.query(
//       'INSERT INTO "UserContact" (userid, contactid) VALUES ($1, $2)',
//       [userId, newContact.id]
//     );

//     res.status(201).json(newContact);
//   } catch (error) {
//     console.error('Error adding new contact:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// /* <----------------------CONTACT CREATE - UPLOAD-------------------------------------->*/

// app.post('/upload_contacts', async (req, res) => {
//   const { contacts } = req.body;
//   const firebaseId = req.session.userId;

//   try {    
//       // Get the actual userId from the User table
//       const userResult = await db.query(
//         'SELECT id FROM "User" WHERE "firebaseid" = $1',
//         [firebaseId]
//       );
  
//       const user = userResult.rows[0];
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const userId = user.id; // Get the actual userId from the User table

//     const values = contacts.map(contact => [
//       contact.name,
//       contact.email,
//       contact.comapny,
//       contact.position,
//       contact.notes,
//     ]);

//     const inserted = [];

//     for (const [name, email, company, position, notes] of values) {





//       const contactResult = await db.query(
//         `INSERT INTO "Contacts" (name, email, company, position, notes)
//          VALUES ($1, $2, $3, $4, $5)
//          RETURNING *`,
//         [name, email, company, position, notes]
//       );
  
//       const newContact = contactResult.rows[0];
  
//       // Insert into UserContact table linking the user to the contact
//       await db.query(
//         'INSERT INTO "UserContact" (userid, contactid) VALUES ($1, $2)',
//         [userId, newContact.id]
//       );
//       inserted.push(newContact);
//     }

//     res.status(201).json(inserted);
//   } catch (error) {
//     console.error('Error uploading contacts:', error);
//     res.status(500).send('Error uploading contacts');
//   }
// });

/* <----------------------CONTACT READ-------------------------------------->*/
app.get('/get_contacts', async (req, res) => {
  const { uid } = req.body;

  try {

    
    const userResult = await db.query(
      'SELECT id FROM "User" WHERE "firebaseid" = $1',
      [uid]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user.id; 
    const contactIdResults = await db.query('SELECT contactid FROM "UserContact" WHERE "userid" = $1', [userId]);

    // Map the contactid field correctly based on the query result
    const contactIds = contactIdResults.rows.map(row => row.contactid); 

    if (contactIds.length === 0) {
      return res.json([]);
    }

    const result = await db.query(
      'SELECT * FROM "Contacts" WHERE "id" = ANY($1)',
      [contactIds] // Passing the array of ContactIds
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send('Internal Server Error');
  }
});


// /* <----------------------CONTACT UPDATE-------------------------------------->*/
// app.put('/update_contact/:id', async (req, res) => {
//   const { id } = req.params;
//   const updatedContact = req.body;
  
//   try {
//     const result = await db.query(
//       `UPDATE "Contacts" SET name = $1, email = $2, company = $3, position = $4, notes = $5 WHERE id = $6 RETURNING *`,
//       [updatedContact.name, updatedContact.email, updatedContact.company, updatedContact.position, updatedContact.notes, id]
//     );
    
//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating contact:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



// /* <----------------------CONTACT DETELETE-------------------------------------->*/
// app.delete('/delete_contact/:id', async (req, res) => {
//   const firebaseId = req.session.userId; 
//   const { id } = req.params;
//   try {
//     const userResult = await db.query(
//       'SELECT id FROM "User" WHERE "firebaseid" = $1',
//       [firebaseId]
//     );

//     const user = userResult.rows[0];
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userId = user.id; 
//     await db.query('DELETE FROM "UserContact" WHERE userid = $1 and contactid = $2', [userId, id]);
//     await db.query('DELETE FROM "Contacts" WHERE id = $1', [id]);


//     res.status(200).send('Contact deleted successfully'); 
//   } catch (error) {
//     console.error('Error deleting contact:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

