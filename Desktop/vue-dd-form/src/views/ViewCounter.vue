<template>
  <div class="input-counter__container">
    <div class="input-counter__description" v-if="label">
      <label class="input-counter__label" v-text="label"></label>
    </div>
    <div class="input-counter__wrapper">
      <input class="input-counter" :value="count" type="text" disabled="disabled">
      <div class="input-counter__handles">
        <div class="input-counter__handle" @click="add">
          <div class="input-counter__icon">+</div>
        </div>
        <div class="input-counter__handle" @click="subtract">
          <div class="input-counter__icon">–</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    props: [
      'path',
      'value',
      'description',
    ],
    data() {
      return {
        count: 0,
        label: this.description.label,
        min: this.description.min,
        max: this.description.max,
      };
    },
    created() {
      this.count = this.value;
      if (this.count < this.min) {
        this.count = this.min;
        this.update();
      }
    },
    computed: {
      biggerThanMin() {
        return !this.min || this.count > this.min;
      },
      smallerThanMax() {
        return !this.max || this.count < this.max;
      },
    },
    methods: {
      add() {
        if (this.count < 99 && this.smallerThanMax) {
          this.count += 1;
          this.update();
        }
      },
      subtract() {
        if (this.count > 0 && this.biggerThanMin) {
          this.count -= 1;
          this.update();
        }
      },
      update() {
        this.$emit('change', {
          path: this.path,
          value: this.count,
        });
      },
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .input-counter {
    outline: none;
    border: 0;
    border: 1px solid #d8d8d8;
    height: 40px;
    display: flex;
    flex-grow: 1;
    padding: 0 10px;
    padding-right: 30px;
    font-family: inherit;
    border-radius: 0;
    transition: .3s;
    font-size: 16px;
    font-weight: 300;
    color: #000000;
    letter-spacing: 1px;
    background-color: #ffffff;
    cursor: default;
    max-width: 100%;
    user-select: none;

    &:focus {
      border: 1px solid #797979;
    }

    &__container {
      display: flex;
      flex-direction: column;
    }

    &__description {
      margin-bottom: 10px;
    }

    &__label {
      color: #797979;
      font-size: 16px;
      font-weight: 300;
      user-select: none;
      letter-spacing: 0.15px;
    }

    &__wrapper {
      position: relative;
      display: flex;
    }

    &__handles {
      position: absolute;
      right: 0;
      width: 24px;
      height: 40px;
      border: 1px solid #e2e2e2;
      background-color: #f9f9f9;
      transition: .3s;
      display: flex;
      flex-direction: column;
    }

    &:focus + &__handles {
      border: 1px solid #797979;
    }

    &__handle {
      height: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #4cce52;
      transition: .3s;
      cursor: pointer;

      &:first-of-type {
        border-bottom: 1px solid #e1e1e1;
      }

      &:hover {
        background-color: #d8d8d8;
      }
    }

    &__icon {
      width: 8px;
      fill: #4cce52;
      height: 20px;
      display: flex;
      align-items: center;
      font-weight: 500;
      user-select: none;
    }
  }
</style>