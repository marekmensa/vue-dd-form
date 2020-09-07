<template>
  <div class="input-checkbox">
    <div class="input-checkbox__description" v-if="label">
      <label class="input-checkbox__label" v-text="label"></label>
    </div>
    <div class="input-checkbox__options">
      <view-tick
        class="input-checkbox__option"
        v-for="(option, key) in options"
        :key="getValue(option)"
        :value="status[key]"
        :path="key"
        :label="getText(option)"
        @change="update(key)"
      ></view-tick>
    </div>
  </div>
</template>
<script>
  import includes from 'lodash/includes';
  import compact from 'lodash/compact';
  import set from 'lodash/set';
  import viewTick from './ViewTick.vue';

  export default {
    data() {
      return {
        label: this.description.label,
        options: this.description.options,
      };
    },
    props: {
      value: {},
      path: {},
      description: {},
    },
    computed: {
      current() {
        return this.value || [];
      },
      status() {
        return this.options.map(val => includes(this.current, this.getValue(val)));
      },
    },
    methods: {
      set,
      includes,
      compact,
      getValue(data) {
        return data.value || data;
      },
      getText(data) {
        return data.text || data;
      },
      update(index) {
        const newStatus = [...this.status];
        newStatus[index] = !newStatus[index];
        this.$emit('change', {
          path: this.path,
          value: compact(newStatus.map((val, i) => (val ? this.getValue(this.options[i]) : null))),
        });
      },
    },
    components: {
      viewTick,
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .input-checkbox {
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
      margin-top: 10px;
    }

    &__option {
      margin-bottom: 10px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
</style>
