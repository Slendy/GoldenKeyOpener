// Made by slendy. 2020, Hello to anyone who bothers to look here

let regex = new RegExp("^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$");
var token = '';
var numKeys = 0;
var username = '';
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
            console.log(obj);
            token = obj.tokens.id;
            console.log(token);
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
  var obj = JSON.parse(response);
  if(true){
    document.getElementById("spinResult").innerHTML = "You won ...";
    document.getElementById("spinResult").style = "color:gold";
  } else {
    document.getElementById("spinResult").innerHTML = "You didn't win";
    document.getElementById("spinResult").style = "color:red";
  }
  numKeys--;
  updatePage();
}

function openKey(){
    var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
          if (this.readyState == 4) {
            if(this.status == 200) {
              displayResult(req.responseText);
            } else if(this.status == 403) {
              alert("Request failed, your web token may have expired. Refresh the page and get a fresh token")
            }
          }
      }
      req.open("GET", "https://production.api.finalmouse.com/aimgods/golden-keys", true);
      req.setRequestHeader("authorization", token);
      req.send();
}

function updatePage(){
  document.getElementById("bruh").style = "display: none;";
  document.getElementById("authHeader").innerHTML = "Welcome " + username;
  document.getElementById("authKeys").innerHTML = "You have " + numKeys + " keys remaining";
  if(numKeys == 0){
    document.getElementById("spin").classList.add("disabled");
  }
  document.getElementById("opener").style = "display: block";
}