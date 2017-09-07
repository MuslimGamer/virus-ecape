Game = {
    view: {
        // full-screen
        width: window.innerWidth,
        height: window.innerHeight
    },

    levelNumber: 1,

    makeLevel: function() {
        // Game world is whatever fits on-screen
        Crafty.init(Game.view.width, Game.view.height);
        Crafty.background('black');
        
        map.init(config("level").widthInTiles, config("level").heightInTiles);

        Crafty.e("Level").loadMap(map);

        var playerEntity = Crafty.e("Player").placeInRandomTile();
        map.playerEntity = playerEntity;

        var winGate = map.getRandomTile(true).setWinGate();
        map.winGate = winGate;

        var dangerTilesNo = Game.levelNumber * config('dangerTilesPerLevel');
        for (var i = 0; i < dangerTilesNo; i++) {
            map.getRandomTile().setDangerTile();
        }

        var switchGateNo = Math.floor((Game.levelNumber/2) + 1) * config('switchGatesPerLevel');
        for (var i = 0; i < switchGateNo; i++) {
            var switchGate = map.getRandomTile().setSwitchGate();
            map.getRandomTile().setSwitch(switchGate);
        }

        var path = map.getPath();
        return path.length == 0;
    },

    start: function() {
        if (config('noUnsolvableLevels')) {
            var unsolvable = true;
            while (unsolvable) {
                unsolvable = Game.makeLevel();
            }
        } else {
            Game.makeLevel();
        }

        if (config('limitedMoves')) {
            var moveCounter = Crafty.e('MoveCounter');
            map.playerEntity.setMoveCounter(moveCounter);
            map.playerEntity.setMoveLimit(map.getMoveLimit());
        }
        
        if (config('timerSeconds') != 0) {
            Crafty.e('GameOverTimer').startTimer();
        }
    },

    preStart: function() {
        map.newSeed();
        Game.start();
    },

    completeLevel: function() {
        console.log('Level ' + Game.levelNumber.toString() + ' complete! ' + 
                    'Starting level ' + (Game.levelNumber + 1).toString() + '.');
        Game.levelNumber += 1;
        this.cleanUp();
        this.start();
    },

    loseLevel: function() {
        console.log('You died at level ' + Game.levelNumber.toString() + "!");
        Game.levelNumber = 1;
        this.cleanUp();
        this.preStart();
    },

    cleanUp: function() {
        // copypaste from house of jinn
        var everything = Crafty("*");
        for (var i = 0; i < everything.length; i++) {
            Crafty(everything[i]).destroy();
        }
    }
};

window.addEventListener('load', Game.preStart);
