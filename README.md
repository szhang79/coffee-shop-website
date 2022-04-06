# Proposal

## Project Description
### Our Target Audience
Students/young adults who love to study at a coffee shop! We envision a group of friends using our application to communicate with one another on their café adventures. Whether a friend wants to study with other friends, find a new coffee shop, or try a new drink, they can use this application!

### How Can the Audience Benefit From Our Application
Our application allows users to share their current location and the drinks they are having with their friends without needing to message every friend individually about their café adventure updates. In addition, this application lets users create a portfolio of their own experiences in café shops by uploading photos to create an aesthetic gallery of latte art, café vibes, and studying with friends. Lastly, if they want to explore different coffee shops, they can view activities from other friends and take inspiration from them.

### Why We Want to Build This Application
We want to build this application because we wanted an application that easily connected users with their friends and showed where they are grabbing a coffee and studying. We think building a social media platform would be a great way to create this application and would be something we could use in the future.

## Technical Description
### Figure 1: Architectural Diagram
<img src="imgs/arch-diagram.GIF">

### User Stories Summary Table
<table>
  <tr>
    <th>Priority</th>
    <th>User</th>
    <th>Description</th>
    <th>Technical Implementation</th>
  </tr>
  <tr>
    <td> P0 </td>
    <td> As a user </td>
    <td> I want to sign in to the website </td>
    <td> Implement Microsoft Autheticator to redirect the user to log in through their system </td>
  </tr>
  <tr>
    <td> P0 </td>
    <td> As a user </td>
    <td> I want to search people by their ids/nicknames </td>
    <td> Pull users from the database by their id attribute using user inputted query in the search bar </td>
  </tr>
  <tr>
    <td> P0 </td>
    <td> As a user </td>
    <td> I want to mark that I am active at a coffee shop </td>
    <td> Have a toggle button that the user could turn on and off to share their location to their friends - when toggle is on, add location/description/drinks/food/etc. </td>
  </tr>
  <tr>
    <td> P0 </td>
    <td> As a user </td>
    <td> I want to look at who is currently studying at a cafe - Activity Tab status </td>
    <td> Have an <em>Activity tab</em> on the side of the main <em>Feed</em> page in which the users can pull in and out </td>
  </tr>
  <tr>
    <td> P1 </td>
    <td> As a user </td>
    <td> I want to indicate to my friends that I am a certain coffee shop </td>
    <td> Implement a MongoDB database which stores the name and address of the coffee shops and retrieve matching results to the users for them to select based on their input; if it doesn't already exist, put in a location into the database </td>
  </tr>
  <tr>
    <td> P2 </td>
    <td> As a user </td>
    <td> I want to show what coffee I am drinking at the coffee shop </td>
    <td> There is a form that can be submitted of the user’s drink, and will be submitted to the mongoDB + shown on the activity Tab </td>
  </tr>
  <tr>
    <td> P3 </td>
    <td> As a user </td>
    <td> I want to message my friend! </td>
    <td> Implement a chat box through websockets </td>
  </tr>
  <tr>
    <td> P4 </td>
    <td> As a user </td>
    <td> I want to upload photos to my portfolio </td>
    <td> Upload images and save them on local file storage on the server. Image paths will be stored in a database and can be pulled via an HTTP endpoint </td>
  </tr>
</table>

### API Endpoints
<table>
  <tr>
    <th>Method</th>
    <th>Route</th>
    <th>Description</th>
  </tr>
  <tr>
    <td> GET/POST </td>
    <td> /users/{id}/friends/{id} </td>
    <td> GET- returns all friends or a specific one if id is specified for a specific user <br>
         POST - adds a friend for a specific user, id is not required </td>
  </tr>
  <tr>
    <td> GET/POST </td>
    <td> /users/{id}/activity </td>
    <td> GET - returns a user’s current activity status for a specific id <br>
         POST - updates the user’s activity status </td>
  </tr>
  <tr>
    <td> GET/POST </td>
    <td> /users/{id} </td>
    <td> GET - get all users or a specific user if id is specified <br>
         POST - add a new user to the database </td>
  </tr>
  <tr>
    <td> GET/POST </td>
    <td> /location/{id} </td>
    <td> GET - returns a specific location that matches the user’s input <br>
         POST - adds a new location into the “Location” table in the database </td>
  </tr>
  <tr>
    <td> GET </td>
    <td> /signIn </td>
    <td> GET - initiate a sign in flow </td>
  </tr>
  <tr>
    <td> GET </td>
    <td> /signOut </td>
    <td> GET - initiate a sign out flow </td>
  </tr>
</table>
