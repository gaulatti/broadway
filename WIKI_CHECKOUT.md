# Broadway wiki checkout mapping

Broadway's application and GitHub wiki are separate Git repositories with separate publication paths:

| Surface | Git remote | Default branch | What a push changes |
| --- | --- | --- | --- |
| Application source | `git@github.com:gaulatti/broadway.git` | `main` | Application source; eligible non-documentation pushes can run the application deployment workflow. |
| GitHub wiki | `git@github.com:gaulatti/broadway.wiki.git` | `master` | Wiki pages at `github.com/gaulatti/broadway/wiki`; it cannot deploy the Broadway application. |

The managed checkout for agent work is `./wiki` inside each Broadway application checkout. It is a separate clone, not an application subdirectory, and the application repository excludes it through local Git metadata. The mandatory agent updater creates or validates that checkout for this public repository.

## Historical local checkout

`/Users/gaulatti/source/gaulatti/docs/stronzi.wiki` is a valid historical checkout of `gaulatti/broadway.wiki`. The directory name matches the wiki's historical **Stronzi** product title; it does not point to a different repository.

Retain that directory name. On 2026-09-07 the checkout was at `403e5be2c3cb4171084d2f6243d5458c38184380`, two commits behind the remote wiki head, with twelve modified pages and two untracked compliance paths. It also had no configured upstream branch. Moving, updating, or cleaning it would risk unreviewed documentation work. An exact search under `/Users/gaulatti/source`, the shell configuration, Git configuration, and user configuration found no consumer outside the checkout's own Git metadata, but GUI bookmarks and other external references remain unverified.

Do not replace a worktree-local `./wiki` clone with a symlink to this historical checkout. Do not commit or push the historical changes as part of application work.

## Read-only validation

Run this from a Broadway application checkout. It validates repository identity and separation, then reports wiki status without fetching, editing, committing, or pushing anything:

```sh
check_broadway_wiki() {
  wiki_checkout=$1
  app_checkout=$(git rev-parse --show-toplevel) || return 1
  wiki_root=$(git -C "$wiki_checkout" rev-parse --show-toplevel) || return 1
  wiki_real=$(cd "$wiki_checkout" && pwd -P) || return 1
  app_git_dir=$(git -C "$app_checkout" rev-parse --absolute-git-dir) || return 1
  wiki_git_dir=$(git -C "$wiki_checkout" rev-parse --absolute-git-dir) || return 1
  expected_app_remote='git@github.com:gaulatti/broadway.git'
  expected_wiki_remote='git@github.com:gaulatti/broadway.wiki.git'

  test "$(git -C "$app_checkout" remote get-url origin)" = "$expected_app_remote" || return 1
  test "$(git -C "$wiki_checkout" remote get-url origin)" = "$expected_wiki_remote" || return 1
  test "$wiki_root" = "$wiki_real" || return 1
  test "$app_git_dir" != "$wiki_git_dir" || return 1

  printf 'application=%s\nwiki=%s\nwiki_remote=%s\n' \
    "$app_checkout" \
    "$wiki_real" \
    "$(git -C "$wiki_checkout" remote get-url origin)"
  git -C "$wiki_checkout" status --short --branch
}

check_broadway_wiki "$(git rev-parse --show-toplevel)/wiki"
check_broadway_wiki /Users/gaulatti/source/gaulatti/docs/stronzi.wiki
```

To verify the live wiki remote and its advertised default branch separately:

```sh
git ls-remote --symref git@github.com:gaulatti/broadway.wiki.git HEAD
```

On 2026-09-07 that command advertised `refs/heads/master` at `821e5d98950e548ff29e7935073ca5737568b274`. Treat a different remote, a missing checkout, or a repository-separation failure as an error. Dirty or divergent status is evidence to preserve and review, not permission to clean or update it.

## Publication and rollback boundary

- A commit or push inside a wiki checkout publishes documentation only after it reaches `broadway.wiki.git`; it is not an application release.
- Application deployment automation lives only in `broadway.git` and listens for eligible pushes to `main`. It ignores root Markdown changes, so this documentation-only change is outside that deploy path.
- Wiki commits and pushes require separate authorization. This mapping change does not edit or publish any wiki page.
- Rollback is a normal revert of this application-repository documentation. No wiki history, local wiki work, application artifact, or production state needs restoration.

## Evidence boundary

This inventory verifies local Git state and the wiki remote over the Git protocol. It does not verify GUI bookmarks, credentials beyond successful read access, GitHub wiki rendering after a future push, or any application deployment. No application artifact or image is produced by this documentation contract.
