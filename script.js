"use strict";
let info = {
  q: "Does it have flippers?",
  y: {animal: "a dolphin"},
  n: {animal: "a kangaroo"}
}
let states = {
  start: {
    show: 'h1, .beginRestart'
  , enter() {
      setQuestion(info)
      $('.beginRestart button').text("Begin");
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
}

let question;
let state;

setupEvents();
gotoState('start')

function setupEvents() {
  // Begin button
  $('.beginRestart button').click(() => {
    if (state == 'start') {
      $('.beginRestart button').text('Restart');
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
}

function gotoState(s) {
  let newS = states[s];

  // call enter
  if (newS.enter) newS.enter();

  // hide/show things
  if (state !== undefined)
    $(states[state].show).not(newS.show).slideUp();
  $(newS.show).slideDown();

  state = s;
}

function setQuestion(q) {
  question = q;
  if (q.q)
    $('.question p').text(q.q);
  else
    gotoState('guess')
}
