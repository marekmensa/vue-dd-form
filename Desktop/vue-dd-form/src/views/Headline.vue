<template>
  <div class="headline">
    <h2 class="headline__title">
      <slot></slot>
    </h2>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .headline {
    &__title {
      color: #000000;
      font-weight: 300;
      font-size: 28px;
      letter-spacing: -1.09px;

      @media(min-width: 1400px) {
        font-size: 38px;
      }
    }
  }
</style>
<script>
  export default {
  };
</script>
