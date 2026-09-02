import {GLYPHS} from "@gufo-labs/font";
import * as esbuild from "esbuild";
import type {CallExpression, Expression} from "estree";
import * as fs from "fs-extra";
import * as path from "path";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {GlyphTransformer} from "../plugins/GlyphTransformer.ts";
import {ReplaceMethodsPlugin} from "../plugins/ReplaceMethodsPlugin.ts";

describe("ReplaceMethodsPlugin", () => {
  const testDir = path.join(__dirname, "test-temp");

  beforeEach(async() => {
    await fs.ensureDir(testDir);
  });

  afterEach(async() => {
    await fs.remove(testDir);
  });

  it("should replace NOC.core.ResourceLoader.loadSet", async() => {
    const inputCode = `
    Ext.define("NOC.inv.channel.Application", {
      extend: "NOC.core.ModelApplication",
      preview: function(data){
        var me = this;

        this.currentId = data.id;
        NOC.core.ResourceLoader.loadSet("leaflet", {
          yandex: NOC.settings.gis.yandex_supported,
        })
        .then(() => {
          me.createMap(data);
        })
        .catch(() => {
          NOC.error(__("Failed to load map resources"));
        });
      },
    });
  `;
    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const plugin = new ReplaceMethodsPlugin({
      toReplaceMethods: [
        {
          name: "NOC.core.ResourceLoader.loadSet",
          replacement: {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "CallExpression",
                  callee: {
                    type: "MemberExpression",
                    object: {type: "Identifier", name: "leafletAPI"},
                    property: {type: "Identifier", name: "preload"},
                    computed: false,
                    optional: false,
                  },
                  arguments: [],
                  optional: false,
                },
                property: {type: "Identifier", name: "then"},
                computed: false,
                optional: false,
              },
              arguments: [
                {
                  type: "ArrowFunctionExpression",
                  params: [],
                  body: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: {type: "ThisExpression"},
                      property: {type: "Identifier", name: "createMap"},
                      computed: false,
                      optional: false,
                    },
                    arguments: [
                      {type: "Identifier", name: "data"},
                    ],
                    optional: false,
                  },
                  generator: false,
                  expression: true,
                  async: false,
                },
              ],
              optional: false,
            },
          },
        },   
      ],
      isDev: true,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({semanticDtsPath: "types/noc-glyph.d.ts", glyphCodes: GLYPHS, useSemantic: false, debug: false}),
    });

    const result = await esbuild.build({
      entryPoints: [inputFile],
      bundle: false,
      write: false,
      plugins: [plugin.getPlugin()],
    });

    const outputCode = result.outputFiles[0].text;
    expect(outputCode).not.toContain("NOC.core.ResourceLoader.loadSet");
    expect(outputCode).not.toContain(".catch");
    expect(outputCode).toContain("leafletAPI.preload()");
    expect(outputCode).toContain("this.createMap(data)");
  });
  
  it("should remove specified methods from JavaScript code", async() => {
    const inputCode = `
        console.debug("NOC.core.StateProvider");
        Ext.define("NOC.core.StateProvider", {
          extend: "Ext.state.Provider",
          url: "/main/desktop/state/",
          constructor: function(config2) {
            var me2 = this;
            me2.callParent();
            me2.state = me2.loadPreferences();
            console.log("User preferences state: ", me2.state);
          }
        });
    `;

    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const plugin = new ReplaceMethodsPlugin({
      isDev: true,
      toReplaceMethods: [
        {
          name: "console.debug",
          replacement: {
            type: "UnaryExpression",
            argument: {type: "Literal", value: 0},
            operator: "void",
            prefix: true,
          },
        },
        {
          name: "console.log",
          replacement: {
            type: "UnaryExpression",
            argument: {type: "Literal", value: 0},
            operator: "void",
            prefix: true,
          },
        },
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({semanticDtsPath: "types/noc-glyph.d.ts", glyphCodes: GLYPHS, useSemantic: false, debug: false}),
    });

    const result = await esbuild.build({
      entryPoints: [inputFile],
      bundle: false,
      write: false,
      plugins: [plugin.getPlugin()],
    });

    const outputCode = result.outputFiles[0].text;

    expect(outputCode).not.toContain("console.debug");
    expect(outputCode).not.toContain("console.log");
  });

  it("should handle replace method new_load_scripts", async() => {
    const inputCode = `
      console.debug("Defining NOC.inv.channel.Application");
      Ext.define("NOC.inv.channel.Application", {
        extend: "NOC.core.ModelApplication",
        requires: [
          "NOC.project.project.LookupField",
          "NOC.crm.subscriber.LookupField",
          "NOC.crm.supplier.LookupField",
          "NOC.main.remotesystem.LookupField",
          "Ext.ux.form.GridField",
        ],
        model: "NOC.inv.channel.Model",
        search: true,
        renderScheme: function(data){
          var me = this;
          if(typeof Viz === "undefined"){
            new_load_scripts([
              "/ui/pkg/viz-js/viz-standalone.js",
            ], me, Ext.bind(me._render, me, [data]));
          } else{
            me._render(data);
          }
        },
      });
    `;

    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const plugin = new ReplaceMethodsPlugin({
      isDev: true,
      toReplaceMethods: [
        {
          name: "new_load_scripts",
          replacement: {
            type: "CallExpression",
            callee: (node: CallExpression) => node.arguments[2] as Expression,
            arguments: [],
          },
        },
        {
          name: "console.debug",
          replacement: {
            type: "UnaryExpression",
            argument: {type: "Literal", value: 0},
            operator: "void",
            prefix: true,
          },
        },
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({semanticDtsPath: "types/noc-glyph.d.ts", glyphCodes: GLYPHS, useSemantic: false, debug: false}),
    });

    const result = await esbuild.build({
      entryPoints: [inputFile],
      bundle: false,
      write: false,
      plugins: [plugin.getPlugin()],
    });

    const outputCode = result.outputFiles[0].text;
    expect(outputCode).not.toContain("console.debug");
    expect(outputCode).not.toContain("new_load_scripts");
  });

  it("should handle files with no methods", async() => {
    const inputCode = `
      const x = 1;
      const y = 2;
      console.log(x + y);
    `;

    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const plugin = new ReplaceMethodsPlugin({
      isDev: true,
      toReplaceMethods: [
        {
          name: "console.debug",
          replacement: {
            type: "UnaryExpression",
            argument: {type: "Literal", value: 0},
            operator: "void",
            prefix: true,
          },
        },
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({semanticDtsPath: "types/noc-glyph.d.ts", glyphCodes: GLYPHS, useSemantic: false, debug: false}),
    });

    const result = await esbuild.build({
      entryPoints: [inputFile],
      bundle: false,
      write: false,
      plugins: [plugin.getPlugin()],
    });

    const outputCode = result.outputFiles[0].text;
    expect(outputCode).toContain("const x = 1");
    expect(outputCode).toContain("const y = 2");
  });

  it("should validate 'semantic' keyword in NOC.glyph references", async() => {
    const inputCode = `
      const icon1 = NOC.glyph.semantic.VALID;
      const icon2 = NOC.glyph.wrong.ICON;
    `;

    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const glyphCodes = {
      "test_icon": 0xf001,
    };

    const plugin = new ReplaceMethodsPlugin({
      isDev: true,
      toReplaceMethods: [],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({
        semanticDtsPath: path.join(__dirname, "fixtures", "semantic.d.ts"),
        glyphCodes: glyphCodes,
        debug: true,
        useSemantic: true,
      }),
    });

    await expect(async() => {
      await esbuild.build({
        entryPoints: [inputFile],
        bundle: false,
        write: false,
        plugins: [plugin.getPlugin()],
      });
    }).rejects.toThrow("Invalid glyph accessor: NOC.glyph.wrong");
  });

  it("should throw error for unknown semantic names", async() => {
    const inputCode = `
      const icon1 = NOC.glyph.semantic.UNKNOWN_NAME;
    `;

    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const semanticDtsPath = path.join(testDir, "semantic.d.ts");
    await fs.writeFile(semanticDtsPath, `
      export declare namespace semantic {
        /** @glyphName test_icon */
        readonly KNOWN_NAME: string;
      }
    `);

    const glyphCodes = {
      "test_icon": 0xf001,
    };

    const plugin = new ReplaceMethodsPlugin({
      isDev: true,
      toReplaceMethods: [],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({
        semanticDtsPath: semanticDtsPath,
        glyphCodes: glyphCodes,
        debug: true,
        useSemantic: true,
      }),
    });

    await expect(async() => {
      await esbuild.build({
        entryPoints: [inputFile],
        bundle: false,
        write: false,
        plugins: [plugin.getPlugin()],
      });
    }).rejects.toThrow("Unknown semantic constant: UNKNOWN_NAME");
  });

  it("should transform valid semantic glyph references", async() => {
    const inputCode = `
      const icon1 = NOC.glyph.semantic.TEST_ICON;
    `;

    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const semanticDtsPath = path.join(testDir, "semantic.d.ts");
    await fs.writeFile(semanticDtsPath, `
      export declare namespace semantic {
        /** @glyphName test_icon */
        readonly TEST_ICON: string;
      }
    `);

    const glyphCodes = {
      "test_icon": 0xf001,
    };

    const plugin = new ReplaceMethodsPlugin({
      isDev: true,
      toReplaceMethods: [],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({
        semanticDtsPath: semanticDtsPath,
        glyphCodes: glyphCodes,
        debug: true,
        useSemantic: true,
      }),
    });

    const result = await esbuild.build({
      entryPoints: [inputFile],
      bundle: false,
      write: false,
      plugins: [plugin.getPlugin()],
    });

    const outputCode = result.outputFiles[0].text;
    // Should replace with unicode code
    expect(outputCode).toContain("61441"); // 0xf001 in decimal
    expect(outputCode).not.toContain("NOC.glyph.semantic.TEST_ICON");
  });

  it("should ignore non-semantic glyphs when useSemantic is false", async() => {
    const inputCode = `
      const icon1 = NOC.glyph.semantic.TEST_ICON;
      const icon2 = NOC.glyph.other.ICON;
    `;

    const inputFile = path.join(testDir, "input.js");
    await fs.writeFile(inputFile, inputCode);

    const semanticDtsPath = path.join(testDir, "semantic.d.ts");
    await fs.writeFile(semanticDtsPath, `
      export declare namespace semantic {
        /** @glyphName test_icon */
        readonly TEST_ICON: string;
      }
    `);

    const glyphCodes = {
      "test_icon": 0xf001,
    };

    const plugin = new ReplaceMethodsPlugin({
      isDev: true,
      toReplaceMethods: [],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      glyphTransformer: new GlyphTransformer({
        semanticDtsPath: semanticDtsPath,
        glyphCodes: glyphCodes,
        debug: true,
        useSemantic: false,
      }),
    });

    const result = await esbuild.build({
      entryPoints: [inputFile],
      bundle: false,
      write: false,
      plugins: [plugin.getPlugin()],
    });

    const outputCode = result.outputFiles[0].text;
    expect(outputCode).toContain("61441");
    expect(outputCode).toContain("NOC.glyph.other.ICON");
  });
});
