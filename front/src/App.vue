<template>
<h1>{{posts}}</h1>
  <!--
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  -->
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
export default {
  data() {
    return {
      posts: [],
    };
  },

  methods: {
    async getData() {
      try {
        fetch('/api')
        .then(response => response.json())
        .then(data => this.posts = data.msg)
      } catch (error) {
        console.log(error);
      }
    },
  },

  created() {
    this.getData();
  },
};
// export default {
//   name: 'App',
//   components: {
// //    HelloWorld
//   },
//   data() {
//     return {
//       somevariable: 42
//     }
//   }
// }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
