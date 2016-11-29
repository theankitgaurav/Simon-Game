Vue.config.debug = true;
Vue.config.devtools = true
var timer;
var app = new Vue({
  el: '.app',
  data: {
    isStrictModeOn: false,
    step: '--',
    userTurn: false,
    state: 'Start',
    isPlaying: false,
    pattern: [],
    index: 0,
    isBoxOneActive: false,
    isBoxTwoActive: false,
    isBoxThreeActive: false,
    isBoxFourActive: false,
    showHelpBox: false,
    score: 0,
    hiScore: 0,
    message: null
  },
  created: function(){
    if(localStorage.getItem('simonHiScore')!== null){
      this.hiScore = localStorage.getItem('simonHiScore');
    }
  },
  methods: {
    changeState: function() {
      if (this.state === 'Start') {
        this.state = 'Stop';
        this.message = null;
        this.isPlaying = true;
        this.step = 0;
        this.computerTurn();
      } else {
        this.resetGame();
      }
    },
    computerTurn: function() {
      var self = this;
      this.index = 0;
      this.step++;
      this.pattern.push(this.getRandomNumberOneToFour());
      this.showPattern(function(){
        self.userTurn = true;
      });
    },
    clickedBox: function(boxNum) {
      var self = this;
      if (this.state === 'Start') {
        return;
      }
      this.clickEffect(boxNum);
      var isCorrect = this.checkPattern(boxNum);
      if (!isCorrect) { // If user clicks wrong box
        if (this.isStrictModeOn) {// User playing in strict mode
          self.processGameOver();
          return;
        } else {//User playing in regular mode
          self.showPattern()
        }
      } else { // If the current click is correct
        if (this.index === this.pattern.length - 1) { // If total items in pattern clicked
          this.score++;
          setTimeout(function() {
             self.userTurn = false;
            self.computerTurn();
          }, 1000);
        } else { // Pending clicks exist
          this.index++;
        }
      }
    },
    processGameOver: function(){          
          //If score is greater than hiScore, update localStorage
          if(this.score>this.hiScore){
            this.hiScore = this.score;
            this.message = 'Congo! New High Score';
            localStorage.setItem('simonHiScore', this.hiScore);
          } else {
            this.message = 'Game Over.'
          }
      console.log('Score: '+this.score);
          this.resetGame();
    },
    getRandomNumberOneToFour: function() {
      //Utility method to get a random number from 1 to 4
      return Math.floor(Math.random() * 4 + 1);
    },
    checkPattern: function(boxNum) {
      return (this.pattern[this.index] === boxNum);
    },
    resetGame: function() {
      this.step = '--';
      this.userTurn = false;
      this.state = 'Start';
      this.score = 0;
      this.isPlaying = false;
      this.pattern = [];
      this.index = 0;
    },
    showPattern: function(callback) {
      var self = this
      var i=0;
      timer = setInterval(function() {
        if(i>=self.pattern.length){
          self.stopInterval();
        }
        self.clickEffect(self.pattern[i]);
        i++;
      }, 500);
      callback();
    },
    stopInterval: function(){
      clearInterval(timer);
    },
    changeMode: function(){
      if(this.state !== 'Start'){
        return;
      }
      if(this.isStrictModeOn){
        this.isStrictModeOn = false;
      } else{
        this.isStrictModeOn = true;
      }
    },
    clickEffect: function(boxNum) {
      //This method takes in a box number as parameter
      //Then toggles its class as active
      //Then plays the respective audio file
      //Then reverts the class back to original
      var self = this
      switch (boxNum) {
        case 1:
          this.isBoxOneActive = true;
          audio1.play();
          setTimeout(function() {
            self.isBoxOneActive = false;
          }, 100);
          break;
        case 2:
          this.isBoxTwoActive = true;
          audio2.play();
          setTimeout(function() {
            self.isBoxTwoActive = false;
          }, 100);
          break;
        case 3:
          this.isBoxThreeActive = true;
          audio3.play();
          setTimeout(function() {
            self.isBoxThreeActive = false;
          },100);
          break;
        case 4:
          this.isBoxFourActive = true;
          audio4.play();
          setTimeout(function() {
            self.isBoxFourActive = false;
          }, 100);
          break;
      }
      return;
    }
  }
})