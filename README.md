# Fry Menu

Role-based counter UI + Ford Ranger Wildtrak gallery slideshow.

## Termux

```bash
unzip fry-menu.zip -d ~/fry-menu
cd ~/fry-menu
python -m http.server 8080
```

Open:
- http://127.0.0.1:8080 — main app (Ford tab = in-app slideshow)
- http://127.0.0.1:8080/ford.html — fullscreen gallery “video-style” slideshow

## Note on “video”

Real video with engine noise and the Ford startup chime cannot be generated.
The Ford section is an auto-playing still slideshow of the black Wildtrak angles.
