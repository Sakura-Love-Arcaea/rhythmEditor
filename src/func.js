import { Stave, StaveNote, Beam, Formatter, Renderer, TabStave, Tuplet } from "vexflow";
import { VexFlow } from "vexflow";

const high = (duration) => {
    return new StaveNote({
        keys: ["c/5"],
        duration,
    });
};

const low = (duration) => {
    return new StaveNote({
        keys: ["a/4"],
        duration,
    });
};

const mid = (duration) => {
    return new StaveNote({
        keys: ["b/4"],
        duration,
    });
};

const rest = (duration) => {
    return new StaveNote({
        keys: ["b/4"],
        duration: `${duration}r`,
    });
};

const myStave = (x, y, width) => {
    const stave = new Stave(x, y, width);
    stave.setBegBarType(VexFlow.Barline.type.NONE);
    stave.setConfigForLine(0, { visible: false });
    stave.setConfigForLine(1, { visible: false });
    stave.setConfigForLine(3, { visible: false });
    stave.setConfigForLine(4, { visible: false });
    return stave;
};

const calToGiveBeam = (noteArray, unit) => {
    let beamArray = [];
    let counter = 0;
    let start = 0,
        end = 0;
    for (let i = 0; i < noteArray.length; i++) {
        const duration = Number(1 / noteArray[i].duration);
        if (duration >= 1 / 4) {
            start++; // 1/4 以上的音符不參與符桿，前提已經分開
            continue;
        }
        counter += duration;
        if (counter === unit) {
            end = i;
            beamArray.push(new Beam(noteArray.slice(start, end + 1)));
            start = end + 1;
            counter = 0;
        }
    }
    return beamArray;
};

const allInOneRender = (stave, notes, beams) => {
    stave.setContext(context).draw();
    Formatter.FormatAndDraw(context, stave, notes);
    beams.forEach((b) => b.setContext(context).draw());
};

export { high, low, mid, rest, myStave };
