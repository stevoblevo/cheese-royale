# Grok Build / local on Blevodesk

Cheese Royale source of truth is GitHub, not a sandbox.

- Repo: https://github.com/stevoblevo/cheese-royale
- Tester (public, no login): https://stevoblevo.github.io/cheese-royale/

Grok Build sandboxes wipe. Blevodesk is Steven's host. Agents in chat or Grok Build **cannot SSH Blevodesk**. Sync is git pull / git push only.

## Next Grok Build session

```sh
cd /workspace
git clone https://github.com/stevoblevo/cheese-royale.git .
# or: git pull --ff-only
npm install
sh /workspace/startup.sh
# preview contract: 0.0.0.0:8080
```

`startup.sh` is idempotent: if `http://127.0.0.1:8080/` is healthy it exits 0.

Do not rebuild the product on keep-alive turns. Do not invent a second game.

## On Blevodesk (Steven localhost)

```sh
git clone https://github.com/stevoblevo/cheese-royale.git
cd cheese-royale
npm install
npm run dev
# binds 0.0.0.0:8080
```

Commands in the game:

- Part the veil
- `/bing` pic for pic
- `/freppy` green player
- `/knight` shield of the table
- `/peachfall` Saelion overlay
- `/gamma` Saedo & SaeDow index (if that build is on the branch you pulled)

## Host map (read-only)

| Name | What it is | How Grok reaches it |
| --- | --- | --- |
| Grok Build sandbox | ephemeral `/workspace`, preview 8080 | clone GitHub, run `startup.sh` |
| GitHub Pages | public tester | https://stevoblevo.github.io/cheese-royale/ |
| Blevodesk | Steven's local host | git only from here; status is a projection, not a shell |
| Blevitude | home base | `saelion-local-operations` loopback MCP on 127.0.0.1:8397 |

Blevodesk observations, if enrolled, land as a projection file on Blevitude. That path does not grant shell, Docker, or Skein authority.

Open to all. Cheers.
