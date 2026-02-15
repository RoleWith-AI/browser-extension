# Extension Icons

Add the following icon files to this directory:

| File | Size | Usage |
|------|------|-------|
| `icon-16.png` | 16x16 | Favicon, toolbar (small) |
| `icon-32.png` | 32x32 | Toolbar (retina) |
| `icon-48.png` | 48x48 | Extension management page |
| `icon-128.png` | 128x128 | Chrome Web Store, installation |

## Requirements

- PNG format with transparency
- Square dimensions
- Clear at small sizes

## Generating Icons

You can generate these from the main RoleWith.AI logo:

1. Use the SVG logo from the main project
2. Export at each required size
3. Ensure transparency is preserved

Tools:
- [Figma](https://figma.com) - Export at multiple sizes
- [Real Favicon Generator](https://realfavicongenerator.net)
- ImageMagick: `convert logo.svg -resize 48x48 icon-48.png`
