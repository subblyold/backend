<div class="nano">
  <div class="nano-content ord-dtls">
    <div class="c-pdg-h c-pdg-t">
      <div class="customer-title">
        <h3 class="f-lrg">
          <strong class="c-blk strong">Profile</strong>
          Orders ({{count orders}})
        </h3>
      </div>
      <div id="customer-orders">
        <ul class="cln-lst c-pdg-bas-t user-orders">
          <li class="cln-lst-rw cust-row js-trigger-goto list-row">
            <span class="cln-lst-itm cln-lst-blk ordr-sts"> <span class="bullet waiting"></span> </span>
            <span class="cln-lst-itm cln-lst-blk strong c-blk">
              5 products
            </span>
            <span class="fl-r">
              <span class="cln-lst-itm cln-lst-blk strong c-blk">
                $ 3 630.00
              </span>
              <span class="cln-lst-itm cln-lst-blk">
                12/02/2014
              </span>
              <span class="cln-lst-itm cln-lst-blk">
                <a href="javascript:;" class="btn btn-icon">
                  <i class="icon icon-files"></i>
                </a>
              </span>
            </span>
          </li>
        </ul>
      </div><!-- /#customer-orders -->
      <div id="customer-profile">
        <hr class="hr">
        <div class="cl-f">
          <div class="cust-identifier">
            <strong class="c-blk strong">{{displayName}}</strong>  n° {{id}}<br>
            {{email}}<br>
            Last visit: {{lastLogin}}
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
  <!--       <hr class="hr">
        <ul class="customer-subscriptions">
          <li>
            Newsletter : <strong class="c-blk strong">Yes</strong>
          </li>
          <li>
            Subscription date :  <strong class="c-blk strong">04/02/2012 at 19:10:51</strong>
          </li>
          <li>
            Last visit :  <strong class="c-blk strong">04/03/2012 at 13:14:13</strong>
          </li>
        </ul> -->
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
              {{{userAddress value}}}
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
      </div><!-- /.c-pdg-h -->
    </div><!-- /#customer-profile -->
  </div><!-- /.nano-content ord-dtls -->
</div><!-- /.nano -->
