import * as fs from "fs";
import * as path from "path";

interface GlyphMapping {
  [semanticName: string]: string; // semantic name -> glyph name
}

interface GlyphCodes {
  [glyphName: string]: number; // glyph name -> unicode
}

export interface GlyphTransformerOptions {
  semanticDtsPath: string;
  glyphCodes: GlyphCodes;
  debug?: boolean;
}

/**
 * Transforms NOC.glyph.semantic.XXX references to unicode codes
 * Used as a pre-transformer in ReplaceMethodsPlugin
 */
export class GlyphTransformer{
  private semanticDtsPath: string;
  private glyphMapping: GlyphMapping = {};
  private glyphCodes: Record<string, number>;
  private debug: boolean;
  private initialized = false;

  constructor(options: GlyphTransformerOptions){
    this.semanticDtsPath = options.semanticDtsPath;
    this.glyphCodes = options.glyphCodes;
    this.debug = options.debug || false;
  }

  /**
   * Initialize glyph mappings from .d.ts file
   * Should be called once before any transformations
   */
  public initialize(): void{
    if(this.initialized){
      return;
    }

    this.log("Initializing glyph mappings...");
    this.loadGlyphMappings();
    this.initialized = true;
    this.log(`Loaded ${Object.keys(this.glyphMapping).length} semantic mappings`);
  }

  /**
   * Transform NOC.glyph.semantic references in content
   * @param contents - File content to transform
   * @param filePath - File path (for error messages)
   * @returns Transformed content
   */
  public transform(contents: string, filePath: string): string{
    // Quick check - skip files without semantic references
    if(!contents.includes("NOC.glyph.semantic.")){
      return contents;
    }

    // Skip the semantic files themselves
    if(filePath.includes("glyph.semantic")){
      return contents;
    }

    this.log(`Transforming glyphs in: ${filePath}`);

    return contents.replace(
      /NOC\.glyph\.semantic\.(\w+)/g,
      (match, semanticName) => {
        // Step 1: Get glyph name from semantic name
        const glyphName = this.glyphMapping[semanticName];

        if(!glyphName){
          throw new Error(
            `[GlyphTransformer] Unknown semantic constant: ${semanticName}\n` +
            `  File: ${filePath}\n` +
            `  Available constants: ${Object.keys(this.glyphMapping).slice(0, 20).join(", ")}...`,
          );
        }

        // Step 2: Get unicode code from glyph name
        const glyphCode = this.glyphCodes[glyphName];

        if(glyphCode === undefined){
          throw new Error(
            `[GlyphTransformer] Glyph not found: ${glyphName} (for semantic: ${semanticName})\n` +
            `  File: ${filePath}\n` +
            `  Available glyphs: ${Object.keys(this.glyphCodes).slice(0, 20).join(", ")}...`,
          );
        }

        this.log(`  ${match} -> ${glyphCode} (0x${glyphCode.toString(16)})`);

        // Return the unicode code as a number
        return glyphCode.toString();
      },
    );
  }

  private loadGlyphMappings(): void{
    const dtsPath = path.resolve(process.cwd(), this.semanticDtsPath);

    if(!fs.existsSync(dtsPath)){
      throw new Error(`[GlyphTransformer] Semantic definitions file not found: ${dtsPath}`);
    }

    const content = fs.readFileSync(dtsPath, "utf8");

    // Parse: /** @glyphName glyph_name */\n      readonly SEMANTIC_NAME: string;
    const regex = /\/\*\*\s*@glyphName\s+(\w+)\s*\*\/\s*readonly\s+(\w+):/g;
    let match;

    while((match = regex.exec(content)) !== null){
      const [, glyphName, semanticName] = match;
      this.glyphMapping[semanticName] = glyphName;
      this.log(`  Mapped ${semanticName} -> ${glyphName}`);
    }

    if(Object.keys(this.glyphMapping).length === 0){
      throw new Error(`[GlyphTransformer] No glyph mappings found in ${dtsPath}`);
    }
  }

  private log(...args: (string | number | boolean | object)[]): void{
    if(this.debug){
      console.log("[GlyphTransformer]", ...args);
    }
  }
}
