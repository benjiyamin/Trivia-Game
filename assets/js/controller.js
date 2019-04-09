function Controller(model, view) {
  const self = this

  this.updateQuestion = function () {
    $('#question', view).text(
      'Question ' + model.currentRound() + ': ' + model.currentQuestion.text
    )
    let $answers = $('#answers', view)
    $answers.empty()
    model.currentQuestion.answers.forEach(answer => {
      let button = $('<button>')
        .addClass('btn btn-secondary btn-lg btn-block')
        .text(answer.text)
        .on('click', function () {
          $('#answers>.btn')
            .addClass('disabled')
            .attr('disabled', true)
          button.removeClass('btn-secondary')
          if (answer.isCorrect) {
            button.addClass('btn-success')
          } else {
            button.addClass('btn-danger')
          }
          model.guess(answer)
          if (!model.gameOver()) {
            //self.updateQuestion()
            self.updateTime()
          } else {
            self.endGame()
          }
        })
      $answers.append(button)
    });
  }

  this.updateTime = function () {
    let percent = model.time / model.timePerQuestion * 100
    let $timeProgress = $('#timeProgress')
      .css('width', percent + '%')
      .text(model.time + ' s')
    if (percent > 50) {
      $timeProgress.attr('class', 'progress-bar bg-success')
    } else if (percent > 20) {
      $timeProgress.attr('class', 'progress-bar bg-warning')
    } else {
      $timeProgress.attr('class', 'progress-bar bg-danger')
    }
  }

  this.startGame = function () {
    this.updateQuestion()
    this.updateTime()
    $('#start').hide()
    $('#trivia').show()
  }

  this.endGame = function () {
    $('#score').text(model.score())
    let $results = $('#results', view)
    $results.empty()
    for (let i = 0; i < model.results.length; i++) {
      const result = model.results[i];
      let questionNumber = i + 1
      let questionP = $('<p>')
        .text('Question ' + questionNumber + ': ' + result.question.text)
      let answersDiv = $('<div>')
      result.question.answers.forEach(answer => {
        let answerDiv = $('<div>')
          .addClass('alert result-alert')
          .text(answer.text)
        if (answer === result.guess) {
          if (answer.isCorrect) {
            answerDiv.addClass('alert-success')
          } else {
            answerDiv.addClass('alert-danger')
          }
        }
        answersDiv.append(answerDiv)
      });
      let resultDiv = $('<div>')
        .append(questionP)
        .append(answersDiv)
      $results.append(resultDiv)
    }
    $('#trivia').hide()
    $('#end').show()
  }

  view.addEventListener('timeChange', function () {
    if (!model.gameOver()) {
      if (model.time === model.timePerQuestion) {
        self.updateQuestion()
      }
      self.updateTime()
    } else {
      self.endGame()
    }
  });

  $('#startBtn', view).on('click', function () {
    model.startGame(3, 5)
    self.startGame()
  })
}