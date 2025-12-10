function init() {
  const coordsSystem = document.getElementById("coordsSystem");
  const dot = document.getElementById("dot");
  const output = document.getElementById("currentCoordsOut");
  const playButton = document.getElementById("playButton");
  const stopButton = document.getElementById("stopButton");
  const submitButton = document.getElementById("submitButton");

  if (
    !coordsSystem ||
    !dot ||
    !output ||
    !playButton ||
    !stopButton ||
    !submitButton
  ) {
    console.error("Required UI elements missing; cannot start audio.");
    return;
  }

  submitButton.style.display = "none";
  let tempX;
  let tempY;
  let emoX = 0;
  let emoY = 0;

  coordsSystem.addEventListener("click", function (e) {
    const rect = coordsSystem.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const center_y = (rect.bottom - rect.top) / 2;
    const center_x = (rect.right - rect.left) / 2;
    const intuitive_x = Number(((x - center_x) / 5).toFixed(2));
    const intuitive_y = Number((-(y - center_y) / 5).toFixed(2));
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.display = "block";
    output.textContent = `Your current emotion coordinates are: (${intuitive_x}, ${intuitive_y})`;
    tempX = intuitive_x;
    tempY = intuitive_y;
  });

  submitButton.addEventListener("click", function () {
    emoX = tempX;
    emoY = tempY;
  });

  ////////////////////////////////////////////////////////////////////
  //          TONE.JS SECTION           //
  Tone.Transport.bpm.value = 105;
  ////////////////////// ARPEGGIO SETUP////////////////////////////////////////
  const Cmaj7_arp = ["C3", "E3", "G3", "B3", "C4", "B3", "G3", "C3"];
  const Dm7_arp = ["D3", "F3", "A3", "B3", "C4", "D4", "C4", "F3"];
  const E7_arp = ["E3", "G3", "B3", "D4", "F4", "E4", "F4", "G4"];
  const Fmaj7_arp = ["F3", "A3", "C4", "E4", "F4", "E4", "F4", "C4"];
  const Cmaj7_chord = ["C3", "E3", "G3", "B3"];
  const C_arp = ["C3", "E3", "G3", "C4", "E4", "C4", "G3", "C3"];
  const Dm_arp = ["D3", "F3", "A3", "D4", "F4", "D4", "A3", "D3"];
  const Em_arp = ["E3", "G3", "B3", "E4", "G4", "E4", "B3", "E3"];
  const Emb_arp = ["E3", "G3", "Bb3", "E4", "G4", "E4", "Bb3", "E3"];
  const Edim_arp = ["E3", "G3", "Bb3", "E4", "G4", "E4", "A4", "E4"]; //E dim add 11
  const Fmaj13_arp = ["F3", "A3", "C4", "E4", "A4", "B4", "C5", "D5"];
  const Fmaj9_arp = ["F3", "A3", "C4", "E4", "G4", "E4", "A4", "Bb4"];
  const Dm7_chord = ["D3", "F3", "A3", "C4"];
  const E7_chord = ["E3", "G3", "B3", "D4"];
  const Fmaj7_chord = ["F3", "A3", "C4", "E4"];
  const Am_arp = ["A2", "C3", "E3", "A3", "C4", "A3", "E3", "A2"];
  const Cm_arp = ["C3", "Eb3", "G3", "C4", "Eb4", "C4", "G3", "C3"];
  const G_arp = ["G3", "B3", "D4", "G4", "B4", "G4", "D4", "G3"];
  const C_chord = ["C3", "E3", "G3", "C4"];
  const Dm_chord = ["D3", "F3", "A3", "D4"];
  const Em_chord = ["E3", "G3", "B3", "E4"];
  const Emb_chord = ["E3", "G3", "Bb3"];
  const Edim_chord = ["E3", "G3", "Bb3", "A4"];
  const Fmaj13_chord = ["F3", "A3", "C4", "D5"];
  const Fmaj9_chord = ["F3", "A3", "C4", "G4"];
  const arps_neutral = [
    Cmaj7_arp,
    Cmaj7_arp,
    Dm7_arp,
    Dm7_arp,
    E7_arp,
    E7_arp,
    Fmaj7_arp,
    Fmaj7_arp,
  ].flat();
  const chords_neutral = [
    Cmaj7_chord,
    Cmaj7_chord,
    Dm7_chord,
    Dm7_chord,
    E7_chord,
    E7_chord,
    Fmaj7_chord,
    Fmaj7_chord,
  ];
  const arps_pleasant = [
    C_arp,
    C_arp,
    Dm_arp,
    Dm_arp,
    Em_arp,
    Em_arp,
    Fmaj7_arp,
    Fmaj7_arp,
  ].flat();
  const chords_pleasant = [
    C_chord,
    C_chord,
    Dm_chord,
    Dm_chord,
    Em_chord,
    Em_chord,
    Fmaj7_chord,
    Fmaj7_chord,
  ];
  const arps_unpleasant = [
    Cm_arp,
    Cm_arp,
    Dm_arp,
    Dm_arp,
    Em_arp,
    Em_arp,
    Fmaj9_arp,
    Fmaj9_arp,
  ].flat();
  const chords_unpleasant = [
    Emb_chord,
    Emb_chord,
    Dm_chord,
    Dm_chord,
    Edim_chord,
    Edim_chord,
    Fmaj9_chord,
    Fmaj9_chord,
  ];
  const reverb_arp = new Tone.Reverb({
    decay: "4",
    wet: 0.5,
  }).toDestination();
  // Tone.Panner pan range is -1..1; 15/-15 would clamp and can mute, so use +/-0.15 for a 15% offset.
  const arp_pan = new Tone.Panner(-0.15);
  const arp_vol = new Tone.Volume(0); // main arp gain stage
  const arpLFO = new Tone.LFO({
    type: "square",
    frequency: "0.8hz", // slow sweep
    min: -40, // dB lower bound
    max: 0, // dB upper bound
  }).start();
  arpLFO.connect(arp_vol.volume); // modulate arp volume
  const arp_synth = new Tone.PolySynth(Tone.AMSynth);
  arp_synth.chain(arp_pan, arp_vol, reverb_arp);
  ////////////////////// MELODY SETUP///////////////////////////////////////////////
  const mel_lengths_long = [
    "1n",
    "1n",
    "1n",
    "2n",
    "2n",
    "1n",
    "1n",
    "1n",
    "2n",
    "2n",
    "4n",
  ];
  const mel_lengths_short = [
    "1n",
    "2n",
    "4n",
    "4n",
    "8n",
    "8n",
    "8n",
    "8n",
    "16n",
  ];
  const mel_notes_peaceful = [
    "E4",
    "C5",
    "F4",
    "G5",
    "C4",
    "G4",
    "F4",
    "D4",
    "C4",
    "G3",
    null,
  ];
  const mel_notes_unpleasant = [
    "C3",
    "D3",
    "Eb3",
    "Eb4",
    "F4",
    "G#4",
    "A4",
    "B4",
    "C5",
    "B5",
    "Ab3",
    "Bb3",
    "Db3",
    "Ab5",
    "Bb5",
  ];

  const mel_vol = new Tone.Volume(-20).toDestination(); // "vol" for volume.
  const mel_pan = new Tone.Panner(0.15);
  const reverb_mel = new Tone.Reverb({
    decay: "1",
    wet: 0.1,
  }).toDestination();
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
  });
  mel_synth.chain(mel_pan, mel_vol, reverb_mel); // "mel" for melody.
  ////////////////////////// HI-HAT SETUP////////////////////////////////////////////////////
  const hat_vol = new Tone.Volume(-20).toDestination(); // "hat" for hi-hat
  const hat_synth = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.15, release: 0.05 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 3000,
    octaves: 1.5,
  }).connect(hat_vol);
  //////////////////////// KICK SETUP///////////////////////////
  const kick_vol = new Tone.Volume(-6).toDestination();
  const kick_synth = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 6,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.9, sustain: 0.01, release: 0.6 },
  }).connect(kick_vol);
  //////////////////////// SNARE SETUP//////////////////////////////////////////////////////
  const snare_vol = new Tone.Volume(-20).toDestination();
  const snare_synth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.25, sustain: 0 },
  }).connect(snare_vol);
  //TODO: Add an eq to boost bass frequency.

  ///////////////////////// INITIALIZING SEQUENCES////////////////////////////////////////////////
  let arp_seq = null;
  let mel_seq = null;
  let hat_seq = null;
  let kick_seq = null;
  let snare_seq = null;
  let chordIndex = 0;

  ////////////////////////// INITIALIZING STATES//////////////////////////////////////////////////
  let currentState = {
    bpm: 105,
    arpPattern: arps_neutral,
    melLengths: mel_lengths_long,
    melNotes: mel_notes_peaceful,
    chordPattern: chords_neutral,
    useChords: false,
    arpLfoFreq: 0,
    arpVol: 0,
    snareRandomness: 0.4,
    hatRandomness: 0.4,
  };
  let targetState = { ...currentState };
  let pendingChanges = {};
  arp_vol.volume.value = currentState.arpVol;

  ////////////////////////////////// MAPPING /////////////////////////////////////////////
  function computeTargetFromEmotion(x, y) {
    const bpm = 105 + y * 0.5;
    let arpPattern = currentState.arpPattern;
    let chordPattern = currentState.chordPattern;
    //chords brightness
    if (x > 10) {
      arpPattern = arps_pleasant;
      chordPattern = chords_pleasant;
    } else if (x < -10) {
      arpPattern = arps_unpleasant;
      chordPattern = chords_unpleasant;
    } else {
      arpPattern = arps_neutral;
      chordPattern = chords_neutral;
    }
    //melody note length
    let melLengths = currentState.melLengths;
    if (y > 20) {
      melLengths = mel_lengths_short;
    } else {
      melLengths = mel_lengths_long;
    }
    //melody brightness
    let melNotes = currentState.melNotes;
    if (x < -25) {
      melNotes = mel_notes_unpleasant;
    } else {
      melNotes = mel_notes_peaceful;
    }
    //use chords when y>30
    const useChords = y > 30;
    //When using chords, apply (16n)
    let arpLfoFreq = useChords ? "64n" : 0;
    let arpVol = useChords ? -15 : 0;
    //percussion randomness
    let hatRandomness = currentState.hatRandomness ?? 0.4;
    let snareRandomness = currentState.snareRandomness ?? 0.4;
    if (y < 0) {
      const dist = Math.sqrt(x * x + y * y); // distance from origin 歐幾里得距離
      const scaled = Math.max(1 - dist / 100, 0);
      hatRandomness = scaled;
      snareRandomness = scaled;
    }

    return {
      bpm,
      arpPattern,
      chordPattern,
      melLengths,
      melNotes,
      useChords,
      arpLfoFreq,
      arpVol,
      hatRandomness,
      snareRandomness,
    };
  }
  ////////////////////////////////// CONDUCTOR ///////////////////////////////////
  Tone.Transport.scheduleRepeat((time) => {
    if (Object.keys(pendingChanges).length > 0) {
      const arp_old = currentState.arpPattern;
      const chord_old = currentState.chordPattern;
      const useChords_old = currentState.useChords;
      currentState = { ...currentState, ...pendingChanges };
      pendingChanges = {};
      if (typeof currentState.arpVol === "number") {
        arp_vol.volume.value = currentState.arpVol;
      }
      if (
        currentState.useChords !== useChords_old ||
        (currentState.useChords && currentState.chordPattern !== chord_old)
      ) {
        disposeSequences();
        buildSequences();
        startSequences(time);
        return;
      }
      if (
        arp_seq &&
        !currentState.useChords &&
        currentState.arpPattern !== arp_old
      ) {
        arp_seq.events = currentState.arpPattern;
      }
    }
  }, "1m");

  /////////////////////////////// disposeSequences() ////////////////////////////////////
  function disposeSequences() {
    if (arp_seq) {
      arp_seq.dispose();
      arp_seq = null;
    }
    if (mel_seq) {
      mel_seq.dispose();
      mel_seq = null;
    }
    if (hat_seq) {
      hat_seq.dispose();
      hat_seq = null;
    }
    if (kick_seq) {
      kick_seq.dispose();
      kick_seq = null;
    }
    if (snare_seq) {
      snare_seq.dispose();
      snare_seq = null;
    }
    chordIndex = 0;
  }

  function buildSequences() {
    //////////////////////////SNARE////////////////////////////////////////
    snare_seq = new Tone.Sequence(
      (time, hit) => {
        if (hit && Math.random() < (currentState.snareRandomness ?? 0.5)) {
          snare_synth.triggerAttackRelease("16n", time, 0.6);
        }
      },
      [null, "S", null, null, "S", null, null, "S"],
      "8n"
    );
    //////////////////////////HI-HAT////////////////////////////////////////
    const hat_temp_array = new Array(16).fill(1);
    hat_seq = new Tone.Sequence(
      (time) => {
        const hit = Math.random() < (currentState.hatRandomness ?? 0.4);
        if (hit) {
          hat_synth.triggerAttackRelease("C6", "16n", time, 0.3);
        }
      },
      hat_temp_array,
      "16n"
    );

    /////////////////////////KICK////////////////////////////////////////////////////
    const kick_targets = [true, null, null, null, true, null, null, true];
    kick_seq = new Tone.Sequence(
      (time, hit) => {
        if (hit && Math.random() < (currentState.kickRandomness ?? 0.5)) {
          kick_synth.triggerAttackRelease("C1", "8n", time, 0.8);
        }
      },
      kick_targets,
      "8n"
    );
    /////////////////////////////ARPEGGIO / CHORDS////////////////////////////////////
    const arpEvents = currentState.useChords
      ? currentState.chordPattern
      : currentState.arpPattern;
    if (currentState.useChords) {
      // One chord per measure, all notes together.
      arp_seq = new Tone.Loop((time) => {
        const chord = arpEvents[chordIndex % arpEvents.length];
        if (Array.isArray(chord)) {
          arp_synth.triggerAttackRelease(chord, "1m", time);
        }
        chordIndex += 1;
      }, "1m");
    } else {
      arp_seq = new Tone.Sequence(
        (time, event) => {
          if (event) {
            arp_synth.triggerAttackRelease(event, "8n", time);
          }
        },
        arpEvents,
        "8n"
      );
    }
    //////////////////////////MELODY////////////////////////////////////////
    mel_seq = new Tone.Sequence(
      (time) => {
        const bar_seconds = Tone.Time("1m").toSeconds();
        let current_time = 0;
        while (current_time < bar_seconds) {
          const duration =
            currentState.melLengths[
              Math.floor(Math.random() * currentState.melLengths.length)
            ];
          const duration_seconds = Tone.Time(duration).toSeconds();
          const pitch =
            currentState.melNotes[
              Math.floor(Math.random() * currentState.melNotes.length)
            ];
          if (duration_seconds + current_time > bar_seconds) {
            break;
          }
          mel_synth.triggerAttackRelease(pitch, duration, time + current_time);
          current_time = current_time + duration_seconds;
        }
      },
      currentState.melNotes,
      "1m"
    );
  }

  function startSequences(startTime = 0) {
    arp_seq.start(startTime);
    mel_seq.start(0);
    hat_seq.start(0);
    kick_seq.start(0);
    snare_seq.start(0);
  }
  ///////////////////////// PLAYBUTTON FUNCTION///////////////////////////////////////////////////
  playButton.addEventListener("click", async () => {
    playButton.style.display = "none";
    submitButton.style.display = "inline-block";
    await Tone.start();
    disposeSequences();
    buildSequences();
    startSequences();
    Tone.Transport.start();
  });
  ////////////////////STOPBUTTON FUNCTION////////////////////////////////////
  stopButton.addEventListener("click", () => {
    if (arp_seq) arp_seq.stop();
    if (mel_seq) mel_seq.stop();
    if (hat_seq) hat_seq.stop();
    if (kick_seq) kick_seq.stop();
    if (snare_seq) snare_seq.stop();
    disposeSequences();
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    playButton.style.display = "inline-block";
    submitButton.style.display = "none";
  });

  /////////////////////SUBMITBUTTON FUNCTION////////////////////////////////
  submitButton.addEventListener("click", () => {
    targetState = computeTargetFromEmotion(tempX, tempY);
    if (Number.isFinite(targetState.bpm)) {
      Tone.Transport.bpm.rampTo(targetState.bpm, 2.5);
    }
    pendingChanges = { ...targetState };
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
