<script>
import AntimatterDisplay from './components/AntimatterDisplay.vue';
import DimensionsContainer from './components/DimensionsContainer.vue';
import TickspeedContainer from './components/TickspeedContainer.vue';
import { useGameStore } from './store/store';

export default {
	components: {
		AntimatterDisplay,
		DimensionsContainer,
		TickspeedContainer
	},

	setup() {
		let store = useGameStore();

		return {
			store
		}
	},
	
	created() {
		// Number of ticks per second
		const tps = 20;

		// Dev boost for testing
		const devBoost = 1000;

		// Create the core gameplay loop
		setInterval(() => {
			this.store.runGameTick(tps / devBoost);
		}, 1000 / tps);

		document.addEventListener("keydown", event => {
			let key = event.key;
			console.log(event);
			
			// Check for numerical dimensions (including shift case)
			if (["1", "2", "3", "4", "5", "6", "7", "8"].includes(key)) {
				this.store.buyDimensionUntil10(parseInt(key));
			} else if ([1, 2, 3, 4, 5, 6, 7, 8].map(num => `Digit${num}`).includes(event.code)) { // Now for the buy-only 1 case, since it involves holding the shift key, affecting the key
				let number = parseInt(event.code[5]);

				this.store.buyDimension(number);
			} else if (key === "t") {
				this.store.buyTickspeed();
			} else if (key === "d") {
				this.store.buyDimboost();
			} else if (key === "g") {
				this.store.buyGalaxy();
			}
		});
	}
}
</script>

<template>
	<div id="app-container">
		<AntimatterDisplay />
		<TickspeedContainer />
		<DimensionsContainer />
	</div>
</template>

<style scoped>
	#app-container {
		display: grid;
		grid-template-rows: 10% 7.5% auto;
		height: 100%;
	}
</style>
