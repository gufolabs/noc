/**
 * NOC Semantic Glyph Type Definitions
 * Provides IntelliSense/autocomplete for NOC.glyph.semantic in VSCode
 * Augments the existing NOC global object defined in ui/web/js/boot.js
 */

interface NOC {
  glyph: {
    semantic: {
        // =================================================================
        // CRUD OPERATIONS (Create, Read, Update, Delete)
        // =================================================================
      
        /** Save changes (text: "Save", tooltip: "Save changes") */
        /** @glyphName floppy_disk_s */
        readonly ACTION_SAVE: string;
        /** Apply without closing (text: "Apply", tooltip: "Save changes and continue editing") */
        /** @glyphName plus_s */
        readonly ACTION_SAVE_AND_CONTINUE: string;
      
        /** Add new item (text: "Add", tooltip: "Add new record") */
        /** @glyphName plus */
        readonly ACTION_ADD: string;
        /** Create new object */
        /** @glyphName plus */
        readonly ACTION_CREATE: string;
        /** Insert item */
        /** @glyphName plus */
        readonly ACTION_INSERT: string;
        /** Append to list */
        /** @glyphName floppy_disk_s */
        readonly ACTION_APPEND: string;
      
        /** Edit object (text: "Edit", "Group Edit") */
        /** @glyphName edit */
        readonly ACTION_EDIT: string;
        /** Clone/Copy (text: "Clone", tooltip: "Copy existing values to a new object") */
        /** @glyphName copy */
        readonly ACTION_CLONE: string;
      
        /** Delete object (text: "Delete", tooltip: "Delete object") */
        /** @glyphName times */
        readonly ACTION_DELETE: string;
        /** Remove from list */
        /** @glyphName minus */
        readonly ACTION_REMOVE: string;
        /** Remove all items (text: "Remove All", "Unselect All") */
        /** @glyphName minus_circle */
        readonly ACTION_REMOVE_ALL: string;
        /** Clear content/form */
        /** @glyphName eraser */
        readonly ACTION_CLEAR: string;
        /** Move to trash */
        /** @glyphName trash_o */
        readonly ACTION_TRASH: string;
      
        /** Close window/form (text: "Close", tooltip: "Close without saving") */
        /** @glyphName arrow_left */
        readonly ACTION_CLOSE: string;
        /** Cancel operation */
        /** @glyphName times */
        readonly ACTION_CANCEL: string;
      
        /** Reset to defaults (text: "Reset", tooltip: "Reset to default values") */
        /** @glyphName undo */
        readonly ACTION_RESET: string;
        /** Undo changes */
        /** @glyphName undo */
        readonly ACTION_UNDO: string;
      
        /** Run/Execute (text: "Run", tooltip: "Run") */
        /** @glyphName play */
        readonly ACTION_RUN: string;
        /** Start/Play action */
        /** @glyphName play */
        readonly ACTION_PLAY: string;
        /** Execute command */
        /** @glyphName play */
        readonly ACTION_EXECUTE: string;
      
        // =================================================================
        // DATA OPERATIONS
        // =================================================================
      
        /** Refresh data (text: "Refresh", tooltip: "Refresh") */
        /** @glyphName refresh */
        readonly DATA_REFRESH: string;
        /** Reload content */
        /** @glyphName refresh */
        readonly DATA_RELOAD: string;
      
        /** Export data (text: "Export", tooltip: "Save screen", "Export") */
        /** @glyphName arrow_down */
        readonly DATA_EXPORT: string;
        /** Import data */
        /** @glyphName arrow_down */
        readonly DATA_IMPORT: string;
        /** Download file (tooltip: "Download image as SVG", "Download content") */
        /** @glyphName download */
        readonly DATA_DOWNLOAD: string;
        /** Upload file (tooltip: "Upload list of allocated IP addresses") */
        /** @glyphName upload */
        readonly DATA_UPLOAD: string;
      
        /** Search (text: "Preview") */
        /** @glyphName search */
        readonly DATA_SEARCH: string;
        /** Advanced search (text: "Query") */
        /** @glyphName search_plus */
        readonly DATA_SEARCH_ADVANCED: string;
      
        // =================================================================
        // NAVIGATION
        // =================================================================
      
        /** Navigate up */
        /** @glyphName arrow_up */
        readonly NAV_UP: string;
        /** Navigate down */
        /** @glyphName arrow_down */
        readonly NAV_DOWN: string;
        /** Navigate left/back */
        /** @glyphName arrow_left */
        readonly NAV_LEFT: string;
        /** Navigate right/forward */
        /** @glyphName arrow_right */
        readonly NAV_RIGHT: string;
        /** Go back */
        /** @glyphName arrow_left */
        readonly NAV_BACK: string;
      
        /** Go to parent level */
        /** @glyphName level_up */
        readonly NAV_LEVEL_UP: string;
        /** Go to child level (icon usage in trees) */
        /** @glyphName level_down */
        readonly NAV_LEVEL_DOWN: string;
      
        /** Navigate to location (tooltip: "Center to object") */
        /** @glyphName location_arrow */
        readonly NAV_LOCATION: string;
        /** Set position marker (tooltip: "Set position") */
        /** @glyphName map_marker */
        readonly NAV_MAP_MARKER: string;
      
        /** Expand view */
        /** @glyphName expand */
        readonly NAV_EXPAND: string;
        /** Collapse view */
        /** @glyphName compress */
        readonly NAV_COLLAPSE: string;
      
        // =================================================================
        // VIEW MODES
        // =================================================================
      
        /** Preview view */
        /** @glyphName eye */
        readonly VIEW_PREVIEW: string;
        /** Show details */
        /** @glyphName eye */
        readonly VIEW_SHOW: string;
        /** Card view */
        /** @glyphName eye */
        readonly VIEW_CARD: string;
        /** List view (text: "VLAN Interfaces") */
        /** @glyphName list */
        readonly VIEW_LIST: string;
        /** Grid view */
        /** @glyphName reorder */
        readonly VIEW_GRID: string;
        /** Map view */
        /** @glyphName map */
        readonly VIEW_MAP: string;
        /** Alternative map view */
        /** @glyphName map_o */
        readonly VIEW_MAP_ALT: string;
        /** Globe/Network view */
        /** @glyphName globe */
        readonly VIEW_GLOBE: string;
        /** Chart/Graph view */
        /** @glyphName line_chart */
        readonly VIEW_CHART: string;
        /** Tree/Hierarchy view */
        /** @glyphName sitemap */
        readonly VIEW_TREE: string;
      
        // =================================================================
        // ENTITY TYPES
        // =================================================================
      
        /** User entity */
        /** @glyphName user */
        readonly ENTITY_USER: string;
        /** Device/Server */
        /** @glyphName server */
        readonly ENTITY_DEVICE: string;
        /** Network topology */
        /** @glyphName sitemap */
        readonly ENTITY_NETWORK: string;
        /** File/Document (text: "JSON") */
        /** @glyphName file */
        readonly ENTITY_FILE: string;
        /** Code file */
        /** @glyphName file_code_o */
        readonly ENTITY_FILE_CODE: string;
        /** Video/Recording */
        /** @glyphName film */
        readonly ENTITY_VIDEO: string;
      
        // =================================================================
        // STATUS INDICATORS
        // =================================================================
      
        /** Success state */
        /** @glyphName check */
        readonly STATUS_SUCCESS: string;
        /** Success with circle (text: "Fix") */
        /** @glyphName check_circle */
        readonly STATUS_SUCCESS_CIRCLE: string;
        /** Error state (text: "Set unmanaged") */
        /** @glyphName times */
        readonly STATUS_ERROR: string;
        /** Error with circle */
        /** @glyphName times_circle */
        readonly STATUS_ERROR_CIRCLE: string;
        /** Warning state */
        /** @glyphName exclamation_triangle */
        readonly STATUS_WARNING: string;
        /** Information */
        /** @glyphName info */
        readonly STATUS_INFO: string;
        /** Help/Question (text: "About system ...", tooltip: "Application Help", "Help") */
        /** @glyphName question_circle */
        readonly STATUS_QUESTION: string;
        /** Favorite/Important */
        /** @glyphName star */
        readonly STATUS_STAR: string;
      
        // =================================================================
        // CONNECTION/LINKING
        // =================================================================
      
        /** Link/Connect */
        /** @glyphName link */
        readonly CONNECT_LINK: string;
        /** Remove link */
        /** @glyphName unlink */
        readonly CONNECT_UNLINK: string;
        /** Connect plug */
        /** @glyphName plug */
        readonly CONNECT_PLUG: string;
        /** Bidirectional connection */
        /** @glyphName arrows_h */
        readonly CONNECT_ARROWS: string;
      
        // =================================================================
        // MANAGEMENT/CONFIGURATION
        // =================================================================
      
        /** Settings/Configuration (text: "User profile ...") */
        /** @glyphName cog */
        readonly CONFIG_SETTINGS: string;
        /** Tools/Maintenance (text: "New Maintenance", tooltip: "Edit Prefix") */
        /** @glyphName wrench */
        readonly CONFIG_WRENCH: string;
        /** Repair/Fix tools */
        /** @glyphName medkit */
        readonly CONFIG_MEDKIT: string;
        /** Auto-configuration/Magic (text: "Create from model") */
        /** @glyphName magic */
        readonly CONFIG_MAGIC: string;
      
        // =================================================================
        // SHOPPING CART (Object Selection)
        // =================================================================
      
        /** Add to cart (text: "Add") */
        /** @glyphName cart_plus */
        readonly CART_ADD: string;
        /** View cart */
        /** @glyphName shopping_cart */
        readonly CART_VIEW: string;
        /** Remove from selection */
        /** @glyphName minus_circle */
        readonly CART_REMOVE: string;
      
        // =================================================================
        // COMMUNICATION
        // =================================================================
      
        /** Terminal/Console */
        /** @glyphName terminal */
        readonly COMM_TERMINAL: string;
        /** Print */
        /** @glyphName print */
        readonly COMM_PRINT: string;
        /** Lock/Security */
        /** @glyphName lock */
        readonly COMM_LOCK: string;
        /** Power off/Logout (text: "Logout") */
        /** @glyphName power_off */
        readonly COMM_POWER: string;
      
        // =================================================================
        // UI ELEMENTS
        // =================================================================
      
        /** Slide right */
        /** @glyphName hand_o_right */
        readonly UI_HAND_RIGHT: string;
        /** Slide left */
        /** @glyphName hand_o_left */
        readonly UI_HAND_LEFT: string;
        /** Rotate */
        /** @glyphName rotate_right */
        readonly UI_ROTATE: string;
        /** Tag/Label */
        /** @glyphName tag */
        readonly UI_TAG: string;
        /** Basket/Container */
        /** @glyphName shopping_basket */
        readonly UI_BASKET: string;
      
        // =================================================================
        // SPECIFIC ICONS (domain-specific)
        // =================================================================
      
        /** Move/Transport (text: "Rebase") */
        /** @glyphName truck */
        readonly SPECIFIC_TRUCK: string;
        /** Temperature/Sensors */
        /** @glyphName thermometer_full */
        readonly SPECIFIC_THERMOMETER: string;
        /** Identification card */
        /** @glyphName id_card_o */
        readonly SPECIFIC_ID_CARD: string;
        /** Edit/Write */
        /** @glyphName pencil */
        readonly SPECIFIC_PENCIL: string;
        /** Add with emphasis (text: "Fill Entrances") */
        /** @glyphName plus_square */
        readonly SPECIFIC_PLUS_SQUARE: string;
        /** Add circular (text: "Allocate VLAN") */
        /** @glyphName plus_circle */
        readonly SPECIFIC_PLUS_CIRCLE: string;
        /** Direction indicator */
        /** @glyphName long_arrow_right */
        readonly SPECIFIC_LONG_ARROW: string;
      
        // =================================================================
        // LEGACY/FALLBACK
        // =================================================================
      
        /** Generic question */
        /** @glyphName question */
        readonly FALLBACK_QUESTION: string;
      /** Generic fallback icon */
      /** @glyphName question_circle */
      readonly FALLBACK_GENERIC: string;
    };
    [key: string]: number | typeof NOC.glyph.semantic;
  };
}

// eslint-disable-next-line no-var
declare var NOC: NOC;
