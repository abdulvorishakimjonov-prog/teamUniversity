function initCounterAnimation() {
	const targets = document.querySelectorAll('[data-count]')
	if (!targets.length || typeof IntersectionObserver === 'undefined') return

	const time = 2000
	const items = new Map()
	let rafId = null

	const stop = () => {
		if (rafId) cancelAnimationFrame(rafId)
		rafId = null
	}

	const loop = (t) => {
		const now = t || performance.now()

		items.forEach((state, el) => {
			if (state.start == null) state.start = now

			const p = Math.min((now - state.start) / time, 1)
			const eased = 1 - Math.pow(1 - p, 3)
			const v = Math.floor(eased * state.target)

			if (v !== state.prev) {
				el.textContent = v
				state.prev = v
			}

			if (p >= 1) items.delete(el)
		})

		if (!items.size) return stop()

		rafId = requestAnimationFrame(loop)
	}

	const start = el => {
		const target = +el.dataset.count
		if (Number.isNaN(target)) return

		items.set(el, { start: null, prev: -1, target })

		if (rafId === null) rafId = requestAnimationFrame(loop)
	}

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return
			start(entry.target)
			observer.unobserve(entry.target)
		})
	})

	targets.forEach(el => observer.observe(el))

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) stop()
		else if (items.size && rafId === null) {
			rafId = requestAnimationFrame(loop)
		}
	})
}


function switchToTab(i, tabButtons, tabPanels) {
	if (i < 0 || i >= tabButtons.length || i >= tabPanels.length) return

	if (tabButtons[i].classList.contains('active')) return

	tabButtons.forEach(button => button.classList.remove('active'))
	tabButtons[i].classList.add('active')

	// Show the target panel first to prevent document height collapse
	if (tabPanels[i]) tabPanels[i].hidden = false
	tabPanels.forEach((panel, index) => {
		if (index !== i) panel.hidden = true
	})

}

const toggleMenu = () => {
	const menu = document.querySelector('.menu')

	if (!menu) return

	document.body.classList.toggle('sidebar-open')
	menu.classList.toggle('active')
}

function toggleSearch() {
	const searchBtn = document.querySelector('.header__search--btn')
	const searchWrapper = document.querySelector('.header__search--wrapper')
	const headerMenu = document.querySelector('.header__menu')
	const headerLang = document.querySelector('.header__lang')

	if (!searchWrapper || !searchBtn || !headerMenu || !headerLang) return

	searchWrapper.classList.toggle('active')

	if (headerMenu) {
		headerMenu.classList.toggle('hidden')
	}

	if (headerLang) {
		headerLang.classList.toggle('hidden')
	}

	if (searchWrapper.classList.contains('active')) {
		searchBtn.setAttribute('aria-expanded', 'true')
	} else {
		searchBtn.setAttribute('aria-expanded', 'false')
	}
}

function initTabSwitching() {
	const tabNavigations = document.querySelectorAll('.tab-navigation')

	tabNavigations.forEach(navigation => {
		const system = navigation.querySelector('.tab-button')?.dataset?.tabSystem

		if (!system) return

		const tabButtons = navigation.querySelectorAll(
			`[data-tab-system="${system}"]`
		)
		const tabPanels = document.querySelectorAll(
			`.tab-panel[data-tab-system="${system}"]`
		)
		const availableTabs = Math.min(tabButtons.length, tabPanels.length)

		if (!availableTabs) return

		tabButtons.forEach((button, index) => {
			button.addEventListener('click', e => {
				e.preventDefault()

				if (index >= availableTabs) return

				switchToTab(index, tabButtons, tabPanels)
				initFaqs()
				button.focus({ preventScroll: true })
			})

			button.addEventListener('keydown', e => {
				let nextIndex = index

				if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
					nextIndex = index > 0 ? index - 1 : availableTabs - 1
					e.preventDefault()
				} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
					nextIndex = index < availableTabs - 1 ? index + 1 : 0
					e.preventDefault()
				} else if (e.key === 'Home') {
					nextIndex = 0
					e.preventDefault()
				} else if (e.key === 'End') {
					nextIndex = availableTabs - 1
					e.preventDefault()
				}

				if (nextIndex !== index && nextIndex < availableTabs) {
					switchToTab(nextIndex, tabButtons, tabPanels)
					initFaqs()
					tabButtons[nextIndex].focus({ preventScroll: true })
				}
			})
		})

		tabPanels.forEach((panel, index) => {
			const nextButton = panel.querySelector('.form--button[type="button"]')

			if (!nextButton) return

			nextButton.addEventListener('click', e => {
				e.preventDefault()

				const activeIndex = [...tabButtons].findIndex(button =>
					button.classList.contains('active')
				)
				const currentIndex = activeIndex >= 0 ? activeIndex : index
				const nextIndex = currentIndex + 1

				if (nextIndex >= availableTabs) return

				switchToTab(nextIndex, tabButtons, tabPanels)
				tabButtons[nextIndex].focus({ preventScroll: true })
			})
		})

		// Keep the tab the page opened on (e.g. ?tab=), else show the first one
		if (![...tabButtons].some(button => button.classList.contains('active'))) {
			switchToTab(0, tabButtons, tabPanels)
		}
	})
}

