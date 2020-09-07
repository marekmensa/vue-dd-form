<template>
  <div class="input-text__wrapper">
    <div class="input-text__description" v-if="label">
      <label class="input-text__label" v-text="label"></label>
    </div>
    <input class="input-text" :value="value" @input="update">
  </div>
</template>
<script>

  export default {
    props: [
      'path',
      'value',
      'description',
    ],
    computed: {
    },
    data() {
      return {
        label: this.description.label,
      };
    },
    components: {
    },
    methods: {
      update(e) {
        this.$emit('change', {
          path: this.path,
          value: e.target.value,
        });
      },
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .input-text {
    outline: none;
    border: 1px solid #d8d8d8;
    background-color: #ffffff;
    height: 40px;
    max-height: 40px;
    display: flex;
    flex-grow: 1;
    padding: 0 10px;
    font-family: inherit;
    border-radius: 0;
    transition: .3s;
    font-size: 16px;
    font-weight: 300;
    color: #000000;
    letter-spacing: 1px;

    &:focus {
      border: 1px solid #797979;
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      position: relative;

    }

    &__description {
      margin-bottom: 10px;
    }

    &__label {
      color: #797979;
      font-size: 16px;
      height: auto;
      font-weight: 300;
      letter-spacing: 0.15px;
      position: relative;

    }
  }
</style>