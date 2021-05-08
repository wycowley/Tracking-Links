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

var db = firebase.firestore();
var date = new Date();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var email = urlParams.get('id').replace(".com", "")
var identifier = urlParams.get('identifier')
var nameRequired = urlParams.get('name')

console.log(email+" "+identifier)


// db.collection("users").add({

// }).then((docRef) => {
//   console.log("Document written with ID: ", docRef.id);
// })
// .catch((error) => {
//     console.error("Error adding document: ", error);
// });
function onPageLoad(){
    document.getElementById("name").value = getCookie("name")
    console.log(nameRequired);
    if(nameRequired == "false"){
        document.getElementById("mainDiv").style.display = "none"
        document.getElementById("otherOption").style.display = "inline-block"
    
        db.collection("users").doc(email).collection("assignments").doc(identifier).update({
            numAccessed: firebase.firestore.FieldValue.increment(1)
        }).then(() =>{
            // redirects to the correct location
            db.collection("users").doc(email).collection("assignments").doc(identifier).collection("accessors").add({
                name: "??",
                accessed: "1",
                date: date.getTime()
    
            }).then(() =>{
                db.collection("users").doc(email).collection("assignments").doc(identifier).get().then((doc)=>{
                    var links = doc.data().link;
                    links.replace("https://","");
                    links.replace("http://","");
                    links.replace("www.","");
        
                    window.location.href = "https://"+links;
                    console.log("HELP")
                })
            })
        })

        
    }
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function continueButton(){
    document.cookie = "name="+document.getElementById("name").value
    
    var enteredName = document.getElementById("name").value;
    var timesAccessed = 0;
    if(enteredName==""){
        window.alert("Please enter your name!")
        return;
    }
    // Check if there is already someone with that name
    db.collection("users").doc(email).collection("assignments").doc(identifier).collection("accessors").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.data().name+" "+ enteredName)
            if(doc.data().name == enteredName){
                console.log("adding another hopefully")
                timesAccessed = doc.data().accessed;
                
            }
        })
    }).then(() => {
        // then update the document
        timesAccessed++;
        if(timesAccessed==1){
            db.collection("users").doc(email).collection("assignments").doc(identifier).update({
                numAccessed: firebase.firestore.FieldValue.increment(1)
            })
        }
        console.log(timesAccessed)
        db.collection("users").doc(email).collection("assignments").doc(identifier).collection("accessors").doc(enteredName).set({
            name: document.getElementById("name").value,
            accessed: timesAccessed,
            date: date.getTime()

        })
        .then(()=>{
            // then redirect to the correct page
            db.collection("users").doc(email).collection("assignments").doc(identifier).get().then((doc)=>{
                var links = doc.data().link;
                links.replace("https://","");
                links.replace("http://","");
                links.replace("www.","");
    
                window.location.href = "https://"+links;
                console.log("HELP")
            })
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        })
    })
    
    
}
