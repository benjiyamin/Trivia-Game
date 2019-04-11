function Controller(model, view) {
  const self = this

  this.updateQuestion = function () {
    $('#question', view).text(
      'Q' + model.currentRound() + ': ' + model.currentQuestion.text
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
            button
              .addClass('btn-success')
              .append(' <i class="fas fa-check"></i>')
          } else {
            button
              .addClass('btn-danger')
              .append(' <i class="fas fa-times"></i>')
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
      .text(Math.ceil(model.time) + ' s')
    if (percent > 50) {
      $timeProgress.attr('class', 'progress-bar bg-success')
    } else if (percent > 20) {
      $timeProgress.attr('class', 'progress-bar bg-warning')
    } else {
      $timeProgress.attr('class', 'progress-bar bg-danger')
    }
    if (model.time <= 0) {
      $('#answers>.btn')
        .addClass('disabled btn-danger')
        .attr('disabled', true)
    }
  }

  this.startGame = function () {
    this.updateQuestion()
    this.updateTime()
    $('#start').hide()
    $('#trivia').show()
    $('#end').hide()
  }

  this.endGame = function () {
    //$('#score').text(model.score())
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
          //answerText += ' <i class="fas fa-check"></i>'
        }
        if (answer === result.guess) {
          if (answer.isCorrect) {
            answerDiv.addClass('alert-success')
          } else {
            answerDiv
              .addClass('alert-danger')
              .append(' <i class="fas fa-times"></i>')
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

  $('.start-btn', view).on('click', function () {
    model.startGame()
    self.startGame()
  })
}