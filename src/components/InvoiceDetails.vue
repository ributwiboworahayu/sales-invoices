<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import cookies from "vue-cookies";
import {baseApiUrl} from "../../config.js";

const props = defineProps({
  invoiceId: {
    type: String,
    required: true
  }
});

const invoiceDetailData = ref([]);
const invoiceUser = ref({});
const loading = ref(true);  // Loading state

const mountDetailInvoice = async (invoiceId) => {
  try {

    console.log('invoiceId', invoiceId);
    // Get data from API
    const response = await axios.get(`${baseApiUrl}invoices/${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`
      }
    });

    if (response.data.status === 'success') {
      // Process invoice details
      invoiceDetailData.value = response.data.data.items.map(invoice => ({
        itemCode: invoice.item_code,
        itemName: invoice.item_name,
        warehouse: invoice.warehouse,
        qty: invoice.quantity,
        uom: invoice.uom,
        price: invoice.price,
        discount: invoice.discount,
        total: invoice.total
      }));

      // Process user details
      invoiceUser.value = {
        status: response.data.data.status,
        date: response.data.data.date,
        return: response.data.data.return,
        customerName: response.data.data.customer_name,
        salesPerson: response.data.data.sales_person,
        createdBy: response.data.data.created_by,
        remarks: response.data.data.remarks,
        totalQty: response.data.data.total_quantity,
        totalDiscount: response.data.data.total_discount,
        totalAmount: response.data.data.total_amount,
        totalNet: response.data.data.total_net
      };
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.log(error);
    alert('Something went wrong: ' + error);
  } finally {
    loading.value = false;  // Set loading to false after data is fetched
  }
};

onMounted(() => {
  mountDetailInvoice(props.invoiceId);
});
</script>

<template>
  <div class="container mt-4">
    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-6">
          <h4 class="text"><strong>Invoice Number: {{ invoiceId.replace(/_/g, '/') }}</strong></h4>
          <p><strong>Status: {{ invoiceUser.status }}</strong></p>
        </div>
      </div>
      <hr class="hr hr-blurry"/>
      <table class="table">
        <tbody>
        <tr>
          <th>Date</th>
          <td>: {{ invoiceUser.date }}</td>
        </tr>
        <tr>
          <th>Return</th>
          <td>: {{ invoiceUser.return }}</td>
        </tr>
        <tr>
          <th>Customer Name</th>
          <td>: {{ invoiceUser.customerName }}</td>
        </tr>
        <tr>
          <th>Sales Person</th>
          <td>: {{ invoiceUser.salesPerson }}</td>
        </tr>
        <tr>
          <th>Created By</th>
          <td>: {{ invoiceUser.createdBy }}</td>
        </tr>
        <tr>
          <th>Remarks</th>
          <td>: {{ invoiceUser.remarks }}</td>
        </tr>
        </tbody>
      </table>

      <hr class="hr hr-blurry"/>

      <div class="table-responsive">
        <table class="table">
          <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Warehouse</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="invoiceDetail in invoiceDetailData" :key="invoiceDetail.itemCode">
            <td>{{ invoiceDetail.itemCode }}</td>
            <td>{{ invoiceDetail.itemName }}</td>
            <td>{{ invoiceDetail.warehouse }}</td>
            <td>{{ invoiceDetail.qty }}</td>
            <td>{{ invoiceDetail.uom }}</td>
            <td>{{ invoiceDetail.price }}</td>
            <td>{{ invoiceDetail.discount }}</td>
            <td>{{ invoiceDetail.total }}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-center">Total Qty :</td>
            <td>{{ invoiceUser.totalQty }}</td>
            <td colspan="2"></td>
            <td>Amount :</td>
            <td>{{ invoiceUser.totalAmount }}</td>
          </tr>
          <tr>
            <td colspan="6"></td>
            <td>Discount :</td>
            <td>{{ invoiceUser.totalDiscount }}</td>
          </tr>
          <tr>
            <td colspan="6"></td>
            <td>Total :</td>
            <td>{{ invoiceUser.totalNet }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
