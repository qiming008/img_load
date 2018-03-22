//图片预加载
(function($){

	function PreLoad(imgs, options){
		this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
		this.opts = $.extend({}, PreLoad.DEFAULTS, options);
		if(this.opts.order === 'ordered'){
			this._ordered();
		}else{
			this._unoredered();
		}
	}
	PreLoad.DEFAULTS = {
		order:'unoredered',//无序预加载
		each: null, //每一张图片加载完毕后执行
		all: null  //所有图片加载完毕后执行
	}

	PreLoad.prototype._ordered = function(){ //有序加载
		var opts = this.opts,
		    imgs = this.imgs,
		    len = imgs.length;
		    count = 0;

		load();
		function load(){
			
			var imgObj = new Image();
			
			$(imgObj).on('load error', function(){
				
				if(count >= len){ //所有图片已加载完毕
					opts.all && opts.all();
				}else{
					opts.each && opts.each(count);
					load();
				}
				count++;
			})	
			imgObj.src = imgs[count];
		}
	},

	PreLoad.prototype._unoredered = function(){ //无序加载
		var imgs = this.imgs,
			opts = this.opts,
			count = 0,
			len = imgs.length;
		$.each(imgs,function(i,src){
			
			if(typeof src != 'string') return;

			var imgObj = new Image();

			$(imgObj).on('load error',function(){
				opts.each && opts.each(count);
				if(count >= len - 1){
					opts.all && opts.all();
				}

				count++;
			});

			imgObj.src = src;	
			
		})
	}

	$.extend ({
		preload: function(imgs, opts){
			new PreLoad(imgs,opts);
		}
	})
})(jQuery);