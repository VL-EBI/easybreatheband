/* Band component */
EBB.define("Band", (function () {
class Component extends DCLogic {
  state = { masked: {}, open: -1, opener: -1 };

  photos() {
    const P = (id, src, w, h, caption, alt) => ({ id: 'g-' + id, src: src, w: w, h: h, caption: caption, alt: alt });
    return [
      P('live-crowd', 'assets/img/gallery/live-crowd.jpg?v=ebb-mask-fit-20261124-v3', 1122, 1402, 'A full room, masks and all', 'EBB performing under an Easy Breathe Band banner; Nina Brooks faces the front row while playing bass, and all four members and some fans wear CPAP masks.'),
      P('rehearsal', 'assets/img/gallery/rehearsal.jpg?v=ebb-mask-fit-20261124-v3', 1122, 1402, 'Rehearsal room, morning light', 'Cal Benton on acoustic guitar, Nina Brooks on bass, Tom Kellan on drums and Ben Halton on keys rehearsing in a sunlit room; Nina turns toward Ben, gesturing as she talks.'),
      P('nina-stage', 'assets/img/gallery/nina-stage.jpg?v=ebb-mask-fit-20261124-v3', 941, 1670, 'Nina, locked into the groove', 'Nina Brooks singing backing vocals into a microphone while playing her sunburst bass, wearing nasal pillows.'),
      P('cal-singing', 'assets/img/gallery/cal-singing.jpg?v=ebb-refresh-20261124', 1122, 1402, 'Cal at the mic', 'Cal Benton singing and playing acoustic guitar under warm stage lights, wearing nasal pillows.'),
      P('band-sofa', 'assets/img/gallery/band-sofa.jpg?v=ebb-mask-fit-20261124-v3', 1122, 1402, 'Between songs', 'Cal Benton, Nina Brooks, Ben Halton and Tom Kellan relaxing on a sofa and armchair with coffee mugs; Nina leans back laughing toward Tom.'),
      P('tom-drums', 'assets/img/gallery/tom-drums.jpg?v=ebb-refresh-20261124', 1122, 1402, 'Tom keeps time', 'Tom Kellan smiling behind his drum kit, wearing a full face mask.'),
      P('cal-ben-duo', 'assets/img/gallery/cal-ben-duo.jpg?v=ebb-mask-fit-20261124-v3', 941, 1672, 'Cal and Ben, trading a look', 'Cal Benton on acoustic guitar and Ben Halton on keys playing together on stage, both wearing CPAP masks.'),
      P('cal-signing', 'assets/img/gallery/cal-signing.jpg?v=ebb-refresh-20261124', 1122, 1402, 'Cal signs a fan’s CPAP machine', 'Cal Benton signing his name on a fan’s CPAP machine at a merch table while she laughs.'),
      P('ben-keys', 'assets/img/gallery/ben-keys.jpg?v=ebb-mask-fit-20261124-v3', 1122, 1402, 'Ben has another idea', 'Ben Halton grinning at the keyboard, wearing glasses and a compact full face mask.'),
      P('nina-bass', 'assets/img/gallery/nina-bass.jpg?v=ebb-mask-fit-20261124-v3', 1122, 1402, 'Nina, with the best line in the room', 'Nina Brooks leaning forward with her eyes closed, playing her sunburst bass and wearing nasal pillows.'),
      P('live-stage', 'assets/img/gallery/live-stage.jpg?v=ebb-mask-fit-20261124-v3', 941, 1671, 'EBB live', 'The full band on stage under an EBB banner, all four wearing CPAP masks; Nina Brooks turns in profile toward her bandmates as concertgoers stand in the foreground.')
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState && prevState.open !== this.state.open) {
      if (this.state.open >= 0) {
        const c = document.getElementById('lb-close'); if (c) c.focus();
      } else if (prevState.open >= 0) {
        // Return focus to the gallery tile that opened the viewer.
        const k = this.state.opener >= 0 ? this.state.opener : prevState.open;
        const t = document.getElementById(this.photos()[k].id); if (t) t.focus();
      }
    }
  }

  galleryVals() {
    const list = this.photos();
    const n = list.length;
    const open = this.state.open;
    const go = (i) => this.setState({ open: ((i % n) + n) % n });
    const cur = open >= 0 ? list[open] : list[0];
    const withOpen = list.map((p, i) => Object.assign({}, p, { open: () => this.setState({ open: i, opener: i }) }));
    return {
      // Fixed desktop columns (top to bottom): col 1 = photos 1–3, col 2 = 4–7, col 3 = 8–11.
      gcols: [{ items: withOpen.slice(0, 3) }, { items: withOpen.slice(3, 7) }, { items: withOpen.slice(7) }],
      lbOpen: open >= 0,
      cur: cur,
      lbLabel: 'Photo: ' + cur.caption,
      lbCount: (open + 1) + ' / ' + n,
      close: () => this.setState({ open: -1 }),
      prev: () => go(open - 1),
      next: () => go(open + 1),
      onLbKey: (e) => {
        if (e.key === 'Escape') { e.preventDefault(); this.setState({ open: -1 }); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(open - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(open + 1); }
      }
    };
  }

  renderVals() {
    const people = [
      { key: 'cal', first: 'Cal', name: 'Cal Benton', role: 'Lead vocals and acoustic guitar', hook: 'Brings the heart.',
        bio: "Cal leads with a warm voice and a stubborn sense of hope. He believes the next song could be the one that gets people listening, and he's happy to play it one more time to find out." },
      { key: 'nina', first: 'Nina', name: 'Nina Brooks', role: 'Bass and backing vocals', hook: 'Keeps everyone grounded.',
        bio: 'Nina brings a steady groove, a confident voice and a dry sense of humor. She keeps the band moving and usually has the best line in the room.' },
      { key: 'ben', first: 'Ben', name: 'Ben Halton', role: 'Guitar and keys', hook: 'Has another idea.',
        bio: 'Ben hears possibilities in every song. A different chord, another harmony, a keyboard part nobody asked for yet. His enthusiasm tends to come with one more arrangement idea.' },
      { key: 'tom', first: 'Tom', name: 'Tom Kellan', role: 'Drums', hook: 'Is ready when they are.',
        bio: 'Tom is easygoing, observant and quietly particular about his routines. He keeps the rhythm steady, knows where everything belongs and catches more than the others realize.' }
    ];
    const masked = this.state.masked;
    const set = (k, v) => this.setState({ masked: Object.assign({}, masked, { [k]: v }) });
    return Object.assign(this.galleryVals(), {
      members: people.map((p) => {
        const on = !!masked[p.key];
        return Object.assign({}, p, {
          id: 'member-' + p.key,
          cropClass: 'm-' + p.key + (on ? ' is-masked' : ' is-unmasked'),
          alt: p.name + (on ? ', wearing a CPAP mask' : ''),
          toggleLabel: 'Photo of ' + p.first,
          onPressed: on ? 'true' : 'false',
          offPressed: on ? 'false' : 'true',
          showOn: () => set(p.key, true),
          showOff: () => set(p.key, false)
        });
      })
    });
  }
}
return Component;
})());
