Vue.component('filter-mentions', {
  template: html`
    <section id="feedblock-mentions">
      
      <h5 
        v-bind:class="{ 'has-mentions': mentions.length }"
        @click="showList = !showList" 
        title="Include @mentions to block. Press Enter to add.">
        Blocked mentions 
        <span v-show="mentions.length">({{ mentions.length }})</span>
      </h5>

      <ul v-show="showList">
        <li v-for="keyword in mentions">
          <span>{{ keyword }}</span>
          <a @click="removeMention(keyword)" class="delete">x</a>
        </li>
      </ul>
      
      <autocomplete-twitter v-on:selectionChoose="addMention" prefix="@" resultType="users" resultKey="screen_name"></autocomplete-twitter>
    
    </section>
  `(),

  props: ['network'],

  computed: {
    mentions() {
      return this.$store.state.filters[this.network].mentions;
    }
  },

  data() {
    return {
      showList: false
    };
  },

  methods: {
    addMention(value) {
      if (!value) {
        return;
      }
      if (!value.startsWith('@')) {
        value = '@' + value;
      }
      store.commit('MENTION_ADD', { mention: value, network: 'twitter' });
    },
    removeMention(value) {
      store.commit('MENTION_REMOVE', { mention: value, network: 'twitter' });
    }
  }
});
