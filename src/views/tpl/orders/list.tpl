<div class="nano">
  <div class="nano-content">
    <div>
      <div class="column-title cl-f c-pdg-h c-pdg-t c-pdg-bas-b">
        <h3 class="f-ttl c-blk fl-l">{{{i18n 'orders.pageTitle'}}}</h3>

        <h4 class="f-ttl fl-r c-blk">
          <span class="f-sml c-bas dp-b" style="padding-top: 8px;">SALES TODAY</span>
          $ 499.00
        </h4>
      </div><!-- /.column-title -->
      <div class="scrll-stck">
        <form class="scrll-stck-cnt c-pdg-h c-pdg-bas-v">
          <p class="input-search-holder">
            <input type="search" class="form-input input-search" placeholder="{{{i18n 'orders.formPlaceholder'}}}">
          </p>
        </form><!-- /.scrll-stck-cnt -->
      </div><!-- /.scrll-stck -->
    </div>
    <div class="fetch-holder rendering loading orders-list">
      <div class="loading-list">
        <div class="loader large"></div>
      </div>
      <div class="empty-list">
        {{{i18n 'orders.noEntry'}}}
      </div>
      <ul class="cln-lst c-pdg-bas-t" id="orders-list"></ul><!-- /.cln-lst -->
    </div>
  </div><!-- /.nano-content -->
</div><!-- /.nano -->