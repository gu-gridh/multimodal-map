<template>
  <div v-if="styleType === 'button'" class="flex flex-wrap gap-2">
    <CategoryButton
      v-for="(label, key) in categories"
      :key="key"
      :text="label"
      :value="!!modelValue.includes(key)"
      @toggle="toggle(key)"
    />
  </div>
  <select v-else :value="modelValue[0]" class="dropdown" @change="dropdownToggle($event)">
    <option value="all">all</option>
    <option 
      v-for="(label, key) in categories"
      :key="key"
      :value="key">
      {{ label }}
    </option>
  </select>
</template>

<script setup>
import CategoryButton from "../../../src/components/input/CategoryButton.vue";

const props = defineProps({
  modelValue: Array, 
  categories: Object,
  limit: {
    type: Number, 
    default: undefined 
  },
  styleType: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: undefined
  }
});


const emit = defineEmits(["update:modelValue", "click"]);

function toggle(key) {
  handleToggle(key);
}

function dropdownToggle(event) {
  const selectElement = event.target| null;
  
  if (selectElement) {
    const selectedKey = selectElement.value;
    handleToggle(selectedKey);
  }
}

function handleToggle(key) {
  if (key === 'all') {
    emit("update:modelValue", ['all']); // Set modelValue to ['all']
    
    // If this dropdown is for "Necropolis", then move the map
    // if (props.type === 'necropolis') {
    //   selectedNecropolisCoordinates.value = [1335733.925763396, 5194636.579769473];
    // }

    emit('click', 'all'); // Emit the special 'all' value
    return;
  }
  
  let newValue = [...props.modelValue];
  if (newValue.includes(key)) {
    newValue.splice(newValue.indexOf(key), 1);
  } else if (props.limit === 1) {
    newValue = [key];
  } else {
    newValue.push(key);
  }
  
  emit("update:modelValue", newValue);
  emit('click', key); 
}

</script>

<style scoped>
.dropdown {
    color: white;
    border-radius: 5px;
    background-color: rgb(180, 100, 100);
    padding: 3px 10px;
    padding-right: 30px;
    width: auto;
    height: auto;
    background-image: url("/dropdown-arrow.png");
    background-size: 15px;
    background-repeat: no-repeat;
    background-position: calc(100% - 10px) 10px;
    -webkit-appearance: none;
    text-transform: capitalize;
  
}

.dropdown:hover {
    background-color: rgb(160, 80, 80);
}

.dropdown:focus {
    outline: none;
    outline-color: rgb(140, 60, 60) !important;
}
</style>
