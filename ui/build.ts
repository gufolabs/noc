import {createHash} from "crypto";
import fs from "fs-extra";
import * as path from "path";
import type {BuilderOptions, Language, Theme} from "./scripts/builders/BaseBuilder.ts";
import {BaseBuilder} from "./scripts/builders/BaseBuilder.ts";
import {DevBuilder} from "./scripts/builders/DevBuilder.ts";
import {ProdBuilder} from "./scripts/builders/ProdBuilder.ts";
import {VendorBuilder} from "./scripts/builders/VendorBuilder.ts";

type ModeType = "prod" | "dev" | "vendor" | "vendor-dev"

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve("./package.json"), "utf8"),
);

if(!process.argv[2] || !["prod", "dev", "vendor", "vendor-dev"].includes(process.argv[2])){
  throw new Error('Mode must be either "prod", "dev", "vendor", "vendor-dev"');
}
const mode = process.argv[2] as ModeType;

let theme: Theme;
if(process.argv[3]){
  if(!["gray", "noc"].includes(process.argv[3])){
    throw new Error('Theme must be either "gray" or "noc"');
  }
  theme = process.argv[3] as Theme;
} else{
  theme = (packageJson.config?.defaultTheme || "noc") as Theme;
  console.log(`Using default theme from package.json: ${theme}`);
}

let language: Language;
if(process.argv[4]){
  if(!["en", "ru", "pt_BR"].includes(process.argv[4])){
    throw new Error('Language must be either "en", "ru" or "pt_BR"');
  }
  language = process.argv[4] as Language;
} else{
  language = (packageJson.config?.defaultLanguage || "en") as Language;
  console.log(`Using default language from package.json: ${language}`);
}

const isDev = ["dev", "vendor-dev"].includes(mode);

const commonOptions: BuilderOptions = {
  buildDir: "dist",
  filePatterns: ["app", "theme", "ext-locale"], // files to clean in buildDir
  entryPoint: ["web/main/desktop/app.js"],
  cacheDir: ".cache",
  theme: theme,
  themes: ["gray", "noc"],
  language: language,
  languages: ["en", "ru", "pt_BR"],
  pluginDebug: false,
  isDev,
  htmlTemplate: `scripts/index-template.html`,
  assetsDir: "assets",
  cssEntryPoints: ["scripts/app-dev.css"],
  aliases: {
    "@cssPkg": "./pkg",
    "@cssWeb": "./web/css",
    "@theme": theme,
    "/ui/web/img": "./web/img",
  },
  toReplaceMethods: [
    // { // replace new_load_scripts() with the third argument of the call expression
    //   // new_load_scripts([], me, me._render); => me._render();
    //   name: "new_load_scripts",
    //   replacement: {
    //     type: "CallExpression",
    //     callee: (node: CallExpression) => node.arguments[2] as Expression,
    //     arguments: [],
    //   },
    // },
    {
      // remove console.debug() calls
      name: "console.log",
      replacement: {
        type: "UnaryExpression",
        argument: {type: "Literal", value: 0},
        operator: "void",
        prefix: true,
      },
    },
    {
      // remove console.debug() calls
      name: "console.debug",
      replacement: {
        type: "UnaryExpression",
        argument: {type: "Literal", value: 0},
        operator: "void",
        prefix: true,
      },
    },
  ],
  esbuildOptions: {
    bundle: true,
    sourcemap: isDev,
    // ToDO make option bundle suffix configurable
    // 'bundle' used in BaseBuilder.cleanBuildDir() to remove files
    // used in LoggerPlugin.checkDirectory() to exclude files from changed list
    entryNames: isDev ? "[name]-bundle" : "[name]-[hash]",
    metafile: true,
    minify: !isDev,
    keepNames: false,
    format: "esm",
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    comment: false,
    tokens: false,
    range: false,
    loc: false,
  },
  generateOptions: {
    indent: "  ",
    lineEnd: "\n",
  },
};

let builder: BaseBuilder;

switch(mode){
  case "dev":
    builder = new DevBuilder({
      ...commonOptions,
    });
    break;
  case "prod":
    builder = new ProdBuilder({
      ...commonOptions,
      entryPoint: [
        ...commonOptions.entryPoint,
      ],
      cssEntryPoints: [
        "scripts/app-prod.css",
        "scripts/theme-noc.css",
        "scripts/theme-gray.css",
      ],
    });
    break;
  case "vendor":
  case "vendor-dev": {
    delete commonOptions.cssEntryPoints;
    builder = new VendorBuilder({
      ...commonOptions,
      entryPoint: [`${commonOptions.cacheDir}/vendor.js`],
      esbuildOptions: {
        ...commonOptions.esbuildOptions,
        entryNames: "external.js",
      },
    });
    break;
  }
}

// Copy static assets & themes js-files
{
  fs.ensureDirSync(commonOptions.buildDir);
  const from = path.resolve("web/img");
  const to = path.join(commonOptions.buildDir, "web", "img");
  fs.copySync(from, to);

  // Copy theme JS files to build dir with content hash in filename
  const copyWithHash = (srcFile: string) => {
    const content = fs.readFileSync(srcFile);
    const hash = createHash("sha256").update(content).digest("hex").slice(0, 8);
    const base = path.basename(srcFile, ".js");
    const outFile = `${base}-${hash}.js`;
    const outPath = path.join(commonOptions.buildDir, outFile);

    // Remove previous versions of the same base (cleanup old hashed files)
    try{
      const entries = fs.readdirSync(commonOptions.buildDir);
      for(const e of entries){
        if(e.startsWith(`${base}-`) && e.endsWith(".js")){
          try{ fs.removeSync(path.join(commonOptions.buildDir, e)); } catch{ /* noop */ }
        }
      }
    } catch{ /* noop */ }

    fs.writeFileSync(outPath, content);
    console.log(`Copied ${path.relative(process.cwd(), srcFile)} -> ${path.relative(process.cwd(), outPath)}`);
    return;
  };

  try{
    const nocSrc = path.resolve("pkg/extjs/classic/theme-noc/theme-noc.js");
    const graySrc = path.resolve("pkg/extjs/classic/theme-gray/theme-gray.js");

    copyWithHash(nocSrc);
    copyWithHash(graySrc);

  } catch(e){
    console.warn("Warning: failed to copy theme JS files:", (e as Error).message);
  }
}

builder.start();

process.on("SIGINT", async() => {
  if(builder && "stop" in builder){
    await builder.stop();
  }
  process.exit(0);
});
