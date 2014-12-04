<div class="nano">
  <div class="nano-content">
    <div>
      <div class="column-title cl-f c-pdg-h c-pdg-t c-pdg-bas-b">
        <h3 class="f-ttl c-blk fl-l cur-p">
          {{i18n 'products.pageTitle'}}
          <span class="caret"></span>
        </h3>

        <form class="fl-r">
          <div class="cl-f">
            <a href="javascript:;" class="btn btn-action fl-l js-trigger-new">
              {{i18n 'products.btnAdd'}}
            </a>
            <p class="input-search-holder fl-l c-mrg-bas-l">
              <input type="search" class="form-input input-search" placeholder="{{i18n 'products.formPlaceholder'}}">
            </p>
          </div>
        </form>
      </div><!-- /.column-title -->
      <div class="column-title cl-f c-pdg-h c-pdg-bas-v ta-r">
        <a href="javascript:;" class="js-toggle-view" data-view="grid">
          <i class="icon icon-view-grid"></i>
        </a>
        <a href="javascript:;" class="c-mrg-bas-l js-toggle-view" data-view="list" style="margin-right:6px">
          <i class="icon icon-view-list"></i>
        </a>
      </div><!-- /.column-title -->
    </div>
    <div class="c-pdg-h c-pdg-b products-list fetch-holder rendering loading" id="products-list">
      <div class="loading-list">
        <div class="loader large"></div>
      </div>
      <div class="empty-list">
        {{i18n 'products.noEntry'}}
      </div>
      <div class="thmb-col js-view-item dp-n" id="products-view-grid"></div><!-- /.thmb-col -->
      <ul class="pdt-list js-view-item dp-n" id="products-view-list"></ul><!-- /.pdt-list -->
    </div><!-- /.c-pdg-h c-pdg-bas-v -->
  </div><!-- /.nano-content -->
</div><!-- /.nano -->
