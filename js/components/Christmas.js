/* Christmas component */
EBB.define("Christmas", (function () {
class Component extends DCLogic {
  state = { selected: 0, playing: false, cur: 0, dur: 0, durs: {}, loadError: null };

  // Audio sources for the Christmas songs. Empty = honest "not connected" state.
  audioSources() {
    return {
      'cpap-next-to-mine': 'assets/audio/cpap-next-to-mine.mp3',
      'the-gift-you-never-wrapped': 'assets/audio/the-gift-you-never-wrapped.mp3',
      'christmas-found-us-anyway': 'assets/audio/christmas-found-us-anyway.mp3',
      'up-for-christmas': 'assets/audio/up-for-christmas.mp3',
      'tangled-up-in-christmas': 'assets/audio/tangled-up-in-christmas.mp3'
    };
  }

  // The Christmas hold-music song is first; the hero's Play button always plays the first song.
  songs() {
    const cpapChorus = `Your CPAP next to mine,
Your stocking on the wall.
If you're staying here for Christmas,
Baby, I've got it all.
Two masks on the nightstand,
Let the Christmas lights shine.
Merry Christmas, baby—
Put your CPAP next to mine.`;
    const giftChorus = `The gift you never wrapped,
The one I couldn't see,
Was the way you kept on loving
All the tired parts of me.

You gave me back the mornings,
You gave me back the light.
The gift you never wrapped
Was another night by your side.`;
    const foundChorus = `We never made it home,
But we don't have to be alone.
Pull another chair up close;
Tell me who you're missing most.
Somewhere in the long delay,
Christmas found us anyway.`;
    const upChorus = `I'm up for Christmas,
All the beautiful mess of it.
I'm up for Christmas,
And I want every bit of it.
Let the paper fly,
Let the whole house sing.
I'm up for Christmas—
Bring on everything.`;
    const tangledChorus = `Tangled up in Christmas,
Tangled up in you.
Let that old record keep on turning—
We've got some dancing left to do.
Tangled up in Christmas—
Come get tangled up with me.`;
    return [
      {
        id: 'cpap-next-to-mine', title: 'CPAP Next to Mine', kicker: 'Track 01',
        desc: 'A Christmas love song about making room: a spot beside the bed, a stocking on the wall and a CPAP next to mine.',
        photo: ['assets/img/christmas/10-masked-christmas-rehearsal.jpg?v=ebb-christmas-20261125-v1', 'EBB plays in Santa hats beside the tree, each wearing a CPAP mask.', 1672, 941],
        lyrics: [
          ['Verse 1', `I moved my CPAP over,
Made you room beside the bed.
Hung your Christmas stocking
With your name stitched in red.
Put a bow around a new mask,
Hung the mistletoe up high.
I keep turning down the music
Every time a car goes by.`],
          ['Pre-Chorus', `Bring your mask and bring your kisses;
Make yourself at home this Christmas.`],
          ['Chorus', cpapChorus],
          ['Verse 2', `You come in with Christmas presents
And your CPAP travel case.
Before you get your coat off,
I kiss the cold right off your face.
We fill the humidifier chambers,
Get your heated tube unwound.
You find fresh filters in your stocking,
Then you spin me round and round.`],
          ['Pre-Chorus', `You brought your mask, now bring those kisses;
Make yourself at home this Christmas.`],
          ['Chorus', cpapChorus],
          ['Bridge', `There's a house key in your stocking;
That's what I've been trying to say.
When we take the Christmas tree down,
You and your CPAP can stay.`],
          ['Final Chorus', `Your CPAP next to mine,
Your stocking on the wall.
Now you're staying here for Christmas,
Baby, I've got it all.
Two masks on the nightstand,
Let the Christmas lights shine.
Merry Christmas, baby—
Put your CPAP next to mine.`],
          ['Outro', `Merry Christmas, baby—
Your CPAP next to mine.`]
        ]
      },
      {
        id: 'the-gift-you-never-wrapped', title: 'The Gift You Never Wrapped', kicker: 'Track 02',
        desc: 'A thank-you to the person who noticed first, made room on the nightstand and stayed through everything.',
        photo: ['assets/img/christmas/03-gift-wrapping-studio.jpg?v=ebb-christmas-20261125-v1', 'The band wraps presents in their rehearsal space; one open gift box holds a CPAP mask and tubing.', 1536, 1024],
        lyrics: [
          ['Intro', `There's a box beneath the Christmas tree,
With my name written in your hand.
You've always known the things I wanted,
Better than I understand.`],
          ['Verse 1', `But I remember last December,
When the nights were wearing thin.
You were lying there beside me,
Wondering how to let me in.`],
          ['Pre-Chorus', `You didn't try to change me,
You just asked me to believe
That the life we had together
Could be better than I'd seen.`],
          ['Chorus', giftChorus],
          ['Verse 2', `There's a little mask beside the bed,
A quiet hum against the night.
You moved your books to make some room,
And said, "I think we'll be all right."

Now I hear you laughing in the kitchen,
And I don't have to ask you why.
There's a little less of yesterday
Still hanging in my eyes.`],
          ['Pre-Chorus', `You didn't need a grand confession,
Didn't need me to be brave.
You just held a little space for me
Until I learned to stay.`],
          ['Chorus', giftChorus],
          ['Bridge', `You heard the silence in my breathing,
Long before I heard a thing.
You said, "Let's find out what's happening,"
And stayed through everything.

Now the little hum beside us
Is a sound we've come to know.
You gave me room to rest at night,
And somewhere safe to go.`],
          ['Final Chorus', giftChorus],
          ['Outro', `There's a box beneath the Christmas tree,
With my name written in your hand.
But the gift you never wrapped
Was the way you took my hand.`]
        ]
      },
      {
        id: 'christmas-found-us-anyway', title: 'Christmas Found Us Anyway', kicker: 'Track 03',
        desc: 'Stuck at the airport on Christmas Eve, a few strangers pull their chairs together and make a holiday out of the delay.',
        photo: ['assets/img/christmas/02-gingerbread-kitchen.jpg?v=ebb-christmas-20261125-v1', 'Nina, Tom, Cal and Ben bake gingerbread in a festive kitchen; Nina pipes icing onto a gingerbread house.', 1536, 1024],
        lyrics: [
          ['Verse 1', `The board says, "Maybe after ten."
At ten, the numbers change again.
I call back home and try to sound
Like Christmas hasn't let me down.
I spot another CPAP case;
She shifts her coat and makes some space.
"You too?" she asks. I start to grin.
She opens up a cookie tin.`],
          ['Chorus', foundChorus],
          ['Verse 2', `I baked too much, as I always do.
These were for Mom. There's some for you.
She calls to say she's doing fine;
I know that voice—it's just like mine.
A little girl folds paper stars,
A boy takes out his old guitar.
We pass the cookies down the row;
He plays; we sing the songs we know.`],
          ['Chorus', foundChorus],
          ['Bridge', `Leave a little light on;
We'll get there when we can.
The snow can have the runway—
We've found a place to land.`],
          ['Final Chorus', foundChorus],
          ['Outro', `The board still says, "Delayed."
Christmas found us anyway.`]
        ]
      },
      {
        id: 'up-for-christmas', title: 'Up for Christmas', kicker: 'Track 04',
        desc: 'Christmas morning, for once up before the kids, and ready for every bit of the beautiful mess.',
        photo: ['assets/img/christmas/08-christmas-gift-exchange.jpg?v=ebb-christmas-20261125-v1', 'The band trades gifts by the tree in Santa hats; Nina unwraps new CPAP tubing.', 1536, 1024],
        lyrics: [
          ['Verse 1', `Six a.m., the hallway creaks,
Little feet outside our door.
CPAP off and slippers on—
No "just five minutes more."
They shout, "Dad! Come see! Come see!"
For once, they're running after me.
You catch me laughing on the stairs,
Like I'm the youngest person there.`],
          ['Chorus', upChorus],
          ['Verse 2', `Pancakes black around the edge,
There's tape still sticking to my leg.
You take a picture; I complain,
Then make you take it once again.
The room looks like a paper sea,
And you sit right down next to me.
You used to listen while I slept;
Now you're dreaming next to me.`],
          ['Chorus', upChorus],
          ['Bridge', `Someday the stairs will all be quiet;
They'll have their own trees to light.
So let them pull me every which way—
I've got both arms open wide.`],
          ['Final Chorus', upChorus],
          ['Outro', `I'm up for Christmas.
Bring on everything.`]
        ]
      },
      {
        id: 'tangled-up-in-christmas', title: 'Tangled Up in Christmas', kicker: 'Track 05',
        desc: 'A playful love song about hanging the lights, hiding the presents and never quite getting the star on the tree.',
        photo: ['assets/img/christmas/01-decorating-the-tree.jpg?v=ebb-christmas-20261125-v1', 'Cal, Ben, Tom and Nina decorate a Christmas tree trimmed with colorful CPAP tubing and CPAP mask ornaments, all in ugly Christmas sweaters.', 1672, 941],
        lyrics: [
          ['Verse 1', `My CPAP's on the nightstand,
Your coat's across the chair.
You came to help me hang the lights;
Now there's tinsel in your hair.
I reach up for that silver strand;
You catch my wrist and kiss my hand.
You say, "We've got so much to do."
I turn the music up on you.`],
          ['Chorus', tangledChorus],
          ['Verse 2', `You're wrapping something on the floor,
I find excuses to pass through.
You hide the box and block the door—
Can't get a single thing past you.
One kiss before the mask goes on;
I shift the tube and pull you near.
You say, "We never hung that star."
I say, "I've got my Christmas here."`],
          ['Chorus', tangledChorus],
          ['Bridge', `When all the paper's gone,
And every light comes down,
I'll still be wanting you
The way I want you now.`],
          ['Final Chorus', tangledChorus],
          ['Outro', `Tangled up in Christmas—
Come get tangled up with me.`]
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
    // Let other parts of the page (the seasonal banner's sound bars) know when music is playing.
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
      heroText: heroPlaying ? 'Pause' : 'Play “' + songs[0].title + '”',
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
