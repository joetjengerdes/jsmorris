function GameController(game) {
  this.valid = false;
  this.game = game;
  var controller = this;
  var eventController = null;
  var drawController = null;

  this.setDrawController = function(drawController_) {
    drawController = drawController_;
  }

  this.getDrawController = function() {
    return drawController;
  }

  this.setEventController = function(eventController) {
    this.eventController = eventController;
  }

  this.getEventController = function() {
    return eventController;
  }

  this.doAction = function(x,y) {
    // it's the human players turn
    if(game.isHumansTurn()) {
      if(game.mode == 0) {
        if(game.tokensPlaced >= 18) {
          game.mode = 1;
        }
        var vertices = game.gamefield.vertices;
        for(var i = 0; i< vertices.length;i++) {
          if(vertices[i].contains(x,y)) {
            game.createToken(vertices[i].x,vertices[i].y,i);
            drawController.drawVertex(vertices[i].x, vertices[i].y, "#FF0000");
            game.changeTurn();
          }
        }
      }



    } else {
      // do nothing: it's CPUs turn and user tried to do s.th.
      // TODO: remove test
          for(var i = 0; i< game.gamefield.vertices.length;i++) {
                    var coord = game.convertVertexPosToArrayPos(i);
                    console.log(game.gamefield.field);
                    if(game.gamefield.field[coord.z][coord.y][coord.x] == 'undefinied') {
                      game.createToken(vertices[i].x,vertices[i].y,i);
                      drawController.drawVertex(vertices[i].x, vertices[i].y, "#00FF00")
                      game.changeTurn();
                    }
              }
      }
  }
}
