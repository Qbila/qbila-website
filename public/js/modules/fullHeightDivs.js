window.onload = function(){

	// skip height change below certain limit.
	// while viewport height is below 465, keep it 465.
	// while viewport height is more than that, change it to maximum.

	var slideMinHeight = 500;
	var viewPortDimensions;
	var slides = $('.a-slide');

	/**
	 * Onload Functions
	 */
	resizeSlides();
	//refreshCanvas();


	// particles.js implementation
	$(function(){
    var particleJSJson = '/public/js/particles.json';

    if(Qbila.isSmallScreen.matches){
      particleJSJson = '/public/js/particlesSmallScreen.json';
    }

    particlesJS.load(
      'qbila-background',
      particleJSJson,
      function(){}
    );
  });

	window.onresize = function(){
		resizeSlides();
	};

	/**
	 * DOM DEPENDENT FUNCTION DEFINITIONS
	 */

	function resizeSlides() {
		viewPortDimensions = getViewPortDimensions();

		if ( viewPortDimensions.height < slideMinHeight ) {
			// set slideMinHeight
			slides.css({ height: slideMinHeight + 'px' });
			return;
		}

		slides.css({ height: viewPortDimensions.height + 'px' });
		return;
	}


	$(document).on('click', '.b-scrollToElementById', function () {
		var scrollToId = $( "#" + $(this).attr('data-scrollToId') + "" );

		$('html, body').animate({
	        scrollTop: scrollToId.offset().top
	    }, 700);
	});

	$(document).on('click', '.newsClips', function(){
		var imgUrl = $(this).attr('data-clipUrl');
		var newsSource = $(this).siblings('.d-helpText').find('.a-newsSource').text();
		var newsDate = $(this).siblings('.d-helpText').find('.a-newsDate').text();

		$('#pressModal .newsClip').html('<img src="'+imgUrl+'" />');
		$('#pressModal .modal-header .modal-title').html(newsSource + ' <small>' + newsDate + '</small>');

		$('#pressModal').modal('show');
	});

	$(document).on('click', '.a-pressRelease', function(){
		var newsSource = $(this).siblings('.d-helpText').find('.a-newsSource').text();
		var newsDate = $(this).siblings('.d-helpText').find('.a-newsDate').text();

		var releaseId = $(this).attr('data-release');

		$('#htmlModal .modal-header .modal-title').html( newsSource + ' <small>' + newsDate + '</small>' );
		$('#htmlModal .a-htmlWrapper').html( $('#' + releaseId).html() );

		$('#htmlModal').modal('show');
	});

};


function getViewPortDimensions(){
	return {
		height: $(window).height(),
		width: $(window).width()
	};
}

function toNextSlideTop(){
	// slide to top of next slide.
}

function resizeElement(ele, options) {
	ele.css({
			height : options.height,
			width : options.width
		});
}

function scrollToElementById (id) {

}
