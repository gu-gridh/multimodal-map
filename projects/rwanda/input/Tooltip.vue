<template>
    <div class="tooltip-wrapper">
        <slot />
        <span :class="tooltipClasses">{{ text }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    position: {
        type: String,
        default: 'top'
    },
})

const tooltipClasses = computed(() => ({
    'tooltip__text': true,
    [`tooltip--${props.position}`]: true
}))
</script>

<style>
.tooltip__text {
    visibility: hidden;
    opacity: 0;
    transition: opacity 1s;
    color: #ffffff;
    text-align: center;
    padding: 5px 0;
    border-radius: 2px;
    min-width: 120px;
    background: #5e5d5d;
    position: absolute;
    z-index: 1;
}

.tooltip-wrapper {
    position: relative;
    display: inline-block;
}

.tooltip-wrapper:hover .tooltip__text{
    visibility: visible;
    opacity: 1;
}

:slotted(*):focus + .tooltip__text {
    visibility: visible;
    opacity: 1;
}

.tooltip--top {
    inset-block-end: 120%;
    inset-inline-start: 50%;
    margin-inline-start: -60px;
}
.tooltip--bottom {
    inset-block-start: 120%;
    inset-inline-start: 50%;
    margin-inline-start: -60px;
}
.tooltip--left {
    inset-block-end: 0%;
    inset-inline-end: 110%;
}
.tooltip--right {
    inset-block-end: 0%;
    inset-inline-start: 110%;
}
</style>