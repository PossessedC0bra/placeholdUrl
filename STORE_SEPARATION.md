# Store Separation - Documentation

## Overview

The Zustand store has been successfully separated into two distinct stores to improve code organization, performance, and maintainability:

1. **History Store** (`src/stores/historyStore.ts`) - Persisted data
2. **Popup Store** (`src/stores/popupStore.ts`) - UI state (non-persisted)

## 🏗️ Store Architecture

### Before (Single Store)
```
src/pages/popup/PopupStore.ts
├── isHistoryExpanded (UI state)
├── history (persisted data)
├── addHistoryItem()
├── updateHistoryItem()
├── removeHistoryItem()
├── incrementUsageCount()
└── clearHistory()
```

### After (Separated Stores)
```
src/stores/
├── historyStore.ts (persisted)
│   ├── history
│   ├── addHistoryItem()
│   ├── updateHistoryItem()
│   ├── removeHistoryItem()
│   ├── incrementUsageCount()
│   └── clearHistory()
├── popupStore.ts (non-persisted)
│   ├── isHistoryExpanded
│   ├── isLoading
│   ├── error
│   ├── currentTab
│   ├── plainUrl
│   ├── urlParts
│   ├── placeholderValueMap
│   └── computed getters/setters
└── index.ts (exports)
```

## 📦 Store Details

### History Store (`historyStore.ts`)
**Purpose**: Manages persistent history data that survives between popup sessions.

**Features**:
- ✅ **Persisted to Chrome storage** using `chrome.storage.local`
- ✅ **Immutable updates** with Immer middleware
- ✅ **Error handling** for storage operations
- ✅ **Automatic cleanup** of empty URL entries

**State**:
```typescript
interface HistoryState {
    history: Record<string, Record<string, HistoryItem>>;
    addHistoryItem: (url: string, id: string, item: HistoryItem) => void;
    updateHistoryItem: (url: string, id: string, newName: string) => void;
    removeHistoryItem: (url: string, id: string) => void;
    incrementUsageCount: (url: string, id: string) => void;
    clearHistory: (url?: string) => void;
}
```

### Popup Store (`popupStore.ts`)
**Purpose**: Manages temporary UI state that resets when popup is closed.

**Features**:
- ✅ **Non-persisted** - resets on each popup open
- ✅ **Computed getters** for form validation
- ✅ **State reset functions** for cleanup
- ✅ **Centralized UI state** management

**State**:
```typescript
interface PopupState {
    // History UI state
    isHistoryExpanded: boolean;
    
    // Loading and error states
    isLoading: boolean;
    error: string | null;
    
    // Tab and URL state
    currentTab: chrome.tabs.Tab | null;
    plainUrl: string;
    urlParts: [boolean, string][];
    
    // Placeholder form state
    placeholderValueMap: Record<string, string>;
    
    // Computed getters
    hasPlaceholders: () => boolean;
    isFormValid: () => boolean;
    
    // Reset functions
    resetState: () => void;
    resetError: () => void;
}
```

## 🔄 Migration Changes

### Component Updates

**Files Updated**:
- `src/pages/popup/Popup.tsx` - Updated to use both stores
- `src/components/HistoryView.tsx` - Uses both stores appropriately
- `src/components/HistoryHeader.tsx` - Uses popup store for UI state
- `src/components/HistoryItemName.tsx` - Uses history store for updates
- `src/components/HistoryCard.tsx` - Updated import path

**Import Changes**:
```typescript
// Before
import { useHistoryStore } from "@/pages/popup/PopupStore";

// After
import { useHistoryStore } from "@/stores/historyStore";
import { usePopupStore } from "@/stores/popupStore";
// Or combined
import { useHistoryStore, usePopupStore } from "@/stores";
```

### Usage Patterns

**History Operations**:
```typescript
const { history, addHistoryItem, updateHistoryItem } = useHistoryStore();
```

**UI State Management**:
```typescript
const { 
    isHistoryExpanded, 
    setHistoryExpanded,
    isLoading,
    error,
    isFormValid
} = usePopupStore();
```

## 🎯 Benefits

### 1. **Separation of Concerns**
- History data is completely separate from UI state
- Clear responsibility boundaries
- Easier to test and maintain

### 2. **Performance Optimization**
- UI state changes don't trigger storage operations
- History changes don't cause UI re-renders unnecessarily
- More granular subscriptions

### 3. **Storage Efficiency**
- Only history data is persisted to Chrome storage
- Temporary UI state doesn't pollute storage
- Faster popup initialization

### 4. **Type Safety**
- Better TypeScript inference
- Clearer interfaces for each store
- Reduced coupling between different state types

### 5. **Maintainability**
- Easier to add new features to either store
- Clear separation makes debugging easier
- Better code organization

## 🧪 Testing Considerations

### History Store Testing
- Test persistence operations
- Verify Chrome storage integration
- Test error handling for storage failures

### Popup Store Testing
- Test state resets
- Verify computed getters
- Test form validation logic

## 🔮 Future Enhancements

### Possible Store Extensions

**History Store**:
- Add import/export functionality
- Implement backup/restore features
- Add history analytics

**Popup Store**:
- Add user preferences (theme, layout)
- Implement form auto-save
- Add keyboard shortcut customization

### Additional Stores
Could add more specialized stores:
- **Settings Store** - User preferences (persisted)
- **Cache Store** - Temporary data caching
- **Analytics Store** - Usage analytics (persisted)

## 📁 File Structure

```
src/
├── stores/
│   ├── historyStore.ts     # Persisted history data
│   ├── popupStore.ts       # UI state management
│   └── index.ts            # Store exports
├── pages/popup/
│   ├── Popup.tsx          # Updated to use both stores
│   └── index.tsx
└── components/
    ├── HistoryView.tsx    # Uses both stores
    ├── HistoryHeader.tsx  # Uses popup store
    ├── HistoryCard.tsx    # Updated import
    └── HistoryItemName.tsx # Uses history store
```

## ✅ Verification

- ✅ **Build Success**: All TypeScript errors resolved
- ✅ **Import Paths**: All imports updated correctly
- ✅ **Functionality**: All features working as expected
- ✅ **Persistence**: History data still persists correctly
- ✅ **UI State**: UI state resets properly on popup close

---

**Migration Status**: ✅ **Complete**  
**Build Status**: ✅ **Passing**  
**Functionality**: ✅ **Fully Working**