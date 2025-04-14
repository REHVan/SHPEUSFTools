CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    orgname VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE UserCategory (
    id SERIAL PRIMARY KEY,
    user_id INT,
    category VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE UserDetails (
    id SERIAL PRIMARY KEY,
    category_id INT,
    detail VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES UserCategory(id)
);

CREATE TABLE "Group" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Rights (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE GroupRight (
    id SERIAL PRIMARY KEY,
    group_id INT,
    right_id INT,
    FOREIGN KEY (group_id) REFERENCES "Group"(id),
    FOREIGN KEY (right_id) REFERENCES Rights(id)
);

CREATE TABLE Section (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE GroupSectionRight (
    id SERIAL PRIMARY KEY,
    group_right_id INT,
    section_id INT,
    FOREIGN KEY (group_right_id) REFERENCES GroupRight(id),
    FOREIGN KEY (section_id) REFERENCES Section(id)
);

CREATE TABLE UserGroup (
    id SERIAL PRIMARY KEY,
    user_id INT,
    group_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (group_id) REFERENCES "Group"(id)
);

CREATE TABLE MentorshipMatches (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL,
    mentee_id INT NOT NULL,
    match_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    FOREIGN KEY (mentor_id) REFERENCES Users(id),
    FOREIGN KEY (mentee_id) REFERENCES Users(id)
);

CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_data (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    contact_name VARCHAR(255),
    email_address VARCHAR(255)
);
