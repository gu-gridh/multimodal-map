<template>
  <Combobox v-model="selectedItem">
    <div class="mt-0 non-clickable w-full">
      <div
        class="clickable relative cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm"
      >
        <ComboboxInput
          class="searchbox"
          @change="searchTerm = $event.target.value"
          :placeholder="placeholderText"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="searchTerm = ''"
      >
        <ComboboxOptions
          class="searchbox-menu clickable relative overflow-auto shadow-lg focus:outline-none"
        >
          <div
            v-if="searchResults.length === 0 && searchTerm !== ''"
            class=""
          >
            {{ noResultsText }}
          </div>

          <ComboboxOption
            v-for="item in searchResults"
            as="template"
            :key="item.id"
            :value="item"
            v-slot="{ selected, active }"
          >
            <li
              class="searchbox-menu-text"
              :class="{
              'searchbox-menu-text-active': active,
                'searchbox-menu-text-inactive': !active,
              }"
            >
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
                v-html="displayFunction(item)"
              >
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-teal-300': !active }"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
    
        
    <!-- <div
      class="bg-white rounded p-4 my-2 shadow-md w-full flex content-end clickable"
      v-if="selectedItem"
    >
    <router-link :to="`/place/${store.results?.id}`" class="clickable">
      <span class="flex-auto" v-html="displayFunction(selectedItem)"></span>
    </router-link>
      <button class="place-self-center mx-1 flex-auto" @click="clickUnselect">
        
        <XMarkIcon
          class="clickable h-6 w-6 text-red-700 hover:bg-red-200 rounded-full"
          aria-hidden="true"
        />
      </button>
    </div> -->
  </Combobox>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, watch } from "vue";
import type { TextSearchFunction } from "../../types/diana";
import { mapStore } from "@/stores/store";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import router from "@/router";

const props = defineProps<{
  searchItems: TextSearchFunction;
  displayFunction: (item: any) => string;
  placeholderText: string;
  noResultsText: string;
}>();

const searchResults = ref<Array<any>>([]);
const searchTerm = ref<string>("");

watch(searchTerm, () => {
  props.searchItems(searchTerm.value).then((d) => {
    searchResults.value = d;
  });
});

let selectedItem = ref<any>();

function clickUnselect() {
  selectedItem.value = undefined;
}


const store = mapStore();

watch(selectedItem, () => {
  store.updateResults(selectedItem.value)
  router.push({path: `/place/${store.results?.id}`})
  .then(() => {router.go(0)})
})
</script>

<style scoped>
.rounded-lg{
  border-radius:8px;

}
</style>
