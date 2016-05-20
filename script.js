"use strict";
let info = {
  q: "Does it have flippers?",
  y: {animal: "a dolphin"},
  n: {animal: "a kangaroo"}
}
let initInfo = info;
let states = {
  start: {
    show: 'h1, .beginRestart'
  , enter() {
      setQuestion(info)
      $('#begin').text("Begin");
      $('input').prop('value', '')
    }
  }
, ask: {
    show: 'h1, .beginRestart, .question'
  }
, guess: {
    show: 'h1, .beginRestart, .guess'
  , enter() {
      $('.guess p span').text(question.animal)
    }
  }
, add: {
    show: 'h1, .beginRestart, .add'
  }
, enterQuestion: {
    show: 'h1, .beginRestart, .enterQuestion'
  , enter() {
      let anim = $('.enterQuestion .anim');
      anim.eq(0).text(newAnimal);
      anim.eq(1).text(question.animal);
    }
  }
, enterYesNo: {
    show: 'h1, .beginRestart, .enterYesNo'
  , enter() {
      $('.enterYesNo .q').text(newQuestion);
      $('.enterYesNo .anim').text(newAnimal);
    }
  }
}

let question;
let state;
let newAnimal;
let newQuestion;

let animalRE = /"animal"\s*:\s*"(?:[^"\\]*)(?:\\.[^"\\]*)*"/g;
let strRE = /"(?:[^"\\]*)(?:\\.[^"\\]*)*"/;

setupEvents();
setupStorage();
gotoState('start')

function setupEvents() {
  // Begin button
  $('#begin').click(() => {
    if (state == 'start') {
      $('#begin').text('Restart');
      gotoState('ask');
    }
    else
      gotoState('start');
  })

  // Answer buttons
  $('.question button').click(function() {
    var answer = $(this).text().substring(0,1).toLowerCase();
    setQuestion(question[answer]);
  })

  // Correct?
  function messageAndRestart(msg) {
    $('body > *').slideUp();
    let h1 = $('h1')
    h1.slideUp(undefined, () => {
      let text = h1.text();
      h1.text(msg);
      h1.slideDown();
      setTimeout(() => {
        h1.slideUp(undefined, () => {
          h1.text(text);
          gotoState('start')
        });
      }, 1500);
    });
  }
  $('#correct').click(() => { messageAndRestart("I got it!") })

  //Incorrect?
  $('#incorrect').click(function() {
    gotoState('add')
  })

  // Animal done
  $('.add button').click(function () {
    newAnimal = $('.add input')[0].value;
    gotoState('enterQuestion')
  })

  // Added question done
  $('.enterQuestion button').click(function () {
    newQuestion = $('.enterQuestion input')[0].value;
    gotoState('enterYesNo');
  })

  // yes/no defined for new question
  $('.enterYesNo button').click(function() {
    let answer = $(this).text().substring(0,1).toLowerCase();
    let oldAnimal = question.animal;
    delete question.animal;
    question.q = newQuestion;
    question[answer] = { animal: newAnimal };
    question[answer == 'y'? 'n' : 'y'] = { animal: oldAnimal };
    let newInfo = JSON.stringify(info);
    if ((typeof localStorage) !== undefined) {
      localStorage.setItem('animalGuessInfo', newInfo);
    }
    showInfo();
    messageAndRestart(`Okay! I will remember ${newAnimal}!`);
  })

  // Hook up Enter key on input fields.
  $('input[type="text"]').keydown(
    function(e) {
      if (e.keyCode == 13) {
        $(this).siblings('button').eq(0).click();
      }
    }
  )
}

function gotoState(s) {
  let newS = states[s];

  // call enter
  if (newS.enter) newS.enter();

  // hide/show things
  if (state !== undefined)
    $(states[state].show).not(newS.show).slideUp();
  $(newS.show).slideDown();
  $('#info').show();

  // focus any newly appeared text inputs
  //$('input').focus()

  state = s;
}

function setQuestion(q) {
  question = q;
  if (q.q)
    $('.question p').text(q.q);
  else
    gotoState('guess')
}

function setupStorage() {
  if ((typeof localStorage) !== undefined) {
    let newInfo = localStorage.getItem('animalGuessInfo');
    if (newInfo) {
      info = JSON.parse(newInfo);
    }

    $('#clear').show();

    $('#clear').click(function() {
      localStorage.removeItem('animalGuessInfo');
      info = initInfo;
      showInfo();
      gotoState('start');
    })
  }
  showInfo();
}

function showInfo() {
  let infoS = JSON.stringify(info);
  // Sanitize for HTML.
  infoS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&rt;');
  info
  $('#info').html(
    infoS.replace(animalRE, a => {
      let p = a.substring(0, 8); // includes "animal"
      let P = a.substring(8); // includes the value string
      return p + P.replace(strRE, b => `<strong>${b}</strong>`);
    }).replace(/"/g, '&quot;')
  );
}
