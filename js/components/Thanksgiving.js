/* Thanksgiving component */
EBB.define("Thanksgiving", (function () {
class Component extends DCLogic {
  state = { selected: 0, playing: false, cur: 0, dur: 0, durs: {}, loadError: null };

  // Audio sources for the three Thanksgiving songs. Empty = honest "not connected" state.
  audioSources() {
    return {
      'stay-for-the-leftovers': 'assets/audio/stay-for-the-leftovers.mp3',
      'heres-to-the-quiet-ones': 'assets/audio/heres-to-the-quiet-ones.mp3',
      'keep-the-good': 'assets/audio/keep-the-good.mp3'
    };
  }

  songs() {
    const stayChorus = `Stay for the leftovers,
Leave your keys beside the door.
Put your mask upon the nightstand—
That's what the guest room's for.
Pass the pie and pass the stories,
Let Thanksgiving linger on.
Stay for the leftovers—
We've got more to be thankful for.`;
    const quietChorus = `Here's to the quiet ones,
The ones who see us through.
You never ask for anything—
This one's for you.
Raise a glass for the quiet ones.
This one's for you.`;
    const goodChorus = `Keep the good,
Let the rest go.
Keep the pie, keep the mask,
Leave the pride outside the door.
Keep the good,
Let the rest go.
I'm taking care of what I've got—
That's what I'm thankful for.`;
    return [
      {
        id: 'stay-for-the-leftovers', title: 'Stay for the Leftovers', kicker: 'Track 01',
        desc: 'A song about packing an overnight bag, staying through the weekend and making time for family once the big meal is over.',
        photo: ['assets/img/thanksgiving/05-fireplace-pie.jpg?v=ebb-thanksgiving-20261124-v1', 'The band relaxes beside a fireplace after Thanksgiving dinner, sharing pumpkin pie and looking through records.', 1536, 1024],
        lyrics: [
          ['Verse 1', `My CPAP's packed beside the pumpkin pie,
Mask and tube in my overnight bag.
Mom says, "Staying?" I say, "Through Friday."
She hands me an apron and points to Dad.
He's got the turkey; I've got the gravy.
I'm staying for breakfast. It's as simple as that.`],
          ['Chorus', stayChorus],
          ['Verse 2', `I fill the humidifier, lay the tubing loose,
My mask goes on in my old room.
The CPAP hums while the whole house settles;
Friday brings the coffee and the news.
My brother says, "You got a minute?"
I say, "I've got the whole day for you."`],
          ['Chorus', stayChorus],
          ['Bridge', `Cold turkey, warm kitchen,
Some things don't need a plan.
My brother talks; I put the kettle on,
And get to know him again.`],
          ['Final Chorus', stayChorus],
          ['Outro', `Save a little pie for breakfast.
I'm staying for the leftovers.`]
        ]
      },
      {
        id: 'heres-to-the-quiet-ones', title: 'Here’s to the Quiet Ones', kicker: 'Track 02',
        desc: 'A thank-you to the people who quietly help us through, from the one who cleared a nightstand to the patient voice on the other end of the phone.',
        photo: ['assets/img/thanksgiving/01-friendsgiving-table.jpg?v=ebb-thanksgiving-20261124-v1', 'Cal, Nina, Ben and Tom share a candid Thanksgiving dinner at a backyard table decorated with pumpkins and autumn flowers.', 1672, 941],
        lyrics: [
          ['Verse 1', `My CPAP's in the guest room,
Cranberry on my plate.
You asked me to get tested;
I kept saying, "It can wait."
You cleared a little nightstand,
Made room for mask and tube.
The turkey's going round again—
I lift my glass to you.`],
          ['Chorus', quietChorus],
          ['Verse 2', `The patient voice who helped me
When my mask just wouldn't seal,
Who let me ask the same thing twice
And knew how strange it all could feel.
My brother bringing folding chairs,
My sister slicing pumpkin pie—
You never make a speech about
The ways you get us by.`],
          ['Chorus', quietChorus],
          ['Bridge', `Later, when the house is still,
I fill the chamber, dim the light.
Your hand finds mine beneath the quilt—
That's how we end Thanksgiving night.`],
          ['Final Chorus', quietChorus],
          ['Outro', `Happy Thanksgiving, quiet ones.
This one's for you.`]
        ]
      },
      {
        id: 'keep-the-good', title: 'Keep the Good', kicker: 'Track 03',
        desc: 'A song about holding on to family traditions, like Grandma’s handwritten recipe, while making room for a little change.',
        photo: ['assets/img/thanksgiving/02-farmhouse-kitchen.jpg?v=ebb-thanksgiving-20261124-v1', 'The four bandmates prepare Thanksgiving food together in a farmhouse kitchen, each working on a different dish.', 1536, 1024],
        lyrics: [
          ['Verse 1', `My CPAP's in the guest room,
There's pumpkin pie beside the stove.
Aunt Jean brought the secret stuffing;
Nobody can crack the code.
Mask and tube beside my pillow,
Fresh filter in the bag.
I still love the family stories—
I've retired my "I'm fine" act.`],
          ['Chorus', goodChorus],
          ['Verse 2', `My brother passes cranberry,
I hand the turkey down.
He asks me how the sleep test went;
We let the dishes make the rounds.
I say, "I fought that mask for weeks,
Now it comes wherever I go."
He says, "I might ask someone, too."
I say, "I'm glad you told me so."`],
          ['Chorus', goodChorus],
          ['Bridge', `Grandma's handwritten recipe
Has butter stains across the page.
We can love the way she loved us
And still make a little change.`],
          ['Final Chorus', goodChorus],
          ['Outro', `Keep the good this Thanksgiving—
And save some pie for me.`]
        ]
      }
    ];
  }

  srcFor(i) {
    const s = this.songs()[i];
    return s ? (this.audioSources()[s.id] || '') : '';
  }

  componentDidMount() {
    const a = new Audio();
    a.preload = 'metadata';
    a.addEventListener('loadedmetadata', () => this.setState({ dur: isFinite(a.duration) ? a.duration : 0 }));
    // Let other parts of the page (the Thanksgiving banner's sound bars) know when music is playing.
    // Also used by the site's opt-in analytics (song plays, pauses and how far people listen).
    // The song is remembered when it starts, so a pause caused by switching tracks is credited to the right song.
    const info = () => ({ song: this.playingSong || (this.songs()[this.state.selected] || {}).id, t: a.currentTime || 0, dur: isFinite(a.duration) ? a.duration : 0 });
    const tell = (on, how) => { window.__ebbPlaying = on; window.dispatchEvent(new CustomEvent('ebb:audio', { detail: Object.assign({ playing: on, how: how }, info()) })); };
    a.addEventListener('timeupdate', () => { this.setState({ cur: a.currentTime || 0 }); window.dispatchEvent(new CustomEvent('ebb:audio-time', { detail: info() })); });
    a.addEventListener('play', () => { this.playingSong = (this.songs()[this.state.selected] || {}).id; this.setState({ playing: true }); tell(true, 'play'); });
    a.addEventListener('pause', () => { if (!a.ended) tell(false, 'pause'); this.setState({ playing: false }); });
    a.addEventListener('ended', () => { tell(false, 'ended'); this.setState({ playing: false, cur: 0 }); });
    a.addEventListener('error', () => { if (a.getAttribute('src')) this.setState({ playing: false, loadError: this.state.selected }); });
    this.audio = a;
    this.loadTrack(0);
    this.probes = this.songs().map((s, i) => {
      const src = this.srcFor(i);
      if (!src) return null;
      const p = new Audio();
      p.preload = 'metadata';
      p.addEventListener('loadedmetadata', () => {
        if (isFinite(p.duration)) this.setState((prev) => ({ durs: Object.assign({}, prev.durs, { [i]: p.duration }) }));
      });
      p.src = src;
      return p;
    });
  }

  componentWillUnmount() {
    if (this.audio) { this.audio.pause(); this.audio.removeAttribute('src'); }
  }

  loadTrack(i) {
    const a = this.audio; if (!a) return;
    a.pause();
    const src = this.srcFor(i);
    if (src) { a.src = src; a.load(); } else { a.removeAttribute('src'); }
  }

  selectTrack(i) {
    if (i === this.state.selected) return;
    this.loadTrack(i);
    this.setState({ selected: i, cur: 0, dur: 0, playing: false, loadError: null });
  }

  startPlayback() {
    const a = this.audio; if (!a || !a.getAttribute('src')) return;
    const p = a.play();
    if (p && p.catch) p.catch(() => this.setState({ playing: false }));
  }

  playTrack(i) {
    if (!this.srcFor(i)) { this.selectTrack(i); return; }
    if (i !== this.state.selected) { this.selectTrack(i); this.startPlayback(); return; }
    this.toggleSelected();
  }

  toggleSelected() {
    const a = this.audio;
    if (!a || !this.srcFor(this.state.selected)) return;
    if (a.paused) this.startPlayback(); else a.pause();
  }

  fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  renderVals() {
    const st = this.state;
    const songs = this.songs();
    const sel = songs[st.selected];
    const selAvailable = !!this.srcFor(st.selected) && st.loadError !== st.selected;
    const statusFor = (i) => {
      if (!this.srcFor(i)) return 'Audio not connected yet — lyrics below.';
      if (st.loadError === i) return 'This recording couldn’t be loaded.';
      return '';
    };
    const tracks = songs.map((s, i) => {
      const isSel = i === st.selected;
      const isPlaying = isSel && st.playing;
      const available = !!this.srcFor(i) && st.loadError !== i;
      const len = st.durs[i] ? this.fmt(st.durs[i]) : '';
      return {
        title: s.title,
        kicker: s.kicker,
        desc: s.desc,
        anchor: 'song-' + s.id,
        titleId: 'title-' + s.id,
        rowClass: isSel ? 'is-selected' : '',
        isPlaying: isPlaying,
        notPlaying: !isPlaying,
        unavailable: !available,
        btnText: isPlaying ? 'Pause' : 'Play',
        playLabel: (isPlaying ? 'Pause "' : 'Play "') + s.title + '"',
        metaShort: '0' + (i + 1) + (available ? (len ? ' · ' + len : '') : ' · Lyrics only for now'),
        metaLong: available ? len : statusFor(i),
        play: () => this.playTrack(i),
        photo: s.photo[0],
        photoAlt: s.photo[1],
        photoW: s.photo[2],
        photoH: s.photo[3],
        sections: s.lyrics.map((l) => ({ label: l[0], hasLabel: !!l[0], text: l[1] }))
      };
    });
    const heroPlaying = st.selected === 0 && st.playing;
    return {
      tracks: tracks,
      heroPlay: () => this.playTrack(0),
      heroPlaying: heroPlaying,
      heroNotPlaying: !heroPlaying,
      heroUnavailable: !this.srcFor(0) || st.loadError === 0,
      heroText: heroPlaying ? 'Pause' : 'Play Stay for the Leftovers',
      heroLabel: (heroPlaying ? 'Pause "' : 'Play "') + songs[0].title + '"',
      selTitle: sel.title,
      selKicker: (st.playing ? 'Now playing · ' : 'Selected · ') + '0' + (st.selected + 1),
      miniShow: st.playing || st.cur > 0,
      progressPct: (st.dur ? Math.min(100, (st.cur / st.dur) * 100) : 0).toFixed(1) + '%',
      selPlaying: st.playing,
      selNotPlaying: !st.playing,
      discClass: st.playing ? 'is-spinning' : '',
      selUnavailable: !selAvailable,
      selPlayLabel: (st.playing ? 'Pause "' : 'Play "') + sel.title + '"',
      selStatus: statusFor(st.selected) || (st.playing ? 'Playing.' : 'Ready to play.'),
      toggleSelected: () => this.toggleSelected(),
      curText: this.fmt(st.cur),
      durText: st.dur ? this.fmt(st.dur) : '--:--',
      durMax: st.dur || 0,
      curVal: Math.min(st.cur, st.dur || 0),
      seekText: this.fmt(st.cur) + ' of ' + (st.dur ? this.fmt(st.dur) : 'unknown length'),
      onSeek: (e) => { const v = Number(e.target.value); if (this.audio && isFinite(v)) { this.audio.currentTime = v; this.setState({ cur: v }); } }
    };
  }
}
return Component;
})());
