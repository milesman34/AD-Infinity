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

		// Create the core gameplay loop
		setInterval(() => {
			this.store.runGameTick(tps / 20);
		}, 1000 / tps);
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
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
