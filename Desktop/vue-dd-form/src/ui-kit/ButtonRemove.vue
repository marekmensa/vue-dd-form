<template>
  <transition name="button-remove--is-sliding">
        <div class="button-remove" v-if="show" v-text="text" @click="remove"></div>
  </transition>
</template>

<script>
export default {
  props: ['show', 'text'],
  methods: {
    remove() {
      this.$emit('remove');
    },
  },
};
</script>

<style lang="scss" scoped>

  .button-remove {
    cursor: pointer !important;
    font-weight: 300;
    min-width: 24px;
    border: 1px solid #f0f0f0;
    transition: color 0.3s ease;
    color: #9b9b9b;

    &:hover {
      color: #4cce52;
    }
    &--is-sliding-enter-active {
      animation: slide-in .3s;
    }

    &--is-sliding-leave-active {
      animation: slide-out .3s;
    }
     @keyframes slide-in {
      0% {
        transform: translate(-10%, 0);
        opacity: 0;
      }
      100% {
        transform: translate(0, 0);
        opacity: 1;
      }
    }

    @keyframes slide-out {
      0% {
        transform: translate(0, 0);
        opacity: 1;
      }
      100% {
        transform: translate(-10%, 0);
        opacity: 0;
      }
    }
  }
</style>
