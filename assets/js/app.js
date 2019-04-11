// Fisher-Yates shuffle
function shuffle(array) {
  var i = 0,
    j = 0,
    temp = null
  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}


function Game(questionBank) {
  this.questionBank = questionBank
  this.questions = []
  this.questionCount = undefined
  this.timePerQuestion = undefined
  this.interval = undefined
  this.time = undefined
  this.currentQuestion = undefined
  this.results = []

  var event = new CustomEvent('timeChange', {
    'detail': 'Trivia time is updated'
  });

  this.startGame = function (questionCount = 10, timePerQuestion = 10, timeBetweenRounds = 2) {
    if (questionCount <= questionBank.length) {
      this.questionCount = questionCount
      this.timePerQuestion = timePerQuestion
      this.timeBetweenRounds = timeBetweenRounds
      shuffle(this.questionBank)
      this.questions = this.questionBank.slice(0, questionCount) // Select # of random questions from the bank
      this.results = [] // Reset the results
      this.currentQuestion = this.questions[0] // Initialize first question
      this.startRound()
    } else {
      'Not enough questions in the bank'
    }
  }

  this.startRound = function () {
    this.time = this.timePerQuestion // Reset the time
    document.dispatchEvent(event);
    clearInterval(this.inverval)
    this.inverval = setInterval(this.deincrementTime.bind(this), 1000) // Start the timer
  }

  this.endRound = function() {
    clearTimeout(this.inverval)
    this.inverval = setTimeout(this.nextRound.bind(this), 1000 * this.timeBetweenRounds) // Start the timer
  }

  this.nextRound = function() {
    if (!this.currentQuestionLast()) { // Round is over
      this.nextQuestion()
      this.startRound()
    } else { // Game is over
      this.endGame()
    }
  }

  this.deincrementTime = function () {
    this.time--
    document.dispatchEvent(event);
    if (this.time <= 0) {
      this.guess()
    }
  }

  this.guess = function (guess) {
    // Make a guess
    let resultGuess;
    if (guess && this.currentQuestion.answers.indexOf(guess) !== -1) {
      resultGuess = guess
    }
    let result = {
      guess: resultGuess,
      question: this.currentQuestion
    }
    this.results.push(result)
    this.endRound()
  }

  this.score = function () {
    let score = 0
    this.results.forEach(result => {
      if (result.guess === this.correctAnswer(result.question)) {
        score++
      }
    });
    return score
  }

  this.unanswered = function() {
    let unanswered = 0
    this.results.forEach(result => {
      if (!result.guess) {
        unanswered++
      }
    });
    return unanswered
  }

  this.incorrect = function () {
    return this.score() - this.unanswered()
  }

  this.correctAnswer = function (question) {
    for (let i = 0; i < question.answers.length; i++) {
      const answer = question.answers[i];
      if (answer.isCorrect) {
        return answer
      }
    }
  }

  this.currentQuestionLast = function () {
    let index = this.questions.indexOf(this.currentQuestion)
    if (index < this.questions.length - 1) {
      return false
    } else {
      return true
    }
  }

  this.nextQuestion = function () {
    if (!this.currentQuestionLast()) {
      let index = this.questions.indexOf(this.currentQuestion)
      this.currentQuestion = this.questions[index + 1]
    } else {
      throw 'Current question is the last'
    }
  }

  this.currentRound = function() {
    return this.questions.indexOf(model.currentQuestion) + 1
  }

  this.endGame = function () {
    document.dispatchEvent(event);
    clearInterval(this.inverval)
  }

  this.gameOver = function () {
    return this.results.length === this.questions.length && !this.interval
  }
}