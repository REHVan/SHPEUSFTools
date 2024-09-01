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

    if (checkResult.rows.length > 0) {
      res.send("YOU ALREADY HAVE AN ACCOUNT");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (firstname, lastname, orgname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [fName, lName, orgName, email, hash]
          );
          const user = result.rows[0];
          req.login(user, async (err) => {
            const userSecurityDefault = await db.query(`
              DO $$
              DECLARE
                  newUserId INT := $1;
                  admin_group_id INT;
              BEGIN
                  -- Find Admin Group
                  SELECT id INTO admin_group_id FROM "Group" WHERE name = 'Admin';
  
                  -- Assign New User to Admin Group
                  INSERT INTO UserGroup (user_id, group_id)
                  VALUES (newUserId, admin_group_id);
              END $$;
          `, [user.Id]);
            res.redirect("/profile");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/formSubmit', async (req, res) => {
  const userId = req.user.id;
  const details = req.body;

  try {
    const categoryResult = await db.query(
      "INSERT INTO usercategory (user_id, category) VALUES ($1, 'SurveyInfo') RETURNING id",
      [userId]
    );
    const categoryId = categoryResult.rows[0].id;

    const detailEntries = Object.entries(details);
    for (const [detailName, value] of detailEntries) {

      if(value != "")
      {
        if(detailName == "userMentorOrMentee" && value=="mentee")
          {
            const userSecurityDefault = await db.query(`
              DO $$
              DECLARE
                  newUserId INT := $1;
                  groupId INT;
              BEGIN
                  SELECT id INTO groupId FROM "Group" WHERE name = 'Mentee';
  
                  -- Assign New User to Admin Group
                  INSERT INTO UserGroup (user_id, group_id)
                  VALUES (newUserId, groupId);
              END $$;
          `, [userId]);
          }
    
          if(detailName == "userMentorOrMentee" && value=="mentor")
            {
              const userSecurityDefault = await db.query(`
                DO $$
                DECLARE
                    newUserId INT := $1;
                    groupId INT;
                BEGIN
                    -- Find Admin Group
                    SELECT id INTO groupId FROM "Group" WHERE name = 'Mentor';
    
                    -- Assign New User to Admin Group
                    INSERT INTO UserGroup (user_id, group_id)
                    VALUES (newUserId, groupId);
                END $$;
            `, [userId]); 
            }


        await db.query(
          "INSERT INTO userdetails (category_id, detail, value) VALUES ($1, $2, $3)",
          [categoryId, detailName, value]
        );
      }
    }

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
    for (const contactId of selectedContacts) {
      const contactResult = await db.query('SELECT contact_name, company_name, email_address FROM user_data WHERE id = $1', [contactId]);
      const contact = contactResult.rows[0];

      if (contact) {
        // Replace placeholders in the message and subject
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
      }
    }

    res.redirect('/external'); // Redirect after sending emails
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send('Internal Server Error');
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
    console.log(templateName);
    console.log(subject);
    console.log(body);

    const result = await db.query(
      "INSERT INTO email_templates (template_name, subject, body) VALUES ($1, $2, $3) RETURNING *",
      [templateName, subject, body]
    );

    res.redirect("/template");
  } catch (error) {
    console.error('Error adding email template:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
