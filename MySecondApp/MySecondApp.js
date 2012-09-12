var MySecondApp = cc.Layer.extend(
{
    init:function()
    {
        var layer1 = cc.LayerColor.create(
            new cc.Color4B(128, 128, 128, 255), 600, 600),
            jetSprite = cc.Sprite.create("./images/Jet.png");
        layer1.setPosition(new cc.Point(0.0,0.0));
        layer1.addChild(jetSprite);
        jetSprite.setPosition(new cc.Point(0.0,0.0));
        
        this.addChild(layer1);
        return true;
    }
});

MySecondAppScene = cc.Scene.extend({
    onEnter:function() {
        this._super();
        var layer = new MySecondApp();
        layer.init();
        this.addChild(layer);
    }
});