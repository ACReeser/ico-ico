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
    var center = function(visual, xoffset, yoffset){
        xoffset = xoffset || 0;
        yoffset = yoffset || 0;
        visual.setX((stage.getWidth()/2)-(visual.getWidth()/2)+xoffset);
        visual.setY((stage.getHeight()/2)-(visual.getHeight()/2)+yoffset);
    };
    function iconCircleCollision(c1, c2) {
          var dx = c1.getX() - c2.getX();
          var dy = c1.getY() - c2.getY();
          var c1Min = (c1.getWidth() < c1.getHeight()) ? c1.getWidth() : c1.getHeight();
          var c2Min = (c2.getWidth() < c2.getHeight()) ? c2.getWidth() : c2.getHeight();
          var radiiSum = c1Min/2 + c2Min;
          console.log(dx + "/" + dy + ": " + radiiSum);
          return ((dx * dx + dy * dy) < radiiSum * radiiSum);
      }
      
    var winObjs = [];
    var props = [];
    var levelStar = null;
    var checkClearState = function(){
        for(var i = 0; i < winObjs.length; i++){
            if (winObjs[i].state){
                if (winObjs[i].state != winObjs[i].winState){
                    return false;
                }
            } else if (winObjs[i].checkWinCondition) {
                if (!winObjs[i].checkWinCondition()){
                    return false;
                }
            }
        }
        levelStar.award();
        return true;
    };
    var currentLevel = -1;
    var levelCreators = [];
    var cursorClass = function(){
        this.state = -1;
        this.visual = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: 15,
        fontFamily: 'fontello',
        text: '',
        fontSize: 18,
        fill: 'black',
        name:'cursor',          
      });
    };
    cursorClass.prototype.isState = function(){return this.state === 0;};
    cursorClass.prototype.isAction = function(){return this.state == 1;};
    cursorClass.prototype.isMove = function(){return this.state == 2;};
    cursorClass.prototype.makeState = function(){
        this.state = 0;
        this.visual.setText("\u2699");
    };
    cursorClass.prototype.makeAction = function(){
        this.state = 1;
        this.visual.setText("\u26a1");
    };
    cursorClass.prototype.makeMove = function(){
        this.state = 2;
        this.visual.setText("\uf0b2");
    };
    cursorClass.prototype.highlight = function(){
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
    cursorClass.prototype.unhighlight = function(){
        this.visual.setFill("black");
    };
    cursorClass.prototype.grabObject = function(obj){
        this.moveObj = obj;
        // this.moveOffsetX = this.visual.getX() - obj.visual.getX();
        // this.moveOffsetY = this.visual.getY() - obj.visual.getY();
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
            clearStage();
            nextStage();
        });
    };
    this.stateTool = function(x, y, isPersistant){
        this.visual = new icoVisual(x, y, "\u2699");
        var that = this;
        this.visual.on('mouseover', function(){
            if (!emotCursor.isState()){
                emotCursor.makeState();
            }
            if (!isPersistant){
                that.visual.destroy();
                delete that;
            }
        });
    };
    this.moveTool = function(x, y, isPersistant){
        this.visual = new icoVisual(x, y, "\uf0b2");
        var that = this;
        this.visual.on('mouseover', function(){
            if (!emotCursor.isMove()){
                emotCursor.makeMove();
            }
            if (!isPersistant){
                that.visual.destroy();
                delete that;
            }
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
        this.visual.on('mouseenter', function(){ emotCursor.highlight();});
        this.visual.on('mouseout', function(){ emotCursor.unhighlight();});
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
        this.visual.on('mouseenter', function(){ emotCursor.highlight();});
        this.visual.on('mouseout', function(){ emotCursor.unhighlight();});
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
    this.circle = function(x, y, badge, winObjs){
        this.visual = new Kinetic.Group({x:x, y:y});
        this.circleVisual = icoVisual(0, 0, "\ue830");
        this.badgeVisual = icoVisual(100, 100, badge);
        this.circleVisual.setScale(4);
        this.visual.add(this.circleVisual);
        this.visual.add(this.badgeVisual);
        this.winObjs = winObjs;
        this.lastPushed;
        this.currentObjs = [];
        var that = this;
        this.winObjs.forEach(function(user){
            user.parentCircle = that;    
        });
    };
    this.circle.prototype.addUser = function(){
        if (this.currentObjs.indexOf(emotCursor.moveObj) == -1){
            this.currentObjs.push(emotCursor.moveObj);
            checkClearState();
        }
    };
    this.circle.prototype.dropUser = function(){
        var indexy = this.currentObjs.indexOf(emotCursor.moveObj);
        if (indexy != -1){
            this.currentObjs.splice(indexy, 1);
        }
    };
    this.circle.prototype.checkWinCondition = function(){
        for(var i = 0; i < this.winObjs.length; i++){
            if (this.currentObjs.indexOf(this.winObjs[i]) == -1){
                return false;
            }
        }
        return true;
    };
    this.moveUser = function(x, y, badgeUnicode){
        this.visual = new Kinetic.Group({
        x: x,
        y: y,
        draggable: false,
      });
        this.user = new icoVisual(0, 0, "\ue801");
        this.visual.add(this.user);
        this.badge = new icoVisual(25, 20, badgeUnicode);
        this.badge.setScale(0.6);
        this.visual.add(this.badge);
        this.selectable = true;
        this.visual.entity = this;
        var self = this;
        this.visual.on('mousedown', self.startDrag);
        this.visual.on('dragend', self.endDrag);
        this.visual.on('mouseover', self.checkDrag);
        this.visual.on('mouseleave', function(){emotCursor.unhighlight();});
    };
    this.moveUser.prototype.startDrag = function(){
        if (emotCursor.isMove()){
            emotCursor.grabObject(this.entity);
        }
    };
    this.moveUser.prototype.endDrag = function(){
        if (emotCursor.isMove() && this.entity.parentCircle){
            if (iconCircleCollision(this.entity.user, this.entity.parentCircle.circleVisual)){
                this.entity.parentCircle.addUser();
            } else {
                this.entity.parentCircle.dropUser();                
            }
            emotCursor.moveObj = null;
        }
    };
    this.moveUser.prototype.checkDrag = function(){
        if (emotCursor.isMove()){
            emotCursor.highlight();
            this.setDraggable(true);
        } else {
            this.setDraggable(false);            
        }
    };    
    
    var initIcoObj = function(icoObj){
        layer.add(icoObj.visual);
        winObjs.push(icoObj);
    };
    var initIcoProp = function(icoObj){
        layer.add(icoObj.visual);
        props.push(icoObj);
    };
    var clearStage = function(){
        levelStar.visual.on('mouseover', function(){});
        TweenLite.to(levelStar.visual, .5, {
        setOpacity: 0,
        onUpdate: function() {
          layer.draw(); 
        }        
        });
        winObjs.forEach(function(obj){obj.visual.destroy(); delete obj;});
        winObjs.forEach(function(undef, i){winObjs.splice(i, 1)});
        props.forEach(function(obj){obj.visual.destroy(); delete obj;});
        props.forEach(function(undef, i){winObjs.splice(i, 1)});
    };
    var nextStage = function(){
        currentLevel++;
        levelCreators[currentLevel](stage, layer);
    };
    var initStage2 = function(stage, layer){
        var so = new moveUser(100, 100, "\u2665");
        var stu = new moveUser(360, 290, "\ue81a");
        var mech = new moveUser(60, 130, "\ue828");
        var ticket = new moveUser(20, 400, "\ue81b");
        var clap = new moveUser(200, 350, "\ue82d");
        var music = new moveUser(200, 30, "\u266a");
        var paper = new moveUser(500, 30, "\ue80b");
        var mo = new moveTool(200, 100);
        var circHeart = new circle(200, 200, "\ue80a", [so, stu]);
        var circMovie = new circle(450, 80, "\ue804", [ticket, clap]);
        layer.add(mo.visual);
        initIcoProp(so);
        initIcoProp(stu);
        initIcoProp(mech);
        initIcoProp(ticket);
        initIcoProp(clap);
        initIcoProp(music);
        initIcoProp(paper);
        initIcoObj(circHeart);
        initIcoObj(circMovie);
        levelStar = new star(0,0);
        center(levelStar.visual);
        layer.add(levelStar.visual);
        circHeart.visual.moveToBottom();
        circMovie.visual.moveToBottom();
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
      levelStar = new star(0, 0);
      center(levelStar.visual);
      var tool = new stateTool(200, 200);
      layer.add(tool.visual);
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
    var initGame = function(stage, layer){
        var icoTitle = new icoVisual(0,0, "\ue086co-\ue086co");
        var start = new icoVisual(0,0, "\u2605");
        center(icoTitle, 0, -100);
        center(start, 0, 100);
        start.setFill('#f0b613');
        start.setStroke('black');
        layer.add(icoTitle);
        layer.add(start);
        var v1 = new Kinetic.Tween({
            node: icoTitle, 
            duration: 0.6,
            opacity: 0,
            onFinish:function(){
                icoTitle.destroy();
                nextStage();
            }
        });
        start.on('mouseover', function(){
            start.destroy();
            v1.play();
        });
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
      
      emot.oncollide = function(collider){
          console.log(collider.name)
      };
      emotCursor = new cursorClass();
      
      var moveEmot = function(mouseoverEvt){
          emotCursor.visual.setX(mouseoverEvt.offsetX);
          emotCursor.visual.setY(mouseoverEvt.offsetY);
          emot.setX( mouseoverEvt.offsetX+15);
          emot.setY( mouseoverEvt.offsetY+15);
          if (emotCursor.moveObj){
           //   emotCursor.moveObj.moveTo(mouseoverEvt.offsetX+emotCursor.moveOffsetX, mouseoverEvt.offsetY+emotCursor.moveOffsetY);
          }
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
      
      levelCreators = [initStage2, initStage1];
      // add the shapes to the layer
      //layer.add(rect);
      stage.add(layer);
      stage.add(glass);
      // initStage1(stage, layer);
      glass.add(emotCursor.visual);
      glass.add(emot);
      initGame(stage, layer);
};