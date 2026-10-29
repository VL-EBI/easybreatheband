/* Main component */
EBB.define("Main", (function () {
class Component extends DCLogic {
  state = { selected: 0, playing: false, cur: 0, dur: 0, durs: {}, loadError: null, open: {}, email: '', signupStatus: 'idle' };

  // ===== EBB CONFIGURATION — replace pending values here =====
  config() {
    return {
      // Audio: paths to files in assets/audio/ (or hosted audio URLs). Empty = player disabled with an honest message.
      audio: {
        'a-little-pressure': 'assets/audio/a-little-pressure.mp3',
        'leave-it-on': 'assets/audio/leave-it-on.mp3',
        'nothing-to-hide': 'assets/audio/nothing-to-hide.mp3',
        'tomorrow-comes-in-a-box': ''
      },
      // Easy Breathe testing/insurance/store links live in js/components/SiteCtas.js and js/components/SiteFooter.js.
      newsletterEndpoint: '',   // signup endpoint; success shows only on a confirmed response
      projectContactUrl: '',    // mailto: address or contact form URL
      instagramUrl: '',
      tiktokUrl: '',
      youtubeUrl: ''
    };
  }

  songs() {
    const alpChorus = `A little pressure
Takes the pressure off.
Someone to lean on
When the road gets rough.
Lay it on the table,
Leave the rest with me.
A little pressure,
A little room to breathe.`;
    const lioChorus = `Leave it on, leave it on,
You don't have to put on a show.
Leave it on, leave it on,
I love the you that only I know.
Come a little closer, let the long day go.
Leave it on.`;
    const nthPre = `No more trying to get it right.
I'm just being me tonight.`;
    const nthChorus = `I've got a mask on,
And nothing to hide.
Same heart beating,
Same wild side.
You like the real thing—
Baby, so do I.
I've got a mask on,
And nothing to hide.`;
    const nthPost = `Oh my, oh my,
Nothing, nothing to hide.
Oh my, oh my,
You like me better when I don't try.`;
    const tcChorus = `You couldn't watch me disappear,
A little more with every year.
Couldn't lie beside me, wide awake,
And wonder which breath I wouldn't take.
I said forever, you said when?
I closed my eyes, you cried again.
You didn't leave because you stopped loving me.
You left because I wouldn't see.`;
    return [
      {
        id: 'a-little-pressure', title: 'A Little Pressure',
        desc: 'An uplifting song about accepting help, finding room to breathe and passing that care along.',
        lyrics: [
          ['Intro', `A little pressure
Takes the pressure off.`],
          ['Verse 1', `I rolled in with a case of blues,
A crooked grin and some secondhand shoes.
A little worn down, a little off-key,
More on my mind than I let you see.
You said, "Come on in and pull up a seat;
There's always room at Easy Breathe."`],
          ['Pre-Chorus', `You heard the song beneath the doubt,
Turned it up instead of tuning out.`],
          ['Chorus', alpChorus],
          ['Verse 2', `See-pap humming by the bed,
A half-made song still in my head.
I had some questions, quite a few;
You sat with me and talked them through.
I said, "I'm taking all your time."
You said, "Take yours. You've got mine."`],
          ['Pre-Chorus', `Call it a deal, call it a trade;
You stood beside me either way.`],
          ['Chorus', alpChorus],
          ['Bridge', `I used to think that standing tall
Meant never needing help at all.
You gave me room to make it through;
Now let me do the same for you.`],
          ['Final Chorus', alpChorus],
          ['Outro', `A little pressure
Takes the pressure off.`]
        ]
      },
      {
        id: 'leave-it-on', title: 'Leave It On',
        desc: 'An intimate love song about being known, loved and comfortable enough to stop putting on a brave face.',
        lyrics: [
          ['Verse 1', `Your coat lands on the kitchen chair,
Like half the world was hanging there.
You say you're fine. I know that line;
I've used it more than once or twice.
Later, with the lights down low,
You make a joke, then let it go.
You reach to take the mask away;
I lean in close enough to say—`],
          ['Chorus', lioChorus],
          ['Verse 2', `See-pap humming beside the bed,
You pull my arm beneath your head.
We used to talk till the sun came through;
Now the quiet says a little, too.
You steal the covers, I take your side.
You swear you don't; I let it slide.
I miss those nights when we were young;
I wouldn't trade this one with you.`],
          ['Chorus', lioChorus],
          ['Bridge', `I've had my nights of hiding, too,
Smiled so you couldn't see.
You never asked for perfect,
Just the honest part of me.`],
          ['', `Take off the brave face.
Leave the mask on.`],
          ['Final Chorus', lioChorus],
          ['Outro', `Leave it on.
I love you like this.`]
        ]
      },
      {
        id: 'nothing-to-hide', title: 'Nothing to Hide',
        desc: 'A playful song about letting go of self-consciousness and showing someone who you really are, mask and all.',
        lyrics: [
          ['Intro', `Mask on.
Nothing to hide.`],
          ['Verse 1', `Good shoes by the bedroom door,
Two left feet on a wooden floor.
All night long I played it cool;
Now you're laughing at my moves.
Had a little speech rehearsed;
You leaned in and kissed me first.
Said, "Don't make this hard to do.
I came home to be with you."`],
          ['Pre-Chorus', nthPre],
          ['Chorus', nthChorus],
          ['Post-Chorus', nthPost],
          ['Verse 2', `See-pap humming by the bed,
All that fuss was in my head.
Little hose and a bedside glow—
That's the big secret. Now you know.
You steal the covers, I steal a kiss;
Tell me what's not to love about this?
You make room and I settle in.
Here comes that ridiculous grin.`],
          ['Pre-Chorus', nthPre],
          ['Chorus', nthChorus],
          ['Bridge', `You never asked for perfect.
I don't know why I tried.
You pulled me a little closer—
And I left that act outside.`],
          ['Final Chorus', nthChorus],
          ['Post-Chorus', nthPost],
          ['Outro', `Mask on.
Nothing to hide.`]
        ]
      },
      {
        id: 'tomorrow-comes-in-a-box', title: 'Tomorrow Comes in a Box',
        desc: 'An aching song about regret, a relationship strained by avoidance and finally choosing to take the first step.',
        lyrics: [
          ['Verse 1', `You used to wake me in the middle of the night,
Say, "Baby, something about your breathing isn't right."
I'd laugh and pull you closer, say, "I'm fine, go back to sleep."
While you lay there in the darkness,
Counting breaths I couldn't keep.
You made the calls, you found the names,
I found a hundred reasons.
Said I'd get around to it,
Like there'd always be another season.`],
          ['Pre-Chorus', `I thought you wanted me to change.
You just wanted me to stay.`],
          ['Chorus', tcChorus],
          ['Verse 2', `Your coffee cup's still by the sink,
Your sweater's on the chair.
Funny how a house can hold
So much of someone who's not there.
I used to call you worried,
Said you made too much of things.
Now I hear the silence
And the truth that silence brings.`],
          ['Pre-Chorus', `You weren't asking for a promise.
You were asking me to try.`],
          ['Chorus', tcChorus],
          ['Bridge', `I found the note you left me,
Folded underneath the phone.
"Please take care of yourself,
Even if you do it alone."
And for once I didn't argue.
Didn't say you had it wrong.
Just sat there with your handwriting
Till the morning came along.`],
          ['Final Chorus', `I know why you had to leave,
And what it cost to love me.
I can't undo those sleepless nights,
Or ask you to come running back to me.
But there's a little light beneath the door,
And I ain't waiting anymore.
I can't promise you forever.
I can promise you I'll try.`],
          ['Outro', `My home sleep test comes tomorrow.
I still have your number in my phone.
I don't know if you'll answer.
But I won't face this alone.`]
        ]
      }
    ];
  }

  srcFor(i) {
    const s = this.songs()[i];
    return s ? (this.config().audio[s.id] || '') : '';
  }

  componentDidMount() {
    const a = new Audio();
    a.preload = 'metadata';
    a.addEventListener('timeupdate', () => this.setState({ cur: a.currentTime || 0 }));
    a.addEventListener('loadedmetadata', () => this.setState({ dur: isFinite(a.duration) ? a.duration : 0 }));
    a.addEventListener('play', () => this.setState({ playing: true }));
    a.addEventListener('pause', () => this.setState({ playing: false }));
    a.addEventListener('ended', () => this.setState({ playing: false, cur: 0 }));
    a.addEventListener('error', () => { if (a.getAttribute('src')) this.setState({ playing: false, loadError: this.state.selected }); });
    this.audio = a;
    this.loadTrack(0);
    // Read each recording's real length from its file for the track list.
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

  onSubscribe(e) {
    if (e && e.preventDefault) e.preventDefault();
    const endpoint = this.config().newsletterEndpoint;
    if (!endpoint || this.state.signupStatus === 'loading') return;
    const email = (this.state.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.setState({ signupStatus: 'invalid' }); return; }
    this.setState({ signupStatus: 'loading' });
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) })
      .then((r) => { if (!r.ok) throw new Error('signup failed'); this.setState({ signupStatus: 'success' }); })
      .catch(() => this.setState({ signupStatus: 'error' }));
  }

  renderVals() {
    const st = this.state;
    const cfg = this.config();
    const songs = this.songs();
    const sel = songs[st.selected];
    const selAvailable = !!this.srcFor(st.selected) && st.loadError !== st.selected;
    const statusFor = (i) => {
      if (!this.srcFor(i)) return 'Audio not connected yet — lyrics available.';
      if (st.loadError === i) return 'This recording couldn’t be loaded.';
      return '';
    };

    const tracks = songs.map((s, i) => {
      const isSel = i === st.selected;
      const isPlaying = isSel && st.playing;
      const open = !!st.open[s.id];
      const available = !!this.srcFor(i) && st.loadError !== i;
      return {
        num: '0' + (i + 1),
        title: s.title,
        desc: s.desc,
        titleId: 'trk-' + s.id,
        lyricsId: 'lyr-' + s.id,
        rowClass: (isSel ? 'is-selected' : '') + (isPlaying ? ' is-playing' : ''),
        pressed: isSel ? 'true' : 'false',
        isPlaying: isPlaying,
        notPlaying: !isPlaying,
        showSelected: isSel && !isPlaying,
        unavailable: !available,
        status: statusFor(i),
        durText: st.durs[i] ? this.fmt(st.durs[i]) : '',
        playLabel: (isPlaying ? 'Pause "' : 'Play "') + s.title + '"',
        play: () => this.playTrack(i),
        select: () => this.selectTrack(i),
        lyricsOpen: open,
        lyricsExpanded: open ? 'true' : 'false',
        lyricsLabel: open ? 'Hide lyrics' : 'View lyrics',
        chevron: open ? 'rotate(180deg)' : 'none',
        toggleLyrics: () => this.setState({ open: Object.assign({}, st.open, { [s.id]: !open }) }),
        sections: s.lyrics.map((l) => ({ label: l[0], hasLabel: !!l[0], text: l[1] }))
      };
    });

    const social = [
      { label: 'Instagram', url: cfg.instagramUrl },
      { label: 'TikTok', url: cfg.tiktokUrl },
      { label: 'YouTube', url: cfg.youtubeUrl }
    ].filter((s) => !!s.url);

    const connected = !!cfg.newsletterEndpoint;
    const ss = st.signupStatus;
    let signupMsg = 'Email signup coming soon.';
    let signupMsgClass = '';
    if (connected) {
      signupMsg = '';
      if (ss === 'invalid') { signupMsg = 'Please enter a valid email address.'; signupMsgClass = 'msg--error'; }
      if (ss === 'loading') signupMsg = 'Signing you up…';
      if (ss === 'error') { signupMsg = 'Something went wrong. Please try again.'; signupMsgClass = 'msg--error'; }
      if (ss === 'success') { signupMsg = 'You’re in. Watch your inbox for EBB updates.'; signupMsgClass = 'msg--success'; }
    }

    return {
      tracks: tracks,
      selTitle: sel.title,
      selKicker: (st.playing ? 'Now playing · ' : 'Selected · ') + '0' + (st.selected + 1),
      miniShow: st.playing || st.cur > 0,
      progressPct: (st.dur ? Math.min(100, (st.cur / st.dur) * 100) : 0).toFixed(1) + '%',
      selPlaying: st.playing,
      discClass: st.playing ? 'is-spinning' : '',
      selNotPlaying: !st.playing,
      selUnavailable: !selAvailable,
      selPlayLabel: (st.playing ? 'Pause "' : 'Play "') + sel.title + '"',
      selStatus: statusFor(st.selected) || (st.playing ? 'Playing.' : 'Ready to play.'),
      toggleSelected: () => this.toggleSelected(),
      curText: this.fmt(st.cur),
      durText: st.dur ? this.fmt(st.dur) : '--:--',
      durMax: st.dur || 0,
      curVal: Math.min(st.cur, st.dur || 0),
      seekText: this.fmt(st.cur) + ' of ' + (st.dur ? this.fmt(st.dur) : 'unknown length'),
      onSeek: (e) => { const v = Number(e.target.value); if (this.audio && isFinite(v)) { this.audio.currentTime = v; this.setState({ cur: v }); } },
      listenFirst: () => { if (st.selected === 0 && st.playing) return; this.playTrack(0); },



      email: st.email,
      onEmail: (e) => this.setState({ email: e.target.value, signupStatus: st.signupStatus === 'invalid' || st.signupStatus === 'error' ? 'idle' : st.signupStatus }),
      onSubscribe: (e) => this.onSubscribe(e),
      emailInvalid: ss === 'invalid' ? 'true' : 'false',
      signupDisabled: !connected || ss === 'loading',
      signupBtn: ss === 'loading' ? 'Signing up…' : 'Keep me in the loop',
      signupMsg: signupMsg,
      signupMsgClass: signupMsgClass,

      social: social,
      hasSocial: social.length > 0,
      noSocial: social.length === 0,

      hasContact: !!cfg.projectContactUrl,
      noContact: !cfg.projectContactUrl,
      contactUrl: cfg.projectContactUrl || '#contact'
    };
  }
}
return Component;
})());
