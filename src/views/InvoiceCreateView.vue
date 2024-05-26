<script setup>
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';
import cookies from 'vue-cookies';
import router from "@/router/index.js";
import {baseApiUrl} from "../../config.js";

const searchTerm = ref('');
const options = ref([]);
const selectedOption = ref(null);
const showDropdown = ref(false);
const loading = ref(false);

const fetchOptions = async () => {
  try {
    const response = await axios.get(`${baseApiUrl}customers`, {
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    });
    options.value = response.data.data;
  } catch (error) {
    console.error('Error fetching options:', error);
  }
};

const filteredOptions = computed(() => {
  if (!searchTerm.value) {
    return options.value;
  }
  return options.value.filter(option =>
      option.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const setInputItems = (idName) => {
  const inputItem = document.getElementById(idName)

  // clear all options
  inputItem.innerHTML = ''

  // add first option is Choose...
  const option = document.createElement('option')
  option.text = 'Choose...'
  inputItem.appendChild(option)

  // get from api
  const warehouse = document.getElementById('warehouse').value
  axios.get(`${baseApiUrl}warehouses/${warehouse}/product`, {
    headers: {
      'Authorization': 'Bearer ' + cookies.get('token')
    }
  }).then(response => {
    response.data.data.forEach(product => {
      const option = document.createElement('option')
      option.value = product.id
      option.text = product.name
      if (idName === 'inputItem2') {
        if (document.getElementById('inputItem').value == product.id) {
          option.disabled = true
        }
      }
      inputItem.appendChild(option)
    })
  }).catch(error => {
    console.error('Error fetching products:', error);
  })
}

const loadWarehouses = () => {
  const warehouse = document.getElementById('warehouse')

  // get from api
  axios.get(`${baseApiUrl}warehouses`, {
    headers: {
      'Authorization': 'Bearer ' + cookies.get('token')
    }
  }).then(response => {
    response.data.data.forEach(warehouseData => {
      // select first warehouse
      if (warehouseData.id === 1) {
        warehouse.value = warehouseData.name
      }
      const option = document.createElement('option')
      option.value = warehouseData.name
      option.text = warehouseData.address
      warehouse.appendChild(option)
    })
    setInputItems('inputItem')

  }).catch(error => {
    console.error('Error fetching warehouses:', error);
  })
}

onMounted(() => {
  fetchOptions()
  loadWarehouses()
});

const selectOption = (option) => {
  selectedOption.value = option.id;
  searchTerm.value = option.name;
  showDropdown.value = false;
};

const setUpdateItems = () => {
  setInputItems('inputItem')
  if (document.getElementById('inputItem2') === null) {
    return
  }
  setInputItems('inputItem2')
}

// on change inputItem, update inputItem2
const onInputItemChange = () => {
  if (document.getElementById('inputItem2') === null) {
    return
  }
  setInputItems('inputItem2')
}

const removeItems = () => {
  // remove last input
  const inputItem = document.getElementsByClassName('input-item-block')
  const lastInput = inputItem[inputItem.length - 1]
  lastInput.parentNode.removeChild(lastInput)

  // remove last number input
  const inputItemNumber = document.getElementsByClassName('input-item-block-number')
  const lastInputNumber = inputItemNumber[inputItemNumber.length - 1]
  lastInputNumber.parentNode.removeChild(lastInputNumber)

  // show button add
  const addBtn = document.getElementById('add-items')
  addBtn.hidden = false

  // hide button remove
  const removeBtn = document.getElementById('remove-items')
  removeBtn.hidden = true
}

const addItems = () => {

  // if first input is empty, cannot add new input
  const inputItemVal = document.getElementById('inputItem').value
  if (inputItemVal === 'Choose...') {
    return
  }

  // add attribute hidden to remove button
  const addBtn = document.getElementById('add-items')
  addBtn.hidden = true

  // show remove button
  const removeBtn = document.getElementById('remove-items')
  removeBtn.hidden = false

  // add new input below the last input
  const inputItem = document.getElementsByClassName('input-item-block')
  const lastInput = inputItem[inputItem.length - 1]
  const newInput = document.createElement('div')
  newInput.classList.add('col-7', 'mb-3', 'input-item-block')

  // check if product is selected dont show in new input. only show option is not selected in last input
  const lastInputVal = lastInput.children[0].value
  newInput.innerHTML = `
    <select class="form-select" id="inputItem2" required>
      <!-- dinamically add options here -->
    </select>`
  lastInput.parentNode.appendChild(newInput)

  setInputItems('inputItem2')

  // add new number input below the last number input
  const inputItemNumber = document.getElementsByClassName('input-item-block-number')
  const lastInputNumber = inputItemNumber[inputItemNumber.length - 1]
  const newInputNumber = document.createElement('div')
  newInputNumber.classList.add('col-2', 'mb-3', 'input-item-block-number')
  newInputNumber.innerHTML = `
    <input type="number" class="form-control" id="inputItem" placeholder="Item" min="1" value="1">`
  lastInputNumber.parentNode.appendChild(newInputNumber)

}

// when submit button is clicked
const submit = async () => {
  loading.value = true;

  // get all items
  const itemsData = [];
  const inputItem = document.getElementsByClassName('input-item-block');
  const inputItemNumber = document.getElementsByClassName('input-item-block-number');
  for (let i = 0; i < inputItem.length; i++) {
    itemsData.push({
      item_id: inputItem[i].children[0].value,
      quantity: inputItemNumber[i].children[0].value
    });
  }

  // send with headers
  try {
    const response = await axios.post(`${baseApiUrl}invoices`, {
      order_type: document.getElementById('order-type').value,
      customer_id: selectedOption.value,
      sales_person: document.getElementById('sales-person').value,
      invoice_date: document.getElementById('so-date').value,
      warehouse_name: document.getElementById('warehouse').value,
      items: itemsData,
      terms: document.getElementById('terms').value,
      is_return: document.getElementById('return').value,
      discount: document.getElementById('discount').value,
      remarks: document.getElementById('remarks').value,
      status: document.getElementById('status').value
    }, {
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    });

    if (response.data.status === 'success') {
      await router.push('/invoices');
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('Error creating sales order:', error);
    alert('Something went wrong' + error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="container d-flex justify-content-center align-items-center mt-2">
      <div class="card col-sm mx-2 my-2">
        <div class="mx-2 mt-2">
          <RouterLink class="btn btn-outline-secondary" to="/invoices">
            <i class="bi bi-arrow-left"></i> Back
          </RouterLink>
        </div>

        <div class="card-body mx-4">
          <div class="mb-3">
            <h5 class="card-title my-2">Add Sales Order</h5>
          </div>
          <hr class="hr hr-blurry"/>

          <form @submit.prevent="submit">
            <div v-if="loading" class="d-flex justify-content-center align-items-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else>
              <div class="mb-3 col-6">
                <label for="order-type" class="form-label">Type</label>
                <select class="form-select" id="order-type" required>
                  <option value="SI">Sales Invoice</option>
                  <option selected value="SO">Sales Order</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="live-search-select" class="form-label">Select Customer</label>
                <div class="position-relative">
                  <input
                      type="text"
                      v-model="searchTerm"
                      @focus="showDropdown = true"
                      class="form-control"
                      placeholder="Search for a customer"
                      style="width: 100%;"
                      required
                  />
                  <div v-if="showDropdown" class="dropdown-menu show"
                       style="width: 100%; max-height: 200px; overflow-y: auto;">
                    <button
                        v-for="option in filteredOptions"
                        :key="option.id"
                        class="dropdown-item"
                        @click="selectOption(option)"
                    >
                      {{ option.name }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="sales-person" class="form-label">Sales Person</label>
                <input type="text" class="form-control" id="sales-person" required>
              </div>
              <div class="mb-3 col-6">
                <label for="so-date" class="form-label">Sales Order Date</label>
                <input type="date" class="form-control" id="so-date" required>
              </div>
              <div class="mb-3">
                <label for="warehouse" class="form-label">Warehouse</label>
                <select class="form-select" id="warehouse" required @change="setUpdateItems">
                  <!-- dinamically add options here -->
                </select>
              </div>
              <div class="row g-3">
                <label for="inputItem" class="form-label">Item Name</label>
                <div class="col-7 mb-3 input-item-block">
                  <select class="form-select" id="inputItem" required @change="onInputItemChange">
                    <!-- dinamically add options here -->
                  </select>
                </div>
                <div class="col-2 mb-3 input-item-block-number">
                  <input type="number" class="form-control" id="inputItem" placeholder="Item" min="1" value="1">
                </div>
                <div class="col-2 add-items-block">
                  <button type="button" class="btn btn-secondary mb-3" @click="addItems" id="add-items">
                    <i class="bi bi-plus"></i>
                  </button>
                  <button type="button" class="btn btn-secondary mb-3" @click="removeItems" id="remove-items"
                          hidden="hidden">
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
              </div>
              <div class="mb-3 col-6">
                <label for="terms" class="form-label">Terms</label>
                <input type="number" class="form-control" id="terms" required>
              </div>
              <div class="mb-3 col-6">
                <label for="return" class="form-label">Return</label>
                <select class="form-select" id="return" required>
                  <option value="1">Yes</option>
                  <option selected value="0">No</option>
                </select>
              </div>
              <div class="mb-3 col-6">
                <label for="discount" class="form-label">Discount</label>
                <input type="number" class="form-control" id="discount" value="0" min="0">
              </div>
              <div class="mb-3 col-6">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" required>
                  <option value="1" selected>Wait</option>
                  <option value="2">Approved</option>
                  <option value="3">Rejected</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="remarks" class="form-label">Remarks (optional)</label>
                <textarea class="form-control" id="remarks" rows="3"></textarea>
              </div>

              <button type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Style the dropdown menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}

.dropdown-menu.show {
  display: block;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}
</style>