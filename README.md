# CRUD OPERATION API (Link & Working)

  >>USER REGISTER :POST API -- http://127.0.0.1:3100/add/user 
  
  >>USER LOGIN : POST API -- http://127.0.0.1:3100/user/login
  
  >>USER PROFILE : GET API -- http://127.0.0.1:3100/user/profile
  
  >>USER DETAILS UPDATE : PUT API -- http://127.0.0.1:3100/user/update 
  
  >>USER DELETE : DELETE API --  http://127.0.0.1:3100/user/delete

  >>USER ADD ORGANIZATION : POST API --  http://127.0.0.1:3100/add/org

  >>USER All ORGANIZATION LIST : POST API --  http://127.0.0.1:3100/user/orglist
  
  >>USER ORGANIZATION UPDATE : POST API --  http://127.0.0.1:3100/user/orgupdate/:id
   
## PROJECT RUN COMMAND
* Step1 - npm i

* Step2 - npm start

## SETUP ENVIROMENT
* npm install i -------------------node module install

* npm install express -------------express package install

* npm install mongoose ------------mongoose package install

* npm install dotenv --------------dotenv package install

* npm install joi -----------------joi package install

* npm install bcrypt --------------bcrypt package install

* npm install express-jwt ---------jwt(jsonwebtoken) package install

* npm install nodemon -------------nodemon install

## All Version 
* node     - 16.0.0

* express  - 4.18.2

* mongodb  - 3.6.8

* mongoose - 6.7.3

* dotenv   - 16.0.3

* joi      - 17.7.0

* bcrypt   - 5.1.0

* jwt      - 8.5.1

* nodemon  - 2.0.20

## DISCRIPTION OF PACKAGE

* #### Express
   Express is a node js web application framework that provides broad features for building web and mobile applications. It is used to build a       single page, multipage, and hybrid web application.

* #### Mongoose 
   Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

* #### dotenv 
   The dotenv package is a great way to keep passwords, API keys, and other sensitive data out of your code. It allows you to create environment variables in a . env file instead of putting them in your code.

* #### JOI 
   Joi module is a popular module for data validation. This module validates the data based on schemas. There are various functions like optional(), required(), min(), max(), etc which make it easy to use and a user-friendly module for validating the data.

* #### Bcrypt
   bcrypt is an npm module that simplifies password salting and hashing.

* #### Jwt 
   JWTs are mainly used for authentication. After a user signs in to an application, the application then assigns JWT to that user. Subsequent requests by the user will include the assigned JWT. This token tells the server what routes, services, and resources the user is allowed to access.

* #### Nodemon 
   Nodemon is a popular tool that is used for the development of applications based on node. js. It simply restarts the node application whenever it observes the changes in the file present in the working directory of your project.

## PROJECT DISCRIPTION
* In this project i have build user with it's organization.
* For password security i have used bcrypt to hashing a password.
* For input field validation i have used joi validation.

## USER REGISTERATION OVERVIEW

* All this fields are required when user register and the organization fields are optional 

* FIRSTNAME: Required (should be minimum 5 characters)
* LASTNAME : Required (should be minimum 5 characters)
* EMAIL :    Required (should be minimum 10 characters)
* USERNAME : Required (should be minimum 5 characters) --> Unique
* PASSWORD : Required (should be minimum 10 characters)

## USER LOGIN OVERVIEW
* User will login from username and password after then token is generated which is authorize the user to access the entire information.
* USERNAME : Required 
* PASSWORD : Required 

## PROFILE INFORMATION
* User will get profile information with the help of token which is generated at the time of login

## USER PROFILE UPDATE
* User can update your username but make sure the username will be not same because it will be unique. (optional but not empty)
* User can update your firstname (optional but not empty)
* User can update your lastname  (optional but not empty)
* User can update your email     (optional but not empty)
* User can update your passsword (optional but not empty)

## ADD ORGANIZATION 
* User can add organization with the help of token which is generated at the time of login
* One user can create multiple organization there will be no restriction 
* Organization Name (required)
* Address line 1 (optional) but if user enter the address line 1 then all field are required which is below there
* Address line 2 (required)
* City (required)
* State (required)
* Country (required)
* Zipcode (required)

## ORGANIZATION LIST
* User can get all organization list with the help of token. 

## UPDATE ORGANIZATION
* User can update organization (all are the fileds are optional)