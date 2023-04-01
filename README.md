# Chatbot Dokumentation:

## Initialize the Project (Chatbot):

In order to set up the Server and Client of the Project the following steps need to be considered:

1.	Install latest Git version on device
2.	Install Node.js version 18.12.1 on device (other version may work as well, but not tested)
3.	Install latest version of Virtual Studio Code on device
4.	Install latest version of SourceTree on device (optional)
5.	Clone the Project (e.g., via SourceTree or manually)
    -	In SourceTree:
      -	Click Remote
      -	Copy Clone URL of git Project into URL input field
      -	Choose Target folder and Name (e.g., Chatbot)
      -	Press Clone
6.	Open the Cloned folder in VSCode (via File-> Open Folder)
7.	Open VSCode Terminal (the folder of the project should be selected ideal-ly)
8.	Enter *npm i* and press enter (wait for it to run through)
9.	When finished enter *cd server* press enter again
10.	Enter *npm i* and press enter (wait for it to run through)
11.	Enter *cd..* press enter again

The project should now be set up.

## Initialize Dialogflow:

To set up our Dialogflow Agent the following steps need to be considered:

1.	Create Google Cloud Account
2.	Open DialogFlow Essentials (https://dialogflow.cloud.google.com/)
3.	Create a new Agent
4.	Press on the cogwheel
5.	Select Import and Export tab
6.	Press Import from Zip and select our ZIP from github
7.	The agent should restored

To Enable API access, the following steps need to be considered:

(All steps (1-12) are also done by video: https://youtu.be/dRZ7aoQ9hIM?t=158 (Minutes 2:38 to 4:30))

1.	Open Dialogflow Essentials (https://dialogflow.cloud.google.com/)
2.	Select the created agent
3.	Press on the cogwheel
4.	Select General tab (should be selected by default)
5.	Click on the blue name of the Google Project (Project ID)
6.	In the newly opened Tab (Google Cloud Console) on the left should be the navigation menu open (when not press the tree stripes in the upper left)
7.	Click on IAM & Admin and then select Service Accounts
8.	Click on Create Service Account
    -	Enter Service Name (any possible)
    -	Press Continue
    -	Select the Role Owner
    -	Press Continue
    -	Press Done
9.	Service Account should be now created
10.	Click on the e-mail of the Service Account inside the table
11.	Select Keys Tab inside the newly opened view
12.	Click on Add key, select JSON and press create
13.	This should download a JSON file 

The Values inside this JSON should be transferred into the server/chatbot/support/devKeyConfig.ts file. If done right, the server should now be able to execute API calls to the Dialogflow agent.
Other Settings that should be opted in (inside the cogwheel settings) are: General Tab-> Beta Features (enabled), ML Settings Tab -> Automatic spell correction (enabled), Speech Tab -> Enable Auto Speech Adaption (enabled).

## Database

1.	Install MySQL Workbench 
    -	Download MySQL Installer from the official MySQL website https://dev.mysql.com/downloads/installer/ (We used the version 8.0.32 in our project)
    -	Run the downloaded file and install the MySQL Workbench
2.	In MySQL Workbench:
    -	Setup a new Connection with following properties Connection Name: Give the connection any name
      -	Connection Method: Standard (TCP/IP)
      -	Hostname: 127.0.0.1
      -	Port: 3306
      -	Username: root
      -	Password: root
    -	Test the connection
    -	Open the newly created connection if test of the connection was successful 
3.	Create a connection for accessing the database via code:
    -	In MySQL Workbench (when connected to database):
      -	Create a new Schema with the name chatbot
      -	Execute the query: ALTER USER 'root'@'localhost' IDENTI-FIED WITH mysql_native_password BY 'root'; 
      -	Execute the query: flush privileges; 
4.	In VSCode:
    -	Make sure that the mySQL2 driver in version 3.2.0 is installed and can be found in the package.json file within the server folder. Oth-erwise run npm i from the        terminal. Consider running this state-ment in the server folder
    -	Check in the databaseMain.ts file if the declared values for the connection are fitting to your connection


## Start the Chatbot:

- *All of the above described steps should finished before the following commands are executed*!
- To start both the server and client all the command *yarn serve* has to be typed into the console. 
- To now open the chatbot client the URL *localhost:4200* has to be entered into a browser of choice. 
  We recommend using Google Chrome to guarantee that everything works as intended.
- To shut down both server and client *ctrl+c* has to be pressed twice in the console.



