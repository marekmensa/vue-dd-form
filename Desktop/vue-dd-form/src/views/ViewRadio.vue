<template>
  <div class="input-radio">
    <div class="input-radio__description" v-if="label">
      <label class="input-radio__label" v-text="label"></label>
    </div>
    <div class="input-radio__options">
      <div class="input-radio__option" v-for="(value, key) in options" :key="key">
        <label class="input-radio__option-label">
          <div class="input-radio__radio" :class="{ 'input-radio__radio--checked': getValue(value) === current }"></div>
          <input class="input-radio__input" type="radio" :value="getValue(value)" :checked="getValue(value) === current" @change="update">
          {{ getText(value) }}
        </label>
      </div>
    </div>
  </div>
</template>
<script>
  import get from 'lodash/get';

  export default {
    data() {
      return {
        current: this.value,
        label: this.description.label,
        options: this.description.options,
      };
    },
    props: {
      value: {},
      path: {},
      description: {},
    },
    mounted() {
      this.current = this.value;
    },
    watch: {
      'value': { // eslint-disable-line
        handler() {
          this.current = this.value;
        },
        deep: true,
      },
    },
    methods: {
      get,
      getValue(data) {
        return data.value || data;
      },
      getText(data) {
        return data.text || data;
      },
      update(e) {
        this.current = e.target.value;
        this.$emit('change', {
          path: this.path,
          value: this.current,
        });
      },
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .input-radio {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    &__description {
      margin-bottom: 10px;
    }


    &__label {
      color: #797979;
      height: auto;
      font-size: 16px;
      font-weight: 300;
      letter-spacing: 0.15px;
      position: relative;
      user-select: none;

      &::after {
        color: #ffd012;
        line-height: 1;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(130%, -10%);
      }
    }

    &__options {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }

    &__option {
      margin-bottom: 10px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }

    &__radio {
      width: 24px;
      height: 24px;
      border-radius: 24px;
      border: 1px solid #e2e2e2;
      position: relative;
      margin-right: 15px;
      cursor: pointer;
      flex-shrink: 0;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 13px;
        height: 13px;
        background-color: #4cce52;
        transition: .3s;
        opacity: 0;
        border-radius: 7px;
      }

      &--checked::before {
        opacity: 1;
      }
    }

    &__option-label {
      color: #000000;
      font-size: 16px;
      font-weight: 300;
      letter-spacing: 1px;
      display: flex;
      flex-direction: row;
      align-items: center;
      user-select: none;
      cursor: pointer;
    }

    &__input {
      display: none;
    }

  }
</style>
