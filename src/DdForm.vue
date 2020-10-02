<template>
  <div class="dd-form">
      <form @submit.prevent="submit">
        <dd-form-view
          class="view--root"
          v-if="values"
          :descriptions="descriptions"
          :data="values"
          :functions="functions"
          :views="views"
          :lang="langValue"
          @change="update"
          @add="emitAdd"
          @remove="emitRemove"
          >
        </dd-form-view>
        <component
            class="button--submit"
            name="button-submit"
            :is="submitButtonComponent"
            :text="langValue['save']">
        </component>
      </form>
  </div>
</template>

<script>

import get from 'lodash/get';
import set from 'lodash/set';
import clone from 'lodash/clone';
import compact from 'lodash/compact';
import includes from 'lodash/includes';
import isUndefined from 'lodash/isUndefined';
import merge from 'lodash/merge';
import { defaultViewValues as defaults } from './config';
import ddFormView from './DdFormView.vue';
import buttonSubmit from './views/ButtonSubmit.vue';

export default {
  props: [
    'descriptions',
    'data',
    'functions',
    'views',
    'lang',
  ],
  data() {
    return {
      values: null,
      langValue: {
        /* default lang */
        add: '+ Add',
        remove: '–',
        drag: '≡',
        save: 'Save',
        /* custom lang */
        ...this.lang,
      },
    };
  },
  created() {
    this.values = clone(this.data) || defaults[this.viewTypes.GROUP];
  },
  computed: {
    submitButtonComponent() {
      return (this.views && this.views['group.button-submit']) || 'button-submit';
    },
  },
  methods: {
    get,
    set,
    compact,
    clone,
    includes,
    isUndefined,
    merge,
    update({ path, value }) {
      set(this.data, path, value);
      this.$emit('change', { path, value, data: this.data });
    },
    submit() {
      this.$emit('submit', { data: this.data });
    },
    emitAdd({ path, value }) {
      this.$emit('add', { path, value, data: this.data });
    },
    emitRemove({ path, value, index }) {
      this.$emit('remove', { path, value, index, data: this.data });
    }
  },
  components: {
    ddFormView,
    buttonSubmit,
  },
};
</script>

<style lang="scss">

  .view {
    display: flex;
    flex-direction: column;
    width: 100%;
    transition: 0.3s width ease;

    &--root {
      margin: 0 70px;
    }
    &--branch {
      margin: 15px 0;
    }
    &--leaf {
      margin: 15px 0;
    }
    &__container--removable {
      position: relative;
    }
    &__wrapper--draggable {
      position: relative;
      .view, .view__container {
        cursor: initial;
      }
      .view__wrapper {
        /* padding: 15px 0; */
      }
      .view__wrapper:hover {
        cursor: move;
      }
    }
    &__container {
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
      transition: .2s;
    }
  }

  .button {
    &--drag {
      position: absolute;
      left: -70px;
      margin-left: 20px;
      transition: visibility 0.2s linear,opacity 0.2s linear;
    }
    &--remove {
      position: absolute;
      right: -70px;
      margin-right: 20px;
      transition: visibility 0.2s linear,opacity 0.2s linear;
    }
    &--add {
      margin-top: 10px;
    }
    &--submit {
      margin-left: 70px !important;
    }
  }

  .headline {
    margin-bottom: 10px;
    width: 100%;
  }

  .ghost {
    background: #f9f9f9;
    div {
      opacity: 0;
    }
  }

  h2 {
    margin: 0;
    margin-top: 25px;
  }

  /* Grid layout classes */
  .col--1-3 {
    width: calc(100% / 3 - 100px);
  }
  .col--2-3 {
    width: calc(2*(100% / 3 - 200px));
  }
  .col--1-2 {
    width: calc(100% / 2);
  }
  .col--1-1 {
    width: calc(100%);
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    &--boxed {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      box-shadow: 0 0 17px rgba(0, 0, 0, 0.1);
      padding: 10px 20px;
    }
  }

  .row-responsive {
      display: flex;
      flex-direction: row;
      @media (max-width: 1023px) {
        flex-direction: column;
      }
  }
</style>
