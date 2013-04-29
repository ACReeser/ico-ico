window.onload = function(){
	var stage = new Kinetic.Stage({
        container: 'icoCanvas',
        width: 768,
        height: 512
      });
      var layer = new Kinetic.Layer();

      //var simpleText = new Kinetic.Text({
    //    x: stage.getWidth() / 2,
      //  y: 15,
    //    fontFamily: 'fontello',
     //   text: '\uE800 alpha blue \u2708 \uF0FB',
      //  fontSize: 30,
    //    fill: 'green'
     // });
     
     var emot = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: 15,
        fontFamily: 'fontello',
        text: '\uE800',
        fontSize: 18,
        fill: 'black',
        name:'emot',
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
          emot.setX( mouseoverEvt.offsetX);
          emot.setY( mouseoverEvt.offsetY);
          emot.getLayer().draw();          
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
      layer.add(emot);
      //layer.add(rect);
      stage.add(layer);
};