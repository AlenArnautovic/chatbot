# Chatbot Dokumentation:

## Initialize the Project (Chatbot):

In order to set up the Server and Client of the Project the following steps need to be considered:

1.	Install latest Git version on device
2.	Install Node.js version 18.12.1 on device (other version may work as well, but not tested)
3.	Install latest version of Virtual Studio Code on device
4.	Install latest version of SourceTree on device (optional)
5.	Clone the Project (e.g., via SourceTree or manually)
  a.	In SourceTree:
    i.	Click Remote
    ii.	Copy Clone URL of git Project into URL input field
    iii.	Choose Target folder and Name (e.g., Chatbot)
    iv.	Press Clone
6.	Open the Cloned folder in VSCode (via File-> Open Folder)
7.	Open VSCode Terminal (the folder of the project should be selected ideal-ly)
8.	Enter *npm i* and press enter (wait for it to run through)
9.	When finished enter *cd server* press enter again
10.	Enter *npm i* and press enter (wait for it to run through)
11.	Enter *cd..* press enter again

The project should now be set up.

## Start the Chatbot:

- To start both the server and client all the command *yarn serve* has to be typed into the console. 
- To now open the chatbot client the URL *localhost:4200* has to be entered into a browser of choice. 
  We recommend using Google Chrome to guarantee that everything works as intended.
- To shut down both server and client *ctrl+c* has to be pressed twice in the console.



