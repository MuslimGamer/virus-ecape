// Level: the thing you see on the screen. Uses a map for data.
Crafty.c('Level', {
    init: function() {
        this.requires("Actor")
            .color("#000088")
            .size(config("level").widthInTiles * paddedWidth, config("level").heightInTiles * paddedHeight);
        var paddedWidth = config("tileSize") + config("padding");
        var paddedHeight = config("tileSize") + config("padding");

        if (config('allowTileScanning').firstStage) {
            this.scanCounter = 0;
            this.bind('ScanTile', this.scanTile);
            this.scanningTilesArray = [];
        }
    },

    loadMap: function(map) {
        this.map = map;

        for (var key in this.map.data) {
            if (this.map.data.hasOwnProperty(key)) {
                // get the original tile data class
                var tileData = this.map.data[key];
                var tileSize = config('tileSize');

                // make a Crafty tile
                var mapTile = Crafty.e('Tile')
                                    .move(tileData.x * (tileSize + config("padding")), tileData.y * (tileSize + config("padding")))
                                    .color("blue");

                // map the Crafty tile to the data class.
                tileData.setView(mapTile);
            }
        }
    },

    scanTile: function () {
        if (config('allowTileScanning').secondStage) {
            for (i = 0; i < this.scanningTilesArray.length; i++) {
                scanningTile = this.scanningTilesArray[i];
                scanningTile.scanProgress += 1;
                if (scanningTile.scanProgress > config('scansUntilComplete')) {
                    var index = this.scanningTilesArray.indexOf(scanningTile);
                    this.scanningTilesArray.splice(index, 1);

                    scanningTile.setScannedTile();
                }
            }
        }
        this.scanCounter += 1;
        if (this.scanCounter > config('tileScanningRate')) {
            this.scanCounter = 0;
            var tile = map.getRandomTile().setScanningTile();
            this.scanningTilesArray.push(tile);
        }
    }
});