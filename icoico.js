$(document).ready(function(){
	var stage = new Kinetic.Stage({
        container: 'icoCanvas',
        width: 578,
        height: 220
      });
      var layer = new Kinetic.Layer();

      var simpleText = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: 15,
        text: '\ue800',
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'green'
      });

      // to align text in the middle of the screen, we can set the
      // shape offset to the center of the text shape after instantiating it
      simpleText.setOffset({
        x: simpleText.getWidth() / 2
      });

      // since this text is inside of a defined area, we can center it using
      // align: 'center'
      var complexText = new Kinetic.Text({
        x: 100,
        y: 60,
        text: 'COMPLEX TEXT\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.',
        fontSize: 18,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 380,
        padding: 20,
        align: 'center'
      });

      var rect = new Kinetic.Rect({
        x: 100,
        y: 60,
        stroke: '#555',
        strokeWidth: 5,
        fill: '#ddd',
        width: 380,
        height: complexText.getHeight(),
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        cornerRadius: 10
      });

      // add the shapes to the layer
      layer.add(simpleText);
      layer.add(rect);
      layer.add(complexText);
      stage.add(layer);
});