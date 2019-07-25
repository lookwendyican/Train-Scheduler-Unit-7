//grab input and save to database

//retrieve data and display to html

//math for tomorrow




// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDc7ibqPSFSZsxVmAyKe84tp00peFyJ3pc",
  authDomain: "train-scheduler-d4c9e.firebaseapp.com",
  databaseURL: "https://train-scheduler-d4c9e.firebaseio.com",
  projectId: "train-scheduler-d4c9e",
  storageBucket: "train-scheduler-d4c9e.appspot.com",
  messagingSenderId: "180241548457",
  appId: "1:180241548457:web:43d1b24d4d8833a3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var database = firebase.database();

$(document).ready(function () {

  function time(){
    var current = moment().format("LT");
    $("#currentTime").html(current);
    setTimeout(time, 1000);
  }

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";

  // Capture Button Click
  $("#add-train").on("click", function (event) {
    // Don't refresh the page! we use the prevent default
    event.preventDefault();

    //We capture from these inputs from the DOM

    var newTrain = {
      trainName: $("#train-name").val().trim(),
      destination: $("#destination").val().trim(),
      firstTrainTime: moment($("#first-train").val().trim(), "HH:mm").subtract(1, "years").format("X"),
      frequency: $("#frequency").val().trim()
    };


    database.ref().push(newTrain);
    console.log(newTrain);
  });  //End of Capture Button Click function


  //Code to display last train submited info from firebase back to the table

  database.ref().on("child_added", function (childSnap) {
    console.log(childSnap.val().trainName);
    console.log(childSnap.val().destination);
    console.log(childSnap.val().firstTrainTime);
    console.log(childSnap.val().frequency);

    var trainName = childSnap.val().trainName;
    var destination = childSnap.val().destination;
    var firstTrainTime = childSnap.val().firstTrainTime;
    var frequency = childSnap.val().frequency;

    


    // Assumptions
    var tFrequency = childSnap.val().frequency;

    // 
    var firstTime = moment(firstTrainTime, "X").format("h;mm A");
    console.log("Time converted:   "  + firstTime);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    //var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrain = moment(nextTrain).format("hh:mm")
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


    var tr = $("<tr>");

    var tdtrainName = $("<td>").text(childSnap.val().trainName);
    var tdDestination = $("<td>").text(childSnap.val().destination);
    var tdFrequency = $("<td>").text(childSnap.val().frequency);
    var tdNextArrival = $("<td>").text(nextTrain);
    var tdMinutesAway = $("<td>").text(tMinutesTillTrain);


    tr.append(tdtrainName).append(tdDestination).append(tdFrequency).append(tdNextArrival).append(tdMinutesAway);

    $('#train-table').append(tr);

  }); //End of childSnap function

}); //End of Document ready function