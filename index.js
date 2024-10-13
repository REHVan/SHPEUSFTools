import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"; 
import session from "express-session";
import nodemailer from "nodemailer";
import env from "dotenv";


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const saltRounds = 10;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('client/public'));
env.config();
//process.env.SESSION_SECRET
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/public/index.html');
});

app.get('/allProfile', (req, res) => {
  res.sendFile(__dirname + '/client/public/index.html');
});

app.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});


app.post("/login", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/external",
  })(req, res, next);
});

app.post('/register', async (req, res) => {
  const { fName, lName, orgName, email, password } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log("Checking for existing user...");

    if (checkResult.rows.length > 0) {
      console.log("User already exists.");
      return res.status(409).send("YOU ALREADY HAVE AN ACCOUNT");
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Inserting new user into the database...");
    const result = await db.query(
      "INSERT INTO users (firstname, lastname, orgname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [fName, lName, orgName, email, hashedPassword]
    );

    const user = result.rows[0];
    console.log("User created successfully:", user);

    // Log the user in after registration
    req.login(user, (err) => {
      if (err) {
        console.error("Error logging in after registration:", err);
        return res.status(500).send('Error logging in after registration');
      }

      // Redirect to the profile page after successful registration
      return res.redirect('/profile'); // Change made here
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/formSubmit', async (req, res) => {
  const userId = req.user.id;
  const details = req.body;

  try {
    console.log("Test 1");
    const categoryResult = await db.query(
      "INSERT INTO usercategory (user_id, category) VALUES ($1, 'SurveyInfo') RETURNING id",
      [userId]
    );
    const categoryId = categoryResult.rows[0].id;
    console.log("Test 2");

    const detailEntries = Object.entries(details);
    for (const [detailName, value] of detailEntries) {
      console.log("Test 3");
      console.log(value);

      if (value !== "") {
        console.log(detailName);

        // Mentee Handling
        if (detailName === "userMentorOrMentee" && value === "mentee") {
          console.log(userId);

          // Fetch groupId first
          const groupIdResult = await db.query(`
            SELECT id FROM "Group" WHERE name = 'Mentee'
          `);

          if (groupIdResult.rows.length > 0) {
            const groupId = groupIdResult.rows[0].id;

            // Assign New User to Mentee Group
            await db.query(`
              INSERT INTO UserGroup (user_id, group_id)
              VALUES ($1, $2)
            `, [userId, groupId]);
          } else {
            console.log("Group 'Mentee' not found");
          }
        }

        // Mentor Handling
        if (detailName === "userMentorOrMentee" && value === "mentor") {
          // Fetch groupId first
          const groupIdResult = await db.query(`
            SELECT id FROM "Group" WHERE name = 'Mentor'
          `);

          if (groupIdResult.rows.length > 0) {
            const groupId = groupIdResult.rows[0].id;

            // Assign New User to Mentor Group
            await db.query(`
              INSERT INTO UserGroup (user_id, group_id)
              VALUES ($1, $2)
            `, [userId, groupId]);
          } else {
            console.log("Group 'Mentor' not found");
          }
        }

        await db.query(
          "INSERT INTO userdetails (category_id, detail, value) VALUES ($1, $2, $3)",
          [categoryId, detailName, value]
        );
        console.log("Test 6");
      }
    }
    console.log("Test 7");

    res.redirect("/allProfile");
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/checkIfSubmitedBefore', async (req, res) => {
  const userId = req.user.id;

  const checkResult = await db.query(`
    SELECT DISTINCT userdetails.value
    FROM users
    JOIN usercategory ON users.id = usercategory.user_id
    JOIN userdetails ON usercategory.id = userdetails.category_id
    WHERE userdetails.value <> '' AND users.id = $1`, [userId]);

  if (checkResult.rows.length > 3) {
    res.json({ submitted: true });
  } else {
    res.json({ submitted: false });
  }
});

app.get('/checkUserRole', async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' }); // Handle unauthenticated access
  }

  const userId = req.user.id;

  const checkUserRole = await db.query(`
      SELECT users.user_role
      FROM users
      WHERE users.id = $1`, [userId]);

  if (checkUserRole.rows.length > 0) {
      res.json({ userRole: checkUserRole.rows[0].user_role });
  } else {
      res.json({ userRole: "Null" });
  }
});


app.get('/getUserdetails', async (req, res) => {
  try {
    const userIds = await db.query(`
      SELECT DISTINCT users.id
      FROM users
      JOIN usercategory ON users.id = usercategory.user_id
      JOIN userdetails ON usercategory.id = userdetails.category_id
      WHERE userdetails.value <> ''`);

    const userInfoArray = [];

    const promises = userIds.rows.map(async user => {
      const userId = user.id;

      const userDetailResult = await db.query(`
        SELECT userdetails.detail, userdetails.value
        FROM users
        JOIN usercategory ON users.id = usercategory.user_id
        JOIN userdetails ON usercategory.id = userdetails.category_id
        WHERE userdetails.value <> '' AND users.id = $1`, [userId]);

      const userRow = {
        userId: userId,
        userInfo: userDetailResult.rows.map(row => ({
          detail: row.detail,
          value: row.value
        }))
      };

      userInfoArray.push(userRow);
    });

    await Promise.all(promises);

    res.json(userInfoArray);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).send('Internal Server Error');
  }
});

passport.use(
  new LocalStrategy({
    usernameField: 'emailLogin',
    passwordField: 'passwordLogin'
  }, async function verify(username, password, cb) {
    try {
      console.log("testin");

      const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
      console.log(result);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        console.log(user);
        console.log(storedHashedPassword);

        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.log("in err area");

            return cb(err);
          } else {
            if (valid) {
              console.log("valid");

              return cb(null, user);
            } else {
              console.log("not valid");

              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);


passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

app.post('/send_email_external', async (req, res) => {
  const { fromEmail, ccEmail, subjectEmail, messageEmail, selectedContacts } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_GMAIL_USER, // Use environment variables for security
      pass: process.env.GOOGLE_GMAIL_PASSWORD // Use environment variables for security
    }
  });

  try {
    let emailSentCount = 0; // Counter for sent emails

    for (const contactId of selectedContacts) {
      const contactResult = await db.query('SELECT contact_name, company_name, email_address FROM user_data WHERE id = $1', [contactId]);
      const contact = contactResult.rows[0];

      if (contact) {
        const personalizedMessage = messageEmail
          .replace(/\[ContactName\]/g, contact.contact_name)
          .replace(/\[CompanyName\]/g, contact.company_name);

        const personalizedSubject = subjectEmail
          .replace(/\[ContactName\]/g, contact.contact_name)
          .replace(/\[CompanyName\]/g, contact.company_name);

        const mailOptions = {
          from: fromEmail,
          to: contact.email_address,
          cc: ccEmail,
          subject: personalizedSubject,
          html: personalizedMessage
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${contact.email_address}`);
        emailSentCount++; // Increment the counter for each sent email
      }
    }

    // Send success response back to the client
    res.json({ success: true, message: `${emailSentCount} email(s) sent successfully!` });
  } catch (error) {
    console.error('Error sending emails:', error);
    // Send an error response if something goes wrong
    res.status(500).json({ success: false, message: 'Error sending emails. Please try again later.' });
  }
});


app.get('/get_email_templates', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM email_templates');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get_contacts', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_data');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add_email_template', async (req, res) => {
  const { templateName, subject, body } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO email_templates (template_name, subject, body) VALUES ($1, $2, $3) RETURNING *",
      [templateName, subject, body]
    );

    const newTemplate = result.rows[0]; // Get the newly added template
    res.status(201).json(newTemplate); // Respond with the new template
  } catch (error) {
    console.error('Error adding email template:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/update_template/:id', async (req, res) => {
  const { id } = req.params;
  const { templateName, subject, body } = req.body;

  try {
    const result = await db.query(
      "UPDATE email_templates SET template_name = $1, subject = $2, body = $3 WHERE id = $4 RETURNING *",
      [templateName, subject, body, id]
    );

    const updatedTemplate = result.rows[0]; // Get the updated template
    res.status(200).json(updatedTemplate); // Respond with the updated template
  } catch (error) {
    console.error('Error updating email template:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/delete_template/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM email_templates WHERE id = $1', [id]);
    res.status(204).send(); // Send no content response
  } catch (error) {
    console.error('Error deleting email template:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new contact
app.post('/add_contact', async (req, res) => {
  const { company_name, contact_name, email_address } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO user_data (company_name, contact_name, email_address) VALUES ($1, $2, $3) RETURNING *',
      [company_name, contact_name, email_address]
    );

    const newContact = result.rows[0]; // Get the newly added contact

    // Respond with the new contact details
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error adding new contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit an existing contact
app.post('/edit_contact/:id', async (req, res) => {
  const { id } = req.params;
  const { company_name, contact_name, email_address } = req.body;
  try {
    await db.query(
      'UPDATE user_data SET company_name = $1, company_name = $2, email_address = $3 WHERE id = $4',
      [company_name, contact_name, email_address, id]
    );
    res.redirect('/contactdata');  // Or any other route where you display contacts
  } catch (error) {
    console.error('Error editing contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a contact
app.delete('/delete_contact/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Deleting contact with ID:', id); // Ensure this logs correctly
  try {
    await db.query('DELETE FROM user_data WHERE id = $1', [id]);
    res.status(200).send('Contact deleted successfully'); // Send a success message or status
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Backend route to update a contact
app.put('/update_contact/:id', async (req, res) => {
  const { id } = req.params;
  const updatedContact = req.body;
  
  try {
    // Update the contact in the database
    const result = await db.query(
      `UPDATE user_data SET company_name = $1, contact_name = $2, email_address = $3 WHERE id = $4 RETURNING *`,
      [updatedContact.company_name, updatedContact.contact_name, updatedContact.email_address, id]
    );
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
