<script lang='typescript'>
	let count: number = 0;
	let inc = () => count++;
</script>

<button on:click={inc}>
	clicked {count} times
</button>
