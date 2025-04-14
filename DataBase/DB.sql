CREATE TABLE IF NOT EXISTS "User" (
    Id SERIAL PRIMARY KEY,
    FireBaseId TEXT NOT NULL,
    Email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "EmailTemplates" (
    Id SERIAL PRIMARY KEY,
    Name TEXT NOT NULL,
    EmailSubject TEXT,
    EmailBody TEXT
);

CREATE TABLE IF NOT EXISTS "Contacts" (
    Id SERIAL PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    Company TEXT,
    Position TEXT,
    Notes TEXT
);

CREATE TABLE IF NOT EXISTS "UserEmailTemplate" (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER REFERENCES "User"(Id),
    EmailId INTEGER REFERENCES "EmailTemplates"(Id)
);

CREATE TABLE IF NOT EXISTS "UserContact" (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER REFERENCES "User"(Id),
    ContactId INTEGER REFERENCES "Contacts"(Id)
);
