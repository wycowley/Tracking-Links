// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCoj1cIoVuBCmZh-UIncFtaI-u6f8pq4l4",
authDomain: "trackinglinks-ae433.firebaseapp.com",
projectId: "trackinglinks-ae433",
storageBucket: "trackinglinks-ae433.appspot.com",
messagingSenderId: "1096506823117",
appId: "1:1096506823117:web:322fdb570040af5176b484",
measurementId: "G-LBHCQC0M39"
};
firebase.initializeApp(firebaseConfig);

// db.collection("users").add({

// } {merge: true}).then((docRef) => {
//   console.log("Document written with ID: ", docRef.id);
// })
// .catch((error) => {
//     console.error("Error adding document: ", error);
// });
// db.collection("cities").get().then(function(querySnapshot) {
//   querySnapshot.forEach(function(doc) {
//       // value.data() is never undefined for query doc snapshots
//       console.log(doc.id, " => ", doc.data());
//   });
// });


// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var arrayOfEverything;
var db = firebase.firestore();
var newUser;
var date = new Date()
var uiConfig = {
  callbacks: {
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("signInPage").className = document.getElementById("signInPage").className.replace("show", "hide");
    document.getElementById("assignmentViewPage").className = document.getElementById("assignmentViewPage").className.replace("hide", "show");
    document.getElementById("namedText").innerHTML = user.displayName;
    // document.getElementById('loader').style.display = 'none';
    

    newUser = user
    console.log(user.displayName+" "+user.uid);

    var userRef = db.collection("users").doc(user.uid);
    userRef.collection("userData").doc("userData").set({
      displayName: user.displayName,
      email: user.email 
    }, {merge: true})
    .catch((error) => {
        console.error("Error adding document: ", error);
    });


    db.collection("users").doc(user.uid).collection("assignments").doc("zzzzz").set({})
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    refreshAllCards()
    

  } else {
      //no user
      console.log("there is no user");
      ui.start('#firebaseui-auth-container', uiConfig);

  }
});

function signOutUser() {
  
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("successful sign out");
      location.reload();

    }).catch(function(error) {
      console.log(error);
    });
}

function showCreationCard(){
  document.getElementById("creationTab").className = document.getElementById("creationTab").className.replace("hide", "show")
}
function hideCreationCard(){
  document.getElementById("creationTab").className = document.getElementById("creationTab").className.replace("show", "hide")
}
function showStatCard(docID){
  // creates and fills various aspects
  document.getElementById("statTab").className = document.getElementById("statTab").className.replace("hide", "show")
  document.getElementById("statsTitle").innerHTML = "\""+docID.data().title+"\""
  document.getElementById("statDateCreated").innerHTML = "Date Created: "+docID.data().date
  document.getElementById("statUniqueAccessors").innerHTML = "Unique Accessors: "+docID.data().numAccessed
  var links = docID.data().link
  links.replace("https://","");
  links.replace("http://","");
  links.replace("www.","");
  links = "https://"+links
  document.getElementById("statOriginalLink").innerHTML = links
  document.getElementById("statOriginalLink").href = links

  var customLink = "https://trackinglinks-ae433.web.app/link.html?id="+newUser.uid+".com&identifier="+docID.id+"&name="+docID.data().requireName;
  document.getElementById("statCustomLink").innerHTML = customLink
  document.getElementById("statCustomLink").href = customLink

  var arrayOfAccessors = new Array();
  db.collection("users").doc(newUser.uid).collection("assignments").doc(docID.id).collection("accessors").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        arrayOfAccessors.push(doc.data())
        console.log(doc.data());
    })
  }).catch((error) => {
    console.error("Error adding document: ", error);
  }).then(() => {
    // Sort them by date
    for(i = 0;i<arrayOfAccessors.length;i++){
      for(j = 0;j<arrayOfAccessors.length-1;j++){
        if(arrayOfAccessors[j].date<arrayOfAccessors[j+1].date){
          var tempVar = arrayOfAccessors[j]
          arrayOfAccessors[j] = arrayOfAccessors[j+1]
          arrayOfAccessors[j+1] = tempVar
        }
      }
    }
    var mainContainer = document.getElementById("statScroller")
    mainContainer.innerHTML = ""
    if(arrayOfAccessors.length == 0){
      var outerDiv = document.createElement("div")
      outerDiv.className = "statRow"
      outerDiv.innerHTML = "No entries yet!"
      mainContainer.appendChild(outerDiv)
    }
    arrayOfAccessors.forEach(function (value) {
      var outerDiv = document.createElement("div")
      outerDiv.className = "statRow"
      var dateDiv = document.createElement("div")
      dateDiv.className = "statColumn"
      var newDate = new Date(value.date)
      var minutes = newDate.getMinutes()+" "
      if(newDate.getMinutes() <10){
        minutes = "0"+minutes
      }
      dateDiv.innerHTML = newDate.getMonth()+"/"+newDate.getDate()+", "+newDate.getHours()+":"+minutes

      var nameDiv = document.createElement("div")
      nameDiv.className = "statColumn"
      nameDiv.innerHTML = value.name

      var timesDiv = document.createElement("div")
      timesDiv.className = "statColumn"
      timesDiv.innerHTML = value.accessed

      outerDiv.appendChild(dateDiv)
      outerDiv.appendChild(nameDiv)
      outerDiv.appendChild(timesDiv)

      mainContainer.appendChild(outerDiv)

    })
  })
}
function hideStatCard(){
  document.getElementById("statTab").className = document.getElementById("statTab").className.replace("show", "hide")

}

