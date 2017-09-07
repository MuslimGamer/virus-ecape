// tile data class constructor
function tileData(x, y) {
    this.tileData = {
        x: x,
        y: y,

        walkable: true,
        contents: '',

        enter: function(thing) {
            this.contents = thing.nameInTile;

            return this;
        },

        leave: function() {
            switch (config('walkedTileSetting')) {
                case "open":
                    this.contents = '';
                    break;
                case "closed":
                    this.contents = '';
                    this.view.color('silver');
                    this.walkable = false;
                    break;
                case "closed-deadly":
                    this.contents = 'DangerTile';
                    this.view.color('silver');
                    break;
            }

            return this;
        },

        setView: function(view) {
            this.view = view;

            return this;
        },

        setDangerTile: function() {
            this.view.color('red');
            this.contents = 'DangerTile';

            return this;
        },

        setWinGate: function() {
            this.view.color('green');
            this.contents = 'WinGate';

            return this;
        },

        setSwitch: function(switchGate) {
            this.view.color('yellow');
            this.contents = 'Switch';
            this.isOn = true;
            this.switchGate = switchGate;

            return this;
        },

        activate: function() {
            if (this.contents != 'Switch') {
                return this;
            }

            this.isOn = false;
            this.view.color('yellow', 0.5);
            this.switchGate.view.color('maroon', 0.5);
            this.switchGate.contents = config('switchGatesAfter').tileType;
            this.switchGate.walkable = config('switchGatesAfter').walkable;

            return this;
        },

        setSwitchGate: function() {
            this.view.color('maroon');
            this.contents = config('switchGatesBefore').tileType;
            this.walkable = config('switchGatesBefore').walkable;

            return this;
        }


    };
    
    return this.tileData;
}

// "Model" data: doesn't know anything about the view, CraftyJS, etc.
map = {
    init: function(widthInTiles, heightInTiles, levelNumber) {
        this.widthInTiles = widthInTiles;
        this.heightInTiles = heightInTiles;
        this.levelNumber = levelNumber;

        // hash: key is coordinates (eg. "x, y" and value is tile data)
        this.data = {};

        for (var y = 0; y < this.heightInTiles; y++) {
            for (var x = 0; x < this.widthInTiles; x++) {
                this.data[this.getKey(x, y)] = new tileData(x, y);
            }
        }
    },

    seed: '',

    // for now, we'll just use the current timestamp.
    newSeed: function() {
        if (config('mapSeed') == '') {
            // get random seed
            this.seed = Srand.randomize();
        } else {
            this.seed = config('mapSeed');
            Srand.seed(this.seed);
        }

        console.log('The seed is: "' + this.seed.toString() + '".');

        return this;
    },

    getRandomTile: function(isWinGate) {
        var isTileOccupied = true;
        var isTooClose = false;

        // DONE: make WinGate not spawn too close to player
        // good seed for testing is 1531171161
        
        // get random x, y coordinates to get a random tile
        // https://stackoverflow.com/a/4550514
        while (isTileOccupied || isTooClose) {
            var tileX = Math.floor(Srand.random() * config('level').widthInTiles);
            var tileY = Math.floor(Srand.random() * config('level').heightInTiles);
            var newTile = map.getTile(tileX, tileY);

            if (!isWinGate) {
                // check if tile is empty
                isTileOccupied = newTile.contents != '';
            } else {
                var diffY = Math.abs(tileY - this.playerTile.y);
                var diffX = Math.abs(tileX - this.playerTile.x);

                var distance = diffY + diffX;

                isTooClose = (distance < config('minDistanceToGate'));
                isTileOccupied = newTile.contents != '';
            }
        }

        return newTile;
    },
    
    getTile: function(x, y) {
        return this.data[this.getKey(x, y)];
    },

    // Boundary: methods below are private (by convention only, not enforceable).

    getKey: function(x, y) {
        return x + ", " + y;
    }
};