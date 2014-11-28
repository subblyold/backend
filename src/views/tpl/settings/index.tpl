<div class="settings nano">
  <div class="nano-content">
    <div class="c-pdg-h c-pdg-t">
      <h3 class="f-ttl c-blk">Settings</h3>
      <ul role="tablist" class="nav-tabs">
        <li role="presentation">
          <a href="#settings-general" class="active">
            {{i18n 'settings.tabs.general'}}
          </a>
        </li>
        <li role="presentation">
          <a href="#settings-payment">
            {{i18n 'settings.tabs.payment'}}
          </a>
        </li>
        <li role="presentation">
          <a href="#settings-billing">
            {{i18n 'settings.tabs.billing'}}
          </a>
        </li>
        <li role="presentation">
          <a href="#settings-shipping-tax">
            {{i18n 'settings.tabs.shippingTaxs'}}
          </a>
        </li>
        <li role="presentation">
          <a href="#settings-language-curreny">
            {{i18n 'settings.tabs.languageCurrency'}}
          </a>
        </li>
        <li role="presentation">
          <a href="#settings-users">
            {{i18n 'settings.tabs.users'}}
          </a>
        </li>
      </ul><!-- /.nav-tab -->
      <div class="content-tabs">
        <form role="tabpanel" class="tab-pane form active" id="settings-general">
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">
                Name of your shop
              </label>
              <input type="text" class="form-input" name="subbly.shop_name" value="{{subbly.shop_name}}">
            </div><!-- /.form-field -->
          </div><!-- /.form-row -->
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">
                Email of admin
              </label>
              <input type="text" class="form-input" name="subbly.contact_email" value="{{subbly.contact_email}}">
            </div><!-- /.form-field -->
          </div><!-- /.form-row -->
          <div class="form-row">
            <div class="form-field input-6">
              <label class="form-label">
                Store statut
              </label>
              <span class="form-select-holder">
                <select class="form-input" name="subbly.shop_status">
                  {{#each siteStatusList}}
                  <option value="{{this}}" {{isSelected this default=../subbly.shop_status attribute="selected"}}>{{this}}</option>
                  {{/each}}
                </select>
              </span>
            </div><!-- /.form-field -->
          </div><!-- /.form-row -->
          <div class="form-row">
            <div class="form-field input-6">
              <label class="form-label">
                Backend Language
              </label>
              <span class="form-select-holder">
                <select class="form-input" name="subbly.backend_language">
                  {{#keyValue backendLocales}}
                  <option value="{{key}}" {{isSelected key default=../subbly.backend_language attribute="selected"}}>{{value}}</option>
                  {{/keyValue}}
                </select>
              </span>
            </div><!-- /.form-field -->
          </div><!-- /.form-row -->
          <p class="ta-r c-pdg-v">
            <button type="submit" class="btn btn-valid">
              Save
            </button>
          </p>
        </form>
        <div role="tabpanel" class="tab-pane" id="settings-payment">settings-payment</div>
        <div role="tabpanel" class="tab-pane" id="settings-billing">settings-billing</div>
        <div role="tabpanel" class="tab-pane" id="settings-shipping-tax">settings-shipping-tax</div>
        <div role="tabpanel" class="tab-pane" id="settings-language-curreny">settings-language-curreny</div>
        <div role="tabpanel" class="tab-pane" id="settings-users">settings-users</div>
      </div><!-- /.content-tabs -->
    </div><!-- /.c-pdg -->
  </div><!-- /.nano-content -->
</div><!-- /.settings -->