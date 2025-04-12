<template>
    <!--    div.control-->
    <div class="control">control</div>
    <div class="item">item</div>
    <Chart2 :eachRow="3" class="chart"></Chart2>
</template>

<script setup>
import Chart2 from "./components/Chart2.vue";
</script>

<style scoped>
.chart {
    width: 80%;
    height: 80%;
    box-sizing: border-box;
    border: red 1px solid;
    padding: 10px;
    position: fixed;
    right: 0;
    bottom: 0;
    overflow: scroll;
}

.control {
    width: 100%;
    height: 20%;
    box-sizing: border-box;
    border: green 1px solid;
    padding: 10px;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
}

.item {
    width: 20%;
    height: 80%;
    box-sizing: border-box;
    border: blue 1px solid;
    padding: 10px;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
}
</style>
