# Playlist Manager of Tutorial System

## Description

Playlists Manager For List All of Video and List by Category

## API END POINT

-   v1 : #

## API Docs

- [https://playlistsmanager.docs.apiary.io/#](https://playlistsmanager.docs.apiary.io/#)

## Table Structure API End Points

### Playlists Table Routes

| URL                                       | Method | INFO              |
| ----------------------------------------- | ------ | ----------------- |
| `playlists/{userid}`                      | GET    | Get Data by ID    |
| `playlists/{userid}/create`               | POST   | Save Data         |
| `playlists/{userid}/update/{playlistsid}` | POST   | Update Data by ID |
| `playlists/{userid}/delete/{playlistsid}` | POST   | Delete Data by ID |

### Playlists Category Table Routes

| URL                    | Method | INFO              |
| ---------------------- | ------ | ----------------- |
| `category`             | GET    | Get All Data      |
| `category/create`      | POST   | Save Data         |
| `category/{id}`        | GET    | Get Data by ID    |
| `category/update/{id}` | POST   | Update Data by ID |
| `category/delete/{id}` | POST   | Delete Data by ID |

## Example screen shots of API invocations

## How to commit

When committing, precommit hook been called and expect tests and linting be passed first

### Commit message [Conventional Commits](https://conventionalcommits.org/).

The commit message should be structured as follows:

---

```bash
<squad abbreviation-ticket number> <type>(<scope>):  <description>
<BLANK LINE>
[optional body]
<BLANK LINE>
[optional footer]
```

---

## Examples

### Commit message with description, scope and breaking change in body

```bash
CM-21 feat(pm): allow provided config object to extend other configs

CM-22 BREAKING CHANGE(pm): redirect old API request service page to new version
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

| type            | usage                                                                                                                                                                 |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fix             | A bug fix (this correlates with [PATCH](http://semver.org/#summary) in semantic versioning).                                                                          |
| feat            | A new feature (this correlates with [MINOR](http://semver.org/#summary) in semantic versioning).                                                                      |
| BREAKING CHANGE | introduces a breaking API change (correlating with [MAJOR](http://semver.org/#summary) in semantic versioning). A breaking change can be part of commits of any type. |
| chore           | bau taks                                                                                                                                                              |
| build           | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm, webpack)                                                          |
| ci              | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)                                                           |
| docs            | Documentation only changes                                                                                                                                            |
| perf            | A code change that improves performance                                                                                                                               |
| refactor        | A code change that neither fixes a bug nor adds a feature                                                                                                             |
| style           | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)                                                                |
| test            | Adding missing tests or correcting existing tests                                                                                                                     |

### Scope

The scope should be the name of the component package affected (as perceived by the person reading the changelog generated from commit messages.

The following is the list of supported scopes:

| Short Code | Components        |
| :--------- | :---------------- |
| pm         | Playlists Manager |
| test       | Test automation   |
| doc        | Documentation     |

... keep adding above list
