const dot = document.getElementById("dot");
const output = document.getElementById("currentCoordsOut");
coordsSystem.addEventListener("click", function (e) {
  //e for "event", i.e. click event.
  const rect = coordsSystem.getBoundingClientRect();
  //x and y are coords relative to the image
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  //The intuitive (0,0), which is the center of the image, relative to the image
  const center_y = (rect.bottom - rect.top) / 2;
  const center_x = (rect.right - rect.left) / 2;
  //intuitive_x and intuitive_y are the intuitive coords with intuitive (0,0)
  const intuitive_x = Number(((x - center_x) / 5).toFixed(2));
  const intuitive_y = Number((-(y - center_y) / 5).toFixed(2));
  // Show the dot on the image
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  dot.style.display = "block";
  // Display the coordinates
  output.textContent = `Your current emotion coordinates are: (${intuitive_x}, ${intuitive_y})`;
});
////////////////////////////////////////////////////////////////////
//          TONE.JS SECTION           //
Tone.Transport.bpm.value = 105;
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");
//////////////////////////////////////////////////////////////
const C7_arp = ["C3", "E3", "G3", "B3", "C4", "B3", "G3", "C3"];
const D7_arp = ["D3", "F3", "A3", "B3", "C4", "D4", "C4", "F3"];
const E7_arp = ["E3", "G3", "B3", "D4", "F4", "E4", "F4", "G4"];
const F7_arp = ["F3", "A3", "C4", "E4", "F4", "E4", "F4", "C4"];
const arps = [C7_arp, C7_arp, D7_arp, D7_arp, E7_arp, E7_arp, F7_arp, F7_arp];
const arp_to_play = arps.flat();
const reverb_arp = new Tone.Reverb({
  decay: "4",
  wet: 0.7,
}).toDestination();
const arp_synth = new Tone.PolySynth(Tone.AMSynth);
arp_synth.connect(reverb_arp);
/////////////////////////////////////////////////////////////////////
const mel_lengths = ["1n", "1n", "1n", "2n", "2n", "2n", "4n", "4n", "8n"]; // Durations that divide into 2 bars nicely
mel_notes = ["E5", "C5", "F4", "G5", "B4", "D4", "C4", "G4"];
const mel_vol = new Tone.Volume(-15).toDestination(); // "vol" for volume.
const mel_synth = new Tone.PolySynth(Tone.DuoSynth, {
  voice0: {
    filterEnvelope: {
      attack: "2n",
      sustain: 1,
      release: "32n",
    },
  },
  voice1: {
    filterEnvelope: {
      attack: "4n",
      sustain: 1,
      release: "32n",
    },
  },
}).connect(mel_vol); // "mel" for melody.
//////////////////////////////////////////////////////////////////////////////
const hat_vol = new Tone.Volume(-15).toDestination(); // "hat" for hi-hat
const hat_synth = new Tone.MetalSynth({
  envelope: { attack: 0.001, decay: 0.15, release: 0.05 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 3000,
  octaves: 1.5, // The number of octaves above the 'resonance' frequency that the filter ramps during the attack/decay
}).connect(hat_vol);

const kick_vol = new Tone.Volume(-6).toDestination();
const kick_synth = new Tone.MembraneSynth({
  pitchDecay: 0.01, // The amount of time frequency env takes.
  octaves: 6,
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.9, sustain: 0.01, release: 0.6 },
}).connect(kick_vol);
//////////////////////////////////////////////////////////////////////////////
const snare_vol = new Tone.Volume(-15).toDestination();
const snare_synth = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.25, sustain: 0 },
}).connect(snare_vol);
//TODO: Add a eq to boost bass frequency.

//////////////////////////////////////////////////////////////////////////
let arp_seq = null; // seq for Sequence
let mel_seq = null;
let hat_seq = null;
let kick_seq = null;
let snare_seq = null;
////////////////////////////////////////////////////////////////////////////
playButton.addEventListener("click", async () => {
  await Tone.start();
  if (arp_seq || mel_seq || hat_seq || kick_seq || snare_seq) {
    arp_seq.dispose();
    arp_seq = null;
    mel_seq.dispose();
    mel_seq = null;
    hat_seq.dispose();
    hat_seq = null;
    kick_seq.dispose();
    kick_seq = null;
    snare_seq.dispose();
    snare_seq = null;
  }
  /////////////////////////////////////////////////////////////////
  arp_seq = new Tone.Sequence(
    (time, note) => {
      arp_synth.triggerAttackRelease(note, "8n", time);
    },
    arp_to_play,
    "8n"
  );
  //////////////////////////////////////////////////////////////////
  snare_seq = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        snare_synth.triggerAttackRelease("16n", time, 0.6);
      }
    },
    [null, "S", null, null, "S", null, null, "S"],
    "8n"
  );
  //////////////////////////////////////////////////////////////////
  mel_seq = new Tone.Sequence(
    (time) => {
      const duration =
        mel_lengths[Math.floor(Math.random() * mel_lengths.length)];
      const pitch = mel_notes[Math.floor(Math.random() * mel_notes.length)];
      mel_synth.triggerAttackRelease(pitch, duration, time);
    },
    mel_notes,
    "1n"
  );
  //////////////////////////////////////////////////////////////////
  const hat_play = ["", "x"];
  const hat_temp_array = new Array(16).fill(1);
  // The fill() here fills all 16 slots in an array with 1.
  hat_seq = new Tone.Sequence(
    (time) => {
      const hit = hat_play[Math.floor(Math.random() * hat_play.length)];
      if (hit) {
        hat_synth.triggerAttackRelease("C6", "16n", time, 0.3);
        //                            (pitch, length, time, velocity/gain multiplier)
      }
    },
    hat_temp_array,
    "16n"
  );
  // The 'x' here is simply a truthy value (not falsey). The array is like a drum machine grid.
  /////////////////////////////////////////////////////////////////////////////
  kick_seq = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        kick_synth.triggerAttackRelease("C1", "8n", time, 0.8);
      }
    },
    ["K", null, null, null, "K", null, null, "K"],
    "8n"
  );
  ///////////////////////////////////////////////////////////////////////////////
  arp_seq.start(0);
  mel_seq.start("8m");
  hat_seq.start("8m");
  kick_seq.start("8m");
  snare_seq.start("8m");
  Tone.Transport.start();
});
////////////////////////////////////////////////////////
stopButton.addEventListener("click", () => {
  if (arp_seq) {
    arp_seq.stop(); // Halts playback, can still be resumed by start()
    arp_seq.dispose(); // Removes sequence
    arp_seq = null;
  }
  if (mel_seq) {
    mel_seq.stop();
    mel_seq.dispose();
    mel_seq = null;
  }
  if (hat_seq) {
    hat_seq.stop();
    hat_seq.dispose();
    hat_seq = null;
  }
  if (kick_seq) {
    kick_seq.stop();
    kick_seq.dispose();
    kick_seq = null;
  }
  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.position = 0;
});