function initTooltips() {
	if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return

	// Only line-clamped elements marked .tooltip, and only when the text is actually cut
	document.querySelectorAll('[class*="line-clamp-"].tooltip').forEach(el => {
		const isClamped = el.scrollHeight > el.offsetHeight;

		if (isClamped && !el.hasAttribute('data-bs-toggle')) {
			el.setAttribute('data-bs-toggle', 'tooltip');
			el.setAttribute('data-bs-placement', 'bottom');
			el.setAttribute('data-bs-custom-class', 'custom-tooltip');
			el.setAttribute('data-bs-title', el.innerText.trim());

			new bootstrap.Tooltip(el);
		}
	});
}

function handleFaqClick(item, activeState) {
	const active = activeState.current
	if (active && active !== item) {
		active.classList.remove('active')
		const prev = active.querySelector('.answer')
		if (prev) prev.style.maxHeight = '0px'
	}
	const wasActive = item.classList.contains('active')

	item.classList.toggle('active')

	const a = item.querySelector('.answer')

	if (a) {
		a.style.maxHeight = wasActive ? '0px' : a.scrollHeight + 25 + 'px'
	}

	activeState.current = item.classList.contains('active') ? item : null
}

function initFaqs() {
	const items = document.querySelectorAll('.faq-item')
	items.forEach(item => {
		const newItem = item.cloneNode(true)
		item.parentNode.replaceChild(newItem, item)
	})

	let active
	const itemsAfterReset = document.querySelectorAll('.faq-item')
	itemsAfterReset.forEach(item => {
		item.classList.remove('active')
		const answer = item.querySelector('.answer')
		if (answer) answer.style.maxHeight = '0px'
	})
	const first = [...itemsAfterReset].find(item => !item.classList.contains('no-active'))
	if (!first) return

	first.classList.add('active')

	const firstAnswer = first.querySelector('.answer')
	if (firstAnswer) {
		firstAnswer.style.transition = 'none'
		firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px'
		firstAnswer.offsetHeight
		firstAnswer.style.transition = ''
	}

	active = first

	const activeState = { current: active }

	itemsAfterReset.forEach(item => {
		item.addEventListener('click', () => handleFaqClick(item, activeState))
	})
}

function initAos() {
	if (typeof AOS === 'undefined' || !AOS.init) return

	AOS.init({
		disable: window.innerWidth < 768,
		once: true,
		duration: 400
	})
}

function initPhoneMask() {
	if (typeof IMask === 'undefined') return

	const inputs = document.querySelectorAll('input[type="tel"]')
	inputs.forEach(input => {
		IMask(input, {
			mask: '+998 00-000-00-00',
			lazy: false
		})
	})
}



