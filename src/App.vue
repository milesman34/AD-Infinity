<script>
import AntimatterDisplay from './components/AntimatterDisplay.vue';
import BuyMaxButton from './components/BuyMaxButton.vue';
import DimensionsContainer from './components/DimensionsContainer.vue';
import SacrificeButton from './components/SacrificeButton.vue';
import TickspeedContainer from './components/TickspeedContainer.vue';
import { useGameStore } from './store/store';

export default {
	components: {
		AntimatterDisplay,
		BuyMaxButton,
		DimensionsContainer,
		SacrificeButton,
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
		const devBoost = 1;

		// Create the core gameplay loop
		setInterval(() => {
			this.store.runGameTick(tps / devBoost);
		}, 1000 / tps);

		document.addEventListener("keydown", event => {
			let key = event.key;
			
			// Check for numerical dimensions (including shift case)
			if (["1", "2", "3", "4", "5", "6", "7", "8"].includes(key)) {
				this.store.buyDimensionUntil10(parseInt(key));
			} else if ([1, 2, 3, 4, 5, 6, 7, 8].map(num => `Digit${num}`).includes(event.code)) { // Now for the buy-only 1 case, since it involves holding the shift key, affecting the key
				let number = parseInt(event.code[5]);

				this.store.buyDimension(number);
			} else if (key === "T") {
				this.store.buyTickspeed();
			} else if (key === "t") {
				this.store.buyMaxTickspeed();
			} else if (key === "d") {
				this.store.buyDimboost();
			} else if (key === "g") {
				this.store.buyGalaxy();
			} else if (key === "m") {
				this.store.buyMax();
			} else if (key === "s") {
				this.store.dimensionalSacrifice();
			}
		});
	}
}
</script>

<template>
	<div id="app-container">
		<AntimatterDisplay />
		<TickspeedContainer />

		<div id="buymax-container">
			<SacrificeButton />
			<BuyMaxButton />
		</div>

		<DimensionsContainer />
	</div>
</template>

<style scoped>
	#app-container {
		display: grid;
		grid-template-rows: 10% 7.5% 7.5% auto;
		height: 100%;
	}

	#buymax-container {
		grid-row: 3;

		display: flex;
		flex-direction: row;

		justify-content: center;
		align-items: center;
	}
</style>
