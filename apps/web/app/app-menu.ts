import { svgCalculate, svgCalculator, svgCodeMerge, svgDatabase, svgListCheck, svgSchema, svgUser } from "./ui/icons/svg"

export interface AppMenuEntry {
  label: string
  path: string
  icon?: string
  svgIcon?: string
  divider?: boolean
}

export interface AppMenuGroup {
  category: string
  label: string
  icon: string
  items: AppMenuEntry[]
}

export const APP_MENU: AppMenuGroup[] = [
  {
    label: 'DB',
    category: 'database',
    icon: svgDatabase,
    items: [
      { label: 'Items', path: '/items', icon: 'assets/icons/menu/items.png' },
      { label: 'Housing', path: '/housing', icon: 'assets/icons/tradeskills/furnishing.png' },
      { label: 'Crafting', path: '/crafting', icon: 'assets/icons/tradeskills/weaponsmithing.png' },

      { label: 'Perks', path: '/perks', icon: 'assets/icons/menu/perks.png', divider: true },
      { label: 'Abilities', path: '/abilities', icon: 'assets/icons/menu/abilities.png' },
      { label: 'Status Effects', path: '/status-effects', icon: 'assets/icons/menu/statuseffects.png' },
      { label: 'Damage Rows', path: '/damage', icon: 'assets/icons/menu/damage.png' },

      { label: 'Gatherables', path: '/gatherables', icon: 'assets/icons/menu/gatherable.png', divider: true },
      { label: 'Lore', path: '/lore', icon: 'assets/icons/menu/lore.png' },
      { label: 'NPCs', path: '/npcs', icon: 'assets/icons/menu/icon_head.png' },
      { label: 'Quests', path: '/quests', icon: 'assets/icons/menu/quests.png' },
      { label: 'Vitals', path: '/vitals', icon: 'assets/icons/menu/vitals.png' },
      { label: 'Zones', path: '/zones', icon: 'assets/icons/menu/fasttraveliconinactive.png' },

      { label: 'Loot Limits', path: '/loot-limits', icon: 'assets/icons/menu/icon_filter_chrono.png', divider: true },
      { label: 'Loot Tables', path: '/loot', icon: 'assets/icons/menu/loot.png' },
      { label: 'Loot Buckets', path: '/loot-buckets', icon: 'assets/icons/menu/loot.png' },
      { label: 'PvP Track Store', path: '/pvp-buckets', icon: 'assets/icons/menu/loot.png' },
      { label: 'Game Events', path: '/game-events', icon: 'assets/icons/menu/events.png' },

      { label: 'Game Modes', path: '/game-modes', icon: 'assets/icons/menu/expeditions.png', divider: true },
      { label: 'Armor Sets', path: '/armor-sets', icon: 'assets/icons/menu/armorsets.png' },
      { label: 'Armor Weights', path: '/armor-weights', icon: 'assets/icons/menu/icon_weight.png' },
      { label: 'Transmog', path: '/transmog', icon: 'assets/icons/menu/transmogtoken.webp' },
      { label: 'Mounts', path: '/mounts', icon: 'assets/icons/menu/reward_type_mount.png' },

      { label: 'Player Titles', path: '/player-titles', icon: 'assets/icons/menu/player-titles.png', divider: true },
      { label: 'Emotes', path: '/emotes', icon: 'assets/icons/menu/emotes.png' },
      { label: 'Season Pass', path: '/season-pass', icon: 'assets/icons/menu/season.png' },
      { label: 'Backstories - PTR Testing', path: '/backstories', icon: 'assets/icons/menu/backstories.png' },
    ],
  },
  {
    label: 'Char',
    category: 'character',
    icon: svgUser,
    items: [
      { label: 'Levels', path: '/leveling/xp', icon: 'assets/icons/menu/levels.png' },
      { label: 'Tradeskills', path: '/leveling/tradeskills', icon: 'assets/icons/tradeskills/weaving.png' },
      { label: 'Territories', path: '/territories', icon: 'assets/icons/menu/territories.png' },
      { label: 'Weapons', path: '/leveling/weapons', icon: 'assets/icons/weapons/1hsword.png' },
      { label: 'Inventory', path: '/inventory', icon: 'assets/icons/menu/storage.png', divider: true },
      { label: 'Gear Sets', path: '/gearsets', icon: 'assets/icons/menu/gearsets.png' },
      { label: 'Skill Trees', path: '/skill-trees', svgIcon: svgCodeMerge },
      { label: 'Damage Calculator', path: '/damage-calculator', icon: 'assets/icons/menu/skill-trees.png' },
    ],
  },
  {
    label: 'Track',
    category: 'tracking',
    icon: svgListCheck,
    items: [
      {
        label: 'Artifacts',
        path: '/tracking/artifacts',
        icon: 'assets/icons/menu/artifacts.png',
      },
      {
        label: 'Cooking Recipes',
        path: '/tracking/recipes',
        icon: 'assets/icons/menu/recipes.png',
      },
      { label: 'Music Sheets', path: '/tracking/music-sheets', icon: 'assets/icons/menu/icon_tradeskill_music.png' },
      { label: 'Runes', path: '/tracking/runes', icon: 'assets/icons/slots/iconrune.png' },

      { label: 'Schematics', path: '/tracking/schematics', icon: 'assets/icons/menu/schematic_blank.png' },
      {
        label: 'Trophies',
        path: '/tracking/trophies',
        icon: 'assets/icons/slots/icon_housing_category_trophies.png',
      },
    ],
  },

]

export const LANG_OPTIONS = [
  { value: 'de-de', label: 'DE' },
  { value: 'en-us', label: 'EN' },
  { value: 'es-es', label: 'ES' },
  { value: 'fr-fr', label: 'FR' },
  { value: 'it-it', label: 'IT' },
  { value: 'pl-pl', label: 'PL' },
  { value: 'pt-br', label: 'BR' },
]
