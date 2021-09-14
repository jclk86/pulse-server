# Travelist

A source for the travel community to create blog articles and to connect with one another.

Live link: https://travelist-client-clfox97sa.vercel.app/

## Login

You may choose to login with the account below or simply create one via registration.

Username: CNorris
Password: Password123!

### npm install

There a number of dependencies that need to be installed.

### npm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm test

Tests all the endpoints.

## Motivation

This app was created for travelers who want to share their tips and guides with fellow travel lovers.

## API

I created my own RESTful APIs to contain all the articles, comments, users, and votes data.

## RESTful Endpoints

### GET

GET logged in user's account... /api/user/account

GET other user's profile... /api/user/profile/:username

GET all articles... /api/articles

Get all comments for article... /api/:article_id/comments

Get all comments... /api/comments

Get specific comment /api/comments/:comment_id

Get all categories... /api/categories

Get all votes for article... /api/votes/article_id

### POST

POST newly-created user... /api/user

POST user's login... /api/auth/login

POST refreshed token... /api/auth/refresh

POST new article... /api/articles

POST add vote to article... /api/votes/:article_id

POST new comment... /api/comments

### DELETE

DELETE specific comment... /api/comments/:comment_id

DELETE specific article... /api/articles/:article_id

DELETE user's vote... /api/votes/:article_id

### PATCH

PATCH specific comment... /api/comments/:comment_id

PATCH specific article... /api/articles/:article_id

PATCH user's account... /api/account

## Challenges

For this application it was important to create a database of tables that complemented one another and offers easy interaction between data for front-end purposes. Some examples of this challenge were as follows: ensuring voting could only be done once, per user and per article, or ensuring that each comment could be attributed to a user and an article. These challenges required formatting data objects for the front-end so that they encompass columns of multiple different data tables. Not only did serializing data tables and using specific queries to join data tables allow for more accessible data, but also it allowed for functions to be built on the front-end to be able to render various features of those data -- for instance, getting vote counts for specific articles, attributing votes to specific articles, comment counts per user or per article, and more. Ultimately, it allowed for more creativity and flexibility with the data.

## Built With

React, Node.js, Express, JavaScript, and PostgreSQL. And Jest, Enzyme, Mocha, and Chai were all utilized in testing.
