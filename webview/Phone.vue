<template></template>

<script setup lang="ts">
import { useEvents } from '@Composables/useEvents';
import { onMounted, onUnmounted } from 'vue';
import { PhoneEvents } from '../shared/events';

const Events = useEvents();

function handleClose() {
    Events.emitServer(PhoneEvents.toServer.hidePhone);
}

function handleKeyUp() {
    Events.onKeyUp('phoneCloseesc', 27, handleClose);
    Events.onKeyUp('phoneCloseK', 75, handleClose);
}

function handleOffKeyUp() {
    Events.offKeyUp('phoneCloseesc');
    Events.offKeyUp('phoneCloseK');
}

const init = () => {};

onMounted(() => {
    handleKeyUp();
    init();
});

onUnmounted(() => {
    handleOffKeyUp();
});
</script>

<style scoped></style>
