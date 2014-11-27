<div class="dashboard">
  <div class="dashboard-content">
    <h3 class="f-ttl c-pdg-b">
      Welcome in your shop,<br>
      <span class="c-blk">You need to configure your Paypal</span>
    </h3>
    <p>
      <a href="javascript:;" class="btn btn-action">
        Set your shipping
      </a>
      <a href="javascript:;" class="btn btn-product js-trigger-new-product">
        Add a product
      </a>
    </p>
    <ul class="dashboard-stats">
      <li>
        <span>SALES TODAY</span>
        {{formatNumber todaySales type="currency"}}
      </li>
      <li>
        <span>CUSTOMERS</span>
        {{formatNumber totalCustomers}}
      </li>
      <li>
        <span>ORDERS</span>
        {{formatNumber totalOrders}}
      </li>
      <li>
        <span>AVERAGE BASKET</span>
        {{formatNumber basketAverage type="currency"}}
      </li>
    </ul>
  </div><!-- /.dashboard-content -->
</div><!-- /.dashboard -->
