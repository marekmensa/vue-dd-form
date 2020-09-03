<template>
  <div class="input-datetime__wrapper">
    <div class="input-datetime__description" v-if="label">
      <label class="input-datetime__label" v-text="label"></label>
    </div>
    <div class="input-datetime">
      <datetime v-model="current" @input="update" :min-datetime="min" :max-datetime="max" :type="'date'" :phrases="phrases"></datetime>
      <datetime v-model="current" @input="update" :min-datetime="min" :max-datetime="max" :type="'time'" :phrases="phrases" :minute-step="5"></datetime>
    </div>
  </div>
</template>
<script>
import get from 'lodash/get';
import clone from 'lodash/clone';
import moment from 'moment';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

export default {
  data() {
    return {
      current: '',
      phrases: {
        ok: 'Confirm',
        cancel: 'Cancel',
      },
      label: this.description.label,
      min: this.description.min,
      max: this.description.max,
    };
  },
  created() {
    this.current = this.stringify(clone(this.dateFormat));
  },
  props: ['path', 'value', 'description'],
  computed: {
    dateFormat() {
      if (this.description.view !== 'datetime') return null;
      let date = clone(this.value);
      /* String value polyfill */
      if (typeof this.value === 'string') date = Date(date);
      /* Firebase Timestamp polyfill */
      if (this.value.seconds) date = date.toDate();
      return date;
    },
  },
  methods: {
    get,
    stringify(date) {
      return date.toISOString();
    },
    update(date) {
      if (date) {
        this.$emit('change', {
          path: this.path,
          value: moment(date).toDate(),
        });
      }
    },
  },
  components: {
    Datetime,
  },
};
</script>
<style lang="scss" rel="stylesheet/scss">

.vdatetime-popup__title,
.vdatetime-month-picker__item--selected,
.vdatetime-year-picker__item--selected,
.vdatetime-time-picker__item--selected 
{
  color: #4cce52 !important;
}

.vdatetime-calendar__month__day--selected {
  & > span > span,
  &:hover > span > span {
    background: #4cce52 !important;
  }
}

.vdatetime-calendar__navigation,
.vdatetime-time-picker__item,
.vdatetime-popup__actions  {
  font-weight: 300;
}

.vdatetime-calendar__month__weekday {
  font-weight: 400;
}

.vdatetime-popup__actions {
  margin-top: 15px;
  &__button {
    color: #000000;
    &:hover {
      color: #4cce52;
    }
  }
}

.vdatetime-overlay {
  background: transparent;
}

.vdatetime-popup {
  font-family: 'Open Sans', sans-serif;
  position: absolute;
  top: 77.5px;
  left: auto;
  transform: none;
  &__header {
    background: #4cce52 !important;
  }
}

.vdatetime {
  width: calc(50% - 15px);
}

.input-datetime {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;

  input {
    outline: none;
    border: 1px solid #d8d8d8;
    background-color: #ffffff;
    height: 40px;
    width: 100%;
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