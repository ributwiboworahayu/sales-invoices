<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import cookies from "vue-cookies";
import axios from "axios";
import {baseApiUrl} from "../../config.js";

const router = useRouter();

const columns = ref([
  {title: "Status", data: "status"},
  {title: "Sales Order Number", data: "salesOrderNumber"},
  {title: "SO Date", data: "soDate"},
  {title: "Customer Name", data: "customerName"},
  {title: "Sales Person", data: "salesPerson"},
  {title: "Terms", data: "terms"},
  {title: "Net Total", data: "netTotal"},
  {title: "Remarks", data: "remarks"},
  {title: "Actions", data: "actions"}
]);

const invoices = ref([]);
const metadata = ref({});
const loading = ref(true);
const loadingTable = ref(false)
const currentPage = ref(1); // Current page
const totalPages = ref(0); // Total pages
const limit = 10; // Items per page

const mountInvoicesTable = async (page = 1) => {
  try {
    loadingTable.value = true;
    // Get data from API with page and limit
    const response = await axios.get(`${baseApiUrl}invoices?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`
      }
    });

    if (response.data.status === 'success') {
      invoices.value = response.data.data.records.map(invoice => ({
        status: invoice.status,
        salesOrderNumber: invoice.sales_order_number,
        soDate: invoice.so_date,
        customerName: invoice.customer_name,
        salesPerson: invoice.sales_person,
        terms: invoice.terms,
        netTotal: invoice.net_total,
        remarks: invoice.remarks ?? "",
        actions: [
          {
            text: "View", href: `/invoices/` +
                invoice.sales_order_number.replace(/\//g, '_')
          }
        ]
      }));
      const responseMetadata = response.data.data._metadata
      metadata.value = {
        currentPage: responseMetadata.page,
        limit: responseMetadata.per_page,
        totalRecords: responseMetadata.total
      }
      totalPages.value = Math.ceil(metadata.value.totalRecords / metadata.value.limit)

    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.log(error);
    alert('Something went wrong: ' + error);
  } finally {
    loadingTable.value = false; // Set loading to false after data is fetched
  }
}

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    mountInvoicesTable(page);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
}

const updateInvoice = async (salesOrderNumber, status) => {

  // update invoice status to Approved using API
  await axios.put(`${baseApiUrl}invoices/${salesOrderNumber.replace(/\//g, '_')}`, {
    status: status
  }, {
    headers: {
      Authorization: `Bearer ${cookies.get('token')}`
    }
  }).catch(error => {
    console.log(error);
    // if 401, redirect to login
    if (error.response.status === 401) {
      alert('Unauthorized. Please login again');
      router.push('/login')
    } else {
      alert('Something went wrong: ' + error)
    }
  }).finally(() => {
    mountInvoicesTable(currentPage.value)
  });
}


const deleteInvoice = async (salesOrderNumber) => {
  // ask before deleting
  if (!confirm('Are you sure you want to delete this invoice?')) {
    return
  }
  // delete invoice using API
  await axios.delete(`${baseApiUrl}invoices/${salesOrderNumber.replace(/\//g, '_')}`, {
    headers: {
      Authorization: `Bearer ${cookies.get('token')}`
    }
  }).catch(error => {
    console.log(error);
    // if 401, redirect to login
    if (error.response.status === 401) {
      alert('Unauthorized. Please login again');
      router.push('/login')
    } else {
      alert('Something went wrong: ' + error)
    }
  }).finally(() => {
    mountInvoicesTable(currentPage.value)
  });
}


onMounted(() => {
  mountInvoicesTable()

  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else>
    <div class="table-responsive my-2">
      <table id="invoices-table" class="table table-bordered">
        <thead>
        <tr>
          <th v-for="column in columns" :key="column.title" scope="col">{{ column.title }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="loadingTable">
          <td colspan="9" class="text-center align-middle">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="invoices.length === 0">
          <td :colspan="columns.length" class="text-center">No records found</td>
        </tr>
        <tr v-else v-for="invoice in invoices" :key="invoice.salesOrderNumber">
          <td>
            <span v-if="invoice.status === 'Approved'" class="badge bg-success">{{ invoice.status }}</span>
            <span v-else-if="invoice.status === 'Wait'" class="badge bg-secondary">{{ invoice.status }}</span>
            <span v-else class="badge bg-danger">{{ invoice.status }}</span>
          </td>
          <td>{{ invoice.salesOrderNumber }}</td>
          <td>{{ invoice.soDate }}</td>
          <td>{{ invoice.customerName }}</td>
          <td>{{ invoice.salesPerson }}</td>
          <td>{{ invoice.terms }}</td>
          <td>{{ invoice.netTotal }}</td>
          <td>{{ invoice.remarks }}</td>
          <td>
            <div class="row">
              <div class="col-3">
                <RouterLink class="btn btn-outline-secondary btn-sm view-btn" :to="invoice.actions[0].href">
                  <i class="bi bi-eye"></i>
                </RouterLink>
              </div>
              <div class="col-2">
                <div class="dropdown">
                  <button
                      class="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                  >
                    <i class="bi bi-file-earmark-text"></i>
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" :class="{ disabled: invoice.status === 'Approved' }"
                           @click="updateInvoice(invoice.salesOrderNumber, 2)">Approve</a></li>
                    <li><a class="dropdown-item" :class="{ disabled: invoice.status === 'Rejected' }"
                           @click="updateInvoice(invoice.salesOrderNumber, 3)">Reject</a></li>
                    <li>
                      <hr class="dropdown-divider">
                    </li>
                    <li>
                      <button class="dropdown-item text-bg-danger"
                              @click="deleteInvoice(invoice.salesOrderNumber)">Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-end">
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="previousPage" tabindex="-1" aria-disabled="true">Previous</a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>