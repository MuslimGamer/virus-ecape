QUnit.test("Map: map is defined", function(assert) {
  assert.ok(map != null);
  assert.ok(typeof(map) !== undefined);
});

QUnit.test("Map: init defines width, height, and level number", function(assert) {
  var expectedWidth = 10;
  var expectedHeight = 20;
  var expectedLevel = 3;

  map.init(expectedWidth, expectedHeight, expectedLevel);

  assert.equal(map.widthInTiles, expectedWidth);
  assert.equal(map.heightInTiles, expectedHeight);
  assert.equal(map.levelNumber, expectedLevel);
});

QUnit.test("Map: init defines data with specified width/height", function(assert) {
  var expectedWidth = 50;
  var expectedHeight = 30;

  map.init(expectedWidth, expectedHeight, 77);

  var actualDataSize = Object.keys(map.data).length;
  assert.equal(actualDataSize, expectedWidth * expectedHeight, "Map data should be " + (expectedWidth * expectedHeight) + " items; it's " + actualDataSize);
});

QUnit.test("Map: getTile gets specified tile", function(assert) {
  map.init(5, 10, 1);
  var data = map.data;

  // Test boundaries and a random tile in the middle
  assert.equal(map.getTile(0, 0), data["0, 0"]);
  assert.equal(map.getTile(4, 9), data["4, 9"]);
  assert.equal(map.getTile(4, 0), data["4, 0"]);
  assert.equal(map.getTile(0, 9), data["0, 9"]);
  assert.equal(map.getTile(2, 7), data["2, 7"]);
});

// failing test; for some reason, it can't find config(). could also be expanded further, with more details as to each case.
QUnit.test("Map: Checks 100 levels using one seed, making sure the win gate doesn't spawn too close to the player.", function(assert) {
  map.seed = "1531171161";

  failArray = [];

  for (level = 1; level <= 100; level++) {
    map.init(8, 8, level);

    // mimic player entity
    var player = map.getRandomTile();
    player.content = 'Player';
    map.playerEntity.tile = player.tile;

    // the win gate
    var winGate = map.getRandomTile(true).setWinGate();

    var diffY = Math.abs(winGate.y - map.playerEntity.tile.y);
    var diffX = Math.abs(winGate.x - map.playerEntity.tile.x);

    var distance = diffY + diffX;

    if (distance < 3) {
      failArray.push([map.playerEntity.tile, winGate]);
    }

    // kept them here so the seed cycles correctly
    var dangerTilesNo = Game.levelNumber * config('dangerTilesPerLevel');
    for (var i = 0; i < dangerTilesNo; i++) {
        map.getRandomTile().setDangerTile();
    }
    var switchGateNo = Math.floor((Game.levelNumber/2) + 1) * config('switchGatesPerLevel');
    for (var i = 0; i < switchGateNo; i++) {
        var switchGate = map.getRandomTile().setSwitchGate();
        map.getRandomTile().setSwitch(switchGate);
    }
  }

  assert.ok(failArray == [], 'The win gate spawned too close to the player ' + failArray.length + ' times.');
});