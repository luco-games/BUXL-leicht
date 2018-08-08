var BuxlGameView = function BuxlGameView (elements) {
    BuxlViewPrototype.call(this, elements);
};

BuxlGameView.prototype = Object.create(BuxlViewPrototype.prototype);

BuxlGameView.prototype.onLetterClick = function onLetterClick (letterHash)
{
    var target = document.querySelector('[data-game-btn-id="'+ letterHash +'"]');
    anime({
      targets: target,
      scale: 0.8,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      duration: 100,
      complete: function () {
        target.style="";
      }
    });
};

BuxlGameView.prototype.setSelectedLetterInactive = function setSelectedLetterInactive (currentLetterHash, oppositeLetterHash)
{
    this.onLetterClick(currentLetterHash);
    this.changeButtonByHash(currentLetterHash,"letter-selected","letter-inactive");
    this.changeButtonByHash(oppositeLetterHash,"letter-notselected","letter-inactive");
};

BuxlGameView.prototype.setSelectedLetter = function setSelectedLetter (currentLetterHash, oppositeLetterHash)
{
    this.onLetterClick(currentLetterHash);
    this.changeButtonByHash(currentLetterHash,"letter-inactive","letter-selected");
    this.changeButtonByHash(oppositeLetterHash,"letter-inactive","letter-notselected");
};

BuxlGameView.prototype.swapLetter = function swapLetter (currentLetterHash, newLetterHash)
{
    this.onLetterClick(newLetterHash);
    this.changeButtonByHash(currentLetterHash,"letter-selected","letter-notselected");
    this.changeButtonByHash(newLetterHash,"letter-notselected","letter-selected");
};

BuxlGameView.prototype.setSelectedLetters = function setSelectedLetters (letters) 
{
    for (var i = 0; i < letters.length; i++) {
        var selectedSolution = document.querySelector('[data-solution-index="'+ i +'"]');
        if (selectedSolution)
            selectedSolution.innerHTML = letters[i];
    }
};

BuxlGameView.prototype.animateWrongWord = function animateWrongWord (dataModel)
{
    this.curDataModel = dataModel;
    var _this = this;

    anime({
      targets: '.letter-solution-mass',
      duration: 1000,
      backgroundColor: '#ff0066',  
      easing: 'easeOutBack'
    });

    anime({
      targets: '.gamewrap',
      translateX: ['-.60rem', '.60rem', '-.60rem'],
      duration: 500,
      loop: 2,
      easing: 'linear',
      direction: 'alternate',
      complete:  _this.render.bind(_this, dataModel, true)
    });
};

BuxlGameView.prototype.animateSolved = async function animateSolved (dataModel)
{
    anime({
      targets: '.letter-solution-mass',
      duration: 500,
      backgroundColor: '#b2ff33',
      easing: 'easeOutBack'
    });

    await anime({
      targets: '.letter-selected',
      duration: 200,
      delay: 0,
      opacity: 0.2,
      loop: 5,
      easing: 'linear'
    }).finished;
    
    this.render(dataModel, true);

    await anime({
      targets: '.latestsolved',
      scale: 2,
      duration: 400,
      opacity: 0.6,
      direction: 'alternate',
      easing: 'easeInOutQuart',
     }).finished;

    return true;
};

var funcx = function() { return anime.random(-40, 40) + 'px'; };
var funcy = function() { return anime.random(-40, 40) + 'px'; };

BuxlGameView.prototype.animateGameFinished = async function animateGameFinished (solvedDataModel, newDataModel)
{
    await this.animateSolved(solvedDataModel);

    var _this = this;

    await anime({
      targets: '.solutioncloud > span',
      duration: 250,
      scale: 1.3,
      delay: 0,
      opacity: 0.2,
      loop: 5,
      easing: 'linear'
    }).finished;

    await anime({
      targets: '.letter-mass',
      translateX: [funcx(), funcx()],
      translateY: [funcy(), funcy()],
      scale: [1, 20],
      opacity: [1, 0],
      backgroundColor: '#b2ff33',
      easing: 'easeInOutQuart',
      delay: 0,
      duration: 400
    }).finished;

    this.render(newDataModel, false);

    anime({
      targets: '.letter-mass',
      translateX: ["+=0",0],
      translateY: ["+=0",0],
      scale: [20, 1],
      opacity: [0, 1],
      easing: 'easeInOutQuart',
      delay: 0,
      duration: 400,
      complete: function () {
          BuxlViewPrototype.prototype.routeTo.call(_this, "buxl", newDataModel.gameHash);
        }
    });
};

BuxlGameView.prototype.animateGameReload = function animateGameReload (gameModelData)
{
    BuxlViewPrototype.prototype.routeTo.call(this, "buxl", gameModelData.gameHash);
};

BuxlGameView.prototype.animateHint = function animateHint (letterHash) 
{
    var target = document.querySelector('[data-game-btn-id="'+ letterHash +'"]');

    anime({
      targets: target,
      rotate: ['-35','35', '-35'],
      duration: 350,
      loop: 4,
      easing: 'easeInOutQuart',
      direction: 'alternate',
      complete: function () {
        target.style="";
      }
    });
};

BuxlGameView.prototype.animateHintError = function animateHintError () 
{
    var target = document.querySelector('#helpico');
    target.src = "images/buxlsurprisedico.svg";
    
    anime({
      targets: '.letter-solution-mass',
      duration: 100,
      backgroundColor: '#ff0066',  
      easing: 'easeOutBack'
    });

    anime({
      targets: '.gamewrap > div > div > div',
      translateX: ['-.60rem', '.60rem', '-.60rem'],
      duration: 60,
      direction: 'alternate',
      loop: 4,
      easing: 'linear',
      complete: function () {
        target.src = "images/buxlnormalico.svg";
      }
    });

};

BuxlGameView.prototype.changeButtonByHash = function changeButtonByHash (letterHash, currentClass, newClass) 
{
    anime({
      targets: '.letter-solution-mass',
      duration: 100,
      backgroundColor: '#b7e2f8',
      easing: 'easeOutBack'
    });

    var selectedBtn = document.querySelector('[data-game-btn-id="'+ letterHash +'"]');

    if (selectedBtn && selectedBtn.classList.contains(currentClass)) 
    {
       selectedBtn.classList.remove(currentClass);
       selectedBtn.classList.add(newClass);
    }
};