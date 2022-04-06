async function init() {
  loadIdentity();
}

async function loadIdentity(){
  let identityInfo;
  try {
    let response = await fetch(`api/getIdentity`);
    identityInfo = await response.json();
  } catch(error) {
      identityInfo =  {
        "status": "error",
        "error": "There was an error: " + error
      };
  }
  let loginStatus = document.getElementById('login-status')
  if (identityInfo.status == "error"){
    console.log('error');
    loginStatus.innerHTML = `<h1>Error</h1>`;
  } else if(identityInfo.status == "loggedin"){
    await fetch(`/api/users`, {
      method: 'POST',
      body: JSON.stringify({username: identityInfo.userInfo.username}),
      headers: {'Content-Type': 'application/json'}
    });
    let innerHTML = `
    <div class="container">
    <div class="column left">
      <h3> BEANS & READS </h3>
      <button class="tab profile" onclick="loadProfile()"> Profile </button>
      <button class="tab search" id ="search" onclick="loadSearchFriend()"> Search Friend </button>
      <button class="tab friendRequests" id="request" onclick="loadFriendRequests()"> Friend Requests </button>
    </div>
    <div class="column middle">
      <div class="user-info">
        <i class="fa-solid fa-user"></i>
        <span id="user">${identityInfo.userInfo.username}</span> <!-- add username through index.js -->
        <a href="/signout" class="fa-solid fa-arrow-right-from-bracket"></a>
      </div>
      <div id="tab-retreived"> <!-- the displayed content changes depending on the page clicked by user -->
      </div>
    </div>
    <div class="column right">
      <div class="activity-title">
        <div class="activity-tit-child left-activity-tit">
          <h2>Friend Activity</h2>
          <img onclick=loadActivity() class="refresh icon" src="/imgs/refresh.png" alt="refresh icon"/>
        </div>
        <div class="activity-tit-child btn">
          <button class="activity-tit-child" id="set-activity" onclick="setActivity()">Set Activity</button>
        </div>
      </div>
      <div id="activityResults"></div>
      <div id="activity-popup"></div>
    </div>
  </div>`;
  loginStatus.innerHTML = innerHTML;
  loadActivity();
  loadProfile();
  } else { //loggedout
    let htmlCode = `
    <div class="landing-body">
      <div>
        <h1> welcome </h1>
        <i class="fa-solid fa-mug-hot"></i>
        <button><a href="/signin">Sign In</a></button>
      </div>
    </div>
    `;
    loginStatus.innerHTML = htmlCode;
  }
}

async function loadSearchFriend() {
  document.getElementById("search").classList.add("active");
  let result = `
  <p class="title"> Search Friend </p>
  <input type="text" id="username" placeholder="type in a username here">
  <button type="submit" onclick="searchUsernames()"><i class="fa-solid fa-magnifying-glass"></i></button>
  <div id="searchResults"> </div>
  `;
  document.getElementById("tab-retreived").innerHTML = result;
}

async function searchUsernames() {
  document.getElementById("search").classList.add("active");
  // There are two elements with ID username, a span & an input
  // Narrow to "input" element then select by ID
  let username = document.querySelector("input#username").value;
  let usersRetrieved = await fetch(`/api/users?username=${username}`);
  usersRetrieved = await usersRetrieved.json();

  let searchResultsHTML = usersRetrieved.map(user => {
    return `
    <div class="userCard">
        <div class="card-col card-col-1">
            <img src="${user.img}" class="userinfo" alt = "profile picture of a user" + ${user.username}>
        </div>
        <div class="card-col card-col-2">
            <p class="userinfo username"> ${user.username} </p>
            <p class="userinfo bio maxlength="130"> ${user.bio} </p>
        </div>
        <div class="card-col card-col-3">
          <button id="${user.username}-btn" class="userinfo" onclick="addFriend('${user.username}')">Add Friend</button>
        </div>

    </div>`
    }).join("")

  document.getElementById("searchResults").innerHTML = searchResultsHTML;
}

