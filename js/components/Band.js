/* Band component */
EBB.define("Band", (function () {
class Component extends DCLogic {
  state = { masked: {} };
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
    return {
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
    };
  }
}
return Component;
})());
