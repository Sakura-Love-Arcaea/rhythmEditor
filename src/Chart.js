import { high, low, rest, myStave, calToGiveBeam, allInOneRender } from "./func.js";
import { Stave, StaveNote, Beam, Formatter, Renderer, TabStave, Tuplet } from "vexflow";

class Chart {
    constructor(renderer, context) {
        this.x = 0;
        this.y = 0;
        this.context = context;
        this.renderer = renderer;
        this.div = document.getElementById("output");
        this.MaxWidth = context.svg.clientWidth;
        this.staves = [];
        this.notes = [
            { stave: 0, localNotes: [high(2), high(4), high(4)] },
            { stave: 1, localNotes: [high(4), high(4), high(4), high(4)] },
            { stave: 2, localNotes: [high(4), high(4), high(4), high(4)] },
            { stave: 3, localNotes: [high(8), high(8), high(8), high(8), high(4), high(4)] },
            {
                stave: 4,
                localNotes: [low(16), low(16), low(16), low(16), low(16), low(16), low(16), low(16), rest(4), rest(4)],
            },
            {
                stave: 5,
                localNotes: [
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                    low(8),
                ],
            },
        ];
        this.beams = [
            { stave: 3, localBeam: [new Beam(this.notes[3].localNotes.slice(0, 4))] },
            {
                stave: 4,
                localBeam: [
                    new Beam(this.notes[4].localNotes.slice(0, 4)),
                    new Beam(this.notes[4].localNotes.slice(4, 8)),
                ],
            },
            {
                stave: 5,
                localBeam: [
                    new Beam(this.notes[5].localNotes.slice(0, 3)),
                    new Beam(this.notes[5].localNotes.slice(3, 6)),
                    new Beam(this.notes[5].localNotes.slice(6, 9)),
                    new Beam(this.notes[5].localNotes.slice(9, 12)),
                ],
            },
        ];
        this.tuplets = [
            {
                stave: 5,
                localTuplet: [
                    new Tuplet(this.notes[5].localNotes.slice(0, 3)),
                    new Tuplet(this.notes[5].localNotes.slice(3, 6)),
                    new Tuplet(this.notes[5].localNotes.slice(6, 9)),
                    new Tuplet(this.notes[5].localNotes.slice(9, 12)),
                ],
            },
        ];
    }

    addStave(length = 400) {
        this.staves.push({ length });
    }

    render() {
        // clear the previous render
        this.context.clear();
        this.x = 0;
        this.y = 0;
        this.MaxWidth = this.context.svg.clientWidth;

        const staveRender = this.staves.map((stave, index) => {
            let obj;
            console.log(index, this.x, this.y, stave.length);
            if (index === 0) {
                obj = myStave(this.x, this.y, stave.length, true);
                this.x += stave.length;
            } else if (this.x + stave.length > this.MaxWidth - 20) {
                this.y += 100;
                obj = myStave(0, this.y, stave.length, true);
                this.x = stave.length;
            } else {
                console.log("else");
                obj = myStave(this.x, this.y, stave.length, false);
                this.x += stave.length;
            }
            return obj;
        });

        this.div.style.height = this.y + 100 + "px";
        this.renderer.resize(window.innerWidth, this.y + 100);

        staveRender.forEach((stave, index) => {
            stave.setContext(this.context).draw();
        });

        this.notes.forEach((note) => {
            Formatter.FormatAndDraw(this.context, staveRender[note.stave], note.localNotes);
        });

        this.beams.forEach((beam) => {
            beam.localBeam.forEach((b) => {
                b.setContext(this.context).draw();
            });
        });
        this.tuplets.forEach((tuplet) => {
            tuplet.localTuplet.forEach((t) => {
                t.setContext(this.context).draw();
            });
        });
    }
}

export default Chart;
