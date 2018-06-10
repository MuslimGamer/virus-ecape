// HealthCounter: displays the Health left.
Crafty.c('HealthCounter', {
    init: function() {
        this.requires('Text2')
            .textColor('white')
            .move(8, 8);
    },

    setHealth: function(healthLeft) {
        this.text('Health: ' + healthLeft);
        return this;
    }
});