// Made by slendy. 2020, Hello to anyone who bothers to look here

let regex = new RegExp("^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$");
var token = '';
var numKeys = 0;
var username = '';
var reroll = false;
var keysOpened = 0;
window.addEventListener('load', function() {
    document.getElementById("submit").addEventListener('click', function(e){
        e.preventDefault();
        checkInput();
    });
    document.getElementById("spin").addEventListener('click', function(e){
        e.preventDefault();
        openKey();
    });
    document.getElementById("login").addEventListener('click', function(e){
        e.preventDefault();
        tryLogin();
    });
});

function tryLogin(){
  var user = document.getElementById("user").value;
  var password = document.getElementById("password").value;
  if(!user && !password){
    alertLoginFailed();
    return;
  }
  var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
          if(this.status == 200) {
            var obj = JSON.parse(req.responseText);
            token = obj.tokens.id;
            getKeys(token);
          } else {
            alertLoginFailed();
          }
        }
    }
    req.open("POST", "https://production.api.finalmouse.com/aimgods/auth/login/web", true);
    req.send("{\"username\":\"" + user + "\",\"pwd\":\"" + password + "\"}");
}

function checkInput(){
  if(regex.test(document.getElementById("jwt").value)){
    token = document.getElementById("jwt").value;
    getKeys();
  } else {
    alertBadToken();
  }
}

function alertLoginFailed(){
  document.getElementById("errorLogin").style = "display: block";
}

function alertBadToken(){
  document.getElementById("errorToken").style = "display: block";
}

function getKeys(){
  var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
          if(this.status == 200) {
              var obj = JSON.parse(req.responseText);
              username = obj.UserName;
              numKeys = obj.GoldenKeys;
              updatePage();
          } else {
            alertBadToken();
          }
        }
    }
    req.open("GET", "https://production.api.finalmouse.com/aimgods/auth/me", true);
    req.setRequestHeader("authorization", token);
    req.send();
}

function displayResult(response){
  numKeys--;
  keysOpened++;
  var obj = JSON.parse(response);
  document.getElementById("keyStats").innerHTML = "Keys opened: " + keysOpened;
  if(obj.isRewardReceived){
    document.getElementById("spinResult").innerHTML = "Key " + numKeys + " - You won, (" + response + ")";
    document.getElementById("spinResult").style = "color:gold";
    reroll = false;
  } else {
    document.getElementById("spinResult").innerHTML = "Key " + numKeys + " - You didn't win (" + response + ")";
    document.getElementById("spinResult").style = "color:red";
    if(reroll && numKeys > 0){
      openKey();
    }
  }
  if(!reroll && numKeys > 0){
    enableButton();
  }
  updatePage();
}

function openKey(){
    disableButton();
    reroll = document.getElementById("reroll").checked;
    var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
          if (this.readyState == 4) {
            if(this.status == 200) {
              displayResult(req.responseText);
            } else {
              document.getElementById("spinResult").innerHTML = "You are either out of golden keys or your authentication has expired"
              document.getElementById("spinResult").style = "color:red";
              reroll = false;
            }
          }
      }
      req.open("POST", "https://production.api.finalmouse.com/aimgods/golden-keys", true);
      req.setRequestHeader("authorization", token);
      req.send();
}

function disableButton(){
  document.getElementById("spin").classList.add("disabled");
}

function enableButton(){
  document.getElementById("spin").classList.remove("disabled");
}

function updatePage(){
  document.getElementById("bruh").style = "display: none;";
  document.getElementById("authHeader").innerHTML = "Welcome " + username;
  document.getElementById("authKeys").innerHTML = "You have " + numKeys + " keys remaining";
  if(numKeys == 0){
    disableButton();
  }
  document.getElementById("opener").style = "display: block";
}