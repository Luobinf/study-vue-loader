<template>
  <div class="title">{{ title }}</div>
</template>

<script>
console.log("appapp");
export default {
  data() {
    return {
      title: "hello world",
    };
  },
  methods() {},
  mounted() {
    const { title} = this
    console.log('title:', title);
  },
};
</script>

<style scoped lang="less">
#app {
  color: red;
  .title {
    color: skyblue;
    font-size: 30px;
}
}
</style>
