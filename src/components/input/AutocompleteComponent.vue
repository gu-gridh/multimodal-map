<template>
  <Combobox v-model="selectedItem">
    <div class="mt-0 non-clickable w-full">
      <div
        class="clickable relative cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
      >
        <ComboboxInput
          class="outline-none border-none py-2 pl-3 pr-10 w-full text-sm leading-5 text-gray-900 focus:ring-0"
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
          class="clickable relative mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <div
            v-if="searchResults.length === 0 && searchTerm !== ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700"
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
              class="relative cursor-default select-none py-2 pl-10 pr-4"
              :class="{
                'bg-teal-600 text-white': active,
                'text-gray-900': !active,
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
                :class="{ 'text-white': active, 'text-teal-600': !active }"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
    <div
      class="bg-white rounded p-4 my-2 shadow-md w-full flex content-end"
      v-if="selectedItem"
    >
      <span class="flex-auto" v-html="displayFunction(selectedItem)"></span>
      <button class="place-self-center mx-1 flex-auto" @click="clickUnselect">
        <XMarkIcon
          class="clickable h-6 w-6 text-red-700 hover:bg-red-200 rounded-full"
          aria-hidden="true"
        />
      </button>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { TextSearchFunction, DisplayFunction } from "../../types/diana";

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

const props = defineProps<{
  searchItems: TextSearchFunction;
  displayFunction: DisplayFunction;
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
</script>
