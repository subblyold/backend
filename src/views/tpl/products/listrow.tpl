<li class="thmb pdt-lst-itm list cur-p js-tigger-goto" data-sku="{{sku}}">
  <i class="icon icon-handler"></i>
  {{#getDefaultImage}}
  <span class="thmb-img" style="background-image:url({{filename}})"></span>
  {{/getDefaultImage}}
  <span class="thmb-capt">
    <strong class="pdt-name">{{name}}</strong>
    <span class="pdt-price">{{formatNumber price type="currency"}}</span>
    <span class="badge product">{{quantity}}</span>
  </span><!-- /.thmb-capt -->
</li>
