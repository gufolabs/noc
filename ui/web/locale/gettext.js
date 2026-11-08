//---------------------------------------------------------------------
// i18n framework.
//---------------------------------------------------------------------
// Copyright (C) 2007-2026 The NOC Project
// See LICENSE for details
//---------------------------------------------------------------------

import IntlMessageFormat from "intl-messageformat";

const locale = "{locale}";
const translations = {translations};

const messages = new Map();

for(const [key, pattern] of Object.entries(translations)){
  messages.set(
    key,
    pattern.includes("{")
      ? new IntlMessageFormat(pattern, locale)
      : pattern,
  );
}

function t(key, args = {}){
  const message = messages.get(key);

  if(message === undefined){
    throw new Error(`Translation "${key}" not found`);
  }

  return typeof message === "string"
    ? message
    : message.format(args);
}

window.t = t;
