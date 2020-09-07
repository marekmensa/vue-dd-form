<template>
<div class="button-add" @click="click">
  {{ text }}
</div>
</template>

<script>
export default {
  props: ['text'],
  methods: {
    click() {
      this.$emit('add');
    },
  },
  computed: {
  },
};
</script>

<style lang="scss" scoped>
.button-add {
  color: #363636;
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 1px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  border: 1px dashed #e2e2e2;
  transition: .3s;
  cursor: pointer;

  &:hover {
    border: 1px dashed #4cce52;
  }
}
</style>
