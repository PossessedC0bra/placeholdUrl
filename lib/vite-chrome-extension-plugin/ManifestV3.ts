/**
 * Chrome Extension Manifest Version 3
 * TypeScript type definition
 */

export interface ManifestV3 {
  manifest_version: 3
  name: string
  version: string
  default_locale?: string
  description?: string
  icons?: Partial<Record<'16' | '32' | '48' | '128' | '256' | '512', string>>

  action?: Action
  background?: Background
  content_scripts?: ContentScript[]
  content_security_policy?: ContentSecurityPolicy
  devtools_page?: string
  options_page?: string
  options_ui?: OptionsUI
  permissions?: Permission[]
  host_permissions?: string[]
  web_accessible_resources?: WebAccessibleResource[]
  chrome_url_overrides?: ChromeUrlOverrides
  commands?: Record<string, Command>
  incognito?: 'spanning' | 'split' | 'not_allowed'
  minimum_chrome_version?: string
  offline_enabled?: boolean
  short_name?: string
  version_name?: string
  storage?: {
    managed_schema?: string
  }

  // Service workers and modules
  importmap?: {
    imports: Record<string, string>
  }

  // Experimental features (optional and rarely used)
  [key: string]: any
}

// #region Subtypes

export interface Action {
  default_popup?: string
  default_icon?: IconSet
  default_title?: string
}

export interface Background {
  service_worker: string
  type?: 'module'
}

export interface ContentScript {
  matches: string[]
  exclude_matches?: string[]
  css?: string[]
  js?: string[]
  run_at?: 'document_start' | 'document_end' | 'document_idle'
  all_frames?: boolean
  match_about_blank?: boolean
  match_origin_as_fallback?: boolean
}

export interface ContentSecurityPolicy {
  extension_pages?: string
  sandbox?: string
}

export interface OptionsUI {
  page: string
  open_in_tab?: boolean
}

export interface WebAccessibleResource {
  resources: string[]
  matches: string[]
  use_dynamic_url?: boolean
}

export interface ChromeUrlOverrides {
  newtab?: string
  bookmarks?: string
  history?: string
}

export interface IconSet {
  [size: string]: string // e.g., "16": "icon16.png"
}

export type Permission =
  | 'activeTab'
  | 'alarms'
  | 'background'
  | 'bookmarks'
  | 'browsingData'
  | 'clipboardRead'
  | 'clipboardWrite'
  | 'contentSettings'
  | 'contextMenus'
  | 'cookies'
  | 'debugger'
  | 'declarativeContent'
  | 'declarativeNetRequest'
  | 'declarativeNetRequestWithHostAccess'
  | 'declarativeNetRequestFeedback'
  | 'downloads'
  | 'enterprise.hardwarePlatform'
  | 'enterprise.networkingAttributes'
  | 'enterprise.platformKeys'
  | 'experimental'
  | 'fileBrowserHandler'
  | 'fileSystemProvider'
  | 'fontSettings'
  | 'gcm'
  | 'history'
  | 'identity'
  | 'idle'
  | 'loginState'
  | 'management'
  | 'nativeMessaging'
  | 'notifications'
  | 'pageCapture'
  | 'platformKeys'
  | 'power'
  | 'printerProvider'
  | 'privacy'
  | 'processes'
  | 'proxy'
  | 'scripting'
  | 'search'
  | 'sessions'
  | 'storage'
  | 'system.cpu'
  | 'system.display'
  | 'system.memory'
  | 'system.storage'
  | 'tabCapture'
  | 'tabGroups'
  | 'tabs'
  | 'topSites'
  | 'tts'
  | 'ttsEngine'
  | 'unlimitedStorage'
  | 'vpnProvider'
  | 'wallpaper'
  | 'webNavigation'
  | 'webRequest'
  | 'webRequestBlocking'
  | string // allow custom permissions

export interface Command {
  suggested_key?: {
    default?: string
    mac?: string
    linux?: string
    windows?: string
    chromeos?: string
  }
  description?: string
  global?: boolean
}
