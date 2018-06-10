// GameOverTimer: the configurable time limit for completing the level.
Crafty.c('GameOverTimer', {
    init: function() {
        this.requires('Text2')
            .textColor('white');
    },

    timerTick: function() {
        var now = Date.now();
        var delta = Math.round((now - this.prevDate)/1000);
        this.timerSeconds -= delta;
        this.text("Time Left: " + this.timerSeconds.toString());
        if (this.timerSeconds < 0) {
            Game.loseLevel();
        }
        this.prevDate = now;
    },

    startTimer: function() {
        this.prevDate = Date.now();
        this.timerSeconds = config('timerSeconds');
        this.text("Time Left: " + this.timerSeconds.toString());
        this.repeatedly(this.timerTick, 1);

        return this;
    }
});