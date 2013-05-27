(function( icoico, $, undefined ) {
    //private properties
    var ico = icoico;

    //public properties
    
    //private methods
    
    //icoico utils
    ico.visual = function(x, y, string, fontSize){
        return new Kinetic.Text({
          x: x,
          y: y,
          fontFamily: 'fontello',
          text:string,
          fontSize: fontSize||30,
          fill:'black',
        });
    };
    ico.center = function(visual, xoffset, yoffset){
        xoffset = xoffset || 0;
        yoffset = yoffset || 0;
        visual.setX((ico.stage.getWidth()/2)-(visual.getWidth()/2)+xoffset);
        visual.setY((ico.stage.getHeight()/2)-(visual.getHeight()/2)+yoffset);
    };
    
    ico.iconCircleCollision = function(c1, c2) {
          var dx = c1.getX() - c2.getX();
          var dy = c1.getY() - c2.getY();
          var c1Min = (c1.getWidth() < c1.getHeight()) ? c1.getWidth() : c1.getHeight();
          var c2Min = (c2.getWidth() < c2.getHeight()) ? c2.getWidth() : c2.getHeight();
          var radiiSum = c1Min/2 + c2Min;
          console.log(dx + "/" + dy + ": " + radiiSum);
          return ((dx * dx + dy * dy) < radiiSum * radiiSum);
      };
      
    ico.checkClearState = function(){
        for(var i = 0; i < ico.winObjs.length; i++){
            if (ico.winObjs[i].state){
                if (ico.winObjs[i].state != ico.winObjs[i].winState){
                    return false;
                }
            } else if (ico.winObjs[i].checkWinCondition) {
                if (!ico.winObjs[i].checkWinCondition()){
                    return false;
                }
            }
        }
        ico.levelStar.award();
        return true;
    };
    ico.initIcoObj = function(icoObj){
        ico.layer.add(icoObj.visual);
        ico.winObjs.push(icoObj);
    };
    ico.initIcoProp = function(icoObj){
        ico.layer.add(icoObj.visual);
        ico.props.push(icoObj);
    };
    ico.clearStage = function(){
        ico.levelStar.visual.on('mouseover', function(){});
        TweenLite.to(ico.levelStar.visual, 0.5, {
        setOpacity: 0,
        onUpdate: function() {
          ico.layer.draw(); 
        }        
        });
        ico.winObjs.forEach(function(obj){obj.visual.destroy(); delete obj;});
        ico.winObjs.forEach(function(undef, i){ico.winObjs.splice(i, 1)});
        ico.props.forEach(function(obj){obj.visual.destroy(); delete obj;});
        ico.props.forEach(function(undef, i){ico.winObjs.splice(i, 1)});
    };
    ico.nextStage = function(){
        ico.currentLevel++;
        ico.levelCreators[ico.currentLevel](ico.stage, ico.layer);
    };
    
    
    //icoico common classes
    ico.cursorClass = function(){
        this.state = -1;
        this.visual = new Kinetic.Text({
        x: ico.stage.getWidth() / 2,
        y: 15,
        fontFamily: 'fontello',
        text: '',
        fontSize: 18,
        fill: 'black',
        name:'cursor',          
      });
    };
    ico.cursorClass.prototype.isState = function(){return this.state === 0;};
    ico.cursorClass.prototype.isAction = function(){return this.state == 1;};
    ico.cursorClass.prototype.isMove = function(){return this.state == 2;};
    ico.cursorClass.prototype.makeState = function(){
        this.state = 0;
        this.visual.setText("\u2699");
    };
    ico.cursorClass.prototype.makeAction = function(){
        this.state = 1;
        this.visual.setText("\u26a1");
    };
    ico.cursorClass.prototype.makeMove = function(){
        this.state = 2;
        this.visual.setText("\uf0b2");
    };
    ico.cursorClass.prototype.highlight = function(){
      switch(this.state){
          case 0:
              this.visual.setFill("#504c75");
              break;
          case 1:
              this.visual.setFill("orange");
              break;
          case 2:
              this.visual.setFill("#40070b");
              break;
      }  
    };
    ico.cursorClass.prototype.unhighlight = function(){
        this.visual.setFill("black");
    };
    ico.cursorClass.prototype.grabObject = function(obj){
        this.moveObj = obj;
        // this.moveOffsetX = this.visual.getX() - obj.visual.getX();
        // this.moveOffsetY = this.visual.getY() - obj.visual.getY();
    };
    ico.stateTool = function(x, y, isPersistant){
        this.visual = new ico.visual(x, y, "\u2699");
        var that = this;
        this.visual.on('mouseover', function(){
            if (!ico.cursor.isState()){
                ico.cursor.makeState();
            }
            if (!isPersistant){
                that.visual.destroy();
                delete that;
            }
        });
    };
    ico.moveTool = function(x, y, isPersistant){
        this.visual = new ico.visual(x, y, "\uf0b2");
        var that = this;
        this.visual.on('mouseover', function(){
            if (!ico.cursor.isMove()){
                ico.cursor.makeMove();
            }
            if (!isPersistant){
                that.visual.destroy();
                delete that;
            }
        });
    };
    ico.star = function(x, y){
        this.visual = new ico.visual(x, y, "\u2605");
        this.visual.setFill('#f0b613');
        this.visual.setOpacity(0);
        this.visual.setStroke('black');
    };
    ico.star.prototype.award = function(){
        TweenLite.to(this.visual, 1, {
            setOpacity: 1,
            onUpdate: function() {
              ico.layer.draw(); 
            }        
        });
        this.visual.on('mouseover', function(){
            ico.clearStage();
            ico.nextStage();
        });
    };
    ico.emot = new Kinetic.Text({
        x: ico.stage.getWidth() / 2 +15,
        y: 30,
        fontFamily: 'fontello',
        text: '\uE800',
        fontSize: 18,
        fill: 'black',
        name:'emot',
    });
    
    ico.emot.oncollide = function(collider){
      console.log(collider.name)
    };
    ico.cursor = new ico.cursorClass();
    
    ico.moveEmot = function(mouseoverEvt){
        ico.cursor.visual.setX(mouseoverEvt.offsetX);
        ico.cursor.visual.setY(mouseoverEvt.offsetY);
        ico.emot.setX( mouseoverEvt.offsetX+15);
        ico.emot.setY( mouseoverEvt.offsetY+15);
        if (ico.cursor.moveObj){
        //   emotCursor.moveObj.moveTo(mouseoverEvt.offsetX+emotCursor.moveOffsetX, mouseoverEvt.offsetY+emotCursor.moveOffsetY);
        }
        ico.emot.getStage().draw();          
    };
    $('#icoCanvas').mouseover(ico.moveEmot);
    
    $('#icoCanvas').mousemove(ico.moveEmot);
    
    
}( window.icoico = window.icoico || {}, jQuery ));