function createCard(){
  var assignmentCount = 0
  document.getElementById("creationTab").className = document.getElementById("creationTab").className.replace("show", "hide")
  db.collection("users").doc(newUser.uid).collection("assignments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        assignmentCount = assignmentCount+1;
        console.log(doc.data().link + " " + document.getElementById("creationLink").value)
        if(doc.data().link == document.getElementById("creationLink").value){
          window.alert("You are adding a link that you have already created.  Remove the previous assignment.")
        }
    })
  }).catch((error) => {
    console.error("Error adding document: ", error);
  }).then(() => {
    console.log(document.getElementById("creationRequireNames").value+"")
    console.log(assignmentCount+" : assignmentCount")

    db.collection("users").doc(newUser.uid).collection("assignments").add({
      link: document.getElementById("creationLink").value,
      title: document.getElementById("creationTitle").value,
      requireName: document.getElementById("creationRequireNames").checked,
      date: (date.getMonth()+1)+"/"+date.getDate(),
      numAccessed: 0,
      order: assignmentCount
    }).catch((error) => {
      console.error("Error adding document: ", error);
    }).then((docRef) =>{
      refreshAllCards()
    });
  });
}
function deleteCard(id){
  var documentOrder;
  db.collection("users").doc(newUser.uid).collection("assignments").doc(id).get().then((doc) => {
     documentOrder = doc.data().order;
     db.collection("users").doc(newUser.uid).collection("assignments").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    document.getElementById(id).innerHTML = ""
    document.getElementById(id).remove;
    document.getElementById(id).style.padding = "0px";
    document.getElementById(id).style.margin = "0px";
  
    db.collection("users").doc(newUser.uid).collection("assignments").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc2) {
        
        console.log("test things "+documentOrder)
          if(doc2.data().order>documentOrder){
            console.log("yes, greater")
            db.collection("users").doc(newUser.uid).collection("assignments").doc(doc2.id).update({
              order: firebase.firestore.FieldValue.increment(-1)
            });
          
          }
      });
    }).then( function(){
      db.collection("users").doc(newUser.uid).collection("assignments").doc(id).collection("accessors").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            db.collection("users").doc(newUser.uid).collection("assignments").doc(id).collection("accessors").doc(doc.id).delete().then(() => {
              console.log("Deleted people's information")
            })
        });
      });
  
    })
    refreshAllCards();
    document.getElementById("popUp").innerHTML = "Deleted an assignment";
    document.getElementById("popUpDiv").className = "hide";
    setTimeout(function(){document.getElementById("popUpDiv").className = "box-shadow popUp red";},100)
  
  })

}

function lowerOrder(id, order){
    db.collection("users").doc(newUser.uid).collection("assignments").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if(doc.data().order+1==order){
          console.log("found a match")
  
          db.collection("users").doc(newUser.uid).collection("assignments").doc(doc.id).update({
            order: firebase.firestore.FieldValue.increment(1)
          });
    
        }
      })
    }).then(()=>{
      db.collection("users").doc(newUser.uid).collection("assignments").doc(id).update({
        order: firebase.firestore.FieldValue.increment(-1)
      }).then(()=>{
        refreshAllCards();
      })
    })
  
}
function raiseOrder(id, order){
  db.collection("users").doc(newUser.uid).collection("assignments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if(doc.data().order-1==order){
        console.log("found a match")

        db.collection("users").doc(newUser.uid).collection("assignments").doc(doc.id).update({
          order: firebase.firestore.FieldValue.increment(-1)
        });
  
      }
    })
  }).then(()=>{
    db.collection("users").doc(newUser.uid).collection("assignments").doc(id).update({
      order: firebase.firestore.FieldValue.increment(1)
    }).then(()=>{
      refreshAllCards();
    })
  })
  
}

