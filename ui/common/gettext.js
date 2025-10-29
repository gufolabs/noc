//
// Simple JS gettext implementation
//
import ptTranslations from "../web/translations/pt_BR.json";
import ruTranslations from "../web/translations/ru.json";

class NOCGettext{
  constructor(){
    this.lang = "en";
    this.translations = {};
  }
  async initialize(){
    var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
    this.set_translation(lang);
  }
  gettext(s){
    var t = this.translations[s];
    if(t === undefined){
      return s;
    }
    if(typeof t === "string"){
      return t;
    } else{
      return t[1];
    }
  }
  ngettext(){
    console.log("ngettext is not implemented yet");
    return this.gettext(arguments[0]);
  }
  set_translation(lang){
    if(!lang || lang.toLowerCase() === "en"){
      this.lang = "en";
      this.translations = {};
      return;
    }
    if(lang.toLowerCase() === "ru"){
      this.lang = "ru";
      this.translations = ruTranslations;
      this.compile_plurals();
      return;
    }
    if(lang.toLowerCase() === "pt_br"){
      this.lang = "pt_BR";
      this.translations = ptTranslations;
      this.compile_plurals();
      return;
    }
  }
  plural_index(n){
    // English fallback
    if(n > 1){
      return 1;
    } else{
      return 0;
    }
  }
  compile_plurals(){
    // English plurals
    var plurals = "nplurals = 2; plural = n ? 1 : 0";
    // Translation plurals
    if(this.translations[""] && this.translations[""]["Plural-Forms"]){
      plurals = this.translations[""]["Plural-Forms"];
    }
    // Build function
    this.plural_index = new Function("n", `${plurals}; return plural;`);
  }
}

var nocgettext = new NOCGettext();
nocgettext.initialize().catch(function(error){
  console.warn("Failed to initialize translations:", error);
});
window._ = nocgettext.gettext.bind(nocgettext);
window.__ = nocgettext.gettext.bind(nocgettext);
window.ngettext = nocgettext.ngettext.bind(nocgettext);

export const gettext = nocgettext.gettext.bind(nocgettext);
export default nocgettext;