
/** Global Declarations **/

const deck = document.querySelector('.deck');
const moveLabel = document.querySelector('.moves');
const totalMoves = document.querySelector('.movesTotal');
const timeLabel = document.querySelector('.time');
const restart = document.querySelectorAll('.restart');
const modal = document.getElementById('myModal');
const win = document.querySelector('.win');
const gameOver = document.querySelector('.game-over');
const finishTime = document.querySelector('.finish-time');
const rating = document.querySelector('.rating');
let stars = document.querySelector('.stars');
let cards = document.querySelectorAll('ul.deck li');
let openCards = [];
let hasCard = false;
let moves = 0;
let matched = 0;
let timer = 60;
let completeTime = 0;
let countdown;

// to shuffle the cards 
console.log(cards);
deck.innerHTML = '';
let shuffledCards = shuffle(Array.from(cards));
cards = shuffledCards;

// to append the shuffled cards to the deck
for (newCard of shuffledCards) {
  newCard.className = 'card open show';
  deck.appendChild(newCard);
}

// onClick function for the reset buttons
for (var x in restart) {
  restart[x].onclick = function () {
    repeatFunction();
  };
}
// 1.5 seconds to view the cards before hiding them
// countdown starts after hiding the cards 
setTimeout(() => {
  for (card of shuffledCards) {
    card.className = 'card';
  }
  countdown = setInterval(function () {
    timer--;
    timeLabel.innerHTML = timer;
    if (timer == 0) {
      clearInterval(countdown);
      modal.style.display = 'block';
      gameOver.style.display = 'inline';
    }
  }, 1000);
}, 1500);

/*** FUNCTIONS ***/

function cardClickListener() {
  let selectedCard = event.target;
  if (selectedCard.classList.contains('card')) {
    if (openCards.length <= 2 && !selectedCard.classList.contains('match') && !selectedCard.classList.contains('open') && !selectedCard.classList.contains('show')) {
      cardOpened(selectedCard);
      openCards.push(selectedCard);
      if (openCards.length == 2) {
        deck.removeEventListener('click', cardClickListener);
        if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
          cardsMatched(openCards[0], openCards[1]);
          deck.addEventListener('click', cardClickListener);
          matched++;
        } else {
          notMatched(openCards[0], openCards[1]);
          setTimeout(function () {
            notMatched(openCards[0], openCards[1]);
            cardOpened(openCards[0]);
            cardOpened(openCards[1]);
            openCards = [];
            deck.addEventListener('click', cardClickListener);
          }, 1000);
        }
        moves++;
        moveLabel.innerHTML = moves;
        // remove stars according to the moves 
        // ([ <9 is 3 stars, between 9 to 18 is 2 stars, above 18 is 1 star])
        if (moves == 9 || moves == 18) {
          stars.removeChild(stars.lastElementChild);
        }
        if (matched == 8) {
          clearInterval(countdown);
          completeTime = 60 - timer;
          finishTime.innerHTML = completeTime;
          totalMoves.innerHTML = moves;
          rating.innerHTML = stars.innerHTML;
          modal.style.display = 'block';
          win.style.display = 'inline';
        }
      }
    }
  }
}

// when the repeat button clicked, will call this fuction
// which is going to reload the page 
function repeatFunction() {
  document.location.reload();
}
// will toggle the classes for showing the selected card
function cardOpened(e) {
  e.classList.toggle('open');
  e.classList.toggle('show');
}

// if the cards matched, add the match class
function cardsMatched(firstCard, secondCard) {
  cardOpened(firstCard);
  cardOpened(secondCard);
  firstCard.classList.toggle('match');
  secondCard.classList.toggle('match');
  openCards = [];
}

// if the cards not matched, add the shake effect
function notMatched(fCard, sCard) {
  fCard.classList.toggle('wrong');
  sCard.classList.toggle('wrong');
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/**  Event listeners **/

deck.addEventListener('click', cardClickListener);