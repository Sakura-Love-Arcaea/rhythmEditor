<template>
    <div id="output" ref="output"></div>
</template>

<script setup>
import { onMounted, useTemplateRef } from "vue";
import Chart from "../Chart.js";

import { Stave, StaveNote, Beam, Formatter, Renderer, TabStave, Tuplet } from "vexflow";

const div = useTemplateRef("output");

onMounted(() => {
    console.log(div);
    div.value.style.border = "1px solid red";
    const renderer = new Renderer(div.value, Renderer.Backends.SVG);
    renderer.resize(window.innerWidth, 370);
    const context = renderer.getContext();

    const chart = new Chart(renderer, context);
    chart.addStave(400); // 1. 有音符然後自動加小節
    chart.addStave(400); // 2. 先開新的小節，再加音符
    chart.addStave(400);
    chart.addStave(400);
    chart.addStave(400);
    chart.addStave(400);

    chart.render();

    const debounce = (fn, delay) => {
        let timer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        };
    };

    window.onresize = debounce(() => {
        renderer.resize(window.innerWidth, 370);
        chart.render();
    }, 10);
});

</script>

<style lang="scss" scoped>
#output {
    width: 1200px;
    height: 370px;
    border: 1px solid red;
}
</style>
