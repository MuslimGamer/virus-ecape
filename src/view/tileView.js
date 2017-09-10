// Tile: the square unit you can walk on
Crafty.c('Tile', {
    init: function() {
        this.requires('Actor')
            .size(config('tileSize'), config('tileSize'));
    },

    addNumberTag: function (number) {
        Crafty.e('Text2')
              .fontSize(config('tileSize') / 2)
              .move(this.x + config('padding'), this.y + config('padding'))
              .text(number);
    }
});