async function addFriend(username) {
  try {
    let currUser = document.getElementById('user').innerHTML;
    let res = await fetch(`/api/users?username=${username}`);
    let resJSON = await res.json();
    let i = resJSON[0].friendRequests.indexOf(currUser)
    if (i < 0) {
      resJSON[0].friendRequests.push(currUser);
    }
    await fetch(`/api/users?username=${username}`, {
      method: 'PATCH',
      body: JSON.stringify({friendRequests: resJSON[0].friendRequests}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    document.getElementById(username + '-btn').innerText = "Pending";
  } catch (e) {
    console.log("error: " + e);
  } 
}

async function loadFriendRequests() {
    document.getElementById("request").classList.add("active");
    document.getElementById("search").classList.remove("active");

    let userInfo = await fetch(`/api/users?username=${document.getElementById('user').innerText}`);
    let userInfoJSON = await userInfo.json();
    let friendRequests = userInfoJSON[0].friendRequests;
    friendRequests = await Promise.all(friendRequests.map(async request => {
      let data = await fetch(`/api/users?username=${request}`);
      data = await data.json();
      data = data[0];
      return data;
    }));


    let FriendRequestResultsHTML = `<p class="title"> Friend Requests </p>`;
    FriendRequestResultsHTML += friendRequests.map(user => {
        return `
        <div class="friendRequestsCard" id="${user.username}">
            <div class="fR-card-col fR-card-col-1">
                <img src="${user.img}" class="userinfo" alt = "profile picture of a user" + ${user.username}>
            </div>
            <div class="fR-card-col fR-card-col-2">
              <div>
                <p class="userinfo username"> ${user.username} </p>
              </div>
              <div>
                <p class="userinfo bio maxlength="130"> ${user.bio} </p>
              </div>
            </div>
            <div class="fR-card-col fR-card-col-3">
                <button class="userinfo add" onclick="acceptFriendReq('${userInfoJSON[0].username}', '${user.username}')"> Add Friend </button>
                <button class="userinfo remove" onclick="declineFriendReq('${userInfoJSON[0].username}', '${user.username}')"> Remove </button>
            </div>
        </div>`
        }).join("")

        document.getElementById("tab-retreived").innerHTML = FriendRequestResultsHTML;
}

async function acceptFriendReq(username, friend) {
  try {
    let user = await fetch(`/api/users?username=${username}`);
    let userJSON = await user.json();
    let i = userJSON[0].friendRequests.indexOf(friend);
    userJSON[0].friendRequests.splice(i, 1);
    let j = userJSON[0].friends.indexOf(friend);
    if (j < 0) {
      userJSON[0].friends.push(friend);
    }
    let res = await fetch(`/api/users?username=${username}`, {
      method: 'PATCH',
      body: JSON.stringify({
        friendRequests: userJSON[0].friendRequests,
        friends: userJSON[0].friends
      }),
      headers: {'Content-Type': 'application/json'}
    });
    let user2 = await fetch(`/api/users?username=${friend}`);
    let userJSON2 = await user2.json();
    let s = userJSON2[0].friendRequests.indexOf(username);
    userJSON2[0].friendRequests.splice(s, 1);
    let t = userJSON2[0].friends.indexOf(username);
    if (t < 0) {
      userJSON2[0].friends.push(username);
    }
    let res2 = await fetch(`/api/users?username=${friend}`, {
      method: 'PATCH',
      body: JSON.stringify({
        friendRequests: userJSON2[0].friendRequests,
        friends: userJSON2[0].friends
      }),
      headers: {'Content-Type': 'application/json'}
    })
    if (res.ok && res2.ok) {
      loadFriendRequests();
      loadActivity();
    }
  } catch(e) {
    console.log("err: " + e);
  }
}

async function declineFriendReq(username, friend) {
  try {
    let user = await fetch(`/api/users?username=${username}`);
    let userJSON = await user.json();
    let i = userJSON[0].friendRequests.indexOf(friend);
    userJSON[0].friendRequests.splice(i, 1);

    let res = await fetch(`/api/users?username=${username}`, {
      method: 'PATCH',
      body: JSON.stringify({
        friendRequests: userJSON[0].friendRequests
      }),
      headers: {'Content-Type': 'application/json'}
    });

    if (res.ok) {
      loadFriendRequests();
    }
  } catch(e) {
    console.log("err: " + e)
  }
}

async function loadActivity() {
  // fetch call -> Get method of everyone
  // map to retrive the user's drink, lastActivity, and coffeeshop,
  // boolean of if they're active rn or nah
  const user = document.getElementById('user').innerHTML;
  let userInfoResponse = await fetch(`/api/users?username=${user}`);
  let currUser = await userInfoResponse.json();
  let friendsArray = currUser[0].friends;
  const activityJSON = async () => {
    let usersRetrieved = friendsArray.map(async (friend) => {
      let friendResponse = await fetch(`/api/users?username=${friend}`);
      let friendInfo = await friendResponse.json();
      let sincePosted = getActivityTime(friendInfo[0]);
      return {
        img: friendInfo[0].img,
        username: friendInfo[0].username,
        sincePosted: sincePosted,
        coffeeShop: friendInfo[0].coffee_shop ?? "N/A",
        drink: friendInfo[0].drink ?? "n/a"
      }
    })
    const resolves = await Promise.all(usersRetrieved)
    return resolves;
  }
  let activityResults = await activityJSON();

  // first retrieve your own, and make a userActivity Card of your own,
  // then build a horizontal line
  let usersDrink = currUser[0].drink;
  let activityResultsHTML = `
  <div class="userActivityCard">
      <div class="actCard-col actCard-col-1">
      <img src="${currUser[0].img}" class="userinfo" alt = "image of a user">
  </div>
  <div class="actCard-col actCard-col-2">
    <div class="activity-div-header">
      <h4>${currUser[0].username}</h4>
      <h4 class="since-posted">${getActivityTime(currUser[0])}</h4>
    </div>
    <p class="coffeeShop">@ ${currUser[0].coffee_shop ?? "N/A"} </p>
    <p class="drink"><img class="coffee icon" src="/imgs/coffee-cup.png" alt="coffee icon"/> ${usersDrink ?? "n/a"} </p>
  </div>
      </div><hr>`;

  // now add friend's activity
  activityResultsHTML += activityResults.map(user => {
    let drinkName = user.drink.toLowerCase();
    return `
      <div class="userActivityCard">
          <div class="actCard-col actCard-col-1">
          <img src="${user.img}" class="userinfo" alt = "image of a user">
      </div>
      <div class="actCard-col actCard-col-2">
        <div class="activity-div-header">
          <h4>${user.username}</h4>
          <h4 class="since-posted">${user.sincePosted}</h4>
        </div>
        <p class="coffeeShop">@ ${user.coffeeShop} </p>
        <p class="drink"><img class="coffee icon" src="/imgs/coffee-cup.png" alt="coffee icon"/> ${drinkName} </p>
      </div>
          </div>`;
  }).join("")

  document.getElementById("activityResults").innerHTML = activityResultsHTML;
}

function getActivityTime(friendInfo) {
  let sincePosted;
  if (friendInfo.isActive) {
    sincePosted = "now";
  } else {
    let currTime = new Date();
    let friendsTime = 0;
    if (friendInfo.lastActive) {
      friendsTime = new Date(friendInfo.lastActive).getTime() ?? 0;
    }
    let timeAgo = currTime.getTime() - friendsTime;
    timeAgo = Math.floor(timeAgo / 1000.0 / 60); // in minutes
    if (timeAgo < 60) { // 60 minute
      sincePosted = timeAgo + " min ago"
    } else if (timeAgo < (60*2-1)) { // an hour ago
      sincePosted = "1 hr ago";
    } else if (timeAgo < (60 * 24 - 1)) { // less than 24 hours ago
      let hrs = Math.floor(timeAgo / 60.0);
      sincePosted = hrs + " hrs ago"
    } else if (timeAgo < (60 * 24 * 2 - 1)) {// a day ago
      sincePosted = "1 day ago"
    } else if (timeAgo < (60 * 24 * 7 - 1)) {
      let day = Math.floor(timeAgo / 60.0 / 24);
      sincePosted = day + " days ago";
    } else {
      sincePosted = "inactive";
    }
  }
  return sincePosted;
}

async function setActivity() {
  let activityFormHtml =  `
  <div id="overlay">
    <div id="activity-status-form">
      <button onclick="closePopup()" id="formCloseBtn"><i class="fa-solid fa-xmark"></i></button>
      <h3>Set Activity</h3>
      <form>
        <div class="form-div">
          <label class ="subheading" for="status">Activity Status :</label><br>
          <input type="radio" id="status-online" name="status" value="online">
          <label for="contactChoice1">At a Cafe!</label><br>
          <input type="radio" id="status-offline" name="status" value="offline">
          <label for="contactChoice1">No longer at Cafe :(</label>
        </div>
        <div class="form-div">
          <label class ="subheading" for="coffeeshop">Coffee Shop :</label><br>
          <input type="text" id="coffeeshop" name="coffeeshop">
        </div>
        <div class="form-div">
          <label class ="subheading" for="drink">Drink :</label><br>
          <input type="text" id="drink" name="drink">
        </div>
      </form>
      <button onclick="submitActivity()">Submit</button>
    </div>
  </div>
  `;
  document.getElementById('activity-popup').innerHTML = activityFormHtml;
}

async function closePopup() {
  document.getElementById('activity-popup').innerHTML = "";
}


// submits the activity and closes the popup
async function submitActivity() {
  let online = document.getElementById('status-online').checked;
  let offline = document.getElementById('status-offline').checked;
  if (!online && !offline) {
    loadActivity();
  } else if (online) { // online is checked
    let coffeeShop = document.getElementById('coffeeshop').value;
    let drink = document.getElementById('drink').value;
    // fetch post method -> patch updating the coffeeshop, drink, and datetime
    // TODO: need to change the database schema to add the lastActivityDateTime
    const username = document.getElementById('user').innerHTML;
    let response = await fetch(`/api/users?username=${username}`, {
      method: "PATCH",
      body: JSON.stringify({
        drink: drink,
        coffee_shop: coffeeShop,
        isActive: true
      }),
      headers: {'Content-Type': 'application/json'}
    })
    let responseJSON = await response.json();
    if(responseJSON.status == "error"){
      console.log("error:" + responseJSON.error);
    } else{
      loadActivity();
    }
  } else { // offline is checked
    // fetch post method -> patch updating the datetime of the lastActivity
    const username = document.getElementById('user').innerHTML;
    var currentDate = new Date();
    var lastActive = new Date(currentDate.getTime() - 60000);
    let response = await fetch(`/api/users?username=${username}`, {
      method: "PATCH",
      body: JSON.stringify({
        isActive: false,
        lastActive: lastActive
      }),
      headers: {'Content-Type': 'application/json'}
    })
    let responseJSON = await response.json();
    if(responseJSON.status == "error"){
      console.log("error:" + responseJSON.error);
    } else{
      loadActivity();
    }
  }
  document.getElementById('activity-popup').innerHTML = "";
  loadActivity();
}

// Load Profile Tab Page
async function loadProfile() {
  const username = document.getElementById('user').innerHTML;
  let response = await fetch(`/api/users?username=${username}`);
  let currUser = await response.json();
  let profileHtml = `
  <div class="profile-page">
    <div class="profile-header">
      <img src="${currUser[0].img}" alt="user ${currUser[0].username}'s profile picture"/>
      <div class="profile-info">
        <div class="profile-top">
          <h1 class="profile-username">${currUser[0].username}</h1>
          <div>
            <button onclick="editProfile()">Edit Bio</button>
          </div>
        </div>
        <div class="profile-bottom">
          <p class="profile-bio">${currUser[0].bio}</p>
        </div>
      </div>
    </div>
    <div id="update-profile"/>
  </div>
  `;
  document.getElementById('tab-retreived').innerHTML = profileHtml;
}

async function editProfile() {
  let updateHtml = `
    <textarea id="bio" name="bio"></textarea><br>
    <button onclick="submitProfile()">Update Bio</button
  `;
  document.getElementById('update-profile').innerHTML = updateHtml;
}

async function submitProfile() {
  // take the stuff from input text id=bio and switch it to the new bio
  // call load profile
  try {
    let newBio = document.getElementById("bio").value;
    const username = document.getElementById('user').innerHTML;
    let response = await fetch(`/api/users?username=${username}`, {
      method: "PATCH",
      body: JSON.stringify({
        bio: newBio
      }),
      headers: {'Content-Type': 'application/json'}
    })
    let responseJSON = await response.json();
    if(responseJSON.status == "error"){
      console.log("error:" + responseJSON.error);
    } else{
      loadProfile();
    }
    // return responseJSON;
  } catch (error) {
    console.log("error:" + error);
  }
}