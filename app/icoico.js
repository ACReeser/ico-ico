(function( icoico, $, undefined ) {
    var ico = icoico;
    ico.stage = new Kinetic.Stage({
        container: 'icoCanvas',
        width: 768,
        height: 512
      });
    ico.layer = new Kinetic.Layer();
    ico.glass = new Kinetic.Layer();
    ico.glass.setListening(false);
    ico.winObjs = [];
    ico.props = [];
    ico.levelStar = null;
    ico.currentLevel = -1;
    ico.levelCreators = [];
    
    ico.initStage3 = function(stage, layer){
        var shopper = new ico.user(200, 200, "\ue81a");   
        var cart = new ico.cart(300, 300, ["", "", ""], 2)
    };
    
    ico.initStage2 = function(stage, layer){
        var so = new ico.moveUser(100, 100, "\u2665");
        var stu = new ico.moveUser(360, 290, "\ue81a");
        var mech = new ico.moveUser(60, 130, "\ue828");
        var ticket = new ico.moveUser(20, 400, "\ue81b");
        var clap = new ico.moveUser(200, 350, "\ue82d");
        var music = new ico.moveUser(200, 30, "\u266a");
        var paper = new ico.moveUser(500, 30, "\ue80b");
        var mo = new ico.moveTool(200, 100);
        var circHeart = new ico.circle(200, 200, "\ue80a", [so, stu]);
        var circMovie = new ico.circle(450, 80, "\ue804", [ticket, clap]);
        ico.layer.add(mo.visual);
        ico.initIcoProp(so);
        ico.initIcoProp(stu);
        ico.initIcoProp(mech);
        ico.initIcoProp(ticket);
        ico.initIcoProp(clap);
        ico.initIcoProp(music);
        ico.initIcoProp(paper);
        ico.initIcoObj(circHeart);
        ico.initIcoObj(circMovie);
        ico.levelStar = new ico.star(0,0);
        ico.center(ico.levelStar.visual);
        ico.layer.add(ico.levelStar.visual);
        ico.circHeart.visual.moveToBottom();
        ico.circMovie.visual.moveToBottom();
    };
    ico.initStage1 = function(stage, layer){
        var quarter = stage.getWidth()/4;
      var k1 = new ico.stateArrow(quarter, 50, 1, 0);
      var k2 = new ico.stateArrow(quarter +50, 50, 2, 0);
      var k3 = new ico.stateArrow(quarter +100, 50, 3, 2);
      var k4 = new ico.stateArrow(quarter +150, 50, 0, 2);
      var k5 = new ico.stateArrow(quarter +200, 50, 1, 3);
      var k6 = new ico.stateArrow(quarter +250, 50, 2, 1);
      var k7 = new ico.stateArrow(quarter +300, 50, 3, 3);
      var k8 = new ico.stateArrow(quarter +350, 50, 0, 1);
      var k9 = new ico.stateText(quarter +400, 50, 0, 1);
      var k10 = new ico.stateText(quarter +450, 50, 2, 0);
      ico.levelStar = new ico.star(0, 0);
      ico.center(ico.levelStar.visual);
      var tool = new ico.stateTool(200, 200);
      ico.layer.add(tool.visual);
      ico.initIcoObj(k1);
      ico.initIcoObj(k2);
      ico.initIcoObj(k3);
      ico.initIcoObj(k4);
      ico.initIcoObj(k5);
      ico.initIcoObj(k6);
      ico.initIcoObj(k7);
      ico.initIcoObj(k8);
      ico.initIcoObj(k9);
      ico.initIcoObj(k10);
      layer.add(ico.levelStar.visual);
    };
    ico.initGame = function(stage, layer){
        var icoTitle = new ico.visual(0,0, "\ue086co-\ue086co");
        var start = new ico.visual(0,0, "\u2605");
        ico.center(icoTitle, 0, -100);
        ico.center(start, 0, 100);
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
                ico.nextStage();
            }
        });
        start.on('mouseover', function(){
            start.destroy();
            v1.play();
        });
    };
}( window.icoico = window.icoico || {}, jQuery ));


window.onload = function(){
    var icoico = icoico || window.icoico;
    
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
     var children = icoico.layer.getChildren();
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
    
    icoico.levelCreators = [icoico.initStage2, icoico.initStage1];
    icoico.stage.add(icoico.layer);
    icoico.stage.add(icoico.glass);
    icoico.glass.add(icoico.cursor.visual);
    icoico.glass.add(icoico.emot);
    icoico.initGame(icoico.stage, icoico.layer);
};