function initHeroLangDropdown() {
	const dropdowns = document.querySelectorAll('.hero-lang')

	dropdowns.forEach(dropdown => {
		const btn = dropdown.querySelector('.hero-lang-btn')
		const list = dropdown.querySelector('.hero-lang-list')

		if (!btn || !list) return

		const closeDropdown = () => {
			dropdown.classList.remove('active')
			btn.setAttribute('aria-expanded', 'false')
			list.classList.remove('active')
		}

		const openDropdown = () => {
			dropdown.classList.add('active')
			btn.setAttribute('aria-expanded', 'true')
			list.classList.add('active')
		}

		const toggleDropdown = () => {
			if (dropdown.classList.contains('active')) {
				closeDropdown()
			} else {
				openDropdown()
			}
		}

		btn.addEventListener('click', e => {
			e.preventDefault()
			e.stopPropagation()
			toggleDropdown()
		})

		document.addEventListener('click', e => {
			if (!dropdown.contains(e.target)) {
				closeDropdown()
			}
		})

		dropdown.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				e.preventDefault()
				closeDropdown()
				btn.focus()
			}
		})
	})
}

function initShop() {
	const root = document.querySelector('.shop')
	if (!root) return

	const KEY_CART = 'shopCart'
	const KEY_LIKES = 'shopLikes'
	const store = {
		get(key) {
			try { return JSON.parse(localStorage.getItem(key)) || [] } catch (e) { return [] }
		},
		set(key, value) {
			try { localStorage.setItem(key, JSON.stringify(value)) } catch (e) { /* storage unavailable */ }
		}
	}
	const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' UZS'
	const itemData = el => ({
		id: el.dataset.id,
		name: el.dataset.name,
		price: Number(el.dataset.price),
		img: el.dataset.img,
		url: el.dataset.url,
		size: el.querySelector('[data-shop-sizes] .is-active')?.textContent.trim() || el.querySelector('[data-shop-sizes] button')?.textContent.trim() || ''
	})
	// Templates pass full paths and URLs; the static pages pass a file name from ./images.
	const imgSrc = img => (img && img.includes('/') ? img : `./images/${img}`)
	const viewUrl = item => item.url || 'shop-view.html'
	const checkoutUrl = root.dataset.shopCheckout || 'shop-inner.html'
	const iconDir = root.dataset.shopIcons || './images/'
	const shopIcon = `${iconDir}shop.svg`
	const qtyOf = el => {
		const value = el.querySelector('[data-shop-qty] [data-value]')
		return value ? Math.max(1, Number(value.textContent) || 1) : 1
	}

	const heartIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 20.5s-7.3-4.5-9.3-9C1.3 8.2 3 4.8 6.4 4.8c1.9 0 3.5 1 4.4 2.5l1.2 1.9 1.2-1.9c.9-1.5 2.5-2.5 4.4-2.5 3.4 0 5.1 3.4 3.7 6.7-2 4.5-9.3 9-9.3 9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
	const trashIcon = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
	const lorem = 'Lorem ipsum dolor sit amet consectetur. Euismod lectus nisl urna nascetur consequat suscipit praesent donec rhoncus. Vitae lobortis scelerisque eget integer. Amet euismod arcu morbi dui.'

	const cardHtml = item => `
		<div class="shop-card" data-shop-item data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}" data-url="${item.url || ''}">
			<div class="shop-card-image">
				<a href="${viewUrl(item)}"><img src="${imgSrc(item.img)}" alt="${item.name}"></a>
				<button type="button" class="shop-like is-active" data-shop-like aria-label="Remove from wishlist">${heartIcon}</button>
			</div>
			<div class="shop-card-body">
				<a href="${viewUrl(item)}" class="shop-card-name subtitle5 slate900">${item.name}</a>
				<p class="shop-card-price body3 blue900">${fmt(item.price)}</p>
				<div class="shop-sizes" data-shop-sizes>
					<span class="shop-sizes-label">Size:</span>
					<button type="button" class="is-active">S</button>
					<button type="button">M</button>
					<button type="button">L</button>
					<button type="button">XL</button>
				</div>
				<div class="shop-card-actions">
					<div class="shop-qty" data-shop-qty>
						<button type="button" data-minus aria-label="Decrease"><img src="${iconDir}minus.svg" alt=""></button>
						<span data-value>0</span>
						<button type="button" data-plus aria-label="Increase"><img src="${iconDir}plus.svg" alt=""></button>
					</div>
					<a href="${checkoutUrl}" class="shop-buy" data-shop-buy>Buy<span class="shop-buy-icon"><img src="${shopIcon}" alt=""></span></a>
				</div>
			</div>
		</div>`

	const updateBadges = () => {
		const likes = store.get(KEY_LIKES).length
		const cart = store.get(KEY_CART).reduce((sum, i) => sum + i.qty, 0)
		document.querySelectorAll('[data-shop-likes-count]').forEach(el => { el.textContent = likes; el.hidden = !likes })
		document.querySelectorAll('[data-shop-cart-count]').forEach(el => { el.textContent = cart; el.hidden = !cart })
	}

	const syncLikes = () => {
		const ids = store.get(KEY_LIKES).map(i => i.id)
		root.querySelectorAll('[data-shop-item]').forEach(item => {
			const btn = item.querySelector('[data-shop-like]')
			if (btn) btn.classList.toggle('is-active', ids.includes(item.dataset.id))
		})
	}

	const toggleEmpty = () => {
		const empty = root.querySelector('[data-shop-empty]')
		if (!empty) return
		const list = root.querySelector('[data-shop-grid], [data-shop-wishlist]')
		const visible = list ? list.querySelectorAll('[data-shop-item]:not([hidden])').length : 1
		empty.hidden = visible > 0
	}

	const addToCart = (item, qty) => {
		const cart = store.get(KEY_CART)
		const data = itemData(item)
		const found = cart.find(i => i.id === data.id && (i.size || '') === data.size)
		if (found) found.qty += qty
		else cart.push({ ...data, qty })
		store.set(KEY_CART, cart)
		updateBadges()
	}
	// Buy: the cart takes the quantities chosen on the page (not added on top), at least 1 for the clicked item.
	const setCartFromPage = clicked => {
		const cart = store.get(KEY_CART)
		root.querySelectorAll('[data-shop-item]').forEach(item => {
			const value = item.querySelector('[data-shop-qty] [data-value]')
			let qty = value ? Number(value.textContent) || 0 : 0
			if (item === clicked) qty = Math.max(1, qty)
			if (!qty) return
			const data = itemData(item)
			const found = cart.find(i => i.id === data.id && (i.size || '') === data.size)
			if (found) found.qty = qty
			else cart.push({ ...data, qty })
		})
		store.set(KEY_CART, cart)
		updateBadges()
	}

	// ---- wishlist page ----
	const wishlist = root.querySelector('[data-shop-wishlist]')
	const renderWishlist = () => {
		if (!wishlist) return
		wishlist.innerHTML = store.get(KEY_LIKES).map(cardHtml).join('')
		toggleEmpty()
	}

	// ---- checkout page ----
	const cartList = root.querySelector('[data-shop-cart-list]')
	const totalEl = root.querySelector('[data-shop-total]')
	const updateTotal = () => {
		if (!totalEl) return
		let total = 0
		root.querySelectorAll('.shop-checkout-order-item').forEach(row => {
			const line = row.querySelector('[data-shop-line]')
			const sum = Number(row.dataset.price) * qtyOf(row)
			if (line) line.textContent = fmt(sum)
			total += sum
		})
		totalEl.textContent = fmt(total)
	}
	const renderCart = () => {
		if (!cartList) return
		const cart = store.get(KEY_CART)
		if (cart.length) {
			cartList.innerHTML = cart.map(i => `
				<div class="shop-checkout-order-item" data-shop-item data-id="${i.id}" data-name="${i.name}" data-price="${i.price}" data-img="${i.img}" data-size="${i.size || ''}">
					<img src="${imgSrc(i.img)}" alt="${i.name}">
					<div class="shop-checkout-order-item-text">
						<h6 class="subtitle5 slate900">${i.name}</h6>
						<p class="body8 slate600">${lorem}</p>
						<div class="shop-checkout-order-item-text-row">
							<div class="shop-qty" data-shop-qty>
								<button type="button" data-minus aria-label="Decrease"><img src="${iconDir}minus.svg" alt=""></button>
								<span data-value>${i.qty}</span>
								<button type="button" data-plus aria-label="Increase"><img src="${iconDir}plus.svg" alt=""></button>
							</div>
							<button type="button" class="shop-checkout-order-item-remove" data-shop-remove aria-label="Remove">${trashIcon}</button>
						</div>
					</div>
					<p class="shop-checkout-order-item-price subtitle5 blue900" data-shop-line>${fmt(i.price * i.qty)}</p>
				</div>`).join('')
		}
		updateTotal()
	}

	// ---- search / sort ----
	const grid = root.querySelector('[data-shop-grid]')
	const search = root.querySelector('[data-shop-search]')
	const sort = root.querySelector('[data-shop-sort]')
	const original = grid ? Array.from(grid.children) : []
	const applyFilter = () => {
		if (!grid) return
		const q = search ? search.value.trim().toLowerCase() : ''
		let items = original.slice()
		if (sort && sort.value !== 'default') {
			const dir = sort.value === 'asc' ? 1 : -1
			items.sort((a, b) => (a.dataset.price - b.dataset.price) * dir)
		}
		items.forEach(el => {
			el.hidden = q !== '' && !el.dataset.name.toLowerCase().includes(q)
			grid.appendChild(el)
		})
		toggleEmpty()
	}
	if (search) search.addEventListener('input', applyFilter)
	if (sort) sort.addEventListener('change', applyFilter)

	// ---- clicks ----
	root.addEventListener('click', e => {
		const target = e.target.closest('button, a')
		if (!target) return
		const item = target.closest('[data-shop-item]')

		if (target.matches('[data-minus], [data-plus]')) {
			const value = target.parentElement.querySelector('[data-value]')
			const min = item && item.closest('[data-shop-cart-list]') ? 1 : 0
			const next = Math.max(min, (Number(value.textContent) || 0) + (target.matches('[data-plus]') ? 1 : -1))
			value.textContent = next
			if (item && item.closest('[data-shop-cart-list]')) {
				const cart = store.get(KEY_CART)
				const found = cart.find(i => i.id === item.dataset.id && (i.size || '') === (item.dataset.size || ''))
				if (found) { found.qty = next; store.set(KEY_CART, cart) }
				updateBadges()
				updateTotal()
			}
			return
		}

		if (target.matches('[data-shop-remove]') && item) {
			store.set(KEY_CART, store.get(KEY_CART).filter(i => i.id !== item.dataset.id || (i.size || '') !== (item.dataset.size || '')))
			item.remove()
			updateBadges()
			updateTotal()
			return
		}

		if (target.matches('[data-shop-like]') && item) {
			let likes = store.get(KEY_LIKES)
			if (likes.some(i => i.id === item.dataset.id)) {
				likes = likes.filter(i => i.id !== item.dataset.id)
			} else {
				likes.push(itemData(item))
			}
			store.set(KEY_LIKES, likes)
			if (wishlist) renderWishlist()
			else syncLikes()
			updateBadges()
			return
		}

		if (target.matches('[data-shop-add]') && item) {
			addToCart(item, qtyOf(item))
			target.classList.add('is-added')
			setTimeout(() => target.classList.remove('is-added'), 900)
			return
		}

		if (target.matches('[data-shop-buy]') && item) {
			setCartFromPage(item)
			return
		}

		if (target.matches('[data-shop-thumb]')) {
			const main = root.querySelector('[data-shop-main]')
			if (main) main.src = target.dataset.shopThumb
			root.querySelectorAll('[data-shop-thumb]').forEach(t => t.classList.toggle('is-active', t === target))
			return
		}

		if (target.closest('[data-shop-sizes]')) {
			target.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === target))
		}
	})

	// ---- order form: success means the order has been saved by the server ----
	const form = root.querySelector('[data-shop-form]')
	if (form) {
		const message = form.querySelector('[data-shop-message]')
		let submitting = false
		form.addEventListener('submit', async e => {
			e.preventDefault()
			if (submitting) return
			message.hidden = false
			message.classList.add('is-error')
			if (!form.reportValidity()) { message.textContent = 'Please fill in all fields correctly.'; return }
			const cart = store.get(KEY_CART)
			if (!cart.length) { message.textContent = 'Your cart is empty.'; return }
			submitting = true
			const button = form.querySelector('[type="submit"]')
			button.disabled = true
			const body = new FormData(form)
			body.set('items', JSON.stringify(cart.map(i => ({ id: i.id, size: i.size || '', qty: i.qty }))))
			try {
				const response = await fetch(form.action, { method: 'POST', body, headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
				const result = await response.json()
				if (!response.ok || !result.success) {
					message.textContent = Object.values(result.errors || {}).flat().join(' ') || result.message || 'Unable to place your order. Please try again.'
					if (window.showFormResult(false, message.textContent)) message.hidden = true
					return
				}
				message.classList.remove('is-error')
				message.textContent = result.message || 'Thank you! Your order request has been received.'
				if (window.showFormResult(true, message.textContent)) message.hidden = true
				store.set(KEY_CART, [])
				cartList?.replaceChildren()
				updateTotal()
				updateBadges()
				form.reset()
				const key = form.querySelector('[name="submission_key"]')
				if (key && globalThis.crypto?.randomUUID) { key.value = crypto.randomUUID(); key.defaultValue = key.value }
			} catch {
				message.textContent = 'Unable to place your order. Your cart has been kept. Please try again.'
				if (window.showFormResult(false, message.textContent)) message.hidden = true
			} finally {
				submitting = false
				button.disabled = false
			}
		})
	}

	renderWishlist()
	renderCart()
	syncLikes()
	updateBadges()
	toggleEmpty()
}

function initHeaderScroll() {
	const header = document.querySelector('.header')
	if (!header) return

	const threshold = 30
	let ticking = false
	let lastTop = null

	const update = () => {
		const isTop = window.scrollY <= threshold
		if (isTop === lastTop) return
		lastTop = isTop
		header.classList.toggle('index', isTop)
	}

	update()

	window.addEventListener('scroll', () => {
		if (ticking) return
		ticking = true
		requestAnimationFrame(() => {
			update()
			ticking = false
		})
	}, { passive: true })
}

function initMobileMenu() {
	const root = document.querySelector('#offcanvasMenu .offcanvas-body')
	const source = document.querySelector('.header-menu')
	if (!root || !source) return

	let uid = 0
	const labelOf = el => {
		const span = el.querySelector('span')
		return (span || el).textContent.replace(/\s+/g, ' ').trim()
	}

	const build = (items, level) => {
		const ul = document.createElement('ul')
		ul.className = level === 0 ? 'menu' : 'submenu collapse'
		const item = level === 0 ? 'menu-item' : 'submenu-item'
		const linkClass = level === 0 ? 'menu-link' : 'submenu-link'

		items.forEach(src => {
			const link = src.querySelector(':scope > a, :scope > button, :scope > span')
			if (!link) return
			const sub = src.querySelector(':scope > .header-menu-submenu')
			const children = sub ? sub.querySelectorAll(':scope > .header-menu-submenu-item') : []
			const li = document.createElement('li')
			li.className = item

			if (children.length) {
				const id = 'mobile-submenu-' + (++uid)
				const toggle = document.createElement('span')
				toggle.className = linkClass
				toggle.setAttribute('role', 'button')
				toggle.setAttribute('tabindex', '0')
				toggle.setAttribute('data-bs-toggle', 'collapse')
				toggle.setAttribute('data-bs-target', '#' + id)
				toggle.setAttribute('aria-expanded', 'false')
				toggle.setAttribute('aria-controls', id)
				toggle.append(labelOf(link) + ' ')
				const icon = document.createElement('i')
				icon.className = 'i-dropdown'
				toggle.append(icon)
				toggle.addEventListener('keydown', e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						toggle.click()
					}
				})

				const nested = build(children, level + 1)
				nested.id = id
				li.classList.add(item + '--dropdown')
				li.append(toggle, nested)
			} else {
				// a category without a page is a plain label, not a link
				const a = document.createElement(link.matches('a') ? 'a' : 'span')
				a.className = linkClass
				if (link.matches('a')) a.href = link.getAttribute('href') || '#'
				a.textContent = labelOf(link)
				if (a.getAttribute('href') === '#') {
					a.addEventListener('click', e => e.preventDefault())
				}
				li.append(a)
			}
			ul.append(li)
		})
		return ul
	}

	root.replaceChildren(build(source.querySelectorAll(':scope > .header-menu-item'), 0))
}

