
$(document).ready(function() {
	
	"use strict";
	
	FirstLoad();
	AjaxExpander();
	VirtualScr();
	SectionScroll();
	ContactForm();
	Shortcodes();
		
});

$(window).on("load", function() {
	LazyLoad();
});




/*--------------------------------------------------
Function First Load
---------------------------------------------------*/

	function FirstLoad() {		

		
		$('.showcase-img:nth-child(1)').addClass('active');
	
		$('.showcase-list li a').on('mouseenter', function() {
			$('.showcase-list li a').addClass('disable');
			$(this).removeClass('disable');	
			var aux = $(this).data('aux'),
			preview = $('.showcase-img[data-aux="' + aux + '"]');	
			$('#showcase-gallery').find('.showcase-img').removeClass('active');
			preview.addClass('active');
		}).on('mouseleave', function() {
			$('.showcase-list li a').removeClass('disable');
		});
		
		// Scroll To Portfolio
		$('.scroll-down').on('click', function() {
			$('html, body').animate({ scrollTop: $('#showcase').offset().top +1 },700);
			return false;
		});	
		
	}// End First Load

/*--------------------------------------------------
Title Animation
---------------------------------------------------*/

var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 100,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;
	
	initHeadline();
	
	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {        
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);
			
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
        
		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');	
			setTimeout(function(){ 
				parentSpan.removeClass('selected'); 
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
		
		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
        
        if($word.text().indexOf("Cornellian") >= 0){
            $('i.in').css('color','#b31b1b');
        } else if($word.text().indexOf("InfoSci") >= 0){
            $('i.in').css('color','orange');
        } else if($word.text().indexOf("CDS") >= 0){
            $('i.in').css('color','#470db9');
        }
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay); 
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');
		
		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
		} else if($bool) { 
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		}
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');
        
		if(!$letter.is(':last-child')) { 
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
		} else { 
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	} //End Title Animation
	
	
/*--------------------------------------------------
Function Ajax Expander
---------------------------------------------------*/	

	function AjaxExpander() {
				
		$('.showcase-list li a').on('click', function() {
			$('.showcase-img.active').addClass('on-top');
			$(window).off('scroll')
			var url = $(this).data('url');
			if ($('.showcase-img.on-top').hasClass("light-content")) {
				$('#loader-mask').addClass("light-content");
			}
			$('#main-content').addClass('hidden');
			$('#loader-mask').removeClass('disable');			
			setTimeout(function() {				
				$('#showcase-gallery').addClass('full');					
				setTimeout(function() {
					$('#main-content').addClass('disable');
					setTimeout(function() {
						if ($('.showcase-img.on-top').hasClass("light-content")) {
							$('header').addClass("light-content");
						}
					}, 400);
					$("#main").append('<div id="showcase-height"></div>');
				}, 300);
			}, 150);
			
	
			setTimeout(function() {
				$('#project-holder #project-data').load(url + ' .project-content', function() {
					Shortcodes();
					HeaderColor();
					$('.showcase-img').removeClass('active');
					$('.project-content').waitForImages({
						finished: function() {
							setTimeout(function() {								
								$('#project-holder').addClass('open');
								setTimeout(function() {
									$('html, body').animate({scrollTop : 250},800);
								}, 400);
							}, 100);
							$('#loader-mask').addClass('disable');
							$('#close-project').removeClass('disable');								
						},
						waitForAll: true
					});
				});
			}, 1000);
	
			return false;
		});
	
		$('#close-project').on('click', function() {
			$(this).addClass('disable');
			$('.showcase-img.on-top').addClass('active');
			setTimeout(function() {
				$('#project-holder').removeClass('open');
			}, 200);
			$('html, body').animate({scrollTop : 0},1000);
			
			setTimeout(function() {
				$('.project-content').remove();
						
					setTimeout(function() {
						$('#showcase-gallery').removeClass('full');
						$('header').removeClass('light-content');
						$('#main-content').removeClass('disable');
						$('html, body').animate({ scrollTop: $('#showcase').offset().top },10);					
						$('.showcase-img').removeClass('on-top');
						$('#loader-mask').removeClass("light-content");
						setTimeout(function() {
							$('#main-content').removeClass('hidden');							
							$('#showcase-height').remove();
							$(window).on('scroll', SectionScroll);									
						}, 400);															
					}, 400);
				
			}, 1200);
			
		});

	}// End AjaxExpander
	

/*--------------------------------------------------
Function SectionColor
---------------------------------------------------*/

	function SectionScroll() {	
	
		if ($('body').hasClass("bg-change")) {
			var distance = $('#contact').offset().top;
			
			$(window).scroll(function() {
				if ( $(window).scrollTop() >= distance ) {
						$("#page-content").css('background-color', '#222');
						$("#page-content").addClass('light-content');
					} else {
						$("#page-content").css('background-color', '#fff');
						$("#page-content").removeClass('light-content');
					}
			});
		}
		
		$(window).scroll(function() {    
			var scroll = $(window).scrollTop();		
			if (scroll >= 30) {				
				$(".scroll-down").addClass('disable');				
			} else {								
				$(".scroll-down").removeClass('disable');
			}
		});	
	
	
	}// End SectionColor
	
	
/*--------------------------------------------------
Function Header Color
---------------------------------------------------*/

	function HeaderColor() {			
		
		$(window).scroll(function() {
			
			var scroll = $(window).scrollTop();
			
			if ($('.showcase-img.on-top').hasClass("light-content")) {
				
				if (scroll >= $("#showcase-height").height() - 80) {					
					$('header').removeClass('light-content');
				} else { 
					$('header').addClass('light-content');
				}
			}
			
		});

	}// End Header Color
	
	
	
