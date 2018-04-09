function generateWinningNumber(){
  return Math.floor(Math.random()*100) + 1
}

function shuffle(arr){
  var remaining = arr.length
  var i
  var placeholder
  while(remaining){
    i = Math.floor(Math.random() * remaining--)
    placeholder = arr[remaining]
    arr[remaining] = arr[i]
    arr[i] = placeholder
  }
  return arr;
}

function Game(){
  this.playersGuess = null
  this.pastGuesses = []
  this.winningNumber = generateWinningNumber()
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess-this.winningNumber)
}

Game.prototype.isLower = function(){
  return this.playersGuess<this.winningNumber
}

Game.prototype.playersGuessSubmission = function(num){
  if(num===Math.floor(num) && num>0 && num<=100){
    this.playersGuess = num
    return this.checkGuess()
  }else{
    throw "That is an invalid guess."
  }
}

Game.prototype.checkGuess = function(){
  function gameEnds(){
    $('h3').text('Reset the game')
    $('#hint-btn, #submit-input, #player-input').prop('disabled', true)
  }
  if(this.pastGuesses.includes(this.playersGuess)){
    return "You have already guessed that number. Guess again..."
  }
  this.pastGuesses.push(this.playersGuess)
  $(`ul li:nth-child(${this.pastGuesses.length})`).text(this.playersGuess)
  if(this.playersGuess===this.winningNumber){
    gameEnds()
    return "You Win!"
  }else if(this.pastGuesses.length===5){
    gameEnds()
    return "You Lose."
  }else{
    var difference = this.difference()
    if(difference<10){
      return "You're burning up!"
    }else if(difference<25){
      return "You're lukewarm."
    }else if(difference<50){
      return "You're a bit chilly."
    }else{
      return "You're ice cold!"
    }
  }
}

function newGame(){
  return new Game
}

Game.prototype.provideHint = function(){
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()])
}


$(document).ready(function(){
  var game = newGame()
  
  function makeGuess(){
    var guess = +$('#player-input').val()
    var result = game.playersGuessSubmission(guess)
    $('#player-input').val('')
    if(result==="You Win!" || result==="You Lose."){
      $('h2').text(result)
    }else{
      game.isLower() ? $('h2').text(`${result} Guess higher!`) : $('h2').text(`${result} Guess lower!`)
    }
  }
  
  $('#submit-input').on('click', makeGuess)
  $('#player-input').on('keypress', function(event){
    if(event.keyCode===13){makeGuess()}
  })
  
  $('#hint-btn').on('click', function(){
    var hints = game.provideHint()
    $('h3').text(`The answer might be ${hints[0]}, ${hints[1]} or ${hints[2]}.`)
    $('#hint-btn').prop('disabled', true)
  })
  
  $('#reset-btn').on('click', function(){
    game = newGame()
    $('h1').text("The Great Phantasmo's Guessing Game")
    $('h2').text("Guess a number...")
    $('h3').text("")
    $('li').text("---")
    $('#hint-btn, #submit-input, #player-input, #hint-btn').prop('disabled', false)
  })
  
})