function initHeaderSearch() {
	const toggle = document.querySelector('.header-search-toggle')
	const input = document.querySelector('.header-search-input')
	const close = document.querySelector('.header-search-close')
	if (!toggle || !input || !close) return
	const bar = toggle.parentElement
	const [searchIcon, arrowIcon] = toggle.querySelectorAll('i')

	const setOpen = open => {
		bar.classList.toggle('is-searching', open)
		bar.closest('.header')?.classList.toggle('is-searching', open)
		input.hidden = close.hidden = !open
		searchIcon.hidden = open
		arrowIcon.hidden = !open
		if (open) input.focus()
		else input.value = ''
	}

	const submit = () => {
		const query = input.value.trim()
		if (query.length < 2) return input.focus()
		const form = document.createElement('form')
		form.method = 'post'
		form.action = toggle.dataset.action
		for (const [name, value] of [['_token', toggle.dataset.token], ['search', query]]) {
			const field = document.createElement('input')
			field.type = 'hidden'
			field.name = name
			field.value = value
			form.append(field)
		}
		document.body.append(form)
		form.submit()
	}

	const onPress = (el, handler) => {
		el.addEventListener('click', handler)
		el.addEventListener('keydown', e => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				handler()
			}
		})
	}
	onPress(toggle, () => (input.hidden ? setOpen(true) : submit()))
	onPress(close, () => setOpen(false))
	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') submit()
		if (e.key === 'Escape') setOpen(false)
	})
}

