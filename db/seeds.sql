DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS jobs_data;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL,
  token VARCHAR NOT NULL
);

CREATE TABLE jobs_data (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES users(id),
  searched_on VARCHAR(255),
  job_id VARCHAR(255),
  created_at VARCHAR(255),
  title VARCHAR(255),
  location VARCHAR(255),
  type VARCHAR(255),
  description VARCHAR,
  how_to_apply VARCHAR(255),
  company VARCHAR(255),
  company_url VARCHAR,
  company_logo VARCHAR,
  url VARCHAR,
  contacted VARCHAR,
  contacted_on VARCHAR,
  contact_name VARCHAR,
  contact_email VARCHAR,
  contact_role VARCHAR,
  contact_number VARCHAR(20),
  applied VARCHAR,
  applied_on VARCHAR,
  notes VARCHAR,
  date_of_last_edit VARCHAR
);


-- inputs to be added?
-- using moment to save last time user changed job info
-- contact name
-- contact email
-- contact phone number
-- date of last communication
-- notes
