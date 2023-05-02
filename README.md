[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/BsFdJ6lI)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-f4981d0f882b2a3f0472912d15f9806d57e124e0fc890972558857b51b24a6f9.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=10177675)

// To create the database on local storage  
FROM:  (https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm) 
1. Download and install a PostgreSQL server. For instructions, refer to the PostgreSQL documentation on www.postgresql.org.
2. Add the PostgreSQL bin directory path to the PATH environmental variable.
3. Open the psql command-line tool:  
  In the Windows Command Prompt, run the command:  
  psql -U postgres  
  Enter your password when prompted (On our code, we set the password to hogwarts6393)  
4. Run a CREATE DATABASE command to create a new database (On our code, we set the db name to be gymCorp)  
   CREATE DATABASE gymCorp WITH ENCODING 'UTF8' LC_COLLATE='English_United Kingdom' LC_CTYPE='English_United Kingdom';
   
// To run our server
1. Open the terminal/command prompt and navigate to the server directory:  
  cd server
2. Open the terminal/command prompt and navigate to the database directory:  
  cd database
3. Start the database server by running the following command:  
  node index.js
4. Once the database server is running, go back to the server directory by running:  
  cd ..
5. Create the necessary tables and data by running the following command:  
  node createData
6. Start the server by running the following command:  
  node app.js
  
// To run our client  
1. Open the terminal/command prompt and navigate to the client directory:  
  cd client
2. Start the client by running the following command:  
  npm start

  