function initFancybox() {
	if (!window.Fancybox) return

	// Images inside rich text open in the lightbox too, grouped per text block
	document.querySelectorAll('.content-text img').forEach(img => {
		if (img.closest('a, [data-fancybox]')) return
		const link = document.createElement('a')
		link.href = img.currentSrc || img.src
		link.dataset.fancybox = 'content'
		if (img.alt) link.dataset.caption = img.alt
		img.replaceWith(link)
		link.append(img)
	})

	window.Fancybox.bind('[data-fancybox]', {
		Hash: false,
		Thumbs: { type: 'classic' },
	})
}

function initYoutubeThumbs() {
	// hqdefault.jpg is a 4:3 frame with black bars; maxresdefault.jpg is a clean 16:9 frame. Videos without a
	// max-resolution thumbnail get a 120px placeholder (or an error), so those fall back to mqdefault.jpg (16:9, no bars).
	const fallback = img => {
		if (img.src.includes('/maxresdefault.jpg')) img.src = img.src.replace('/maxresdefault.jpg', '/mqdefault.jpg')
	}
	const missing = img => img.src.includes('/maxresdefault.jpg') && img.naturalWidth > 0 && img.naturalWidth <= 120

	document.querySelectorAll('img[src*="i.ytimg.com"]').forEach(img => {
		if (img.complete && (missing(img) || img.naturalWidth === 0)) fallback(img)
	})
	document.addEventListener('load', e => {
		if (e.target instanceof HTMLImageElement && missing(e.target)) fallback(e.target)
	}, true)
	document.addEventListener('error', e => {
		if (e.target instanceof HTMLImageElement) fallback(e.target)
	}, true)
}

