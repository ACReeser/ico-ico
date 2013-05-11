window.onload = function(){
	var stage = new Kinetic.Stage({
        container: 'icoCanvas',
        width: 768,
        height: 512
      });
      var layer = new Kinetic.Layer();
      var glass = new Kinetic.Layer();
      glass.setListening(false);

    var icoVisual = function(x, y, string, fontSize){
        return new Kinetic.Text({
          x: x,
          y: y,
          fontFamily: 'fontello',
          text:string,
          fontSize: fontSize||30,
          fill:'black',
        });
    };
    
    var winObjs = [];
    var levelStar = null;
    var checkClearState = function(){
        for(var i = 0; i < winObjs.length; i++){
            if (winObjs[i].state != winObjs[i].winState){
                return;
            }
        }
        levelStar.award();
        return true;
    };
    this.star = function(x, y){
        this.visual = new icoVisual(x, y, "\u2605");
        this.visual.setFill('#f0b613');
        this.visual.setOpacity(0);
        this.visual.setStroke('black');
    };
    this.star.prototype.award = function(){
        TweenLite.to(this.visual, 1, {
        setOpacity: 1,
        onUpdate: function() {
          layer.draw(); 
        }        
        });
        this.visual.on('mouseover', function(){
            nextStage();
        });
    };
    this.stateArrow = function(x, y, initialState, winState){
        this.state = initialState;
        this.winState = winState;
        this.stateStrings = ["\u21c8", "\u21c9", "\u21ca", "\u21c7"];
        this.visual = new icoVisual(x, y, this.stateStrings[initialState]);
        var that = this;
        this.visual.on('mousedown', function(){ 
            that.changeState(1);
            checkClearState();});
        this.visual.on('mouseenter', function(){ emotCursor.setFill('orange');});
        this.visual.on('mouseout', function(){ emotCursor.setFill('black');});
    };
    this.stateArrow.prototype.changeState = function(adjustment){
        this.state += adjustment;
        if (this.state > 3){
            this.state = 0;
        } else if (this.state < 0){
            this.state = 3;
        }
        this.visual.setText(this.stateStrings[this.state]);
    };
    this.stateText = function(x, y, initialState, winState){
        this.state = initialState;
        this.winState = winState;
        this.stateStrings = ["\ue095", "\ue0ce", "\ue086", ];
        this.visual = new icoVisual(x, y, this.stateStrings[initialState]);
        var that = this;
        this.visual.on('mousedown', function(){ 
            that.changeState(1);
            checkClearState();});
        this.visual.on('mouseenter', function(){ emotCursor.setFill('orange');});
        this.visual.on('mouseout', function(){ emotCursor.setFill('black');});
    };
    this.stateText.prototype.changeState = function(adjustment){
        this.state += adjustment;
        if (this.state > 2){
            this.state = 0;
        } else if (this.state < 0){
            this.state = 2;
        }
        this.visual.setText(this.stateStrings[this.state]);
    };
    var initIcoObj = function(icoObj){
        layer.add(icoObj.visual);
        winObjs.push(icoObj);
    };
    var nextStage = function(){
        levelStar.visual.on('mouseover', function(){});
        TweenLite.to(levelStar.visual, .5, {
        setOpacity: 0,
        onUpdate: function() {
          layer.draw(); 
        }        
        });
        winObjs.forEach(function(obj){obj.visual.destroy(); delete obj;});
        winObjs.forEach(function(undef, i){winObjs.splice(i, 1)});
    };
    var initStage1 = function(stage, layer){
      var k1 = new stateArrow(stage.getWidth()/4, 50, 1, 0);
      var k2 = new stateArrow(stage.getWidth()/4 +50, 50, 2, 0);
      var k3 = new stateArrow(stage.getWidth()/4 +100, 50, 3, 2);
      var k4 = new stateArrow(stage.getWidth()/4 +150, 50, 0, 2);
      var k5 = new stateArrow(stage.getWidth()/4 +200, 50, 1, 3);
      var k6 = new stateArrow(stage.getWidth()/4 +250, 50, 2, 1);
      var k7 = new stateArrow(stage.getWidth()/4 +300, 50, 3, 3);
      var k8 = new stateArrow(stage.getWidth()/4 +350, 50, 0, 1);
      var k9 = new stateText(stage.getWidth()/4 +400, 50, 0, 1);
      var k10 = new stateText(stage.getWidth()/4 +450, 50, 2, 0);
      levelStar = new star(stage.getWidth()/2, 100);
      initIcoObj(k1);
      initIcoObj(k2);
      initIcoObj(k3);
      initIcoObj(k4);
      initIcoObj(k5);
      initIcoObj(k6);
      initIcoObj(k7);
      initIcoObj(k8);
      initIcoObj(k9);
      initIcoObj(k10);
      layer.add(levelStar.visual);
    };
     
     var emot = new Kinetic.Text({
        x: stage.getWidth() / 2 +15,
        y: 30,
        fontFamily: 'fontello',
        text: '\uE800',
        fontSize: 18,
        fill: 'black',
        name:'emot',
      });
      var emotCursor = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: 15,
        fontFamily: 'fontello',
        text: '\u26A0',
        fontSize: 18,
        fill: 'black',
        name:'cursor',          
      });
      
      emot.oncollide = function(collider){
          console.log(collider.name)
      };
      
      var rect = new Kinetic.Rect({
        x: 100,
        y: 60,
        stroke: '#555',
        strokeWidth: 5,
        fill: '#ddd',
        width: 380,
        height: 100,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        cornerRadius: 10,
      });
      rect.name = "rect";
      rect.oncollide = function(){
        console.log("Rect hit!");  
      };
      
      var moveEmot = function(mouseoverEvt){
          emotCursor.setX(mouseoverEvt.offsetX);
          emotCursor.setY(mouseoverEvt.offsetY);
          emot.setX( mouseoverEvt.offsetX+15);
          emot.setY( mouseoverEvt.offsetY+15);
          emot.getStage().draw();          
      };
      
      $('#icoCanvas').mouseover(moveEmot);

      $('#icoCanvas').mousemove(moveEmot);
      
      //#region physics
      var checkCollide = function(pointX, pointY, objectx, objecty, objectw, objecth) { // pointX, pointY belong to one rectangle, while the object variables belong to another rectangle
          var oTop = objecty;
          var oLeft = objectx; 
          var oRight = objectx+objectw;
          var oBottom = objecty+objecth; 
    
          if(pointX > oLeft && pointX < oRight){
               if(pointY > oTop && pointY < oBottom ){
                    return true;
               }
          }
          else
               return false;
      };      
      
      var collisionDetection = function (){
         var children = layer.getChildren();
         for( var i=0; i<children.length; i++){  // for each single shape
             for( var j=0; j<children.length; j++){ //check each other shape
                 if(i != j){ //skip if shape is the same
                    if(checkCollide(children[i].getX(), children[i].getY(), children[j].getX(), children[j].getY(), children[j].getWidth(), children[j].getHeight()))
                        children[i].oncollide(children[j]);
                        children[j].oncollide(children[i]);
                 }
             }
         }  
      };
      //window.setInterval(collisionDetection, 300);
      //#endregion
      
      // add the shapes to the layer
      //layer.add(rect);
      stage.add(layer);
      stage.add(glass);
      initStage1(stage, layer);
      glass.add(emotCursor);
      glass.add(emot);
};