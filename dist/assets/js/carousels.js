/*
 * Sahifa vidjetlari va karusellar (jQuery + Owl Carousel).
 * footer.html da main.js dan keyin ulanadi. Avval bular HTML ichida inline <script> edi;
 * CSP (script-src) yoqilgan muhitda ishlashi uchun alohida faylga ko'chirildi.
 * Har bir blok faqat kerakli element sahifada bo'lsa ishlaydi.
 */

// ---- Karusellar (avval footer.html ichida inline edi) ----
$(function () {
	if ($('.example-carousel').length) {
		$('.example-carousel').owlCarousel({
			loop: true,
			autoplay: true,
			nav: false,
			dots: false,
			center: true,
			margin: 16,
			responsive: {
				0: {
					items: 1
				},
				360: {
					items: 2
				}
			}
		});
	}

	if ($('.alumni-main-stories-list').length) {
		const stories = $('.alumni-main-stories-list');

		stories.owlCarousel({
			loop: true,
			center: true,
			autoWidth: true,
			margin: -180,
			nav: false,
			dots: true,
			smartSpeed: 600,
			autoplay: true,
			autoplayTimeout: 4000,
			autoplayHoverPause: true,
			mouseDrag: false,
			touchDrag: false,
			items: 8
		});

		// swipe / drag always moves exactly one card
		let startX = null;
		stories.on('pointerdown', function (e) {
			startX = e.originalEvent.clientX;
		});
		$(document).on('pointerup pointercancel', function (e) {
			if (startX === null) return;
			const dx = e.originalEvent.clientX - startX;
			startX = null;
			if (Math.abs(dx) < 40) return;
			stories.trigger(dx < 0 ? 'next.owl.carousel' : 'prev.owl.carousel');
		});
		stories.on('dragstart', 'img', function (e) {
			e.preventDefault();
		});
	}

	if ($('.about-section-carousel').length) {
		$('.about-section-carousel').owlCarousel({
			loop: true,
			autoplay: false,
			nav: false,
			dots: false,
			center: true,
			margin: 24,
			autoWidth: true,
			items: 8
		});
	}
});

$(document).ready(function () {
	const owl = $('.events-carousel');

	owl.owlCarousel({
		loop: false,
		margin: 20,
		nav: false,
		dots: false,
		smartSpeed: 600,

		responsive: {
			0: {
				items: 1.2
			},

			600: {
				items: 2.2
			},

			1000: {
				items: 3.2
			}
		}
	});

	$('.custom-next').on('click', function (e) {
		e.preventDefault();

		owl.trigger('next.owl.carousel');
	});

	$('.custom-prev').on('click', function (e) {
		e.preventDefault();

		owl.trigger('prev.owl.carousel');
	});
});



const eventsCarousel = $('.carousel-section-wrapper');

eventsCarousel.owlCarousel({
	loop: true,
	center: true,
	margin: 12,
	nav: false,
	dots: false,
	smartSpeed: 4000,
	autoWidth: true,
	mouseDrag: true,
	touchDrag: true,

	responsive: {
		0: {
			autoWidth: false,
			items: 1
		},

		576: {
			autoWidth: true,
			items: 1
		}
	}
});


$('.carousel-prev').on('click', function (e) {
	e.preventDefault();
	eventsCarousel.trigger('prev.owl.carousel', [800]);
});

$('.carousel-next').on('click', function (e) {
	e.preventDefault();
	eventsCarousel.trigger('next.owl.carousel', [600]);
});

$('.partners-section-wrapper').owlCarousel({
	loop: true,
	autoWidth: true,
	margin: 16,
	nav: false,
	dots: false,
	autoplay: false,
	mouseDrag: false,
	touchDrag: false,
	pullDrag: false
})

// ---- Sidebar dropdown (avval sidebar.html ichida inline edi) ----

document.addEventListener('DOMContentLoaded', function () {
	const dropdownItems = document.querySelectorAll(
		'.sidebar__list--item.has-dropdown'
	);

	// Ichki sahifaga o'tganda shu sahifaga tegishli dropdown ochiq tursin
	const currentPage = location.pathname.split('/').pop() || 'index.html';

	dropdownItems.forEach(item => {
		item.querySelectorAll('.sidebar__dropdown--item').forEach(sub => {
			const link = sub.querySelector('.sidebar__dropdown--link');
			const href = (link?.getAttribute('href') || '').split(/[?#]/)[0].split('/').pop();

			if (href && href === currentPage) {
				sub.classList.add('active');
			}

			if (sub.classList.contains('active')) {
				item.classList.add('open');
			}
		});
	});

	dropdownItems.forEach(item => {
		const button = item.querySelector('.sidebar__button');

		button.addEventListener('click', function (e) {
			e.preventDefault();

			const isOpen = item.classList.contains('open');

			dropdownItems.forEach(otherItem => {
				otherItem.classList.remove('open');
			});

			if (!isOpen) {
				item.classList.add('open');
			}
		});
	});
});

// ---- Experience tablari (avval experience.html ichida inline edi) ----

document.querySelectorAll('.experience-tab').forEach(tab => {
	const btns = tab.querySelectorAll('.experience-tab-btn');
	const contents = tab.querySelectorAll('.experience-tab-content');

	btns.forEach(btn => {
		btn.addEventListener('click', () => {
			btns.forEach(b => b.classList.remove('active'));
			contents.forEach(c => c.classList.remove('active'));

			btn.classList.add('active');
			tab.querySelector(`[data-content="${btn.dataset.tab}"]`).classList.add('active');
		});
	});
});

// ---- News view karuseli (avval news-view.html ichida inline edi) ----

function showNewsImage(src) {
	if (!src) return;
	$('#news-main-img').attr('src', src);
	$('.news-view-img-link').attr('href', src);
	$('.news-view-img').css('--news-img', 'url("' + src + '")');
	$('.news-view-carousel-link').each(function () {
		$(this).toggleClass('active', $(this).find('img').attr('src') === src);
	});
}

// The main image follows the carousel: whichever thumbnail is first in view while it plays and slides is shown on top.
$('.news-view-carousel')
	.on('initialized.owl.carousel translated.owl.carousel', function (e) {
		const first = $(e.target).find('.owl-item').eq(e.item.index);
		showNewsImage(first.find('img').attr('src'));
	})
	.owlCarousel({
		autoWidth: true,
		margin: 12,
		nav: false,
		smartSpeed: 600,
		dots: false,
		loop: true,
		autoplay: true
	});

// Thumbnails (carousel or the static pair) swap the main image; the main image opens the whole set in the lightbox.
$('.news-view-carousel-link').on('click', function (e) {
	e.preventDefault();
	showNewsImage($(this).find('img').attr('src'));
});

$('.news-view-img-link').on('click', function (e) {
	const links = $('.news-view-carousel-link').not('.cloned .news-view-carousel-link');
	if (!links.length || !window.Fancybox) return;
	e.preventDefault();
	const sources = links.map(function () { return $(this).attr('href'); }).get();
	const start = Math.max(0, sources.indexOf($('#news-main-img').attr('src')));
	window.Fancybox.show(sources.map(function (src) { return { src: src, type: 'image' }; }), { startIndex: start, Hash: false });
});