function initFooterYear() {
	const year = document.getElementById('y')
	if (year) year.textContent = new Date().getFullYear()
}

function initFooterBanner() {
	const banner = document.querySelector('.footer-banner')
	// the banner is rendered already visible (data-anim="ready", .is-visible), so there is nothing to animate
	if (!banner || banner.dataset.anim === 'ready' || !('IntersectionObserver' in window)) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	banner.dataset.anim = 'ready'
	// animatsiya banner 30% ko'ringanda boshlanadi
	new IntersectionObserver(entries => {
		entries.forEach(entry => { if (entry.isIntersecting) banner.classList.add('is-visible') })
	}, { threshold: 0.3 }).observe(banner)

	// banner ekrandan butunlay chiqib ketgandagina qayta tiklanadi, shunda tepaga skroll qilib qaytganda animatsiya yana ishlaydi
	new IntersectionObserver(entries => {
		entries.forEach(entry => { if (!entry.isIntersecting) banner.classList.remove('is-visible') })
	}, { threshold: 0 }).observe(banner)

	// sahifa banner joyida ochilgan bo'lsa, observer'ni kutmasdan darrov boshlaymiz
	const rect = banner.getBoundingClientRect()
	if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) banner.classList.add('is-visible')
}

function initEventCalendar() {
	document.querySelectorAll('[data-event-calendar]').forEach(root => {
		const title = root.querySelector('[data-cal-title]')
		const grid = root.querySelector('[data-cal-grid]')
		if (!grid || root.dataset.calReady) return
		root.dataset.calReady = '1'
		const events = new Set((root.dataset.events || '').split(',').map(s => s.trim()).filter(Boolean))
		// always opens on the current month; prev/next browse the rest
		const now = new Date()
		let year = now.getFullYear()
		let month = now.getMonth()
		const locale = document.documentElement.lang || 'en'
		// Monday-first weekday names in the page language (2024-01-01 is a Monday)
		const heads = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleString(locale, { weekday: 'short' }).slice(0, 2))
		const pad = n => String(n).padStart(2, '0')
		const todayKey = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())

		const render = () => {
			const first = new Date(year, month, 1)
			const offset = (first.getDay() + 6) % 7
			const days = new Date(year, month + 1, 0).getDate()
			const key = d => year + '-' + pad(month + 1) + '-' + pad(d)
			const label = first.toLocaleString(locale, { month: 'long', year: 'numeric' })
			if (title) title.textContent = label.charAt(0).toUpperCase() + label.slice(1)

			let html = heads.map(h => '<span class="is-head">' + h + '</span>').join('')
			html += '<span></span>'.repeat(offset)
			for (let d = 1; d <= days; d++) {
				const col = (offset + d - 1) % 7
				const isEvent = events.has(key(d))
				// a range breaks at week rows and at month edges
				const start = isEvent && (col === 0 || d === 1 || !events.has(key(d - 1)))
				const end = isEvent && (col === 6 || d === days || !events.has(key(d + 1)))
				const cls = [isEvent && 'is-event', start && 'is-start', end && 'is-end', key(d) === todayKey && 'is-today'].filter(Boolean).join(' ')
				html += '<span' + (cls ? ' class="' + cls + '"' : '') + '>' + d + '</span>'
			}
			grid.innerHTML = html
		}

		const shift = delta => {
			const d = new Date(year, month + delta, 1)
			year = d.getFullYear()
			month = d.getMonth()
			render()
		}

		root.querySelector('[data-cal-prev]')?.addEventListener('click', () => shift(-1))
		root.querySelector('[data-cal-next]')?.addEventListener('click', () => shift(1))
		render()
	})
}
// ---- form submission result modal: shown after a server redirect, or by AJAX forms ----
function initFormResultModal() {
	const modal = document.querySelector('[data-form-result]')
	if (modal?.hasAttribute('data-form-result-open') && window.bootstrap) bootstrap.Modal.getOrCreateInstance(modal).show()
}

