$( document ).ready( () => {
  let randomNumber = random_num();
  while (!randomNumber.toString().is_different()) { randomNumber = random_num(); }
  $('.number').on('keypress', function(event) {
    if (event.which !== 13) return;
    init_game(randomNumber.toString(), $(this).val());
  });

  $('.new-game > button').on('click', () => {
    $('.endgame').fadeOut('slow', () => {
      location.reload();
    });
  });

  $('.hint-active').on('click', () => {
    pista(randomNumber.toString());
  });
});

let init_game = (randomNumber,number) => {
  if (validations(number)) return;
  let results = game(number,randomNumber);
  show_result(results);
  if (number === randomNumber) wonGame();
}

let validations = number => {
  return number.is_different() && number > 999 && number < 10000 ? (
      $('.validation').removeClass('error'),
      $('.form-group > input').removeClass('form-error'),
      false
    ) : (
      $('.validation').addClass('error'),
      $('.form-group > input').addClass('form-error'),
      true
    );
}

let game = (number,randomNumber) => {
  let picas = 0;
  let fijas = 0;
  for (let i = 0; i < number.length; i++) {
    let pos = randomNumber.indexOf(number[i])
    if ( pos !== -1) { number[i] === randomNumber[i] ? fijas++ : picas++ }
  }
  return { number: number, picas: picas, fijas: fijas }
}

let show_result = (results) => {
  let template = Handlebars.compile($('#template-tr').html());
  $('table tbody').prepend(template({ results: results }));
  $('.number').val('');
}

let wonGame = () => { 
  $('.endgame').show();
  $('tbody tr:first-child td').addClass('correct');
}

let random_num = () => Math.floor(Math.random() * (9999 - 1000) + 1000);

let pista = (randomNumber) => {
  $('.hint-active').hide();
  $('.hint-inactive').show();
  let number_hint = randomNumber[0] + "---";
  show_result({ number: number_hint, picas: "0", fijas: "1"});
  $('tbody tr:first-child td').addClass('hint');
}

String.prototype.is_different = function() {
  let res = true;
  for (let i = 0; i < this.length && res; i++) {
    let re = new RegExp(this[i], "g");
    if (this.replace(re, "").length !== 3) { res = false; }
  }
  return res;
}