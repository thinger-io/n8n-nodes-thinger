# Changelog

## [1.0.4] - 2025-12-04

### Added

- Improved field descriptions in credential section for better user understanding

### Changed

- Changed package file structure to support n8n-CLI community nodes guidelines
- Changed deprecated _requestWithAuthentication_ for _httpRequestWithAuthentication_
- Changed _IRequestOptions_ for _IHttpRequestOptions_

### Fixed

- Icon Route in Credential section
- Broken link to Swagger in credential section

### Removed

- Removed @types/nodes from peerDependencies (kept in devDependencies)

## [1.0.3] - 2025-07-17

### Fixed

- Node logo not showing in GUI

## [1.0.2] - 2025-07-16

### Added

- Added @types/nodes as peerDependency in order to use Buffer

### Removed

- Removed access to filesystem when dinamically reading available operations for assets
- Removed Trigger node as WebSocket dependency is not allowed


## [1.0.1] - 2025-07-15

### Added

- Initial version of n8n-nodes-thinger

[1.0.2]: https://github.com/thinger-io/n8n-nodes-thinger/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/thinger-io/n8n-nodes-thinger/tag/1.0.1