window.showFormResult = function (success, message) {
	const modal = document.querySelector('[data-form-result]')
	if (!modal || !window.bootstrap) return false
	const title = modal.querySelector('[data-form-result-title]')
	const text = modal.querySelector('[data-form-result-text]')
	const p = document.createElement('p')
	p.textContent = message
	modal.querySelector('.modal-content').classList.toggle('is-error', !success)
	modal.querySelector('.modal-content').classList.toggle('is-success', success)
	title.textContent = success ? title.dataset.success : title.dataset.error
	text.replaceChildren(p)
	bootstrap.Modal.getOrCreateInstance(modal).show()
	return true
}

function initAppOnContentLoaded() {
	initCounterAnimation()
	initTabSwitching()
	initFaqs()
	initAos()
	initPhoneMask()
	initHeroLangDropdown()
	initHeaderScroll()
	initMobileMenu()
	initHeaderSearch()
	initFancybox()
	initYoutubeThumbs()
	initFooterYear()
	initFooterBanner()
	initShop()
	initEventCalendar()
	initFormResultModal()
}

function initAppOnFullLoad() {
	initTooltips()
}

window.switchToTabByIndex = function (system, i) {
	const index = Number(i)
	const tabButtons = document.querySelectorAll(
		`.tab-button[data-tab-system="${system}"]`
	)
	const tabPanels = document.querySelectorAll(
		`.tab-panel[data-tab-system="${system}"]`
	)

	if (
		Number.isInteger(index) &&
		index >= 0 &&
		index < tabPanels.length &&
		index < tabButtons.length
	) {
		switchToTab(index, tabButtons, tabPanels)
	}
}

document.addEventListener('DOMContentLoaded', initAppOnContentLoaded)
window.addEventListener('load', initAppOnFullLoad)