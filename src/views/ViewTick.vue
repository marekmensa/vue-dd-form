<template>
  <label class="input-tick__wrapper">
    <input class="input-tick" type="checkbox" :checked="checked" @change="update">
    <div class="input-tick__icon-wrapper" :class="{ 'input-tick__icon-wrapper--checked' : checked }">
      <icon-check class="input-tick__icon" :class="{ 'input-tick__icon--checked' : checked }"></icon-check>
    </div>
    <div class="input-tick__label" v-if="this.labelValue">
      <h2 class="input-tick__headline">
        <span v-text="this.labelValue"></span>
      </h2>
    </div>
  </label>
</template>
<script>
  import iconCheck from '../assets/icon-check.vue';

  export default {
    props: [
      'path',
      'value',
      'description',
      'label',
    ],
    methods: {
      update() {
        this.checked = !this.checked;
        this.$emit('change', {
          path: this.path,
          value: this.checked,
        });
      },
    },
    data() {
      return {
        checked: this.value,
        labelValue: this.label || this.description.label,
      };
    },
    components: {
      iconCheck,
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .input-tick {
    display: none;

    &__wrapper {
      flex-direction: row;
      display: flex;
    }

    &__icon-wrapper {
      width: 25px;
      height: 25px;
      border: 1px solid #e2e2e2;
      background-color: #ffffff;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &--checked {
        border: 1px solid #4cce52;
      }
    }

    &__icon {
      width: 15px;
      height: auto;
      fill: #e2e2e2;

      &--checked {
        fill: #4cce52;
      }
    }

    &__label {
      margin-left: 15px;
      cursor: pointer;
      user-select: none;

    }

    &__headline {
      color: #000000;
      font-size: 16px;
      font-weight: 300;
      letter-spacing: 1px;
      margin: 0;
    }

    &__link a:link, &__link a:visited {
      color: #4cce52;
      font-weight: 500;
    }

    &__paragraph {
      color: #797979;
      font-size: 13px;
      font-weight: 300;
      letter-spacing: 1px;
      margin: 0em 1px;
    }
  }
</style>