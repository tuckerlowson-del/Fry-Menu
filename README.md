# Fry Menu

## Owner login
- Name: **Ford**
- Password: *(your secret)*

## Upload to GitHub (easy — few files)

All CSS + JS are **inside `index.html`** now. You only need:

1. `index.html`  (the whole app)
2. `server.py`   (shared accounts on Railway)
3. `Procfile`
4. `railway.json`
5. `requirements.txt`

Optional: `css/` and `js/` folders (not required if using bundled index.html).

### PC upload
Drag those files into GitHub → Commit → Railway redeploys.

## Railway
Start command: `python server.py`  
Then: Settings → Networking → Generate Domain

## Local
```bash
python server.py
```
