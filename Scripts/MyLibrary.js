const Library = {
	mouseFollower:
		/**
		 * Creates a mouse follower instance.
		 *
		 * @param {HTMLElement} [parent=document.body] The parent element to add follower to.
		 * @param {HTMLElement} [customFollower=null] A custom element to use as the follower.
		 * @returns {Object} The mouse follower instance.
		 */
		function (parent = document.body, customFollower = null) {
			const follower = customFollower || document.createElement("div");

			if (!customFollower) {
				follower.style.cssText = `
      position: absolute;
      left:0;
      top:0;
      z-index:999999;
      width: 20px;
      height: 20px;
      background-color: black;
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%,-50%);
    `;
			}

			parent.appendChild(follower);

			let prevX = 0;
			let prevY = 0;

			const moveListener = (event) => {
				const x = event.pageX;
				const y = event.pageY;

				// Only transform if coordinates have changed
				if (x !== prevX || y !== prevY) {
					gsap.to(follower, {
						x: x,
						y: y,
						ease: Power3,
					});
					prevX = x;
					prevY = y;
				}
			};

			document.addEventListener("mousemove", moveListener);

			return {
				/** The follower element */
				follower,

				/**
				 * Stops the follower from following the mouse.
				 * Removes event listeners and the follower element.
				 */
				stopFollowing() {
					document.removeEventListener("mousemove", moveListener);
					parent.removeChild(follower);
				},
			};
		},
	makeMagnet: function (
		selector,
		distance = 200,
		strength = 0.2,
		animationDuration = 0.2,
		customElement = null
	) {
		/**
		 * Applies a magnet effect to elements with a specified selector, making them slightly move towards the cursor.
		 * @param {string} selector - The CSS selector for the elements to apply the magnet effect to.
		 * @param {number} [distance=200] - The distance within which the magnet effect is active.
		 * @param {number} [strength=0.02] - The strength of the magnet effect.
		 * @param {number} [animationDuration=0.2] - The duration of the animation when elements are pulled.
		 * @param {HTMLElement} [customElement=null] - A custom element to apply the magnet effect to.
		 */

		const magnets = customElement
			? [customElement]
			: document.querySelectorAll(selector);

		magnets.forEach((magnet) => {
			magnet.style.transition = `transform ${animationDuration}s ease-out`;
		});

		document.addEventListener("mousemove", (event) => {
			const mouseX = event.clientX;
			const mouseY = event.clientY;

			magnets.forEach((magnet) => {
				const magnetX =
					magnet.getBoundingClientRect().left + magnet.offsetWidth / 2;
				const magnetY =
					magnet.getBoundingClientRect().top + magnet.offsetHeight / 2;

				const distanceX = mouseX - magnetX;
				const distanceY = mouseY - magnetY;
				const distanceFromCursor = Math.sqrt(distanceX ** 2 + distanceY ** 2);

				if (distanceFromCursor < distance) {
					const translateX = distanceX * strength;
					const translateY = distanceY * strength;

					magnet.style.transform = `translate(${translateX}px, ${translateY}px)`;
				} else {
					magnet.style.transform = "";
				}
			});
		});
	},
	makeMagnetGSAP:
		/**
		 * Applies a magnet effect to elements with a specified selector, making them slightly move towards the cursor.
		 * @param {string} selector - The CSS selector for the elements to apply the magnet effect to.
		 * @param {Object} [options] - Options for customizing the magnet effect.
		 * @param {number} [options.distance=200] - The distance within which the magnet effect is active.
		 * @param {number} [options.strength=0.12] - The strength of the magnet effect.
		 * @param {number} [options.animationDuration=0.2] - The duration of the animation when elements are pulled or settled.
		 * @param {HTMLElement} [customElement=null] - A custom element to apply the magnet effect to.
		 */
		function (
			selector,
			options = {
				distance: 200,
				strength: 0.12,
				animationDuration: 0.2,
			},

			customElement = null
		) {
			const magnets = customElement
				? [customElement]
				: document.querySelectorAll(selector);

			magnets.forEach((magnet) => {
				document.addEventListener("mousemove", (event) => {
					const mouseX = event.clientX;
					const mouseY = event.clientY;

					magnets.forEach((magnet) => {
						const magnetX =
							magnet.getBoundingClientRect().left + magnet.offsetWidth / 2;
						const magnetY =
							magnet.getBoundingClientRect().top + magnet.offsetHeight / 2;

						const distanceX = mouseX - magnetX;
						const distanceY = mouseY - magnetY;
						const distanceFromCursor = Math.sqrt(
							distanceX ** 2 + distanceY ** 2
						);

						if (distanceFromCursor < options.distance) {
							const translateX = distanceX * options.strength;
							const translateY = distanceY * options.strength;

							gsap.to(magnet, {
								x: translateX,
								y: translateY,
								duration: options.animationDuration,
								ease: "power2.out",
							});
						} else {
							gsap.to(magnet, {
								x: 0,
								y: 0,
								duration: options.animationDuration,
								ease: "power2.out",
							});
						}
					});
				});
			});
		},
};

export default Library;
