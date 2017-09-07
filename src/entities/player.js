Crafty.c('Player', {
    init: function() {
        // TileEntity already requires Actor
        this.requires("TileEntity, Controllable")
            .color('white')
            .bind('KeyDown', this.moving);

        this.bind('PlayerMoved', this.moved);
        
        this.nameInTile = 'Player';
    },

    moved: function(newTile) {
        var tileType = newTile.contents;

        if (tileType == 'WinGate') {
            Game.completeLevel();
        } else if (tileType == 'DangerTile') {
            Game.loseLevel();
        } else if (tileType == 'Switch' && newTile.isOn == true) { 
            newTile.activate();
        }

        if (config('limitedMoves')) {
            this.moves -= 1;
            this.moveCounter.setMoves(this.moves);
            if (this.moves < 1) {
                Game.loseLevel();
            }
        }
    },

    setMoveCounter: function(moveCounter) {
        this.moveCounter = moveCounter;
    },

    setMoveLimit: function(moveLimit) {
        this.moves = moveLimit + config('extraMoves');
        this.moveCounter.setMoves(this.moves);
    },

    moving: function(e) {
        var k = e.key;

        if (k == Crafty.keys.UP_ARROW || k == Crafty.keys.W) {
            var movement = -1;
            var which = 'y';
        }
        else if (k == Crafty.keys.DOWN_ARROW || k == Crafty.keys.S) {
            var movement = 1;
            var which = 'y';
        }
        else if (k == Crafty.keys.LEFT_ARROW || k == Crafty.keys.A) {
            var movement = -1;
            var which = 'x';
        }
        else if (k == Crafty.keys.RIGHT_ARROW || k == Crafty.keys.D) {
            var movement = 1;
            var which = 'x';
        } else {
            return;
        }
        var y = this.tile.y;
        var x = this.tile.x;

        if (which == 'y') {
            y += movement;
        } else {
            x += movement;
        }

        var newTile = map.getTile(x, y);
        
        if (newTile == null || newTile.walkable == false || newTile == this.tile) {
            return;
        }
        Crafty.trigger('PlayerMoved', newTile);

        // handle removing player from tile's contents array
        this.tile.leave();
        this.moveTo(newTile);
    }
});