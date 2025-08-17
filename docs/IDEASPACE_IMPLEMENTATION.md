# Ideaspace Navigation System Implementation

## Overview

This document describes the implementation of the new Ideaspace Navigation System that provides hierarchical navigation through learning content with a toggle between text mode and mind map mode.

## 🎯 **Key Features**

### 1. **Hierarchical Navigation**
- **Sections** → **Blueprints** → **Ideaspaces**
- Expandable/collapsible tree structure
- Visual indicators for different content types
- Item counts and descriptions

### 2. **View Mode Toggle**
- **Text Mode**: Traditional content display
- **Mind Map Mode**: Interactive React Flow visualization
- Seamless switching between modes
- Persistent state management

### 3. **Responsive Design**
- Mobile-friendly sidebar
- Collapsible navigation
- Adaptive layouts for different screen sizes

## 🏗️ **Architecture**

### Components

#### `IdeaspaceSidebar`
- Main navigation component
- Hierarchical tree structure
- Built-in view mode toggle
- Responsive design with mobile support

**Location**: `src/components/navigation/IdeaspaceSidebar.tsx`

#### `MindMapView`
- React Flow-based mind map visualization
- Interactive nodes and edges
- Zoom, pan, and selection controls
- Legend and navigation tools

**Location**: `src/components/mindmap/MindMapView.tsx`

#### `ViewModeToggle`
- Reusable toggle component
- Multiple variants (compact, small, large, outline)
- Accessible design with ARIA labels

**Location**: `src/components/common/ViewModeToggle.tsx`

### Services

#### `IdeaspaceService`
- API integration for ideaspace data
- Mock data for development
- Error handling and fallbacks

**Location**: `src/services/ideaspaceService.ts`

## 🚀 **Usage**

### Basic Implementation

```tsx
import IdeaspaceSidebar from '../components/navigation/IdeaspaceSidebar';
import MindMapView from '../components/mindmap/MindMapView';
import ViewModeToggle, { ViewMode } from '../components/common/ViewModeToggle';

const MyPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('text');

  return (
    <div className="page">
      <header>
        <ViewModeToggle
          currentMode={viewMode}
          onModeChange={setViewMode}
        />
      </header>
      
      <div className="content">
        {viewMode === 'mindmap' ? (
          <MindMapView blueprintId="123" />
        ) : (
          <div>Text content here</div>
        )}
      </div>
    </div>
  );
};
```

### With Sidebar Navigation

```tsx
import IdeaspaceSidebar from '../components/navigation/IdeaspaceSidebar';

const Layout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <IdeaspaceSidebar
          onNavigate={() => {
            // Handle navigation events
            console.log('Navigation clicked');
          }}
        />
      </aside>
      
      <main className="content">
        {/* Your page content */}
      </main>
    </div>
  );
};
```

## 🔧 **Configuration**

### CSS Variables

The components use CSS custom properties for theming:

```css
:root {
  --color-primary: #3b82f6;
  --color-surface: #ffffff;
  --color-text-base: #1f2937;
  --color-border: #e5e7eb;
  /* ... more variables */
}
```

### Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

## 📱 **Mobile Support**

### Sidebar Behavior
- Fixed positioning on mobile
- Slide-in/out animation
- Touch-friendly interactions
- Overlay backdrop

### Mind Map Controls
- Optimized for touch devices
- Gesture support for zoom/pan
- Accessible button sizes

## 🎨 **Customization**

### ViewModeToggle Variants

```tsx
// Compact (no labels)
<ViewModeToggle className="compact" />

// Small size
<ViewModeToggle className="small" />

// Large size
<ViewModeToggle className="large" />

// Outline style
<ViewModeToggle className="outline" />
```

### Mind Map Styling

Customize node and edge styles through the `style` property:

```tsx
const customNode = {
  id: 'custom',
  data: { label: 'Custom Node' },
  style: {
    background: '#ff6b6b',
    border: '3px solid #ee5a52',
    borderRadius: '12px'
  }
};
```

## 🔌 **API Integration**

### Endpoints

The system expects these API endpoints:

- `GET /api/blueprints/ideaspaces/hierarchy` - Navigation structure
- `GET /api/blueprints/ideaspaces/{id}/content` - Content details
- `GET /api/blueprints/ideaspaces/{id}/mindmap` - Mind map data

### Data Structure

```typescript
interface IdeaspaceItem {
  id: string;
  name: string;
  description?: string;
  type: 'section' | 'blueprint' | 'ideaspace';
  itemCount: number;
  children?: IdeaspaceItem[];
}
```

## 🧪 **Testing**

### Demo Page

Visit `/ideaspaces/demo` to see the complete system in action:

- Full sidebar navigation
- View mode toggle
- Text and mind map modes
- Responsive design

### Development Mode

The service includes mock data for development:

```typescript
// Mock data is automatically used when API calls fail
const response = await ideaspaceService.getIdeaspaceHierarchy();
```

## 🚧 **Future Enhancements**

### Planned Features
- [ ] Real-time collaboration
- [ ] Advanced mind map layouts
- [ ] Search and filtering
- [ ] Drag and drop reordering
- [ ] Export/import functionality

### API Improvements
- [ ] WebSocket support for live updates
- [ ] Caching and offline support
- [ ] Batch operations
- [ ] Advanced filtering

## 📚 **Related Documentation**

- [Blueprint System Architecture](../sprints/s58-frontend-blueprint-centric-foundation.md)
- [Mind Map System](../sprints/s23-blueprint-mindmap-visualization.md)
- [React Flow Integration](../docs/mindmap-system-architecture.md)

## 🤝 **Contributing**

When adding new features:

1. Follow the existing component patterns
2. Use TypeScript interfaces for all data
3. Include responsive design considerations
4. Add proper error handling
5. Update this documentation

## 📄 **License**

This implementation follows the same license as the main project.








