//
// template JS gettext
//

class NOCGettext{
  constructor(){
    this.lang = "{locale}";
    this.translations = "{translations}";
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
window._ = nocgettext.gettext.bind(nocgettext);
window.__ = nocgettext.gettext.bind(nocgettext);
window.ngettext = nocgettext.ngettext.bind(nocgettext);

// export const gettext = nocgettext.gettext.bind(nocgettext);
// export default nocgettext;