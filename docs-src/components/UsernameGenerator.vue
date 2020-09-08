<template>
  <div class="input-text__wrapper">
    <div class="input-text__description" v-if="header">
      <label class="input-text__label" v-text="header"></label>
    </div>
    <input class="input-text" :value="value" :disabled="disabled" @focus="generate" @input="update" />
  </div>
</template>
<script>
export default {
  props: ['path', 'value', 'description'],
  computed: {},
  data() {
    return {
      disabled: false,
      header: this.description.header,
    };
  },
  components: {},
  methods: {
    generate() {
      this.disabled = true;
      this.update({ target: { value: null } }, 'Please wait...');
      setTimeout(() => {
        const names = ['Apple','Banana','The','Orange','House','Boat','Lake','Car','Andy'];
        const random = Math.floor(Math.random() * names.length);
        this.update({ target: { value: null } }, names[random]);
      }, 500);
    },
    update(e, value) {
      this.$emit('change', {
        path: this.path,
        value: e.target.value || value,
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
  transition: 0.3s;
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
    background: #43b984;
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg');
    background-position-y: -105px;
    background-position-x: -355px;
    padding: 10px 15px 20px;
  }

  &__description {
    margin-bottom: 10px;
  }

  &__label {
    color: white;
    font-size: 16px;
    height: auto;
    font-weight: 300;
    letter-spacing: 0.15px;
    position: relative;
  }
}
</style>