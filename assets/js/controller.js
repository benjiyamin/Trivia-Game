function Controller(model, view) {
  const self = this
  this.timeBetweenRounds = undefined
  this.interval = undefined

  this.updateQuestion = function () {
    $('#question', view).text(
      'Q' + model.currentRound() + ': ' + model.currentQuestion.text
    )
    let $answers = $('#answers', view)
    $answers.empty()
    var correctBtn
    model.currentQuestion.answers.forEach(answer => {
      let button = $('<button>')
        .addClass('btn btn-secondary btn-lg btn-block')
        .text(answer.text)
        .on('click', function () {
          $('#answers>.btn')
            .attr('disabled', true)
            .each(function (i, btn) {
              let $btn = $(btn)
              if ($btn.is(correctBtn)) {
                $btn.append(' <i class="fas fa-check"></i>')
                return false // break loop
              }
            })
          button.removeClass('btn-secondary')
          if (answer.isCorrect) {
            button
              .addClass('btn-success')
          } else {
            button
              .addClass('btn-danger')
              .append(' <i class="fas fa-times"></i>')
          }
          model.guess(answer)
          self.endRound()
          if (!model.gameOver()) {
            self.updateTime()
          } else {
            self.endGame()
          }
        })
      $answers.append(button)
      if (answer.isCorrect) {
        correctBtn = button
      }
    });
  }

  this.updateTime = function () {
    let percent = model.time / model.timePerQuestion * 100
    let $timeProgress = $('#timeProgress')
      .css('width', percent + '%')
      .text(Math.ceil(model.time) + ' s')
    if (percent > 50) {
      $timeProgress.attr('class', 'progress-bar bg-success')
    } else if (percent > 20) {
      $timeProgress.attr('class', 'progress-bar bg-warning')
    } else {
      $timeProgress.attr('class', 'progress-bar bg-danger')
    }
    if (model.time <= 0) { // Ran out of time
      $('#answers>.btn')
        //.addClass('btn-danger')
        .attr('disabled', true)
        .each(function (i, btn) {
          let $btn = $(btn)
          if ($btn.text() == model.correctAnswer(model.currentQuestion).text) {
            $btn.append(' <i class="fas fa-check"></i>')
            return false  // break loop
          }
        })
    }
  }

  this.startGame = function (timeBetweenRounds = 2) {
    this.timeBetweenRounds = timeBetweenRounds
    this.updateQuestion()
    this.updateTime()
    $('#start').hide()
    $('#trivia').show()
    $('#end').hide()
    this.startRound()
  }

  this.endGame = function () {
    this.showStones()
    let $results = $('#results', view)
    $results.empty()
    for (let i = 0; i < model.results.length; i++) {
      const result = model.results[i];
      let questionNumber = i + 1
      let questionP = $('<p>')
        .text('Q' + questionNumber + ': ' + result.question.text)
      let answersDiv = $('<div>')
      result.question.answers.forEach(answer => {
        let answerText = answer.text
        let answerDiv = $('<div>')
          .addClass('alert result-alert')
          .text(answerText)
        if (answer.isCorrect) {
          answerDiv.append(' <i class="fas fa-check"></i>')
        }
        if (answer === result.guess) {
          if (answer.isCorrect) {
            answerDiv.addClass('btn-success')
          } else {
            answerDiv
              .addClass('btn-danger')
              .append(' <i class="fas fa-times"></i>')
          }
        }
        answersDiv.append(answerDiv)
      });
      let resultDiv = $('<div>')
        .addClass('result')
        .append(questionP, answersDiv)
      $results.append(resultDiv)
    }
    $('#trivia').hide()
    $('#end').show()
  }

  this.addStone = function (imgSrc) {
    let stoneImg = $('<img>')
      .addClass('img-fluid img-stone')
      .attr('src', imgSrc)
    $('#gauntletWrapper').append(stoneImg)
  }

  this.showStones = function () {
    let count = Math.floor(model.score() / model.questionCount * 6)
    $('#score').text(count)
    if (count >= 1) this.addStone('assets/images/stone-purple.png')
    if (count >= 2) this.addStone('assets/images/stone-blue.png')
    if (count >= 3) this.addStone('assets/images/stone-red.png')
    if (count >= 4) this.addStone('assets/images/stone-orange.png')
    if (count >= 5) this.addStone('assets/images/stone-green.png')
    if (count >= 6) this.addStone('assets/images/stone-yellow.png')
  }

  this.onTimeChange = function () {
    if (!model.gameOver()) {
      if (model.time === model.timePerQuestion) {
        self.updateQuestion()
      }
      self.updateTime()
    } else {
      self.endGame()
    }
  }

  this.startRound = function () {
    model.startRound()
    this.onTimeChange()
    clearInterval(this.inverval)
    this.inverval = setInterval(this.deincrementTime.bind(this), 1000) // Start the timer
  }


  this.deincrementTime = function () {
    model.deincrementTime()
    this.onTimeChange()
    if (model.time <= 0) {
      model.guess()
      this.endRound()
    }
  }

  this.endRound = function () {
    clearTimeout(this.inverval)
    this.inverval = setTimeout(this.nextRound.bind(this), 1000 * this.timeBetweenRounds) // Start the timer
  }

  this.nextRound = function () {
    if (!model.currentQuestionLast()) { // Round is over
      model.nextQuestion()
      this.startRound()
    } else { // Game is over
      clearInterval(this.inverval)
      this.onTimeChange()
    }
  }

  $('.start-btn', view).on('click', function () {
    model.startGame()
    self.startGame()
  })

}