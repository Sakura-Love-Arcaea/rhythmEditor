<template>
    <div ref="vexFlow" id="vexFlow">
        <button @click="addNoteInStave0" class="add">+</button>
        <button @click="removeNoteInStave0" class="remove">-</button>
        <button @click="addStave" class="addStave">++</button>
        <button @click="removeStave" class="removeStave">--</button>
        <!-- 輸入數字 -->
        <input type="number" v-model="staveNum" class="staveNum" />
        <!--（選單：1, 2, 4, 8, 16） -->
        <select v-model="noteDuration" class="noteDuration">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="16">16</option>
        </select>
        <button @click="check" class="check">check</button>
    </div>
</template>

<script setup>
import { onMounted, useTemplateRef, ref, watch, defineProps, computed } from "vue";
import { Stave, Renderer, VexFlow, Formatter, StaveNote, Beam } from "vexflow";
import { myStave, high, low, mid, rest } from "../func.js";

let renderer;
let context;
const el = useTemplateRef("vexFlow");
const staveNum = ref(0);
const noteDuration = ref(4);

onMounted(() => {
    renderer = new Renderer(el.value, Renderer.Backends.SVG);
    context = renderer.getContext();
    render();

    window.addEventListener("resize", re_render);
});

const props = defineProps({
    eachRow: {
        type: Number,
        default: 3,
    },
});

// 測試資料
let bars = [
    {
        timeSignature: "4/4",
        notes: [mid(4), mid(4), mid(4), mid(4)],
    },
    {
        notes: [mid(8), mid(8), mid(8), mid(8), mid(8), mid(8), mid(8), mid(8)],
    },
    {
        notes: [mid(4), mid(4), mid(4), mid(4)],
    },
    {
        notes: [mid(8), mid(16), mid(16), mid(8), mid(8), mid(8), mid(8), mid(4)],
    },
    {
        notes: [mid(8), mid(16), mid(16), mid(8), mid(8), mid(8), mid(8), rest(4)],
    },
    {
        notes: [mid(16), mid(16), mid(8), mid(8), mid(16), mid(16), mid(8), mid(8), rest(4)],
    },
    {
        notes: [
            rest(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
            mid(16),
        ],
    },
    {
        notes: [rest(8), mid(4), mid(8), rest(8), mid(8), rest(8), mid(8)],
    },
];

// 驗證資料報告
const countBar = (bar) => {
    // 把note的時間長度都加起來
    const notes = bar.notes;
    const timeSignature = 1;
    let total = 0;
    for (let i = 0; i < notes.length; i++) {
        total += 1 / Number(notes[i].duration);
    }
    // 如果總長度等於4/4的話就回傳true
    // console.log("總長度", total);
    return total;
};

const check = () => {
    bars.forEach((bar, index) => {
        if (bar.notes) {
            if (countBar(bar) !== 1) {
                console.log(`第${index + 1}小節的音符長度不正確`);
            }
        }
    });
};

/**
 * @description: 這個函數是用來創建一個新的單行譜還有渲染音符，目前使用自動合併beam
 * 對於頭中尾的處理
 *
 */
const render = () => {
    // data
    const render_staves = []; // 用來存放每一個 stave，定位訊息
    const padding_x = 50;
    const padding_y = 10;
    const clefAndTimeWidth = 50;
    const staveWidth = (el.value.clientWidth - padding_x * 2 - clefAndTimeWidth) / props.eachRow;
    const staveHeight = 100;

    // style 1: each row's start with a time signature
    let row = 0,
        col = 0,
        x = padding_x,
        y = padding_y;
    for (let i = 0; i < bars.length; i++) {
        let stave;
        if (col === 0) {
            stave = myStave(x, y, staveWidth + clefAndTimeWidth)
                .addClef("percussion")
                .addTimeSignature(bars[i].timeSignature || "4/4");
            x += staveWidth + clefAndTimeWidth;
            col++;
        } else if (col === props.eachRow - 1) {
            stave = myStave(x, y, staveWidth);
            x = padding_x;
            y += staveHeight;
            col = 0;
            row++;
        } else {
            stave = myStave(x, y, staveWidth);
            x += staveWidth;
            col++;
        }

        render_staves.push(stave);
    }

    // render
    // ready SVG
    context.clear();
    renderer.resize(el.value.clientWidth, (row + 1) * staveHeight + padding_y * 2);

    // render stave
    render_staves.forEach((stave) => {
        stave.setContext(context).draw();
    });

    // render notes
    // bind notes to stave
    for (let i = 0; i < bars.length; i++) {
        if (bars[i].notes && bars[i].notes.length > 0) {
            // 空的話有歧義
            const stave = render_staves[i];
            const notes = bars[i].notes;
            const beams = Beam.generateBeams(notes, {
                maintainStemDirections: true, // 自動生成本來會向下
            });
            Formatter.FormatAndDraw(context, stave, notes);
            beams.forEach((b) => {
                // set up beam
                b.setContext(context).draw();
            });
        }
    }
};

// 功能函數
// debounce
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

const re_render = debounce(() => {
    renderer.resize(el.value.clientWidth, el.value.clientHeight);
    render();
}, 100);

const addStave = () => {
    const stave = {
        notes: [],
    };
    bars.push(stave);
    render();
};

const removeStave = () => {
    if (bars.length > 0) {
        bars.pop();
        render();
    }
    if (staveNum.value > bars.length - 1) {
        staveNum.value = bars.length - 1;
    }

    render();
};

const addNoteInStave0 = () => {
    while (staveNum.value < bars.length && countBar(bars[staveNum.value]) >= 1) {
        staveNum.value++;
    }
    if (staveNum.value >= bars.length) {
        addStave();
    }
    bars[staveNum.value].notes.push(mid(noteDuration.value));
    // check
    if (countBar(bars[staveNum.value]) > 1) {
        // 未處理插入導致過長(invalid)
        console.log(`未處理插入導致過長`);
        staveNum.value++;
        addStave();
    } else if (countBar(bars[staveNum.value]) === 1) {
        staveNum.value++;
        addStave();
    }
    render();
};

const removeNoteInStave0 = () => {
    if (bars[staveNum.value].notes.length === 0) {
        staveNum.value--;
    }
    bars[staveNum.value].notes.pop();
    render();
};
</script>

<style scoped>
.add {
    position: fixed;
    right: 150px;
    bottom: 50px;
    width: 50px;
    height: 50px;
}

.remove {
    position: fixed;
    right: 50px;
    bottom: 50px;
    width: 50px;
    height: 50px;
}

.addStave {
    position: fixed;
    right: 250px;
    bottom: 50px;
    width: 50px;
    height: 50px;
}

.removeStave {
    position: fixed;
    right: 350px;
    bottom: 50px;
    width: 50px;
    height: 50px;
}

.check {
    position: fixed;
    right: 450px;
    bottom: 50px;
    border-radius: 0;
}

.staveNum {
    position: fixed;
    right: 100px;
    bottom: 100px;
    width: 50px;
    height: 30px;
    font-size: 30px;
}

.noteDuration {
    position: fixed;
    right: 100px;
    bottom: 150px;
    width: 50px;
    height: 30px;
    font-size: 30px;
}

button {
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #000;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
