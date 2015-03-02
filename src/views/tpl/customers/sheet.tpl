<div class="nano">
  <div class="nano-content ord-dtls">
    <div class="fetch-holder rendering loading order-entry">
      <div class="loading-list">
        <div class="loader large"></div>
      </div>
      <div class="no-entry-selected">
        aucune fiche sélectionnée
      </div>
      <div class="ordr-cnt">
        <div class="c-pdg-h c-pdg-t">
          <div class="customer-title">
            <ul class="f-lrg customer-nav">
              <li>
                <a href="#customer-profile" class="active">
                  {{i18n 'orderDetails.tabs.profile'}}
                </a>
              </li>
              <li>
                <a href="#customer-orders">
                  {{i18nChoice 'orderDetails.tabs.orders' orders}}
                </a>
              </li>          
            </ul>
          </div>
          <div id="customer-profile" class="customer-tab active">
            <hr class="hr">
            <div class="cl-f pos-r">
              <div class="cust-identifier">
                <strong class="c-blk strong">{{displayName}}</strong>  n° {{id}}<br>
                {{email}}
                {{#if last_login}}
                <br>{{i18n 'customers.lastVisit'}}: {{lastLogin}}
                {{/if}}
              </div><!-- /.fl-l -->
              <span class="cust-action">
                <a href="javascript:;" class="btn btn-w-icon">
                  <i class="icon icon-mail"></i>
                  Send
                </a>
                <a href="javascript:;" class="btn btn-w-icon">
                  <i class="icon icon-edit"></i>
                  Edit
                </a>
              </span><!-- /.fl-r -->
            </div><!-- /.cl-f -->

            <hr class="hr full">

            <h4 class="f-lrg c-pdg-bas-v">Adresses</h4>

            <table class="cust-addresses">
              <colgroup>
                <col width="60px">
                <col width="200px">
                <col>
                <col width="30px">
              </colgroup>
              {{#keyValue addresses}}
              <tr data-index="{{key}}">
                <td>
                  <span class="address-id">{{indexPlusOne key}}</span>
                </td>
                <td>
                  {{value.lastname}} {{value.firstname}}
                </td>
                <td>
                  {{{formatAddress value}}}
                </td>
                <td>
                  <a href="javascript:;">
                    <i class="icon icon-edit"></i>
                  </a>
                </td>
              </tr>
              {{/keyValue}}
            </table>
            {{^addresses}}
            <span class="cust-no-addresses">
              pas d'adresses
            </span>
            {{/addresses}}

            <p class="ta-r c-pdg-v">
              <a href="javascript:;" class="btn btn-default">
                Delete this customer 
              </a>
            </p>
          </div><!-- /#customer-profile -->
          <div id="customer-orders" class="customer-tab">
            <ul class="cln-lst c-pdg-bas-t user-orders">
              <li class="cln-lst-rw cust-row js-trigger-goto list-row">
                <span class="cln-lst-itm cln-lst-blk ordr-sts"> <span class="bullet waiting"></span> </span>
                <span class="cln-lst-itm cln-lst-blk strong c-blk">
                  5 products
                </span>
                <span class="fl-r">
                  <span class="cln-lst-itm cln-lst-blk strong c-blk ordr-total">
                    $ 3 630.00
                  </span>
                  <span class="cln-lst-itm cln-lst-blk">
                    12/02/2014
                  </span>
                  <span class="cln-lst-itm cln-lst-blk ordr-btn-rcp">
                    <a href="javascript:;" class="btn btn-icon">
                      <i class="icon icon-files"></i>
                    </a>
                  </span>
                </span>
              </li>
            </ul>
          </div><!-- /#customer-orders -->
        </div><!-- /.c-pdg-h -->
      </div><!-- /.c-pdg-h -->
    </div><!-- /.fetch-holder -->
  </div><!-- /.nano-content ord-dtls -->
</div><!-- /.nano -->
