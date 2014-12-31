{{#each categories}}
  <li>
    <span class="product-category">
      {{asString}}
      <a href="javascript:;" class="js-remove-category-trigger" data-id="{{id}}">x</a>
    </span>
  </li>
{{/each}}
