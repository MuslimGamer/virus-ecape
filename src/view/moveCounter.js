// MoveCounter: displays the remaining moves.
Crafty.c('MoveCounter', {
    init: function() {
        this.requires('Common, Canvas, Text')
            .textColor('white')
            .textFont({size: '20px'})
            .move(30, 0);
    },
    setMoves: function(movesLeft) {
        this.text('Moves: ' + movesLeft);
        return this;
    }
})