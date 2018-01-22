/* <autocomplete-twitter> */

Vue.component('autocomplete-twitter', {
  template: html`
    <div>
      <input 
        @input="getSuggestions"
        @keydown.up="selectionUp"
        @keydown.down="selectionDown"
        @keydown.enter="selectionChoose"
        @keydown.esc="suggestions = []"
        v-model="searchTerm" 
        type="text">

      <ul v-show="searchTerm.length" class="autocomplete-list">
        <li v-for="(suggestion, index) in suggestions">
          <a 
            :class="{ 'u-bgUserColorLightest': index === activeIndex }"
            @click="selectionChoose"
            @mouseenter="activeIndex = index">
            {{ suggestion }}
          </a>
        </li>
      </ul>      
    </div>
  `(),
  props: ['prefix', 'resultType', 'resultKey'],
  data() {
    return {
      hovering: false,
      searchTerm: '',
      suggestions: [],
      activeIndex: -1
    };
  },
  methods: {
    getSuggestions() {
      if (!this.searchTerm) {
        return;
      }

      let suggestion = this.searchTerm;

      if (!suggestion.startsWith(this.prefix)) {
        suggestion = this.prefix + suggestion;
      }

      getJSON(
        `https://twitter.com/i/search/typeahead.json?count=10&filters=true&result_type=${
          this.resultType
        }&src=COMPOSE&q=${encodeURIComponent(suggestion)}`
      ).then(res => {
        this.suggestions = res[this.resultType]
          .map(u => {
            let result = u[this.resultKey];
            if (result.startsWith(this.prefix)) {
              return result;
            }
            return this.prefix + result;
          })
          .slice(0, 10);
      });
    },
    selectionChoose(event) {
      let suggestion = '';

      if (this.suggestions[this.activeIndex]) {
        // If there is an active suggestion highlighted, use that
        suggestion = this.suggestions[this.activeIndex];
      } else {
        // Otherwise, use what was in the box, in case the user just hit enter on that
        suggestion = this.searchTerm;
      }

      if (!suggestion) {
        return;
      }

      this.activeIndex = -1;
      this.suggestions = [];
      this.searchTerm = '';

      if (!suggestion.startsWith(this.prefix)) {
        suggestion = this.prefix + suggestion;
      }

      this.$emit('selectionChoose', suggestion);
    },
    selectionDown(event) {
      if (this.suggestions.length) {
        event.preventDefault();
        if (this.activeIndex >= this.suggestions.length - 1) {
          this.activeIndex = 0;
        } else {
          this.activeIndex += 1;
        }
      }
    },
    selectionUp(event) {
      if (this.suggestions.length) {
        event.preventDefault();
        if (this.activeIndex <= 0) {
          this.activeIndex = this.suggestions.length - 1;
        } else {
          this.activeIndex -= 1;
        }
      }
    }
  }
});
