(function( icoico, $, undefined ) {
    var ico = icoico;
    
    ico.user = function(x, y, badgeUnicode){
        this.visual = new Kinetic.Group({
            x: x,
            y: y,
            draggable: false,
        });
        this.user = new ico.visual(0, 0, "\ue801");
        this.visual.add(this.user);
        this.badge = new ico.visual(25, 20, badgeUnicode);
        this.badge.setScale(0.6);
        this.visual.add(this.badge);
    };
    
    ico.moveUser = function(x, y, badgeUnicode){
        this.visual = new Kinetic.Group({
            x: x,
            y: y,
            draggable: false,
        });
        this.user = new ico.visual(0, 0, "\ue801");
        this.visual.add(this.user);
        this.badge = new ico.visual(25, 20, badgeUnicode);
        this.badge.setScale(0.6);
        this.visual.add(this.badge);
        this.selectable = true;
        this.visual.entity = this;
        var self = this;
        this.visual.on('mousedown', self.startDrag);
        this.visual.on('dragend', self.endDrag);
        this.visual.on('mouseover', self.checkDrag);
        this.visual.on('mouseleave', function(){ico.cursor.unhighlight();});
    };
    ico.moveUser.prototype.startDrag = function(){
        if (ico.cursor.isMove()){
            ico.cursor.grabObject(this.entity);
        }
    };
    ico.moveUser.prototype.endDrag = function(){
        if (ico.cursor.isMove() && this.entity.parentCircle){
            if (ico.iconCircleCollision(this.entity.user, this.entity.parentCircle.circleVisual)){
                this.entity.parentCircle.addUser();
            } else {
                this.entity.parentCircle.dropUser();                
            }
            ico.cursor.moveObj = null;
        }
    };
    ico.moveUser.prototype.checkDrag = function(){
        if (ico.cursor.isMove()){
            ico.cursor.highlight();
            this.setDraggable(true);
        } else {
            this.setDraggable(false);            
        }
    };  
}( window.icoico = window.icoico || {}, jQuery ));