--Using firebase to store data

CREATE TABLE UserData (
    id SERIAL PRIMARY KEY,
    email_address VARCHAR(255),
    isactive boolean
);

CREATE TABLE ContactData (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    contact_name VARCHAR(255),
    email_address VARCHAR(255),
    isactive boolean
);

CREATE TABLE Template (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

