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

  if(typeof message === "string"){
    return message;
  }

  const parts = message.formatToParts(args);
  return Array.isArray(parts)
    ? parts.map((part) => part.value).join("")
    : String(parts ?? "");
}

window.t = t;