function refreshAllCards(){

  var arrayOfAccessors = new Array();
  db.collection("users").doc(newUser.uid).collection("assignments").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        arrayOfAccessors.push(doc)
    })
  }).catch((error) => {
    console.error("Error adding document: ", error);
  }).then(() => {
    // Sort them by date
    for(i = 0;i<arrayOfAccessors.length;i++){
      for(j = 0;j<arrayOfAccessors.length-1;j++){
        console.log(arrayOfAccessors[j].data().order+" "+arrayOfAccessors[j+1].data().order)
        if(arrayOfAccessors[j].data().order<arrayOfAccessors[j+1].data().order){
          var tempVar = arrayOfAccessors[j]
          arrayOfAccessors[j] = arrayOfAccessors[j+1]
          console.log(tempVar+" ")
          arrayOfAccessors[j+1] = tempVar
        }
      }
    }
  arrayOfEverything = arrayOfAccessors
  var assignmentPlace = document.getElementById("assignmentArea")
  assignmentPlace.innerHTML = "";
  var br = document.createElement("br");
  br.id = "finalInArray"
  assignmentPlace.appendChild(br)
  var finalElement = document.getElementById("finalInArray")
  var changed = false;
  console.log(changed)
  var j = 0;
  arrayOfEverything.forEach(function(value){
      // 2.data() is never undefined for query doc snapshots
      console.log(value.id, " => ", value.data());
      if(value.id != "zzzzz"){
        changed = true;
        console.log("what")
      }
      var outerDiv = document.createElement("div")
      outerDiv.className = "white-bg-color box-shadow rounded-corner defaultAssignmentCard"
      outerDiv.id = value.id;
      value.data().order = j;
      console.log(value.data().order+" "+j);
      var title = document.createElement("h1")
      title.innerHTML = value.data().date+", "+value.data().title
      title.style.width = "80%"

      var link = document.createElement("a");
      link.className = "default-size slight-break bold";
      link.innerHTML = value.data().link;
      link.href = value.data().link;

      var uniqueAccessors = document.createElement("h2")
      uniqueAccessors.className = "default-size slight-break"
      uniqueAccessors.innerHTML = "Unique Accessors: "+value.data().numAccessed

      var copyLink = document.createElement("button")
      copyLink.id = "copyLinkButton"
      copyLink.className = "hover assignment-button rounded-corner box-shadow default-size slight-break"
      copyLink.innerHTML = "Copy Link"
      copyLink.onclick = function () {
        /* Get the text field */
        var copyText = document.getElementById("copiedText");
        console.log(arrayOfEverything)
        console.log(i)
        copyText.value = "https://trackinglinks-ae433.web.app/link.html?id="+newUser.uid+".com&identifier="+value.id+"&name="+value.data().requireName;
        console.log(copyText.value+" "+value.id)
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
        /* Copy the text inside the text field */
        document.execCommand("copy");
        /* Alert the copied text */
        document.getElementById("popUp").innerHTML = "Copied "+ copyText.value;
        document.getElementById("popUpDiv").className = "hide";
        setTimeout(function(){document.getElementById("popUpDiv").className = "box-shadow popUp green";},100)
      }

      var viewStats = document.createElement("button")
      viewStats.id = "viewStatsButton"
      viewStats.className = "hover assignment-button rounded-corner box-shadow default-size slight-break"
      viewStats.innerHTML = "View Stats"
      viewStats.onclick = function () {
        console.log("maybe??")
        showStatCard(value);
      }

      var deleteButton = document.createElement("button")
      deleteButton.id = "deleteButton"
      deleteButton.className = "hover assignment-button rounded-corner box-shadow default-size slight-break"
      deleteButton.innerHTML = "Delete"
      deleteButton.onclick = function () {
        deleteCard(value.id)
      }

      var orderDiv = document.createElement("div")
      orderDiv.className = "order-div"

      var ascendButton = document.createElement("button")
      ascendButton.className = "rounded-corner arrow-img"
      ascendButton.onclick = function() {
        raiseOrder(value.id, value.data().order)
      }
      var descendButton = document.createElement("button")
      descendButton.className = "rounded-corner arrow-img"
      descendButton.onclick = function() {
        lowerOrder(value.id, value.data().order)
      }

      var ascendImg = document.createElement("img")
      ascendImg.className = "statRow"
      ascendImg.src = "Images/raisebutton.png"
      var descendImg = document.createElement("img")
      descendImg.className = "statRow flip"
      descendImg.src = "Images/raisebutton.png"

      var randomBreak = document.createElement("br")
      ascendButton.appendChild(ascendImg)
      descendButton.appendChild(descendImg)
      orderDiv.appendChild(ascendButton)
      orderDiv.appendChild(randomBreak)
      orderDiv.appendChild(descendButton)


      outerDiv.appendChild(title)
      outerDiv.appendChild(link)
      outerDiv.appendChild(uniqueAccessors)
      outerDiv.appendChild(copyLink)
      outerDiv.appendChild(viewStats)
      outerDiv.appendChild(deleteButton)
      outerDiv.appendChild(orderDiv)
      if(value.id !="zzzzz"){
        assignmentPlace.appendChild(outerDiv)
        finalElement = document.getElementById(value.id)
      }
    console.log(changed)
    if(document.getElementById('loader').className!='hide'){
      document.getElementById('loader').className = 'fade';
      setTimeout(function() {
        document.getElementById('loader').className = 'hide';
      },100)
    }
    if(!changed){
      var arrow = document.createElement("img")
      arrow.src = "Images/arrow.png"
      arrow.id = "promptArrow"
      assignmentPlace.insertBefore(arrow,finalElement)
      var promptTitle = document.createElement("h1")
      promptTitle.id = "promptTitle"
      promptTitle.innerHTML = "To get started, add an assignment!"
      assignmentPlace.insertBefore(promptTitle,finalElement);
    }
  });
  });
}


