import type {TSESTree} from "@typescript-eslint/types";
import {parse} from "@typescript-eslint/typescript-estree";
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
  useSemantic: boolean;
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
  private useSemantic: boolean;
  private initialized = false;

  constructor(options: GlyphTransformerOptions){
    this.semanticDtsPath = options.semanticDtsPath;
    this.glyphCodes = options.glyphCodes;
    this.debug = options.debug || false;
    this.useSemantic = options.useSemantic;
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
    // Check for NOC.glyph.* pattern and validate "semantic" keyword
    if(this.useSemantic){
      const glyphPattern = /NOC\.glyph\.(\w+)\.\w+/g;
      let match;
      
      while((match = glyphPattern.exec(contents)) !== null){
        const keyword = match[1];
        if(keyword !== "semantic"){
          throw new Error(
            `[GlyphTransformer] Invalid glyph accessor: NOC.glyph.${keyword}\n` +
            `  File: ${filePath}\n` +
            `  Expected: NOC.glyph.semantic.<NAME>\n` +
            `  Use "semantic" keyword to access glyph constants`,
          );
        }
      }
    }

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

  public loadGlyphMappings(): void{
    const dtsPath = path.resolve(process.cwd(), this.semanticDtsPath);

    if(!fs.existsSync(dtsPath)){
      throw new Error(`[GlyphTransformer] Semantic definitions file not found: ${dtsPath}`);
    }

    const content = fs.readFileSync(dtsPath, "utf8");

    // Parse TypeScript .d.ts file using AST
    const parseResult = parse(content, {
      comment: true,
      loc: true,
      range: true,
      tokens: true,
    });

    this.log(`Parsed AST, found ${parseResult.body.length} top-level nodes`);
    this.log(`Comments found: ${parseResult.comments?.length || 0}`);

    const semanticMembers = this.findSemanticInterface(parseResult);
    
    this.log(`Found ${semanticMembers.length} semantic members`);

    if(semanticMembers.length === 0){
      throw new Error(`[GlyphTransformer] No semantic members found in AST`);
    }

    const comments = parseResult.comments || [];
    
    this.log(`Total comments in file: ${comments.length}`);
    
    for(const member of semanticMembers){
      const semanticName = this.extractPropertyName(member);
      const glyphName = this.extractGlyphNameFromComments(member, comments);

      if(semanticName && glyphName){
        this.glyphMapping[semanticName] = glyphName;
        this.log(`  Mapped ${semanticName} -> ${glyphName}`);
      }
      else if(semanticName && !glyphName){
        this.log(`  Warning: ${semanticName} has no @glyphName (line ${member.loc?.start.line})`);
      }
    }

    this.log(`Total mappings found: ${Object.keys(this.glyphMapping).length}`);

    if(Object.keys(this.glyphMapping).length === 0){
      throw new Error(`[GlyphTransformer] No glyph mappings found in ${dtsPath}`);
    }
  }

  private findSemanticInterface(ast: TSESTree.Program): TSESTree.TypeElement[]{
    for(const node of ast.body){
      // Look for: interface NOC
      if(node.type === "TSInterfaceDeclaration" && node.id.name === "NOC"){
        // Find glyph property
        for(const property of node.body.body){
          if(this.isPropertyWithName(property, "glyph") && property.type === "TSPropertySignature"){
            const glyphType = property.typeAnnotation?.typeAnnotation;
            if(glyphType?.type === "TSTypeLiteral"){
              // Find semantic property inside glyph
              for(const glyphMember of glyphType.members){
                if(this.isPropertyWithName(glyphMember, "semantic") && glyphMember.type === "TSPropertySignature"){
                  const semanticType = glyphMember.typeAnnotation?.typeAnnotation;
                  if(semanticType?.type === "TSTypeLiteral"){
                    // Return all members of semantic interface
                    return semanticType.members;
                  }
                }
              }
            }
          }
        }
      }
    }
    throw new Error("[GlyphTransformer] Could not find NOC.glyph.semantic interface in AST");
  }

  private isPropertyWithName(node: TSESTree.TypeElement, name: string): boolean{
    return node.type === "TSPropertySignature" && node.key?.type === "Identifier" && node.key.name === name;
  }

  private extractPropertyName(node: TSESTree.TypeElement): string | null{
    if(node.type === "TSPropertySignature" && node.readonly && node.key && node.key.type === "Identifier"){
      return node.key.name;
    }
    return null;
  }

  /**
   * Extract @glyphName from leading comments
   * Since typescript-estree doesn't attach comments automatically,
   * we need to find them manually based on position
   */
  private extractGlyphNameFromComments(node: TSESTree.TypeElement, allComments: TSESTree.Comment[]): string | null{
    if(!node.loc){
      return null;
    }

    // Find comments that are right before this node
    // (comments that end on the line before the node starts)
    const relevantComments = allComments.filter(comment => 
      comment.loc && 
      comment.loc.end.line >= node.loc!.start.line - 2 && 
      comment.loc.end.line < node.loc!.start.line,
    );

    for(const comment of relevantComments){
      if(comment.type === "Block" || comment.type === "Line"){
        const match = comment.value.match(/@glyphName\s+(\w+)/);
        if(match){
          return match[1];
        }
      }
    }
    return null;
  }

  private log(...args: (string | number | boolean | object)[]): void{
    if(this.debug){
      console.log("[GlyphTransformer]", ...args);
    }
  }
}
