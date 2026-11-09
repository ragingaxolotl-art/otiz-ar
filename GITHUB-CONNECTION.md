# Teacher GitHub connection

Teacher mode is prepared to use `github-connect.js` instead of the personal-key form. A connection window is opened at https://otzi-teacher-github-connect.ragingaxolotl.chatgpt.site. The service remains owner-private with Sites sign-in, separate from the public student site.

A private GitHub App, installed only on `ragingaxolotl-art/otiz-ar`, needs Contents read/write and mandatory metadata read. Device Flow must be enabled. The teacher approves a displayed code on GitHub. No personal access key or client secret is required. Runtime configuration uses Sites secrets/environment settings: SESSION_SECRET (secret), GITHUB_CLIENT_ID, GITHUB_APP_SLUG, optional GITHUB_REPOSITORY_ID. Never commit their values.

User access tokens are encrypted with AES-GCM in Secure HttpOnly SameSite=Lax host-only cookies and bound to the private service's authenticated visitor. They expire within eight hours; reconnect uses GitHub authorization, not a pasted key. Disconnect clears the service session. Teacher mode has no credential, only a window reference and random message channel.

The service accepts saves from the expected classroom origin/window/channel, and its POST endpoints require authenticated service identity, same-origin Origin, a visitor-bound CSRF nonce and a valid encrypted GitHub session. It verifies the GitHub account and repository access at connection. All saves are restricted to new immutable `_teacher_saves/save-*.md` files on the one repository's main branch; request bodies cannot choose repositories, branches or filenames. Settings are validated before saving. Interrupted identical writes are checked against the immutable file, not overwritten. Publication is confirmed separately by the existing shared-settings refresh.

The connection window must stay open. A blocked/closed popup or expired authorization produces a visible error and keeps the local draft. No save is automatically replayed after login or a timeout. Student pages and existing printed links are unchanged.

Deployment: private service version 2 is deployed. Field Lab Teacher Cards is registered and installed only on otiz-ar. Each teacher browser completes its own device authorization through Connect GitHub. The public teacher page uses this private service.
