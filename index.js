let regex = new RegExp("^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$");
var token = '';
var numKeys = 0;
window.addEventListener('load', function() {
    document.getElementById("submit").addEventListener('click', function(e){
      e.preventDefault();
      checkInput();
    });
    document.getElementById("spin").addEventListener('click', function(e){
          e.preventDefault();
          openKey();
        });
});


function checkInput(){
  if(regex.test(document.getElementById("jwt").value)){
    getKeys(document.getElementById("jwt").value);
  } else {
    alertTokenInvalid();
  }
}

function alertTokenInvalid(){
  document.getElementById("error").style = "display: block";
}

function getKeys(jwt){
  token = jwt;
  var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4) {
          if(this.status == 200) {
            parseResponse(req.responseText);
          } else {
            alertTokenInvalid();
          }
        }
    }
    req.open("GET", "https://production.api.finalmouse.com/aimgods/auth/me", true);
    req.setRequestHeader("authorization", jwt);
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
  document.getElementById("authKeys").innerHTML = "You have " + numKeys + " keys remaining";
  if(numKeys == 0){
    document.getElementById("spin").classList.add("disabled");
  }
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

function parseResponse(response){
  var obj = JSON.parse(response);
  var username = obj.UserName;
  numKeys = obj.GoldenKeys;
  document.getElementById("bruh").style = "display: none;";
  document.getElementById("authHeader").innerHTML = "Welcome " + username;
  document.getElementById("authKeys").innerHTML = "You have " + numKeys + " keys remaining";
  if(numKeys == 0){
    document.getElementById("spin").classList.add("disabled");
  }
  document.getElementById("opener").style = "display: block";
}