/*--------------------------------------------------
Function Virtual Scroll
---------------------------------------------------*/

	function VirtualScr() {		
		
		if ($('body').hasClass("virtual-scroll")) {
		
			new SmoothScroll();
	
			function SmoothScroll(el) {
			var t = this, h = document.documentElement;
			el = el || window;
			t.rAF = false;
			t.target = 0;
			t.scroll = 0;
			t.animate = function() {
			t.scroll += (t.target - t.scroll) * 0.1;
			if (Math.abs(t.scroll.toFixed(5) - t.target) <= 0.47131) {
			cancelAnimationFrame(t.rAF);
			t.rAF = false;}
			if (el == window) scrollTo(0, t.scroll);
			else el.scrollTop = t.scroll;
			if (t.rAF) t.rAF = requestAnimationFrame(t.animate);};
			el.onmousewheel = function(e) {
			e.preventDefault();
			e.stopPropagation();
			var scrollEnd = (el == window) ? h.scrollHeight - h.clientHeight : el.scrollHeight - el.clientHeight;
			t.target += (e.wheelDelta > 0) ? -100 : 100;
			if (t.target < 0) t.target = 0;
			if (t.target > scrollEnd) t.target = scrollEnd;
			if (!t.rAF) t.rAF = requestAnimationFrame(t.animate);};
			el.onscroll = function() {
			if (t.rAF) return;
			t.target = (el == window) ? pageYOffset || h.scrollTop : el.scrollTop;
			t.scroll = t.target;};
			}
		
		}
		
	}// End Virtual Scroll
	
	
	
/*--------------------------------------------------
Function Lazy Load
---------------------------------------------------*/

	function LazyLoad() {		
		
		$("html,body").animate({scrollTop: 0}, 1);
		
		setTimeout(function(){
			$('body').removeClass('hidden');
			$('#intro').addClass('animate');
		} , 200 );
		
		setTimeout(function(){
			$('.scroll-down').removeClass('disable');
		} , 600 );
		
		$.fn.smartBackgroundImage = function(url){
		var t = this;
		
		$('<img />')
			.attr('src', url)
			.load(function(){ 
				t.each(function(){ 
					$(this)
						.css('backgroundImage', "url('"+url+"')" )
						.addClass("loaded")
					});
				});
		
			return this;
		 }
		 
		$(".showcase-img:nth-child(1)").each(function() { 
			$(this).smartBackgroundImage($(this).data('src'));					
		});	
		
	
		$('body').waitForImages({
			finished: function() {
				$(".showcase-img").each(function() { 
					$(this).smartBackgroundImage($(this).data('src'));					
				});				
			},
			waitForAll: true
		});
	
	}// End Lazy Load
	
	
	
/*--------------------------------------------------
Function Contact Formular
---------------------------------------------------*/	
		
	function ContactForm() {	
	
		if( jQuery('#contact-formular').length > 0 ){
			$('#contactform').submit(function(){
				var action = $(this).attr('action');
				$("#message").slideUp(750,function() {
					$('#message').hide();
					$('#submit').attr('disabled','disabled');		
					$.post(action, {
						name: $('#name').val(),
						email: $('#email').val(),
						comments: $('#comments').val()
					},
					function(data){
						document.getElementById('message').innerHTML = data;
						$('#message').slideDown('slow');
						$('#contactform img.loader').fadeOut('slow',function(){$(this).remove()});
						$('#submit').removeAttr('disabled');
						if(data.match('success') != null) $('#contactform').slideUp('slow');		
					}
				);		
				});		
				return false;		
			});		
		}

	}//End ContactForm			



/*--------------------------------------------------
Function Shortcodes
---------------------------------------------------*/	
		
	function Shortcodes() {	
		
		// Text Carousel
		if( $('.text-carousel').length > 0 ){		
			$(".text-carousel").owlCarousel({	
				loop:true,
				dots:true,
				dotsEach: 1,
				items:1,
				autoplay:true,
				smartSpeed: 750,
				autoplayHoverPause:true
			});		  
		}
		
		// Appear Item Animation
		$('.has-animation').each(function() {	
			$(this).appear(function() {				
				$(this).delay($(this).attr('data-delay')).queue(function(next){
					$(this).addClass('animate-in');
					next();
				});				 		
			});		
		});	
		
		// Light Box
		if( $('.image-link').length > 0 ){
			$('.image-link').magnificPopup({
				type: 'image',
				mainClass: 'mfp-with-zoom',	
				gallery: {
				  enabled:true
				},		
				zoom: {
					enabled: true, 			
					duration: 300, 
					easing: 'ease-in-out', 
					opener: function(openerElement) {
						return openerElement.is('img') ? openerElement : openerElement.find('img');
					}
				}			
			});
		}
		
		// Slider
		if( $('.slider').length > 0 ){
			$('.slider').owlCarousel({
				loop:true,
				margin:0,
				autoHeight:false,
				nav:true,
				navSpeed: 600,
				items:1,			
			});
		}
				
		// Carousel
		if( $('.carousel').length > 0 ){
			$('.carousel').owlCarousel({
				loop:true,
				autoplay:true,
				margin:20,
				autoHeight:true,
				navSpeed: 600,
				responsive:{
					0:{
						items:1
					},
					479:{
						items:2
					},
					1024:{
						items:3
					},
					1466:{
						items:4
					}
				}
			});
		}
	
	}//End Shortcodes	
	
	