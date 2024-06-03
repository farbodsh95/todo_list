This application manages a backend service for todo list app. Here are some of the application's functionalities:
     - You can create a new task with sending a POST request to the /api/tasks url. this request should have a JSON body containing the description and owner of the task. owner should be a valid email address. 
       you can also define the state (Backlog, To Do, In Progress, Done) and the order of the task in the defined state in the JSON body if necessary. you will get a response containing the information about the task you just created in JSON format.
     - You can update a task by sending a PUT request to the /api/tasks url. this request should have a JSON body containing the id of the task and anything you wish to update. you will get a response containing the information about the task you 
       just updated in JSON format.
     - You can fetch all the tasks in the database with sending a GET request to the /api/tasks url. you will get an array containing different objects and each object represents the information about a task.
     - You can fetch just one task by sending a GET request to the /api/tasks/:id url and replace :id with the id of the task you wish to recieve. you will get a response containing the information about that task in JSON format.
     - you can update multiple task's state all at one (bulk update) but sending a PUT request to the /api/tasks/bulk url. this request should have a JSON body containing "ids" key, with an array of the ids you wish to update as value and the state you
       wish for the tasks.
     - You can delete a task by sending a DELETE request to the /api/tasks url. this request should have a JSON budy containing the id of the task you wish to delete.
     - You can delete multiple tasks with one DELETE by sending a request to the /api/tasks/bulk url. this request should have a JSON body containing "ids" key, with an array of the ids' of the tasks you wish to delete.

This application sends an email to the task owner's email address when a task is moved to the "Done" column.
This application reorders all the tasks in a column when a task is created with a specific order, updated to have a new order or new state and deleted from a column. it also reorders tasks if user assign an order outside the logical range of the tasks in
 a column to make sure data are stored clean in the database.
To start an use the application, create the database using the code in the database.sql file, then install the app dependencies and rename the .env.example file to .env and then fill the required fields in the .env file for the application to connect to 
 your database and your gmail account (notice: to use gmail account for sending emails, follow the instructions in this link "https://medium.com/@deepbag/how-to-send-mail-using-nodemailer-for-free-f8e3df6f7cf6"). now you can run the application by typing 
 "node index.js" command.
