var GameOverLayer = cc.LayerColor.extend({
	_label : null,
	init : function() {
		this._super();
		this.initWithColor(new cc.Color4B(0, 255, 255, 255));
		var size = cc.Director.getInstance().getWinSize();
		this._label = cc.LabelTTF.create("", "Arial", 32, cc.size(64,32), cc.TEXT_ALIGNMENT_CENTER);
		this._label.setColor(new cc.Color3B(0,0,0));
		this._label.setPosition(cc.p(size.width/2, size.height/2));
		this.addChild(this._label);
		
		this.setTouchEnabled(true);
		this.runAction(cc.Sequence.create(
			cc.DelayTime.create(3),
			cc.CallFunc.create(this, this.gameOverDone)
		));
		return this;
	},
	
	gameOverDone : function() {
		cc.Director.getInstance().replaceScene(new NinjaGameScene());
	},
	
	onTouchesEnded : function(touches, event) {
		this.gameOverDone();
		return true;
	}
});

var GameOverLayerScene = cc.Scene.extend({
	init : function(message) {
		this._super();
		var layer = new GameOverLayer();
		layer.init();
		layer._label.setString(message);
		this.addChild(layer);
	}
});