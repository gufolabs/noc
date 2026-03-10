//---------------------------------------------------------------------
// NOC.main.glyph.Lookup
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------
console.debug("Defining NOC.main.glyph.LookupField");

Ext.define("NOC.main.glyph.LookupField", {
  extend: "NOC.core.ComboBox",
  alias: "widget.main.glyph.LookupField",
  uiStyle: "medium-combo",
  dataFields: ["id", "label", "font", "code"],
  tpl: ['<tpl for=".">',
        '<div class="x-boundlist-item" style="display: flex; align-items: center;gap: 15px;">',
        '<div class="gf">&#{code};</div> {label}</div>',
        "</tpl>"],
});
