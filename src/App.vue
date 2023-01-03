<script>
import AntimatterDisplay from './components/AntimatterDisplay.vue';
import DimensionsContainer from './components/DimensionsContainer.vue';
import { useGameStore } from './store/store';

export default {
	components: {
		AntimatterDisplay,
		DimensionsContainer
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

		// Create the core gameplay loop
		setInterval(() => {
			this.store.runGameTick(tps)
		}, 1000 / tps);
	}
}
</script>

<template>
	<div id="app-container">
		<AntimatterDisplay />
		<DimensionsContainer />
	</div>
</template>

<style scoped>
	#app-container {
		display: grid;
		grid-template-rows: 10% 10% auto;
		height: 100%;
	}
</style>
