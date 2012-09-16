var NEW_COCOS2D-HTML5_APP = cc.LayerColor.extend({
	init : function() {
		this._super();
		this.initWithColor(new cc.Color4B(255, 255, 0, 255));
		var size = cc.Director.getInstance().getWinSize();

		/* Create HelloWorld label and add it to the main layer */
		var helloLabel = cc.LabelTTF.create("Hello world", "Arial", 30);
		helloLabel.setPosition(new cc.Point(size.width / 2, size.height / 2));
		helloLabel.setColor(new cc.Color3B(255, 0, 0));
		var rotationAmount = 0;
		var scale = 1;
		helloLabel.schedule(function() {
			this.setRotation(rotationAmount++);
			if (rotationAmount > 360)
				rotationAmount = 0;
			this.setScale(scale);
			scale += 0.05;
			if (scale > 10)
				scale = 1;
		});
		this.addChild(helloLabel);
		
		return this;
	}
});

var NEW_COCOS2D-HTML5_APPScene = cc.Scene.extend({
	onEnter : function() {
		this._super();
		var layer = new NEW_COCOS2D-HTML5_APP();
		layer.init();
		this.addChild(layer);
	}
});