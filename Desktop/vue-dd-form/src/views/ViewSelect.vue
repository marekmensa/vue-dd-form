<template>
  <div class="input-select__wrapper">
    <div class="input-select__description" v-if="label">
      <div class="input-select__label" v-text="label"></div>
    </div>
    <div class="input-select" :class="{ 'input-select--contrasted' : current }">
      <div class="input-select__option input-select__option--current" :class="{ 'input-select__option--contrasted' : current }" @click="expanded =
      !expanded">
        <span v-if="current">
          {{ mask(current) }}
        </span>
        <span v-else>
          {{ 'Select an option' }}
        </span>
        <icon-expand class="input-select__icon" :class="{ 'input-select__icon--expanded' : expanded }"></icon-expand>
      </div>

      <transition name="input-select__options-wrapper--is-fading">
        <div class="input-select__options-wrapper" :class="{ 'input-select__options-wrapper--contrasted' : current }" v-if="expanded">
          <ul class="input-select__options">
            <li class="input-select__option" :class="{ 'input-select__option--contrasted' : current }" v-text="'Select an option'" @click="choose('')"></li>
            <li class="input-select__option" :class="{ 'input-select__option--contrasted' : current }"
                v-for="(item, key) in options" :key="key" @click="choose(getValue(item))">
              {{ getText(item) }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  import get from 'lodash/get';
  import iconExpand from '../assets/icon-expand.comp.svg';

  export default {
    data() {
      return {
        expanded: false,
        label: this.description.label,
        options: this.description.options,
      };
    },
    props: {
      path: {},
      value: {},
      description: {},
    },
    computed: {
      current: {
        get() {
          return this.value || null;
        },
        cache: false,
      },
    },
    methods: {
      get,
      mask(currentValue) {
        const foundOption = this.options.find(opt =>
        opt.value === currentValue || opt === currentValue);
        return this.getText(foundOption);
      },
      getValue(data) {
        return data.value || data;
      },
      getText(data) {
        return data.text || data;
      },
      choose(item) {
        this.expanded = !this.expanded;
        this.$emit('change', {
          path: this.path,
          value: item,
        });
      },
    },
    components: {
      iconExpand,
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .input-select {
    border: 1px solid #d8d8d8;
    position: relative;
    display: flex;
    color: #000000;
    font-size: 16px;
    font-weight: 300;
    background-color: #ffffff;

    &--contrasted {
      border: 1px solid #4cce52;
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
      font-weight: 300;
      letter-spacing: 0.15px;
      position: relative;

      &::after {
        color: #ffd012;
        line-height: 1;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(130%, -10%);
      }

      &--required::after {
        content: '*';
      }
    }

    &__options-wrapper {
      position: absolute;
      width: calc(100% + 2px);
      left: -1px;
      top: 100%;
      overflow: auto;
      max-height: 200px;
      background-color: #ffffff;
      z-index: 1;
      border: 1px solid #d8d8d8;

      &--contrasted {
        border: 1px solid #4cce52;
      }

      &--is-fading-enter-active {
        animation: fade-in .3s;
      }

      &--is-fading-leave-active {
        animation: fade-out .3s;
      }
    }

    &__options {
      list-style: none;
      margin: 0;
      padding: 0;
      display: block;
    }

    &__option {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 10px;
      transition: .3s;
      margin: 0;
      cursor: pointer;

      &--current {
        justify-content: space-between;
      }
      &--contrasted:hover {
        &:not(&--current) {
          background-color: #4cce52;
        }
      }

      &:not(&--current) {
        &:hover {
          background-color: #d8d8d8;
          color: #ffffff;
        }
      }
    }

    &__icon {
      flex-shrink: 0;
      margin-left: 10px;
      transition: .3s;
      transform: translate(0, -25%) rotate(0deg);

      &--expanded {
        transform: translate(0, -25%) rotate(180deg);
      }
    }

    @keyframes fade-in {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes fade-out {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
</style>
