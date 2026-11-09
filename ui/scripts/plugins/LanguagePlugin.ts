import type {Plugin} from "esbuild";
import * as fs from "fs";
import * as path from "path";
import {parse} from "yaml";
import type {Language} from "../builders/BaseBuilder.ts";

interface LanguagePluginOptions {
  debug: boolean;
  isDev: boolean;
  outputDir: string;
  cacheDir: string;
  languages: Language[];
  language?: Language;
}

export class LanguagePlugin{
  private readonly options: LanguagePluginOptions;
  private readonly catalogDir = path.resolve(process.cwd(), "../src/noc/i18n");
  private readonly localeDir = "web/locale";
  
  constructor(options: LanguagePluginOptions){
    this.options = options;
  }
  
  getPlugin(): Plugin{
    return {
      name: "language-plugin",
      setup: (build) => {
        build.onEnd((result) => {
          if(result.errors.length || !result.metafile){
            return;
          }
          for(const output of Object.keys(result.metafile.outputs)){
            const outputPath = path.resolve(output);
            if(!/^locale-.*\.js$/.test(path.basename(outputPath))){
              continue;
            }
            const contents = fs.readFileSync(outputPath, "utf8");
            fs.writeFileSync(outputPath, `(() => {\n${contents}\n})();`);
          }
        });
        build.onResolve({filter: /^locale-/}, (args) => ({
          path: args.path,
          namespace: "locale",
        }));
        build.onLoad({filter: /.*/, namespace: "locale"}, (args) => {
          const lang = args.path.slice("locale-".length);
          return {
            contents: this.generateLocaleContent(lang),
            loader: "js",
            resolveDir: process.cwd(),
          };
        });
      },
    };
  }

  private log(...args: (string | number | boolean | object)[]): void{
    if(this.options.debug){
      console.log("[LanguagePlugin]", ...args);
    }
  }

  private loadTranslations(lang: string): Record<string, string>{
    const loadCatalog = (language: string): Record<string, string> => {
      const filePath = path.join(this.catalogDir, `${language}.yml`);
      const catalog: unknown = parse(fs.readFileSync(filePath, "utf8"));
      if(typeof catalog !== "object" || catalog === null || Array.isArray(catalog)){
        throw new TypeError(`Invalid translation catalog: ${filePath}`);
      }
      const entries = Object.entries(catalog);
      if(entries.some(([key, value]) => typeof key !== "string" || typeof value !== "string")){
        throw new TypeError(`Translation catalog must contain string keys and values: ${filePath}`);
      }
      return Object.fromEntries(entries) as Record<string, string>;
    };

    return {
      ...loadCatalog("en"),
      ...(lang === "en" ? {} : loadCatalog(lang)),
    };
  }

  private generateLocaleContent(lang: string): string{
    const projectRoot = path.resolve(process.cwd());
    const templatePath = path.join(projectRoot, this.localeDir, "gettext.js");
    const templateContent = fs.readFileSync(templatePath, "utf8");
    const extLocalePath = path.join(
      projectRoot,
      this.localeDir,
      `${lang}/ext-locale-${lang}.js`,
    );
    const extLocale = fs.readFileSync(extLocalePath, "utf8");
    const translations = this.loadTranslations(lang);
    const formatLocale = lang.replaceAll("_", "-");

    return extLocale + templateContent
      .replaceAll('"{locale}"', JSON.stringify(formatLocale))
      .replaceAll("{translations}", JSON.stringify(translations));
  }
}
