var _targets = [];
var _projectiles = [];
var _projectilesDestroyed;

var NinjaGame = cc.LayerColor.extend({
	init : function() {
		this._super();
		this.initWithColor(new cc.Color4B(0, 255, 204, 255));
		var size = cc.Director.getInstance().getWinSize();
		_projectilesDestroyed = 0;

		ninja = cc.Sprite.create("./images/ninja.png");
		ninja.setPosition(cc.p(42, size.height/2));
		this.addChild(ninja);
		this.schedule(this.gameLogic, 1);
		
		this.setTouchEnabled(true);
		this.schedule(this.update);
		cc.AudioEngine.getInstance().playBackgroundMusic("./sounds/background_music_aac", true);
		return this;
	},
	
	
	gameLogic : function () {
		this.addTarget();
	},
	
	addTarget : function () {
		var target = cc.Sprite.create("./images/monster.png");
		
		// Determine where to spawn the target along the Y axis
		var size = cc.Director.getInstance().getWinSize();
		var minY = target.getContentSize().height/2;
		var maxY = size.height - minY;
		var rangeY = maxY - minY;
		var actualY = (Math.random() * rangeY) + minY;
		
		// Create the target slightly off-screen along the right edge,
		// and along a random position along the Y axis as calcuated above
		target.setPosition(new cc.Point(size.width + (target.getContentSize().width/2), actualY));
		this.addChild(target);
		target.setTag(1);
		_targets.push(target);
		
		// Determine speed of the target
		var minDuration = 3.0;
		var maxDuration = 5.0;
		var rangeDuration = maxDuration - minDuration;
		var actualDuration = (Math.random() * rangeDuration) + minDuration;
		
		// Create the actions
		var actionMove = cc.MoveTo.create(actualDuration, cc.p(-target.getContentSize().width/2, actualY));
		var actionMoveDone = cc.CallFunc.create(this, this.spriteMoveFinished);
		var actionSeq = cc.Sequence.create(actionMove, actionMoveDone);
		target.runAction(actionSeq);
	},

	spriteMoveFinished : function (pSender) {
		if (pSender.getTag() == 1) { // target
			var index = _targets.indexOf(pSender);
			_targets.splice(index, 1);
			var newScene = new GameOverLayerScene();
			newScene.init("Your Lose!");
			cc.Director.getInstance().replaceScene(newScene);
		} else if (pSender.getTag() == 2) { // projectile
			var index = _projectiles.indexOf(pSender);
			_projectiles.splice(index, 1);
		}
		pSender.removeFromParentAndCleanup(true);
	},
	
	onTouchesEnded:function (touches, event) {
		if (touches.lenght <= 0)
			return;
		
		var touch = touches[0];
		var location = touch.getLocation();
		//var convertedLocation = cc.Director.getInstance().convertToGL(location);
		var size = cc.Director.getInstance().getWinSize();
		var projectile = cc.Sprite.create("./images/suriken.png");
		projectile.setPosition(cc.p(42, size.height/2));
		
		// Determine offset of location to projectile
		var offX = location.x - projectile.getPosition().x;
		var offY = location.y - projectile.getPosition().y;
		
		// Bail out if we are shooting down or backwards
		if (offX <= 0) return;
		
		// Ok to add now - we've double checked postion
		this.addChild(projectile);
		projectile.setTag(2);
		_projectiles.push(projectile);
		
		// Determine where we wish to shoot the projectile to
		var realX = size.width + (projectile.getContentSize().width/2);
		var ratio = offY / offX;
		var realY = (realX * ratio) + projectile.getPosition().y;
		var realDest = cc.p(realX, realY);
		
		// Determine the length of how far we're shooting
		var offRealX = realX - projectile.getPosition().x;
		var offRealY = realY - projectile.getPosition().y;
		var length = Math.sqrt((offRealX * offRealX) + (offRealY * offRealY));
		var velocity = 480/1; // 480pixels/1sec
		var realMoveDuration = length/velocity;
		
		// Move projectile to actual endpoint
		var projectileAction = cc.Spawn.create(
			cc.MoveTo.create(realMoveDuration, realDest),
			cc.Repeat.create(cc.RotateBy.create(1, 480), 3)
		);
		projectile.runAction(cc.Sequence.create(projectileAction,
							cc.CallFunc.create(this, this.spriteMoveFinished)));
		
		cc.AudioEngine.getInstance().playEffect("./sounds/pew_pew_lei");
	},
	
	update : function (dt) {
		var projectilesToDelete = [];
		for (var i = 0; i < _projectiles.length; i++) {
			var projectile = _projectiles[i];
			var projectileRect = new cc.Rect(
					projectile.getPosition().x - (projectile.getContentSize().width/2),
					projectile.getPosition().y - (projectile.getContentSize().height/2),
					projectile.getContentSize().width,
					projectile.getContentSize().height);
			
			var targetsToDelete = [];
			for (var j = 0; j < _targets.length; j++) {
				var target = _targets[j];
				var targetRect = new cc.Rect(
					target.getPosition().x - (target.getContentSize().width/2),
					target.getPosition().y - (target.getContentSize().height/2),
					target.getContentSize().width,
					target.getContentSize().height);
					
				if (cc.Rect.CCRectIntersectsRect(projectileRect, targetRect)) {
					targetsToDelete.push(target);
				}
			}
			
			for (var k = 0; k < targetsToDelete.length; k++) {
				var target = targetsToDelete[k];
				var index = _targets.indexOf(target);
				_targets.splice(index, 1);
				target.removeFromParentAndCleanup(true);
			}
			
			if (targetsToDelete.length > 0) {
				projectilesToDelete.push(projectile);
			}
		}
		
		for (var i = 0; i < projectilesToDelete.length; i++) {
			var projectile = projectilesToDelete[i];
			var index = _projectiles.indexOf(projectile);
			_projectiles.splice(index, 1);
			projectile.removeFromParentAndCleanup(true);
			
			if (++_projectilesDestroyed > 30) {
				_projectilesDestroyed = 0;
				var newScene = new GameOverLayerScene();
				newScene.init("Your Won!");
				cc.Director.getInstance().replaceScene(newScene);
			}
		}
	}
});

var NinjaGameScene = cc.Scene.extend({
	onEnter : function() {
		this._super();
		var layer = new NinjaGame();
		layer.init();
		this.addChild(layer);
	}
});


