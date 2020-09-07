<template>
  <button class="button">
    {{ text }}
  </button>
</template>
<script>
  export default {
    props: [
      'text',
    ],
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 0;
    box-shadow: 0 2px 17px rgba(0, 0, 0, 0.11);
    background-color: #58d365;
    color: #ffffff;
    font-size: 16px;
    font-weight: 300;
    transition: .3s;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    border-radius: 0;
    position: relative;
    flex-shrink: 0;
    margin: 25px 0;
    width: 270px;
    height: 60px;
    padding: 0 40px;

    @media (min-width: 768px) {
      font-size: 14px;
    }

    @media (min-width: 1400px) {
      font-size: 16px;
    }

    &:hover {
      box-shadow: 0 0 0 rgba(0, 0, 0, 0);
      background-color: #4db352;
    }
  }
</style>
