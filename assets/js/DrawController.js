function DrawController(canvas, gf, stbar) {
    var mCanvas = canvas;
    var mGamefield = gf;
    var mCtx = mCanvas.getContext("2d");
    // BUGFIX self reference
    var self = this;
    var mRedrawAll = false;
    var mGameStatusBar = stbar;

    function initDrawController() {
        mGameStatusBar.setTextChangedListener(self);

        Vertex.prototype.draw = function(ctx) {
            ctx.fillStyle = this.getFill();
            ctx.beginPath();
            ctx.arc(this.getX(), this.getY(), this.getCircleSize(), 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    this.drawVertex = function(x, y, color) {
        var v = new Vertex(x, y, mGamefield.circleSize * 2.5);
        v.setFill(color);
        v.draw(mCtx);
    }

    this.redraw = function(redrawA = false) {
        mRedrawAll = redrawA;
        mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);
        if (mRedrawAll) {
            mGamefield.vertices = [];
        }
        drawField();
        drawTokens();
        drawStatusBar();
    }

    this.statusBarTextChanged = function() {
        drawStatusBar();
    }

    function drawTokens() {
        var field = mGamefield.field;
        for (var z = 0; z < field.length; z++) {
            for (var y = 0; y < field[0].length; y++) {
                for (var x = 0; x < field[0][0].length; x++) {
                    var pToken = field[z][y][x];
                    if (pToken) {
                        var verts = mGamefield.vertices;

                        var v = verts[pToken.getVertexIndex()];

                        if (pToken.isSelected()) {
                            // TODO: fix hardcoded colors
                            if (pToken.getColor() == "hsla(120, 100%, 50%, 1)") {
                                self.drawVertex(v.getX(), v.getY(), "hsla(120, 100%, 70%, 1)");
                            } else {
                                self.drawVertex(v.getX(), v.getY(), "hsla(0, 100%, 70%, 1)")
                            }

                        }
                        // draw not selected token
                        else {
                            self.drawVertex(v.getX(), v.getY(), pToken.getColor());
                        }
                    }
                }
            }
        }
    }

    function drawField() {
        var h = mGamefield.height;
        var w = mGamefield.width;
        var spaceBetween = mGamefield.spaceBetween;
        var leftOffset = mGamefield.leftOffset;

        drawFieldPart(mCtx, 0, 0, h, w);
        drawFieldPart(mCtx, spaceBetween, spaceBetween, h - spaceBetween, w - spaceBetween);
        drawFieldPart(mCtx, 2 * spaceBetween, 2 * spaceBetween, h - 2 * spaceBetween, w - 2 * spaceBetween);

        // von links bis mitte
        drawLine(mCtx, leftOffset + 0 + 50, ((h + 0) / 2), leftOffset + spaceBetween * 2 + 50, ((h + 0) / 2));
        // von rechts bis mitte
        drawLine(mCtx, leftOffset + w - 50, ((h + 0) / 2), leftOffset + w - spaceBetween * 2 - 50, ((h + 0) / 2));

        // von oben bis mitte
        drawLine(mCtx, leftOffset + (w / 2), 50, leftOffset + (w / 2), spaceBetween * 2 + 50);
        // von unten bis mitte
        drawLine(mCtx, leftOffset + (w / 2), h - 50, leftOffset + (w / 2), h - 50 - spaceBetween * 2);

        for (i = 0; i < mGamefield.vertices.length; i++) {
            mGamefield.vertices[i].draw(mCtx);
            //console.log(gamefield.vertices[i].draw);
        }
    }

    function drawStatusBar() {
        //console.log(gameStatusBar);
        mCtx.beginPath();
        mCtx.rect(0, mGamefield.height - mGameStatusBar.height, mCanvas.width, mGamefield.height - mGameStatusBar.height);
        mCtx.fillStyle = mGameStatusBar.backgroundColor;
        mCtx.fill();
        mCtx.closePath();
        drawStatusBarText();
    }

    function drawStatusBarText() {
        mCtx.beginPath();
        mCtx.font = "\"" + mGameStatusBar.fontSize + " " + mGameStatusBar.fontFamily + "\"";
        mCtx.fillStyle = mGameStatusBar.fontColor;
        mCtx.fillText(mGameStatusBar.getText(), mGamefield.leftOffset, mGamefield.height - (mGameStatusBar.height / 3));
        mCtx.closePath();
    }

    function drawFieldPart(ctx, hFrom, wFrom, hTo, wTo, offset = 50) {

        var leftOffset = mGamefield.leftOffset;
        var circleSize = Math.round(mGamefield.circleSize);
        var lineWidth = mGamefield.lineWidth;

        if (mRedrawAll) {
            // vertices from top left to bottom right
            mGamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, hFrom + offset, circleSize));
            mGamefield.vertices.push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hFrom + offset, circleSize));
            mGamefield.vertices.push(new Vertex(leftOffset + wTo - offset, hFrom + offset, circleSize));
            mGamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, ((hTo + hFrom) / 2), circleSize));
            mGamefield.vertices.push(new Vertex(leftOffset + wTo - offset, ((hTo + hFrom) / 2), circleSize));
            mGamefield.vertices.push(new Vertex(leftOffset + wFrom + offset, hTo - offset, circleSize));
            mGamefield.vertices.push(new Vertex(leftOffset + ((wTo + wFrom) / 2), hTo - offset, circleSize));
            mGamefield.vertices.push(new Vertex(leftOffset + wTo - offset, hTo - offset, circleSize));
        }

        // von oben links nach unten links
        drawLine(ctx, leftOffset + wFrom + offset, hFrom + offset, leftOffset + wFrom + offset, hTo - offset);
        // von oben links nach oben rechts
        drawLine(ctx, leftOffset + wFrom + offset, hFrom + offset, leftOffset + wTo - offset, hFrom + offset);
        // von oben rechts und nach unten rechts
        drawLine(ctx, leftOffset + wTo - offset, hFrom + offset, leftOffset + wTo - offset, hTo - offset);
        // von unten rechts nach unten links
        drawLine(ctx, leftOffset + wFrom + offset, hTo - offset, leftOffset + wTo - offset, hTo - offset);


    }

    function drawLine(ctx, xFrom, yFrom, xTo, yTo) {
        ctx.beginPath();
        ctx.moveTo(xFrom, yFrom);
        ctx.lineTo(xTo, yTo);
        ctx.lineWidth = mGamefield.lineWidth;
        ctx.stroke();
    }

    initDrawController();

    this.redraw(true);

}
