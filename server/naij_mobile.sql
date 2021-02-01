-- for the users table
CREATE TABLE users
(id BIGSERIAL PRIMARY KEY NOT NULL,
email VARCHAR(200) NOT NULL,
fullname VARCHAR(200) NOT NULL,
password VARCHAR(200) NOT NULL,
img Text,
verified TEXT,
online_socket_id TEXT,
UNIQUE(email));


INSERT INTO users (email, fullname, password, img, verified)
VALUES ('makindetimi@gmail.com', 'mrmakiaveli', 'qqqq', 'https://imgur.com/Zl6cnIS.png','true');


-- for the posts
CREATE TABLE topics
(id BIGSERIAL PRIMARY KEY NOT NULL,
title VARCHAR(200) NOT NULL,
slug VARCHAR(200) NOT NULL,
img TEXT,
creator_img TEXT,
creator VARCHAR(200) NOT NULL,
creator_email VARCHAR(200) NOT NULL,
is_poster_verified TEXT,
views VARCHAR(200),
date VARCHAR(200) NOT NULL, 
time VARCHAR(200) NOT NULL,
topic_body TEXT NOT NULL);
INSERT INTO topics (title,slug,img,creator_img,creator,date,time,topic_body) VALUES ('how to fight','how-to-fight','img','creator_img','creator','date','time','this is my topic body');

-- for messages
CREATE TABLE messages
(id BIGSERIAL PRIMARY KEY NOT NULL,
img TEXT,
msg_room VARCHAR(200) NOT NULL,
is_msg_sender_verified TEXT,
messages TEXT NOT NULL,
messages_with_img TEXT,
email VARCHAR(200) NOT NULL,
name VARCHAR(200) NOT NULL,
date VARCHAR(200) NOT NULL,
time VARCHAR(200) NOT NULL);

-- for all direct messages
CREATE TABLE direct_messages
(id BIGSERIAL PRIMARY KEY NOT NULL,
img TEXT,
sent_from TEXT,
sent_to TEXT,
is_msg_sender_verified TEXT,
messages TEXT NOT NULL,
messages_with_img TEXT,
name VARCHAR(200) NOT NULL,
date VARCHAR(200) NOT NULL,
time VARCHAR(200) NOT NULL);


INSERT INTO messages (img,msg_room,messages,name,date,time) VALUES ('image','oscar','date','time');

