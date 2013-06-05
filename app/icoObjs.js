(function( icoico, $, undefined ) {
    var ico = icoico;
    
    ico.cart = function(x, y, badges, winState, initialState){
        this.state = initialState || 0;
        this.winState = winState;
        this.stateStrings = badges;
        this.visual = new Kinetic.Group({
            x: x,
            y:y,
            });
        this.cartVisual = ico.visual(0, 0, ico.getIconText("trash"));
        this.badge = new ico.visual(0, -45, this.stateStrings[this.state]);
        this.visual.add(this.badge);
        this.visual.add(this.cartVisual);
        var that = this;
        this.cartVisual.on('mousedown', function(){ 
            if (ico.cursor.isState()){
                that.changeState(1);
                ico.checkClearState();
            }
        });
        this.cartVisual.on('mouseenter', function(){ 
            if (ico.cursor.isState()){
                ico.cursor.highlight();
            }
        });
        this.cartVisual.on('mouseout', function(){ 
            if (ico.cursor.isState()){
                ico.cursor.unhighlight();                
            }            
        });
    };
    ico.cart.prototype.changeState = function(adjustment){
        this.state += adjustment;
        if (this.state > this.stateStrings.length-1){
            this.state = 0;
        } else if (this.state < 0){
            this.state = this.stateStrings.length -1;
        }
        this.badge.setText(this.stateStrings[this.state]);
    };
    ico.stateArrow = function(x, y, initialState, winState){
        this.state = initialState;
        this.winState = winState;
        this.stateStrings = ["\u21c8", "\u21c9", "\u21ca", "\u21c7"];
        this.visual = new ico.visual(x, y, this.stateStrings[initialState]);
        var that = this;
        this.visual.on('mousedown', function(){ 
            that.changeState(1);
            ico.checkClearState();});
        this.visual.on('mouseenter', function(){ ico.cursor.highlight();});
        this.visual.on('mouseout', function(){ ico.cursor.unhighlight();});
    };
    ico.stateArrow.prototype.changeState = function(adjustment){
        this.state += adjustment;
        if (this.state > 3){
            this.state = 0;
        } else if (this.state < 0){
            this.state = 3;
        }
        this.visual.setText(this.stateStrings[this.state]);
    };
    ico.stateText = function(x, y, initialState, winState){
        this.state = initialState;
        this.winState = winState;
        this.stateStrings = ["\ue095", "\ue0ce", "\ue086", ];
        this.visual = new ico.visual(x, y, this.stateStrings[initialState]);
        var that = this;
        this.visual.on('mousedown', function(){ 
            that.changeState(1);
            ico.checkClearState();});
        this.visual.on('mouseenter', function(){ ico.cursor.highlight();});
        this.visual.on('mouseout', function(){ ico.cursor.unhighlight();});
    };
    ico.stateText.prototype.changeState = function(adjustment){
        this.state += adjustment;
        if (this.state > 2){
            this.state = 0;
        } else if (this.state < 0){
            this.state = 2;
        }
        this.visual.setText(this.stateStrings[this.state]);
    };
    ico.circle = function(x, y, badge, winObjs){
        this.visual = new Kinetic.Group({x:x, y:y});
        this.circleVisual = ico.visual(0, 0, "\ue830");
        this.badgeVisual = ico.visual(100, 100, badge);
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
    ico.circle.prototype.addUser = function(){
        if (this.currentObjs.indexOf(ico.cursor.moveObj) == -1){
            this.currentObjs.push(ico.cursor.moveObj);
            ico.checkClearState();
        }
    };
    ico.circle.prototype.dropUser = function(){
        var indexy = this.currentObjs.indexOf(ico.cursor.moveObj);
        if (indexy != -1){
            this.currentObjs.splice(indexy, 1);
        }
    };
    ico.circle.prototype.checkWinCondition = function(){
        for(var i = 0; i < this.winObjs.length; i++){
            if (this.currentObjs.indexOf(this.winObjs[i]) == -1){
                return false;
            }
        }
        return true;
    };
    
}( window.icoico = window.icoico || {}, jQuery ));