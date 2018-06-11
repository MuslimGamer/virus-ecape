GRID_COLOUR = '#000088';
FLOOR_COLOUR = 'black';

// Level: the thing you see on the screen. Uses a map for data.
Crafty.c('Level', {
    init: function() {
        var paddedWidth = config("tileSize") + config("padding");
        var paddedHeight = config("tileSize") + config("padding");
        this.requires("Actor")
            .color(GRID_COLOUR)
            .size(config("level").widthInTiles * paddedWidth, config("level").heightInTiles * paddedHeight);

        for (var key in config('allowTileScanning')) {
            var value = config('allowTileScanning')[key];
            if (value === true) {
                var scanTiles = true;
                break;
            }
        }

        if (scanTiles) {
            this.scanCounter = 0;
            this.bind('TickEvent', this.tickEvent);
            this.scanningTiles2 = [];
            this.scanningTiles3 = [];
            this.scanningTiles4 = [];
        }
        if (config('allowAntiVirusEntities')) {
            this.antiVirusMovePoints = 0;
        }
        if (config('antiVirusTailLength') > 0) {
            this.fadingTiles = [];
        }
    },

    loadMap: function(map) {
        this.map = map;

        for (var y = 0; y < this.map.heightInTiles; y++) {
            for (var x = 0; x < this.map.widthInTiles; x++) {
                // get the original tile data class
                var tileData = this.map.getTile(x, y);

                var tileSize = config('tileSize');
                
                // make a Crafty tile and add the data class properties to it using .tile
                var mapTile = Crafty.e('Tile')
                                    .move(x * (tileSize + config("padding")), y * (tileSize + config("padding")))
                                    .color(FLOOR_COLOUR);

                // map the Crafty tile to the map object, instead of the normal data class.
                tileData.setView(mapTile);
            }
        }

        this.scanTileSeededGen = new Srand(map.seededGen.random());
    },

    tickEvent: function () {
        if (config('allowAntiVirusEntities')) {
            this.antiVirusMovePoints += 1;
            if (this.antiVirusMovePoints >= config('antiVirusMovementCost')) {
                this.antiVirusMovePoints = 0;
                var antiVirusEntitiesList = Crafty('AntiVirus');
                for (i = 0; i < antiVirusEntitiesList.length; i++) {
                    var antiVirus = Crafty(antiVirusEntitiesList[i]);
                    var origTile = antiVirus.tile;
                    if (origTile != null && this.fadingTiles.indexOf(origTile) == -1) {
                        this.fadingTiles.push(origTile);
                    }
                    if (antiVirus.isDead == false) {
                        var tile = antiVirus.moving();
                        if (tile != null) {
                            this.fadingTiles.push(tile);
                        }
                    }
                }

                for (var i = 0; i < this.fadingTiles.length; i++) {
                    var tile = this.fadingTiles[i];
                    tile.footprintFade++;
                    if (tile.footprintFade >= config('antiVirusTailLength')) {
                        tile.footprintFade = 0;
                        tile.resetTile();

                        var index = this.fadingTiles.indexOf(tile);
                        this.fadingTiles.splice(index, 1);
                    }
                }
            }
        }
        var player = Crafty('Player');
        if (player.tile.entity == 'AntiVirus') {
            if (config('deadlyAntiViruses')) {
                Game.loseLevel();
                return;
            } else {
                player.reduceHealth(config('antiVirusDamage'));
            }
        }
        if (player.tile.contents == 'WeakDangerTile') {
            player.reduceHealth(config('dangerDamage'));
        }
        if (player.tile.contents == 'StrongDangerTile') {
            Game.loseLevel();
            return;
        }

        if (config('allowTileScanning').all) {
            this.scanTile();
        }
    },

    scanTile: function () {
        var conf = config('allowTileScanning');
        if (conf.resetTiles || conf.all) {
            for (var i = 0; i < this.scanningTiles4.length; i++) {
                var scanningTile = this.scanningTiles4[i];
                scanningTile.scanProgress += 1;
                if (scanningTile.scanProgress >= config('scansUntilComplete')) {
                    var index = this.scanningTiles4.indexOf(scanningTile);
                    this.scanningTiles4.splice(index, 1);

                    scanningTile.setScanningTile(4);
                }
            }
        }
        if (conf.thirdStage || conf.all) {
            for (var i = 0; i < this.scanningTiles3.length; i++) {
                var scanningTile = this.scanningTiles3[i];
                scanningTile.scanProgress += 1;
                if (scanningTile.scanProgress >= config('scansUntilComplete')) {
                    var index = this.scanningTiles3.indexOf(scanningTile);
                    this.scanningTiles3.splice(index, 1);

                    scanningTile.setScanningTile(3);

                    if (conf.resetTiles) {
                        this.scanningTiles4.push(scanningTile);
                    }
                }
            }
        }
        if (conf.secondStage || conf.all) {
            for (var i = 0; i < this.scanningTiles2.length; i++) {
                var scanningTile = this.scanningTiles2[i];
                scanningTile.scanProgress += 1;
                if (scanningTile.scanProgress >= config('scansUntilComplete')) {
                    var index = this.scanningTiles2.indexOf(scanningTile);
                    this.scanningTiles2.splice(index, 1);

                    scanningTile.setScanningTile(2);

                    if (conf.thirdStage) {
                        this.scanningTiles3.push(scanningTile);
                    }
                }
            }
        }
        if (conf.firstStage || conf.all) {
            this.scanCounter += 1;
            if (this.scanCounter >= config('tileScanningRate')) {
                this.scanCounter = 0;
                var scanningTile = map.getRandomTile(undefined, this.scanTileSeededGen).setScanningTile(1);

                if (conf.secondStage) {
                    this.scanningTiles2.push(scanningTile);
                }
            }
        }
    }
});