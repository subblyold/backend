<div class="nano">
  <div class="nano-content ord-dtls">
    <div class="fetch-holder rendering loading order-entry">
      <div class="loading-list">
        <div class="loader large"></div>
      </div>
      <div class="error-message" id="entry-error-message">
        <code>{{{i18n 'errors.codeDefault'}}}</code>
        <p>{{{i18n 'errors.serverDefault'}}}</p>
      </div>
      <div class="ordr-cnt">
        <div class="c-pdg-h c-pdg-t">
          <div class="order-title cl-f">
            <h3 class="fl-l">
              <span class="f-ttl c-blk dp-b">{{orderId}}</span>
              {{createdDate}}
            </h3>
            <span class="fl-r">
              <a href="javascript:;" class="btn btn-icon">
                <i class="icon icon-files"></i>
              </a>
              <a href="javascript:;" class="btn btn-icon">
                <i class="icon icon-print"></i>
              </a>
            </span><!-- /.fl-r -->
          </div>
          <hr class="hr">
          <p class="ord-sts-rsm"><!-- order status resume -->
            <span class="strong c-blk">{{gateway}}</span> - {{status}}
          </p><!-- /.ord-sts-rsm -->
          <ul class="ord-lst"><!-- order list -->
            {{#each products}}
            <li class="ord-lst-rw">
              <span class="thmb-list">
                <span class="thmb-img" style="background-image:url(/uploads/product-03.jpg)"></span>
              </span>
              <span class="pdt-dtls">
                <span class="pdt-dtls-primary">
                  <span>
                    <strong class="pdt-name dp-b">Reunion tour shirt</strong>
                    <span class="pdt-opt dp-b">taille s</span>
                  </span>
                </span><!-- /.pdt-dtls-primary -->
                <ul class="pdt-dtls-lst">
                  <li class="pdt-price">
                    <span class="pdt-value pdt-price-value">
                      {{formatNumber price type="currency"}}
                    </span>
                  </li>
                  <li class="pdt-qty">
                    <span class="pdt-value pdt-qty-value">
                      {{quantity}}
                    </span>
                  </li>
                  <li class="pdt-total">
                    <span class="pdt-value pdt-total-value">
                      1 336,00 €
                    </span>
                  </li>
                </ul>
              </span><!-- /.pdt-dtls -->
            </li><!-- /.ord-lst-rw -->
            {{/each}}
          </ul><!-- /.ord-lst -->
          <hr class="hr">
          <div class="ord-ttl-dts"><!-- orded total details -->
            <p class="cl-f">
              <span class="fl-l">
                <span class="ord-wgt c-blk strong dp-b">360 gr</span><!-- order weight -->
                <span>
                  <span class="ord-dlv-cpy"><!-- order delivery company -->
                    Colissimo Express
                  </span>
                  - $8,99
                </span>
              </span>
              <span class="fl-r strong f-ttl strong c-blk">
                {{formatNumber total_price type="currency"}}
              </span>
            </p>
          </div><!-- /.ord-ttl-dts -->
        </div><!-- /.c-pdg -->
        <hr class="hr" style="margin-left:-40px;margin-right:-40px">
        <div class="c-pdg-h c-pdg-b">
          <div class="order-custommer cl-f">
            <h3 class="f-lrg fl-l" style="padding-top:8px">
              <span class="strong c-blk">{{user.displayName}}</span> {{{userId}}}
            </h3>
            <span class="fl-r">
              <a href="javascript:;" class="btn btn-icon">
                <i class="icon icon-mail"></i>
              </a>
            </span><!-- /.fl-r -->
          </div><!-- /.order-custommer -->
          <div class="order-addresses cl-f">
            <p class="fl-l c-pdg-bas-v" style="width:50%">
              <span class="strong c-blk dp-b cl-f" style="margin-bottom:8px">
                Delivery adress
                <i class="icon icon-edit c-dgr -fl-l" style="margin-left:10%"></i>
              </span>
              Benjamin Guedj<br>
              16 bis allee du jardin anglais<br>
              93340 LE RAINCY<br>
              FRANCE<br>
            </p>
            <p class="fl-l c-pdg-bas-v" style="width:50%">
              <span class="strong c-blk dp-b" style="margin-bottom:8px">
                Delivery adress
                <i class="icon icon-edit c-dgr -fl-l" style="margin-left:10%"></i>
              </span>
              Benjamin Guedj<br>
              16 bis allee du jardin anglais<br>
              93340 LE RAINCY<br>
              FRANCE<br>
            </p>
          </div><!-- /.order-addresses -->
        </div><!-- /.c-pdg -->
      </div><!-- /.ordr-cnt -->
  </div><!-- /.nano-content ord-dtls -->
</div><!-- /.nano -->