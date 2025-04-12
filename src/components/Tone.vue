<template>
    <div>
        <button @click="playAndStop">{{ isPlaying ? "暫停" : "播放" }}</button>
        <button @click="restart">重新開始</button>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import * as Tone from "tone";

const isPlaying = ref(false);

const synth = new Tone.Synth().toDestination();

const notes = [
    ["0:0:0", "C4"],
    ["0:0:1", "E4"],
    ["0:0:2", "G4"],
    ["0:0:3", "B4"],
    ["0:1:0", "C5"],
    ["0:1:1", "E5"],
    ["0:1:2", "G5"],
    ["0:1:3", "B5"],
    ["0:2:0", "C6"],
    ["0:2:1", "E6"],
    ["0:2:2", "G6"],
    ["0:2:3", "B6"],
];

Tone.getTransport().bpm.value = 120;
const part = new Tone.Part((time, note) => {
    synth.triggerAttackRelease(note, "16n", time);
}, notes).start(0);

Tone.getTransport().schedule(() => {
    Tone.getTransport().stop();
    console.log("stop");
    isPlaying.value = false;
}, "1:0:0");

const restart = () => {
    Tone.getTransport().stop();
    isPlaying.value = false;
};

const playAndStop = () => {
    if (isPlaying.value) {
        Tone.getTransport().pause();
    } else {
        Tone.getTransport().start();
    }
    isPlaying.value = !isPlaying.value;
};

setInterval(() => {
    console.log(".".repeat(Tone.getTransport().ticks / 50));
}, 100);
</script>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* border: #333 solid 1px; */
}

button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

.h1 {
    font-size: 24px;
    color: #333;
    margin: 0;
}
</style>
