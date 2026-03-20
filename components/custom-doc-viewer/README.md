# Custom Doc Viewer for Retool

A document viewer component for previewing `.docx` files in Retool applications. Renders Word documents directly in the browser with responsive scaling and built-in error handling.

## Features

- **DOCX Rendering**: Preview `.docx` files directly in the browser using `docx-preview`
- **Responsive Scaling**: Automatically scales documents to fit the component width
- **Base64 Input**: Accepts base64-encoded document data, with or without data URL prefix
- **Configurable File Size Limit**: Set a maximum allowed file size (default 50MB)
- **Loading & Error States**: Built-in loading indicator and user-friendly error messages
- **Accessible**: ARIA attributes, screen reader support, and keyboard navigation
- **Customizable Styling**: Configure background colors

## Installation

1. Clone this repository or navigate to your project directory

2. Install dependencies:

   ```bash
   npm install
   ```

3. Log in to Retool:

   ```bash
   npx retool-ccl login
   ```

   > Note: You'll need an API access token with read and write scopes for Custom Component Libraries.

4. Start development mode:

   ```bash
   npm run dev
   ```

5. Deploy your component:

   ```bash
   npm run deploy
   ```

6. Switch component versions:
   > To pin your app to the component version you just published, navigate to the Custom Component settings in your Retool app and change dev to the latest version.

## Configuration

The component exposes the following properties in Retool:

### Document Input

| Property    | Type   | Default | Description                                                                 |
| ----------- | ------ | ------- | --------------------------------------------------------------------------- |
| `base64Data`| String | ""      | Base64-encoded `.docx` file data. Supports raw base64 or data URL format    |

### Validation

| Property       | Type    | Default | Description                                             |
| -------------- | ------- | ------- | ------------------------------------------------------- |
| `maxFileSizeMB`| Number  | 50      | Maximum allowed file size in megabytes                  |

### Styling

| Property          | Type   | Default | Description                          |
| ----------------- | ------ | ------- | ------------------------------------ |
| `backgroundColor` | String | white   | Background color of the viewer       |

### Display

| Property           | Type    | Default | Description                                          |
| ------------------ | ------- | ------- | ---------------------------------------------------- |
| `showLoadingState` | Boolean | true    | Show/hide the loading indicator while rendering      |

### Output (Read-Only)

| Property       | Type    | Description                                                  |
| -------------- | ------- | ------------------------------------------------------------ |
| `isLoading`    | Boolean | Whether the component is currently rendering a document      |
| `errorMessage` | String  | Current error message, empty if no error                     |

### Events

| Event              | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `onDocumentLoaded` | Triggered when a document is successfully rendered   |
| `onLoadError`      | Triggered when document loading or rendering fails   |

## Usage Example

### Basic Setup

1. Add the Custom Doc Viewer to your Retool app
2. Set `base64Data` to a base64-encoded `.docx` file from a query or file input:
   - `{{ fileInput1.value[0] }}` (from a File Input component)
   - `{{ query1.data.fileContent }}` (from a query returning base64 data)

### With a File Input

1. Add a **File Input** component to your app
2. Set the Doc Viewer's `base64Data` to `{{ fileInput1.value[0] }}`
3. Upload a `.docx` file — the document renders automatically

### With a Query

If your query returns base64-encoded document data:

```
{{ getDocument.data.base64Content }}
```

### Handling Errors

Use the `onLoadError` event to trigger notifications or other actions when loading fails. Access the error details via `{{ customDocViewer1.errorMessage }}`.

### Customizing the File Size Limit

Set `maxFileSizeMB` to control the maximum accepted file size:
- Set to `10` for a 10MB limit
- Set to `100` for a 100MB limit
- Default is `50` (50MB)

### Using Component State

Access the component's state in other components or queries:
- `{{ customDocViewer1.isLoading }}` — check if a document is loading
- `{{ customDocViewer1.errorMessage }}` — get the current error message

Use the `onDocumentLoaded` event to trigger queries after a document renders successfully.

## File Format Limitation

**Important**: This component only supports `.docx` files (Office Open XML format). It does **not** support the older `.doc` format (Compound File Binary Format). This is a limitation of the underlying `docx-preview` library. If a user uploads a `.doc` file, the component will display an error message.

## Security

This component is designed for use in **internal Retool applications with trusted data sources**.

- **Client-side only**: All document rendering happens entirely in the browser. No data is sent to external servers or third-party services.
- **No XSS risk**: The component does not perform direct DOM manipulation; rendering is handled by the `docx-preview` library.
- **No CSRF risk**: The component is read-only and makes no API calls.
- **Input validation**: Base64 input is validated before rendering. File size is checked against a configurable limit to prevent browser resource exhaustion.
- **Dependency risk**: Rendering security depends on the `docx-preview` library. A maliciously crafted `.docx` file could potentially exploit vulnerabilities in the library's XML parser. Keep the dependency up to date and only render documents from trusted sources.

## Development

### Prerequisites

- Node.js >= 20.0.0
- Retool developer account

### Local Development

1. Run `npm install` to install dependencies
2. Make changes to components in the `src` directory
3. Run `npm run dev` to test your changes
4. Run `npm run deploy` to deploy to Retool

### Project Structure

- `src/index.tsx` — Retool integration layer (state management, events)
- `src/DocViewer.tsx` — Document rendering, scaling, validation, and UI states
- `src/utils/` — Utility functions (base64 to ArrayBuffer conversion)

## License

This project is licensed under the MIT License.

## About

Created by [Stackdrop](https://stackdrop.co)
