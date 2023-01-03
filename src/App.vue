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

		console.log(store.dimensions);

		return {
			store
		}
	},
	
	created() {
		console.log(Decimal.POSITIVE_INFINITY);

		// Create the core gameplay loop
		setInterval(() => {
			// Do something
		}, 50);
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
		grid-template-rows: 10% auto;
		height: 100%;
	}
</style>
