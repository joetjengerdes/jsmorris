function PlayerToken(p) {
    var mPlayer = p;
    var mVertexId = -1;
    var mSelected = false;

    this.getColor = function() {
        return mPlayer.getColor();
    }

    this.getPlayer = function() {
        return mPlayer;
    }

    this.isSelected = function() {
        return mSelected;
    }
}
