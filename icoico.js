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
    }
    this.stateArrow = function(x, y, state){
        this.state = state;
        this.stateStrings = ["\u21c8", "\u21c9", "\u21ca", "\u21c7"];
        this.visual = new icoVisual(x, y, this.stateStrings[state]);
        var that = this;
        this.visual.on('mousedown', function(){ 
            that.changeState(1);});
        this.visual.on('mouseenter', function(){ emotCursor.setFill('orange');});
        this.visual.on('mouseout', function(){ emotCursor.setFill('black');});
    }
    this.stateArrow.prototype.changeState = function(adjustment){
        this.state += adjustment;
        if (this.state > 3){
            this.state = 0;
        } else if (this.state < 0){
            this.state = 3;
        }
        this.visual.setText(this.stateStrings[this.state]);
    }
    
    var initStage1 = function(stage, layer){
      var k1 = new stateArrow(stage.getWidth()/4, 50, 1);
      var k2 = new stateArrow(stage.getWidth()/4 +50, 50, 2);
      var k3 = new stateArrow(stage.getWidth()/4 +100, 50, 3);
      var k4 = new stateArrow(stage.getWidth()/4 +150, 50, 0);
      var k5 = new stateArrow(stage.getWidth()/4 +200, 50, 1);
      var k6 = new stateArrow(stage.getWidth()/4 +250, 50, 2);
      var k7 = new stateArrow(stage.getWidth()/4 +300, 50, 3);
      var k8 = new stateArrow(stage.getWidth()/4 +350, 50, 0);
      layer.add(k1.visual);
      layer.add(k2.visual);
      layer.add(k3.visual);
      layer.add(k4.visual);
      layer.add(k5.visual);
      layer.add(k6.visual);
      layer.add(k7.visual);
      layer.add(k8.visual);
    };
      //var simpleText = new Kinetic.Text({
    //    x: stage.getWidth() / 2,
      //  y: 15,
    //    fontFamily: 'fontello',
     //   text: '\uE800 alpha blue \u2708 \uF0FB',
      //  fontSize: 30,
    //    fill: 'green'
     // });
     
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
      layer.add(emot);
};