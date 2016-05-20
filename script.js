let info = {
  q: "Does it have flippers?",
  y: {animal: "a dolphin"},
  n: {animal: "a kangaroo"}
}
let states = {
  start: {
    show: 'h1, .beginRestart'
  , enter: () => {
      question = info;
      $('.beginRestart button').html("Begin");
    }
  }
, ask: {
    show: 'h1, .beginRestart, .question'
  }
}

let question;
let state;

setupEvents();
gotoState('start')

function setupEvents() {
  $('.beginRestart button').click(() => {
    if (state == 'start') {
      $('.beginRestart button').html('Restart');
      gotoState('ask');
    }
    else
      gotoState('start');
  })
}

function gotoState(s) {
  let newS = states[s];
  
  // hide/show things
  if (state !== undefined)
    $(state.show).not(newS.show).slideUp();
  $(newS.show).slideDown();
  
  state = s;
}
