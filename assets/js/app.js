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
  this.timeBetweenRounds = undefined
  this.time = undefined
  this.currentQuestion = undefined
  this.results = []

  this.startGame = function (questionCount = 10, timePerQuestion = 10) {
    if (questionCount <= questionBank.length) {
      this.questionCount = questionCount
      this.timePerQuestion = timePerQuestion
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
  }

  this.deincrementTime = function () {
    this.time--
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

  this.gameOver = function () {
    return this.results.length === this.questions.length
  }
}