
// Code of the stopwatch adapted from https://dev.to/gspteck/create-a-stopwatch-in-javascript-2mak
const timer = document.getElementById('stopwatch');
const input = document.getElementById('input');
// const result = document.getElementById('result');
const timeUsed = document.getElementById('timeUsed');
const errors = document.getElementById('errors');
const text_to_write=document.getElementById('textToWrite').innerHTML
const errorAdjustedTime=document.getElementById('ErrorAdjustedTime')
const pauseButton=document.getElementById('pauseButton')
const resetButton=document.getElementById('resetButton')
const insructions=document.getElementById('instructions')
const history=document.getElementById('history')
var test = document.getElementById('test')
var resultBox=document.getElementById('resultBox')
var date = document.getElementById('date')
var time = document.getElementById('time')


var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;
// var errorcount=0

function startTimer() {
  if (stoptime == true) {
        stoptime = false;
        timerCycle();
        // resetButton.style.display=""
      
    }
  // pauseButton.style.display=""
}

function toggleHistory() {
  if (history.style.display == 'none') {
    history.style.display = 'block'
    document.getElementById('toggleHistoryButton').innerHTML='Hide'
  } else {
    history.style.display = 'none'
    document.getElementById('toggleHistoryButton').innerHTML='Show'
  }
}
// function stopTimer() {
//   result.style.display="none"
//   if (stoptime == false) {
//     stoptime = true;
//   }
  
//   input.disabled=false
//   result.style.display="none"
//   input.style.backgroundColor = "white";
//   input.focus();
// }

function toggleInstructions() {
  if (instructions.style.display == 'none') {
    instructions.style.display = 'block'
    document.getElementById('toggleInstructionsButton').innerHTML='Hide'
  } else {
    instructions.style.display = 'none'
    document.getElementById('toggleInstructionsButton').innerHTML='Show'
  }
  document.getElementById("exampleModal").modal()
  
}

function secondsToTime(seconds) {
  console.log("input", seconds)
  seconds=parseInt(seconds)
  minutes=0
  hours=0
  if (seconds>=60) {
    console.log("seconds", seconds)
    minutes=Math.floor(seconds/60)
    console.log("minutes", minutes)
    seconds-=minutes*60
    console.log("seconds", seconds)
    if (minutes>=60) {
      hours=Math.floor(minutes/60)
      minutes-=hours*60
    }
  } 

  if (seconds < 10 || seconds == 0) {
    seconds = '0' + seconds;
  }
  if (minutes < 10 || minutes == 0) {
    minutes = '0' + minutes;
  }
  if (hours < 10 || hours == 0) {
    hours = '0' + hours;
  }

  // if (hours>100) {
  //   hours=99;
  //   minutes=59
  //   seconds=59
  // }
  var result = hours + ':' + minutes + ':' + seconds;
  console.log(result)
  return result

}

function showModal() {
  const modal=document.getElementById('myModal')
  console.log("pressed")
  modal.style.display='block'
}

function timerCycle() {
    if (stoptime == false) {
      sec = parseInt(sec);
      min = parseInt(min);
      hr = parseInt(hr);

      sec = sec + 1;

      if (sec == 60) {
        min = min + 1;
        sec = 0;
      }
      if (min == 60) {
        hr = hr + 1;
        min = 0;
        sec = 0;
      }

      if (sec < 10 || sec == 0) {
        sec = '0' + sec;
      }
      if (min < 10 || min == 0) {
        min = '0' + min;
      }
      if (hr < 10 || hr == 0) {
        hr = '0' + hr;
      }

      timer.innerHTML = hr + ':' + min + ':' + sec;

      setTimeout("timerCycle()", 1000);
  }
}

function resetTimer() {
    timer.innerHTML = '00:00:00';
    input.value = ''
    if (stoptime == false) {
      stoptime = true;
    }
    hr = 0;
    min = 0;
    sec = 0;
    input.style.backgroundColor = "white";
    input.disabled = false;
    if (resultBox.style.display != "none") resultBox.style.display="none"
    // resetButton.style.display='none'
    input.focus();
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  var nr_errors=editDistance(longer, shorter)
  sim=(longerLength - nr_errors) / parseFloat(longerLength);
  if (sim<1) sim-=0.075
  if (sim<0) sim=0.000001
  multiplier=sim*sim*sim
  return [nr_errors, multiplier];
}

// Code adapted from https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
function editDistance(s1, s2) {
  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}


function postRequest(data, URL) {
  console.log("post method called")

  fetch(URL, {
    method: "POST",
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(data)
  }).then(res => {
    console.log("Request complete! response:", res);
    window.location.reload();
  });
}


function submit(){
    
  if (stoptime == false) {
    stoptime = true;
  }
  input.style.backgroundColor = "whiteSmoke";
  input.disabled = true;
  // result.style.display="block"
  var totalSeconds=parseInt(hr)*3600+parseInt(min)*60+parseInt(sec)
  if (totalSeconds==0) {
    return
  }
  console.log("total seconds", totalSeconds)
  timeUsed.innerHTML=secondsToTime(totalSeconds)
  var textInput=input.value
  // pauseButton.style.display='none'
  var err;
  var penalty;
  [err, penalty]=(similarity(text_to_write, textInput));
  err=parseInt(err)
  console.log("errors", err)
  var adjustedSeconds=parseInt(totalSeconds/penalty);
  if (adjustedSeconds>359999) {
    adjustedSeconds=359999
  }
  ErrorAdjustedTime.innerHTML=secondsToTime(adjustedSeconds);
  errors.innerHTML=err;
  

  var today = new Date();
  var d = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  date.innerHTML=d
  time.innerHTML=t

  
  resultBox.style.display="block";

  document.getElementById('id_truebtn').onclick = function(){
      var exercise_id=document.getElementById('exerciseId').innerHTML
      console.log("exercise_id", exercise_id)
      exercise_id=parseInt(exercise_id)
      console.log("exercise_id", exercise_id)
      data = {
        exercise_id: exercise_id,
        used_time: totalSeconds,
        adjusted_time: adjustedSeconds,
        errors: err
      }
      postRequest(data, "/new_result")

      
  };
  document.getElementById('id_falsebtn').onclick = function(){
        alert('false');
      return false;
  };
}


// document.getElementById("test").innerHTML="toka"