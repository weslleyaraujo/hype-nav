var hypenessNavigator = (function (window, jQuery) {
	var app, _private, config = {
		keys: {
			down: 106,
			up: 107,
			opener: 111
		}
	};
	
	_private = {
		isLocked: false,

		compose: function (a, b) {
			return function (c) {
				return a(b(c));
			}
		},

		applyScreen: function () {
			$.fn.is_on_screen = function(){
				var win = $(window);
				var viewport = {
						top : win.scrollTop(),
						left : win.scrollLeft()
				};
				viewport.right = viewport.left + win.width();
				viewport.bottom = viewport.top + win.height();
		 
				var bounds = this.offset();
				bounds.right = bounds.left + this.outerWidth();
				bounds.bottom = bounds.top + this.outerHeight();
		 
				return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
			};

			return _private;
		},

		fixPostsClass: function () {
			app.elements.$main.find('div#post').addClass('post');
			return _private;
		},

		getVisible: function (index) {
			index = index || 0;
			app.elements.$main.find('.post').each(function () {
				if ($(this).is_on_screen()) {
					_private.setVisible($(this));
				}
			});
			
			// Set just one post as visible
			app.elements.$main.find('.post.is-visible').eq(index).addClass('is-actual');
			
			// Set actual only one boy :D
			if (app.elements.$main.find('.post.is-visible').length > 1) {
				app.elements.$main.find('.post.is-visible').removeClass('is-visible');
			}

			app.elements.$main.find('.post.is-actual').addClass('is-visible');
			return app.elements.$main.find('.post.is-actual.is-visible');
		},

		setVisible: function (element) {
			element.addClass('is-visible');
			return _private;
		},

		set: function (by) {
			var $actual = app.elements.$main.find('.post.is-visible.is-actual') || {},
				$next = $actual[by]('.post:first') || {};
			
			if (!$actual.length) {
				_private.compose(_private.setVisible, _private.getVisible)();
			}
			else {
				$actual.removeClass('is-visible is-actual');
				$next.addClass('is-actual');
				_private.setVisible($next);
			}
			
			return _private;
		},

		ajaxDone: function (e) {
			if (_private.isLocked) {
				// Fix posts class :(
				_private.setVisible(_private.getVisible(1));
				_private.fixPostsClass().keyBind();
			}
		},

		ajaxSend: function (event, req, settings) {
			// avoid object errors
			settings = settings || {};
			if (_private.isHypeAjax(settings.url)) {
				_private.keyLock();
			}
		},

		keyLock: function () {
			_private.isLocked = true;
			app.elements.$page.unbind();
			return _private;
		},
		
		keyBind: function () {
			_private.isLocked = false;
			app.elements.$page.keypress(app.keyHandler);
			return _private;
		},
		
		isHypeAjax: function (str) {
			return str.match(/(\bhypeness\b)[.]com[.]br\/(\bpage\b)\/[0-9]/g);
		}
	};

	app = {
		init: function () {
			app.setDom().bind();
			_private.applyScreen();
		},

		bind: function () {
			app.elements.$page.keypress(app.keyHandler);
			$(document).ajaxComplete(_private.ajaxDone);
			$(document).ajaxSend(_private.ajaxSend);
			return app;
		},

		setDom: function () {
			app.elements = {};
			app.elements.$main = $('#content');
			app.elements.$page = $('body');
			
			// Fix posts class :(
			_private.fixPostsClass();
			
			return app;
		},

		keyHandler: function (e) {
			switch (e.which) {
				case config.keys.up :
					app.up();
				break;

				case config.keys.down :
					app.down();
				break;

				case config.keys.opener :
					console.log('abre ai')
				break;
			}
		},

		up: function () {
			_private.set('prevAll');
			app.scrollTo();
		},

		down: function () {
			_private.set('nextAll');
			app.scrollTo();
		},

		scrollTo: function () {
			if ( app.elements.$main.find('.post.is-visible.is-actual').length ) {
				app.elements.$page.animate({
					scrollTop: (app.elements.$main.find('.post.is-visible.is-actual').offset().top - 10)
				},400);
			}
			else {
				// Trigger ajax
				app.elements.$page.animate({
					scrollTop: ($(window).scrollTop() + 200)
				},400);
			}
		}
	};

	return app;

}(window, jQuery).init());
