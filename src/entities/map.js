// "Model" data: doesn't know anything about the view, CraftyJS, etc.
map = {
    init: function(level, levelNumber) {
        this.roomHeight = level.roomHeight;
        this.roomWidth = level.roomWidth;

        this.roomPathHeight = level.roomPathHeight;
        this.roomPathWidth = level.roomPathWidth;

        this.heightInTiles = this.roomHeight;
        this.widthInTiles = this.roomWidth + this.roomPathWidth * 2;

        this.levelNumber = levelNumber;

        // hash: key is coordinates (eg. "x, y" and value is tile data)
        this.data = {};

        // generate room itself
        for (var x = this.roomPathWidth; x < this.roomWidth + this.roomPathWidth; x++) {
            for (var y = 0; y < this.roomHeight; y++) {
                this.data[this.getKey(x, y)] = new tileData(x, y);
            }
        }

        if (this.roomHeight % 2 == 0) {
            var middleRow = Math.floor(this.roomHeight / 2) - 1;
        } else {
            var middleRow = Math.floor(this.roomHeight / 2)
        }

        // generate path
        for (var x = 0; x < (this.roomPathWidth * 2) + this.roomWidth; x++) {
            for (var y = middleRow; y < middleRow + this.roomPathHeight; y++) {
                if (typeof(this.getTile(x, y)) == 'undefined') {
                    this.data[this.getKey(x, y)] = new tileData(x, y);
                }
            }
        }
    },

    getPathToPlayer: function (startX, startY) {
        var grid = this.getGrid();
        var finder = new PF.AStarFinder();

        var path = finder.findPath(startX, startY, this.playerTile.x, this.playerTile.y, grid);
        return path;
    },

    // generate a grid representing the map, with 1 as blocked, and 0 as walkable
    getGrid: function () {
        var grid = new PF.Grid(this.roomWidth + this.roomPathWidth, this.roomHeight);

        for (var y = 0; y < this.roomHeight; y++) {
            for (var x = this.roomPathWidth; x < this.roomWidth + this.roomPathWidth; x++) {
                if (this.data.hasOwnProperty(this.getKey(x, y))) {
                    var tile = this.getTile(x, y);
                    if (tile.contents != '' || typeof (tile) == 'undefined') {
                        grid.setWalkableAt(x, y, false);
                    }
                }
            }
        }

        return grid;
    },


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

    getStartTile: function () {
        var x = 0;
        var y = 0;
        while (typeof (tile) == 'undefined') {
            var tile = this.getTile(x, y);
            y++;
        }
        return tile;
    },

    getEndTile: function () {
        var x = 0;
        for (var key in this.data) {
            var tileThingy = this.data[key];
            if (tileThingy.x > x) {
                x = tileThingy.x
            }
        }
        var y = 0;
        while (typeof (tile) == 'undefined') {
            var tile = this.getTile(x, y);
            y++;
        }
        return tile;
    },

    getMoveLimit: function() {
        var diffY = Math.abs(this.winGate.y - this.playerTile.y);
        var diffX = Math.abs(this.winGate.x - this.playerTile.x);

        return (diffY + diffX) + config('extraMoves');
    },

    getRandomTile: function(tileType) {
        var isTileOccupied = true;
        var isTooClose = false;

        // get random x, y coordinates to get a random tile
        // https://stackoverflow.com/a/4550514
        while (isTileOccupied || isTooClose) {
            var tileX = Math.floor(Srand.random() * this.roomWidth) + this.roomPathWidth;
            var tileY = Math.floor(Srand.random() * this.roomHeight);
            var newTile = map.getTile(tileX, tileY);

            if (typeof(tileType) == 'undefined' || tileType == 'Player') {
                // check if tile is empty
                isTileOccupied = newTile.contents != '' || newTile.entity != '';
            } else {
                var diffY = Math.abs(tileY - this.playerTile.y);
                var diffX = Math.abs(tileX - this.playerTile.x);

                var distance = diffY + diffX;

                isTooClose = (distance < config('minDistanceToGate'));
                isTileOccupied = newTile.contents != '' || newTile.entity != '';
            }
        }

        if (tileType == 'WinGate') {
            this.winGate = newTile;
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